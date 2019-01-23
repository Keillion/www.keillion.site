/*global $*/
var kUtil = kUtil || {};
if(!Math.sign){
    Math.sign = function(num){
        if(num > 0){
            return 1;
        }else if(num == 0){
            if(1 / num < 0){
                return -0;
            }else{
                return 0;
            }
        }else if(num < 0){
            return -1;
        }else{
            return NaN;
        }
    };
}
kUtil.Matrix = function(a,b,c,d,e,f){
    this.a=a,
    this.b=b,
    this.c=c,
    this.d=d,
    this.e=e,
    this.f=f;
};
kUtil.Matrix.dot = function(matrixA, matrixB){
    var A=matrixA, B=matrixB;
    return new kUtil.Matrix(
        A.a*B.a+A.c*B.b,
        A.b*B.a+A.d*B.b,
        A.a*B.c+A.c*B.d,
        A.b*B.c+A.d*B.d,
        A.a*B.e+A.c*B.f+A.e,
        A.b*B.e+A.d*B.f+A.f
    );
};
kUtil.Matrix.prototype.dot = function(matrix){
    return kUtil.Matrix.dot(this, matrix);
};
kUtil.Matrix.equals = function(matrixA, matrixB){
    var A=matrixA, B=matrixB;
    return A.a==B.a && A.b==B.b && A.c==B.c && A.d==B.d && A.e==B.e && A.f==B.f;
};
kUtil.Matrix.prototype.equals = function(matrix){
    return kUtil.Matrix.equals(this, matrix);
};
kUtil.Matrix.prototype.inversion = function(){
    var a=this.a, b=this.b, c=this.c, d=this.d, e=this.e, f=this.f;
    var M = a*d - b*c;
    return new kUtil.Matrix(
        d/M,
        -b/M,
        -c/M,
        a/M,
        (c*f - d*e)/M,
        (b*e - a*f)/M
    );
};
kUtil.convertURLToBlob = function(url, callback) {
    var http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.responseType = "blob";
    http.onloadend = function() {
        callback(this.response);
    };
    http.send();
};
kUtil.convertBase64ToBlob = function(base64Str, mimeType){
    var byteCharacters = atob(base64Str);
    var byteNumArr = new Array(byteCharacters.length);
    for(var i=0; i < byteCharacters.length; ++i){
        byteNumArr[i] = byteCharacters.charCodeAt(i);
    }
    var uint8Arr = new Uint8Array(byteNumArr);
    return new Blob([uint8Arr], {type: mimeType});
};
//author: meizz; modify: Keillion
Date.prototype.kUtilFormat = function(fmt){
    var o = {
        "M+" : this.getUTCMonth()+1,
        "d+" : this.getUTCDate(),
        "h+" : this.getUTCHours(),
        "m+" : this.getUTCMinutes(),
        "s+" : this.getUTCSeconds(),
        "q+" : Math.floor((this.getUTCMonth()+3)/3),
        "S"  : this.getUTCMilliseconds()
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};
kUtil.copyToClipBoard = function(txt){
    if(navigator.clipboard){
        navigator.clipboard.writeText(txt)['catch'](function(ex){
            alert('copy failed, info: '+(ex.message || ex));
        });
    }else{
        var textarea = document.createElement('textarea');
        textarea.style.width = '4px';
        textarea.style.height = '4px';
        textarea.style.position = 'fixed';
        textarea.style.left = '0';
        textarea.style.top = '0';
        $(document.body).append(textarea);
        textarea.value = txt;
        textarea.focus();
        textarea.select();
        try{
            var bSuccess = document.execCommand('copy');
            if(!bSuccess){
                alert('copy failed');
            }
        }catch(ex){
            alert('copy failed, info: '+(ex.message || ex));
        }
        $(textarea).remove();
    }
};
(function($){
    $.fn.borderWidth = function(){
        var cs = null;
        if(window.getComputedStyle){
            cs = getComputedStyle(this[0]);
        }else{
            cs = this[0].currentStyle;
        }
        var info = {};
        info.left = parseFloat(cs.getPropertyValue ? cs.getPropertyValue("border-left-width") : cs.getAttribute("border-left-width")) || 0;
        info.top = parseFloat(cs.getPropertyValue ? cs.getPropertyValue("border-top-width") : cs.getAttribute("border-top-width")) || 0;
        info.right = parseFloat(cs.getPropertyValue ? cs.getPropertyValue("border-right-width") : cs.getAttribute("border-right-width")) || 0;
        info.bottom = parseFloat(cs.getPropertyValue ? cs.getPropertyValue("border-bottom-width") : cs.getAttribute("border-bottom-width")) || 0;
        return info;
    };
    $.fn.padding = function(){
        var cs = null;
        if(window.getComputedStyle){
            cs = getComputedStyle(this[0]);
        }else{
            cs = this[0].currentStyle;
        }
        var info = {};
        info.left = parseFloat(cs.getPropertyValue ? cs.getPropertyValue("padding-left") : cs.getAttribute("padding-left")) || 0;
        info.top = parseFloat(cs.getPropertyValue ? cs.getPropertyValue("padding-top") : cs.getAttribute("padding-top")) || 0;
        info.right = parseFloat(cs.getPropertyValue ? cs.getPropertyValue("padding-right") : cs.getAttribute("padding-right")) || 0;
        info.bottom = parseFloat(cs.getPropertyValue ? cs.getPropertyValue("padding-bottom") : cs.getAttribute("padding-bottom")) || 0;
        return info;
    };
    $.fn.borderBoxRect = function(){
        var cs = null;
        if(window.getComputedStyle){
            cs = getComputedStyle(this[0]);
        }
        var offset = this.offset();
        var info = {};
        /*info.zoom = 1;
         tudo:matrix
        var strTransform = this.css('transform');
        if('none'!=strTransform){
            var partStr = 'matrix(';
            var matrixIndex = strTransform.indexOf(partStr) + partStr.length;
            if(-1 != matrixIndex){
                var matrixArr = strTransform.substring(matrixIndex, strTransform.indexOf(')', matrixIndex)).split(',');
                info.zoom = parseFloat(matrixArr[0]);
            }
        }*/
        info.pageX0 = offset.left;
        info.pageY0 = offset.top;
        info.width = cs?parseFloat(cs.width):this.outerWidth();//*info.zoom;
        info.height = cs?parseFloat(cs.height):this.outerHeight();//*info.zoom;
        info.pageX1 = info.pageX0 + info.width;
        info.pageY1 = info.pageY0 + info.height;
        //tudo: client\screen
        return info;
    };
    $.fn.paddingBoxRect = function(){
        var borderBoxRect = this.borderBoxRect();
        var borderWidth = this.borderWidth();
        var info = {};
        //info.zoom = borderBoxRect.zoom;
        info.pageX0 = borderBoxRect.pageX0 + borderWidth.left;//*info.zoom;
        info.pageY0 = borderBoxRect.pageY0 + borderWidth.top;//*info.zoom;
        info.width = window.getComputedStyle?borderBoxRect.width - (borderWidth.left + borderWidth.right):this.innerWidth();//*info.zoom;
        info.height = window.getComputedStyle?borderBoxRect.height - (borderWidth.top + borderWidth.bottom):this.innerHeight();//*info.zoom;
        info.pageX1 = borderBoxRect.pageX1 - borderWidth.right;//*info.zoom;
        info.pageY1 = borderBoxRect.pageY1 - borderWidth.bottom;//*info.zoom;
        //tudo: client\screen
        return info;
    };
    $.fn.contentBoxRect = function(){
        var paddingBoxRect = this.paddingBoxRect();
        var padding = this.padding();
        var info = {};
        //info.zoom = paddingBoxRect.zoom;
        info.pageX0 = paddingBoxRect.pageX0 + padding.left;//*info.zoom;
        info.pageY0 = paddingBoxRect.pageY0 + padding.top;//*info.zoom;
        info.width = window.getComputedStyle?paddingBoxRect.width - (padding.left + padding.right):this.width();//*info.zoom;
        info.height = window.getComputedStyle?paddingBoxRect.height - (padding.top + padding.bottom):this.height();//*info.zoom;
        info.pageX1 = paddingBoxRect.pageX1 - padding.right;//*info.zoom;
        info.pageY1 = paddingBoxRect.pageY1 - padding.bottom;//*info.zoom;
        //tudo: client\screen
        return info;
    };
    $.fn.getTransform = function(){
        var strTransform = this.css('transform');
        if('none' == strTransform || '' == strTransform){
            //jq bug, transform might not get latest, I only resolve the situation when set matrix(...)
            strTransform = this[0].style.transform;
        }
        var partStr = 'matrix(';
        var matrixIndex = strTransform.indexOf(partStr);
        if(-1 != matrixIndex){
            matrixIndex += partStr.length;
            var arr = strTransform.substring(matrixIndex, strTransform.indexOf(')', matrixIndex)).split(',');
            for(var i=0; i<arr.length; ++i){
                arr[i] = parseFloat(arr[i]);
            }
            return new kUtil.Matrix(arr[0],arr[1],arr[2],arr[3],arr[4],arr[5]);//.apply(kUtil.Matrix, matrixArr);
        }
        partStr = 'scale(';
        var scaleIndex = strTransform.indexOf(partStr);
        if(-1 != scaleIndex){
            scaleIndex += partStr.length;
            var zoom = parseFloat(strTransform.substring(scaleIndex));
            return new kUtil.Matrix(zoom,0,0,zoom,0,0);
        }
        return new kUtil.Matrix(1,0,0,1,0,0);
    };
    $.fn.setTransform = function(matrix){
        var m = matrix;
        var str = 'matrix('+[m.a,m.b,m.c,m.d,m.e,m.f].join(',')+')';
        this.css('transform', str);
    };
})(jQuery);
var TaskQueue = function(){
    /// <summary>
    /// @class TaskQueue
    /// </summary>

    this._queue = [];
    this.isWorking = false;

    /// <param name="timeout" type="int">
    /// Timeout between task.
    /// Between the interval, other work can be done, such as UI-response work.
    /// </param>
    this.timeout = 100;
};

TaskQueue.prototype.push = function(task, context, args){
    /// <summary>
    /// Push task. If <span>!isWorking</span>, start the task queue automatically.
    /// </summary>

    this._queue.push({
        "task": task,
        "context": context,
        "args": args
    });
    if(!this.isWorking){
        this.next();
    }
};

TaskQueue.prototype.unshift = function(task, context, args){
    /// <summary>
    /// Push task. If <span>!isWorking</span>, start the task queue automatically.
    /// </summary>

    this._queue.unshift({
        "task": task,
        "context": context,
        "args": args
    });
    if(!this.isWorking){
        this.next();
    }
};

TaskQueue.prototype.next = function(){
    /// <summary>
    /// Do the next task.
    /// You need to call it manually in the end of your task.
    /// To assure <function>next</function> will be called,
    /// in some case you can put the function in <span>finally</span>,
    /// in other case you should carefully handle <span>setTimeout</span>.
    /// </summary>

    if(this._queue.length == 0){
        this.isWorking = false;
        return;
    }
    this.isWorking = true;
    var item = this._queue.shift();
    var task = item.task;
    var taskContext = item.context ? item.context : self;
    var taskArguments = item.args ? item.args : [];
    setTimeout(function(){
        task.apply(taskContext, taskArguments);
    }, this.timeout);
};

/*
TaskQueue.test = function(){
    var taskQueue = new TaskQueue();
    var task = function(mess){
        console.log(mess);
        taskQueue.next();
    };
    for(var i = 0; i < 100; ++i){
        taskQueue.push(task, null, [i]);
    }
};*//*
Keillion get from https://github.com/exif-js/exif-js and fix some bug.

The MIT License (MIT)
Copyright (c) 2008 Jacob Seidelin
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function() {

    var debug = false;

    var root = this;

    var EXIF = function(obj) {
        if (obj instanceof EXIF) return obj;
        if (!(this instanceof EXIF)) return new EXIF(obj);
        this.EXIFwrapped = obj;
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = EXIF;
        }
        exports.EXIF = EXIF;
    } else {
        root.EXIF = EXIF;
    }

    var ExifTags = EXIF.Tags = {

        // version tags
        0x9000 : "ExifVersion",             // EXIF version
        0xA000 : "FlashpixVersion",         // Flashpix format version

        // colorspace tags
        0xA001 : "ColorSpace",              // Color space information tag

        // image configuration
        0xA002 : "PixelXDimension",         // Valid width of meaningful image
        0xA003 : "PixelYDimension",         // Valid height of meaningful image
        0x9101 : "ComponentsConfiguration", // Information about channels
        0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel

        // user information
        0x927C : "MakerNote",               // Any desired information written by the manufacturer
        0x9286 : "UserComment",             // Comments by user

        // related file
        0xA004 : "RelatedSoundFile",        // Name of related sound file

        // date and time
        0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
        0x9004 : "DateTimeDigitized",       // Date and time when the image was stored digitally
        0x9290 : "SubsecTime",              // Fractions of seconds for DateTime
        0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
        0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

        // picture-taking conditions
        0x829A : "ExposureTime",            // Exposure time (in seconds)
        0x829D : "FNumber",                 // F number
        0x8822 : "ExposureProgram",         // Exposure program
        0x8824 : "SpectralSensitivity",     // Spectral sensitivity
        0x8827 : "ISOSpeedRatings",         // ISO speed rating
        0x8828 : "OECF",                    // Optoelectric conversion factor
        0x9201 : "ShutterSpeedValue",       // Shutter speed
        0x9202 : "ApertureValue",           // Lens aperture
        0x9203 : "BrightnessValue",         // Value of brightness
        0x9204 : "ExposureBias",            // Exposure bias
        0x9205 : "MaxApertureValue",        // Smallest F number of lens
        0x9206 : "SubjectDistance",         // Distance to subject in meters
        0x9207 : "MeteringMode",            // Metering mode
        0x9208 : "LightSource",             // Kind of light source
        0x9209 : "Flash",                   // Flash status
        0x9214 : "SubjectArea",             // Location and area of main subject
        0x920A : "FocalLength",             // Focal length of the lens in mm
        0xA20B : "FlashEnergy",             // Strobe energy in BCPS
        0xA20C : "SpatialFrequencyResponse",    //
        0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
        0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
        0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        0xA214 : "SubjectLocation",         // Location of subject in image
        0xA215 : "ExposureIndex",           // Exposure index selected on camera
        0xA217 : "SensingMethod",           // Image sensor type
        0xA300 : "FileSource",              // Image source (3 == DSC)
        0xA301 : "SceneType",               // Scene type (1 == directly photographed)
        0xA302 : "CFAPattern",              // Color filter array geometric pattern
        0xA401 : "CustomRendered",          // Special processing
        0xA402 : "ExposureMode",            // Exposure mode
        0xA403 : "WhiteBalance",            // 1 = auto white balance, 2 = manual
        0xA404 : "DigitalZoomRation",       // Digital zoom ratio
        0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
        0xA406 : "SceneCaptureType",        // Type of scene
        0xA407 : "GainControl",             // Degree of overall image gain adjustment
        0xA408 : "Contrast",                // Direction of contrast processing applied by camera
        0xA409 : "Saturation",              // Direction of saturation processing applied by camera
        0xA40A : "Sharpness",               // Direction of sharpness processing applied by camera
        0xA40B : "DeviceSettingDescription",    //
        0xA40C : "SubjectDistanceRange",    // Distance to subject

        // other tags
        0xA005 : "InteroperabilityIFDPointer",
        0xA420 : "ImageUniqueID"            // Identifier assigned uniquely to each image
    };

    var TiffTags = EXIF.TiffTags = {
        0x0100 : "ImageWidth",
        0x0101 : "ImageHeight",
        0x8769 : "ExifIFDPointer",
        0x8825 : "GPSInfoIFDPointer",
        0xA005 : "InteroperabilityIFDPointer",
        0x0102 : "BitsPerSample",
        0x0103 : "Compression",
        0x0106 : "PhotometricInterpretation",
        0x0112 : "Orientation",
        0x0115 : "SamplesPerPixel",
        0x011C : "PlanarConfiguration",
        0x0212 : "YCbCrSubSampling",
        0x0213 : "YCbCrPositioning",
        0x011A : "XResolution",
        0x011B : "YResolution",
        0x0128 : "ResolutionUnit",
        0x0111 : "StripOffsets",
        0x0116 : "RowsPerStrip",
        0x0117 : "StripByteCounts",
        0x0201 : "JPEGInterchangeFormat",
        0x0202 : "JPEGInterchangeFormatLength",
        0x012D : "TransferFunction",
        0x013E : "WhitePoint",
        0x013F : "PrimaryChromaticities",
        0x0211 : "YCbCrCoefficients",
        0x0214 : "ReferenceBlackWhite",
        0x0132 : "DateTime",
        0x010E : "ImageDescription",
        0x010F : "Make",
        0x0110 : "Model",
        0x0131 : "Software",
        0x013B : "Artist",
        0x8298 : "Copyright"
    };

    var GPSTags = EXIF.GPSTags = {
        0x0000 : "GPSVersionID",
        0x0001 : "GPSLatitudeRef",
        0x0002 : "GPSLatitude",
        0x0003 : "GPSLongitudeRef",
        0x0004 : "GPSLongitude",
        0x0005 : "GPSAltitudeRef",
        0x0006 : "GPSAltitude",
        0x0007 : "GPSTimeStamp",
        0x0008 : "GPSSatellites",
        0x0009 : "GPSStatus",
        0x000A : "GPSMeasureMode",
        0x000B : "GPSDOP",
        0x000C : "GPSSpeedRef",
        0x000D : "GPSSpeed",
        0x000E : "GPSTrackRef",
        0x000F : "GPSTrack",
        0x0010 : "GPSImgDirectionRef",
        0x0011 : "GPSImgDirection",
        0x0012 : "GPSMapDatum",
        0x0013 : "GPSDestLatitudeRef",
        0x0014 : "GPSDestLatitude",
        0x0015 : "GPSDestLongitudeRef",
        0x0016 : "GPSDestLongitude",
        0x0017 : "GPSDestBearingRef",
        0x0018 : "GPSDestBearing",
        0x0019 : "GPSDestDistanceRef",
        0x001A : "GPSDestDistance",
        0x001B : "GPSProcessingMethod",
        0x001C : "GPSAreaInformation",
        0x001D : "GPSDateStamp",
        0x001E : "GPSDifferential"
    };

     // EXIF 2.3 Spec
    var IFD1Tags = EXIF.IFD1Tags = {
        0x0100: "ImageWidth",
        0x0101: "ImageHeight",
        0x0102: "BitsPerSample",
        0x0103: "Compression",
        0x0106: "PhotometricInterpretation",
        0x0111: "StripOffsets",
        0x0112: "Orientation",
        0x0115: "SamplesPerPixel",
        0x0116: "RowsPerStrip",
        0x0117: "StripByteCounts",
        0x011A: "XResolution",
        0x011B: "YResolution",
        0x011C: "PlanarConfiguration",
        0x0128: "ResolutionUnit",
        0x0201: "JpegIFOffset",    // When image format is JPEG, this value show offset to JPEG data stored.(aka "ThumbnailOffset" or "JPEGInterchangeFormat")
        0x0202: "JpegIFByteCount", // When image format is JPEG, this value shows data size of JPEG image (aka "ThumbnailLength" or "JPEGInterchangeFormatLength")
        0x0211: "YCbCrCoefficients",
        0x0212: "YCbCrSubSampling",
        0x0213: "YCbCrPositioning",
        0x0214: "ReferenceBlackWhite"
    };

    var StringValues = EXIF.StringValues = {
        ExposureProgram : {
            0 : "Not defined",
            1 : "Manual",
            2 : "Normal program",
            3 : "Aperture priority",
            4 : "Shutter priority",
            5 : "Creative program",
            6 : "Action program",
            7 : "Portrait mode",
            8 : "Landscape mode"
        },
        MeteringMode : {
            0 : "Unknown",
            1 : "Average",
            2 : "CenterWeightedAverage",
            3 : "Spot",
            4 : "MultiSpot",
            5 : "Pattern",
            6 : "Partial",
            255 : "Other"
        },
        LightSource : {
            0 : "Unknown",
            1 : "Daylight",
            2 : "Fluorescent",
            3 : "Tungsten (incandescent light)",
            4 : "Flash",
            9 : "Fine weather",
            10 : "Cloudy weather",
            11 : "Shade",
            12 : "Daylight fluorescent (D 5700 - 7100K)",
            13 : "Day white fluorescent (N 4600 - 5400K)",
            14 : "Cool white fluorescent (W 3900 - 4500K)",
            15 : "White fluorescent (WW 3200 - 3700K)",
            17 : "Standard light A",
            18 : "Standard light B",
            19 : "Standard light C",
            20 : "D55",
            21 : "D65",
            22 : "D75",
            23 : "D50",
            24 : "ISO studio tungsten",
            255 : "Other"
        },
        Flash : {
            0x0000 : "Flash did not fire",
            0x0001 : "Flash fired",
            0x0005 : "Strobe return light not detected",
            0x0007 : "Strobe return light detected",
            0x0009 : "Flash fired, compulsory flash mode",
            0x000D : "Flash fired, compulsory flash mode, return light not detected",
            0x000F : "Flash fired, compulsory flash mode, return light detected",
            0x0010 : "Flash did not fire, compulsory flash mode",
            0x0018 : "Flash did not fire, auto mode",
            0x0019 : "Flash fired, auto mode",
            0x001D : "Flash fired, auto mode, return light not detected",
            0x001F : "Flash fired, auto mode, return light detected",
            0x0020 : "No flash function",
            0x0041 : "Flash fired, red-eye reduction mode",
            0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
            0x0047 : "Flash fired, red-eye reduction mode, return light detected",
            0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
            0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            0x0059 : "Flash fired, auto mode, red-eye reduction mode",
            0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod : {
            1 : "Not defined",
            2 : "One-chip color area sensor",
            3 : "Two-chip color area sensor",
            4 : "Three-chip color area sensor",
            5 : "Color sequential area sensor",
            7 : "Trilinear sensor",
            8 : "Color sequential linear sensor"
        },
        SceneCaptureType : {
            0 : "Standard",
            1 : "Landscape",
            2 : "Portrait",
            3 : "Night scene"
        },
        SceneType : {
            1 : "Directly photographed"
        },
        CustomRendered : {
            0 : "Normal process",
            1 : "Custom process"
        },
        WhiteBalance : {
            0 : "Auto white balance",
            1 : "Manual white balance"
        },
        GainControl : {
            0 : "None",
            1 : "Low gain up",
            2 : "High gain up",
            3 : "Low gain down",
            4 : "High gain down"
        },
        Contrast : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        Saturation : {
            0 : "Normal",
            1 : "Low saturation",
            2 : "High saturation"
        },
        Sharpness : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        SubjectDistanceRange : {
            0 : "Unknown",
            1 : "Macro",
            2 : "Close view",
            3 : "Distant view"
        },
        FileSource : {
            3 : "DSC"
        },

        Components : {
            0 : "",
            1 : "Y",
            2 : "Cb",
            3 : "Cr",
            4 : "R",
            5 : "G",
            6 : "B"
        }
    };

    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, handler);
        }
    }

    function imageHasData(img) {
        return !!(img.exifdata);
    }


    function base64ToArrayBuffer(base64, contentType) {
        contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    function objectURLToBlob(url, callback) {
        var http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.responseType = "blob";
        http.onload = function(e) {
            if (this.status == 200 || this.status === 0) {
                callback(this.response);
            }
        };
        http.send();
    }

    function getImageData(img, callback) {
        function handleBinaryFile(binFile) {
            var data = findEXIFinJPEG(binFile);
            var iptcdata = findIPTCinJPEG(binFile);
            var xmpdata= findXMPinJPEG(binFile);
            img.exifdata = data || {};
            img.iptcdata = iptcdata || {};
            img.xmpdata = xmpdata || {};
            if (callback) {
                callback.call(img);
            }
        }

        if (img.src) {
            if (/^data\:/i.test(img.src)) { // Data URI
                var arrayBuffer = base64ToArrayBuffer(img.src);
                handleBinaryFile(arrayBuffer);

            } else if (/^blob\:/i.test(img.src)) { // Object URL
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    handleBinaryFile(e.target.result);
                };
                objectURLToBlob(img.src, function (blob) {
                    fileReader.readAsArrayBuffer(blob);
                });
            } else {
                var http = new XMLHttpRequest();
                http.onload = function() {
                    if (this.status == 200 || this.status === 0) {
                        handleBinaryFile(http.response);
                    } else {
                        throw "Could not load image";
                    }
                    http = null;
                };
                http.open("GET", img.src, true);
                http.responseType = "arraybuffer";
                http.send(null);
            }
        } else if (self.FileReader && (img instanceof self.Blob || img instanceof self.File)) {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                if (debug) console.log("Got file of length " + e.target.result.byteLength);
                handleBinaryFile(e.target.result);
            };

            fileReader.readAsArrayBuffer(img);
        }
    }

    function findEXIFinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            marker;

        while (offset < length) {
            if (dataView.getUint8(offset) != 0xFF) {
                if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
                return false; // not a valid marker, something is wrong
            }

            marker = dataView.getUint8(offset + 1);
            if (debug) console.log(marker);

            // we could implement handling for other markers here,
            // but we're only looking for 0xFFE1 for EXIF data

            if (marker == 225) {
                if (debug) console.log("Found 0xFFE1 marker");

                return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

                // offset += 2 + file.getShortAt(offset+2, true);

            } else {
                offset += 2 + dataView.getUint16(offset+2);
            }

        }

    }

    function findIPTCinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength;


        var isFieldSegmentStart = function(dataView, offset){
            return (
                dataView.getUint8(offset) === 0x38 &&
                dataView.getUint8(offset+1) === 0x42 &&
                dataView.getUint8(offset+2) === 0x49 &&
                dataView.getUint8(offset+3) === 0x4D &&
                dataView.getUint8(offset+4) === 0x04 &&
                dataView.getUint8(offset+5) === 0x04
            );
        };

        while (offset < length) {

            if ( isFieldSegmentStart(dataView, offset )){

                // Get the length of the name header (which is padded to an even number of bytes)
                var nameHeaderLength = dataView.getUint8(offset+7);
                if(nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
                // Check for pre photoshop 6 format
                if(nameHeaderLength === 0) {
                    // Always 4
                    nameHeaderLength = 4;
                }

                var startOffset = offset + 8 + nameHeaderLength;
                var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

                return readIPTCData(file, startOffset, sectionLength);

                break;

            }


            // Not the marker, continue searching
            offset++;

        }

    }
    var IptcFieldMap = {
        0x78 : 'caption',
        0x6E : 'credit',
        0x19 : 'keywords',
        0x37 : 'dateCreated',
        0x50 : 'byline',
        0x55 : 'bylineTitle',
        0x7A : 'captionWriter',
        0x69 : 'headline',
        0x74 : 'copyright',
        0x0F : 'category'
    };
    function readIPTCData(file, startOffset, sectionLength){
        var dataView = new DataView(file);
        var data = {};
        var fieldValue, fieldName, dataSize, segmentType, segmentSize;
        var segmentStartPos = startOffset;
        while(segmentStartPos < startOffset+sectionLength) {
            if(dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos+1) === 0x02){
                segmentType = dataView.getUint8(segmentStartPos+2);
                if(segmentType in IptcFieldMap) {
                    dataSize = dataView.getInt16(segmentStartPos+3);
                    segmentSize = dataSize + 5;
                    fieldName = IptcFieldMap[segmentType];
                    fieldValue = getStringFromDB(dataView, segmentStartPos+5, dataSize);
                    // Check if we already stored a value with this name
                    if(data.hasOwnProperty(fieldName)) {
                        // Value already stored with this name, create multivalue field
                        if(data[fieldName] instanceof Array) {
                            data[fieldName].push(fieldValue);
                        }
                        else {
                            data[fieldName] = [data[fieldName], fieldValue];
                        }
                    }
                    else {
                        data[fieldName] = fieldValue;
                    }
                }

            }
            segmentStartPos++;
        }
        return data;
    }



    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getUint16(dirStart, !bigEnd),
            tags = {},
            entryOffset, tag,
            i;

        for (i=0;i<entries;i++) {
            entryOffset = dirStart + i*12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }


    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getUint16(entryOffset+2, !bigEnd),
            numValues = file.getUint32(entryOffset+4, !bigEnd),
            valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
            offset,
            vals, val, n,
            numerator, denominator;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues == 1) {
                    return file.getUint8(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint8(offset + n);
                    }
                    return vals;
                }

            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                return getStringFromDB(file, offset, numValues-1);

            case 3: // short, 16 bit int
                if (numValues == 1) {
                    return file.getUint16(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint16(offset + 2*n, !bigEnd);
                    }
                    return vals;
                }

            case 4: // long, 32 bit int
                if (numValues == 1) {
                    return file.getUint32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 5:    // rational = two long values, first is numerator, second is denominator
                if (numValues == 1) {
                    numerator = file.getUint32(valueOffset, !bigEnd);
                    denominator = file.getUint32(valueOffset+4, !bigEnd);
                    val = new Number(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
                        denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
                        vals[n] = new Number(numerator / denominator);
                        vals[n].numerator = numerator;
                        vals[n].denominator = denominator;
                    }
                    return vals;
                }

            case 9: // slong, 32 bit signed int
                if (numValues == 1) {
                    return file.getInt32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues == 1) {
                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
                    }
                    return vals;
                }
        }
    }

    /**
    * Given an IFD (Image File Directory) start offset
    * returns an offset to next IFD or 0 if it's the last IFD.
    */
    function getNextIFDOffset(dataView, dirStart, bigEnd){
        //the first 2bytes means the number of directory entries contains in this IFD
        var entries = dataView.getUint16(dirStart, !bigEnd);

        // After last directory entry, there is a 4bytes of data,
        // it means an offset to next IFD.
        // If its value is '0x00000000', it means this is the last IFD and there is no linked IFD.

        return dataView.getUint32(dirStart + 2 + entries * 12, !bigEnd); // each entry is 12 bytes long
    }

    function readThumbnailImage(dataView, tiffStart, firstIFDOffset, bigEnd){
        // get the IFD1 offset
        var IFD1OffsetPointer = getNextIFDOffset(dataView, tiffStart+firstIFDOffset, bigEnd);

        if (!IFD1OffsetPointer) {
            // console.log('******** IFD1Offset is empty, image thumb not found ********');
            return {};
        }
        else if (IFD1OffsetPointer > dataView.byteLength) { // this should not happen
            // console.log('******** IFD1Offset is outside the bounds of the DataView ********');
            return {};
        }
        // console.log('*******  thumbnail IFD offset (IFD1) is: %s', IFD1OffsetPointer);

        var thumbTags = readTags(dataView, tiffStart, tiffStart + IFD1OffsetPointer, IFD1Tags, bigEnd)

        // EXIF 2.3 specification for JPEG format thumbnail

        // If the value of Compression(0x0103) Tag in IFD1 is '6', thumbnail image format is JPEG.
        // Most of Exif image uses JPEG format for thumbnail. In that case, you can get offset of thumbnail
        // by JpegIFOffset(0x0201) Tag in IFD1, size of thumbnail by JpegIFByteCount(0x0202) Tag.
        // Data format is ordinary JPEG format, starts from 0xFFD8 and ends by 0xFFD9. It seems that
        // JPEG format and 160x120pixels of size are recommended thumbnail format for Exif2.1 or later.

        if (thumbTags['Compression']) {
            // console.log('Thumbnail image found!');

            switch (thumbTags['Compression']) {
                case 6:
                    // console.log('Thumbnail image format is JPEG');
                    if (thumbTags.JpegIFOffset && thumbTags.JpegIFByteCount) {
                    // extract the thumbnail
                        var tOffset = tiffStart + thumbTags.JpegIFOffset;
                        var tLength = thumbTags.JpegIFByteCount;
                        thumbTags['blob'] = new Blob([new Uint8Array(dataView.buffer, tOffset, tLength)], {
                            type: 'image/jpeg'
                        });
                    }
                break;

            case 1:
                console.log("Thumbnail image format is TIFF, which is not implemented.");
                break;
            default:
                console.log("Unknown thumbnail image format '%s'", thumbTags['Compression']);
            }
        }
        else if (thumbTags['PhotometricInterpretation'] == 2) {
            console.log("Thumbnail image format is RGB, which is not implemented.");
        }
        return thumbTags;
    }

    function getStringFromDB(buffer, start, length) {
        var outstr = "";
        for (var n = start; n < start+length; n++) {
            outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
    }

    function readEXIFData(file, start) {
        if (getStringFromDB(file, start, 4) != "Exif") {
            if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
            return false;
        }

        var bigEnd,
            tags, tag,
            exifData, gpsData,
            tiffOffset = start + 6;

        // test for TIFF validity and endianness
        if (file.getUint16(tiffOffset) == 0x4949) {
            bigEnd = false;
        } else if (file.getUint16(tiffOffset) == 0x4D4D) {
            bigEnd = true;
        } else {
            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            return false;
        }

        if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);

        if (firstIFDOffset < 0x00000008) {
            if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
            return false;
        }

        tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

        if (tags.ExifIFDPointer) {
            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
            for (tag in exifData) {
                switch (tag) {
                    case "LightSource" :
                    case "Flash" :
                    case "MeteringMode" :
                    case "ExposureProgram" :
                    case "SensingMethod" :
                    case "SceneCaptureType" :
                    case "SceneType" :
                    case "CustomRendered" :
                    case "WhiteBalance" :
                    case "GainControl" :
                    case "Contrast" :
                    case "Saturation" :
                    case "Sharpness" :
                    case "SubjectDistanceRange" :
                    case "FileSource" :
                        exifData[tag] = StringValues[tag][exifData[tag]];
                        break;

                    case "ExifVersion" :
                    case "FlashpixVersion" :
                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                        break;

                    case "ComponentsConfiguration" :
                        exifData[tag] =
                            StringValues.Components[exifData[tag][0]] +
                            StringValues.Components[exifData[tag][1]] +
                            StringValues.Components[exifData[tag][2]] +
                            StringValues.Components[exifData[tag][3]];
                        break;
                }
                tags[tag] = exifData[tag];
            }
        }

        if (tags.GPSInfoIFDPointer) {
            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
            for (tag in gpsData) {
                switch (tag) {
                    case "GPSVersionID" :
                        gpsData[tag] = gpsData[tag][0] +
                            "." + gpsData[tag][1] +
                            "." + gpsData[tag][2] +
                            "." + gpsData[tag][3];
                        break;
                }
                tags[tag] = gpsData[tag];
            }
        }

        // extract thumbnail
        tags['thumbnail'] = readThumbnailImage(file, tiffOffset, firstIFDOffset, bigEnd);

        return tags;
    }

   function findXMPinJPEG(file) {

        if (!('DOMParser' in self)) {
            // console.warn('XML parsing not supported without DOMParser');
            return;
        }
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
           if (debug) console.log("Not a valid JPEG");
           return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            dom = new DOMParser();

        while (offset < (length-4)) {
            if (getStringFromDB(dataView, offset, 4) == "http") {
                var startOffset = offset - 1;
                var sectionLength = dataView.getUint16(offset - 2) - 1;
                var xmpString = getStringFromDB(dataView, startOffset, sectionLength)
                var xmpEndIndex = xmpString.indexOf('xmpmeta>') + 8;
                xmpString = xmpString.substring( xmpString.indexOf( '<x:xmpmeta' ), xmpEndIndex );

                var indexOfXmp = xmpString.indexOf('x:xmpmeta') + 10
                //Many custom written programs embed xmp/xml without any namespace. Following are some of them.
                //Without these namespaces, XML is thought to be invalid by parsers
                xmpString = xmpString.slice(0, indexOfXmp)
                            + 'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" '
                            + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
                            + 'xmlns:tiff="http://ns.adobe.com/tiff/1.0/" '
                            + 'xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" '
                            + 'xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" '
                            + 'xmlns:exif="http://ns.adobe.com/exif/1.0/" '
                            + 'xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" '
                            + 'xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" '
                            + 'xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" '
                            + 'xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" '
                            + 'xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" '
                            + xmpString.slice(indexOfXmp)

                var domDocument = dom.parseFromString( xmpString, 'text/xml' );
                return xml2Object(domDocument);
            } else{
             offset++;
            }
        }
    }

    function xml2Object(xml) {
        try {
            var obj = {};
            if (xml.children.length > 0) {
              for (var i = 0; i < xml.children.length; i++) {
                var item = xml.children.item(i);
                var attributes = item.attributes;
                for(var idx in attributes) {
                    var itemAtt = attributes[idx];
                    var dataKey = itemAtt.nodeName;
                    var dataValue = itemAtt.nodeValue;

                    if(dataKey !== undefined) {
                        obj[dataKey] = dataValue;
                    }
                }
                var nodeName = item.nodeName;

                if (typeof (obj[nodeName]) == "undefined") {
                  obj[nodeName] = xml2json(item);
                } else {
                  if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];

                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                  }
                  obj[nodeName].push(xml2json(item));
                }
              }
            } else {
              obj = xml.textContent;
            }
            return obj;
          } catch (e) {
              console.log(e.message);
          }
    }

    EXIF.getData = function(img, callback) {
        if (((self.Image && img instanceof self.Image)
            || (self.HTMLImageElement && img instanceof self.HTMLImageElement))
            && !img.complete)
            return false;

        if (!imageHasData(img)) {
            getImageData(img, callback);
        } else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    }

    EXIF.getTag = function(img, tag) {
        if (!imageHasData(img)) return;
        return img.exifdata[tag];
    }
    
    EXIF.getIptcTag = function(img, tag) {
        if (!imageHasData(img)) return;
        return img.iptcdata[tag];
    }

    EXIF.getAllTags = function(img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.exifdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }
    
    EXIF.getAllIptcTags = function(img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.iptcdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }

    EXIF.pretty = function(img) {
        if (!imageHasData(img)) return "";
        var a,
            data = img.exifdata,
            strPretty = "";
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] == "object") {
                    if (data[a] instanceof Number) {
                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                    } else {
                        strPretty += a + " : [" + data[a].length + " values]\r\n";
                    }
                } else {
                    strPretty += a + " : " + data[a] + "\r\n";
                }
            }
        }
        return strPretty;
    }

    EXIF.readFromBinaryFile = function(file) {
        return findEXIFinJPEG(file);
    }

    if (typeof define === 'function' && define.amd) {
        define('exif-js', [], function() {
            return EXIF;
        });
    }
}.call(this));

/*global $, kUtil, TaskQueue, EXIF*/
var KPainter = function(initSetting){
    var kPainter = this;

    initSetting = initSetting || {};
    var isSupportTouch;
    if("mouse" == initSetting.gesturer){
        isSupportTouch = false;
    }else if("touch" == initSetting.gesturer){
        isSupportTouch = true;
    }else{
        isSupportTouch = "ontouchend" in document ? true : false;
    }
    KPainter.xxx = isSupportTouch;
    
    //var isMobileSafari = (/iPhone/i.test(navigator.platform) || /iPod/i.test(navigator.platform) || /iPad/i.test(navigator.userAgent)) && !!navigator.appVersion.match(/(?:Version\/)([\w\._]+)/); 
    var absoluteCenterDistance = 100000;
    
    var cvsToBlobAsync = function(cvs, callback, mimeType, quality){
        if(cvs.toBlob){
            cvs.toBlob(callback, mimeType, quality);
        }else{
            var b64str = cvs.toDataURL(mimeType, quality);
            var blob = kUtil.convertBase64ToBlob(b64str.substring(b64str.indexOf(",")+1), mimeType);
            callback(blob);
        }
    };
    var imgToCvs = function(img, tsf, maxWH){
        tsf = tsf || new kUtil.Matrix(1,0,0,1,0,0);
        var tCvs = document.createElement("canvas");

        var bSwitchWH = false;
        if(0 != tsf.a*tsf.d && 0 == tsf.b*tsf.c){
            tCvs.width = img.naturalWidth || img.width;
            tCvs.height = img.naturalHeight || img.height;
        }else{
            bSwitchWH = true;
            tCvs.width = img.naturalHeight || img.height;
            tCvs.height = img.naturalWidth || img.width;
        }

        var zoom = 1;
        if(tCvs.width > maxWH || tCvs.height > maxWH){
            zoom = maxWH / Math.max(tCvs.width, tCvs.height);
            tCvs.width = Math.min(tCvs.width * zoom);
            tCvs.height = Math.min(tCvs.height * zoom);
        }

        var ctx = tCvs.getContext('2d');
        ctx.setTransform(tsf.a, tsf.b, tsf.c, tsf.d, tsf.e*tCvs.width, tsf.f*tCvs.height);
        if(!bSwitchWH){
            ctx.drawImage(img, 0, 0, tCvs.width, tCvs.height);
        }else{
            ctx.drawImage(img, 0, 0, tCvs.height, tCvs.width);
        }
        return tCvs;
    };
    var blobToCvsAsync = function(blob, tsf, callback, maxWH){
        var useObjurlToDrawBlobToCvs = function(){
            var objUrl = URL.createObjectURL(blob);
            var img = new Image();
            img.onload = img.onerror = function(){
                img.onload = img.onerror = null;
                var tCvs = imgToCvs(img, tsf, maxWH);
                URL.revokeObjectURL(objUrl);
                callback(tCvs);
            };
            img.src = objUrl;
        };
        if(window.createImageBitmap){
            createImageBitmap(blob).then(function(img){
                callback(imgToCvs(img, tsf, maxWH));
            }).catch(function(){
                useObjurlToDrawBlobToCvs();
            });
        }else{
            useObjurlToDrawBlobToCvs();
        }
    };

    var doCallbackNoBreak = KPainter._doCallbackNoBreak;

    /*eslint-disable indent*/
    var containerDiv = $([
        '<div style="width:800px;height:600px;border:1px solid #ccc;">',
            '<div class="kPainterBox">',
                '<div class="kPainterImgsDiv">',
                    '<canvas class="kPainterCanvas" style="display:none;left:0;top:0;"></canvas>',
                '</div',
                '><div class="kPainterCroper" style="width:50px;height:50px;display:none;">',
                    '<div class="kPainterCells">',
                        '<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>',
                    '</div',
                    '><div class="kPainterBigMover" data-orient="0,0" style="display:none"></div',
                    '><div class="kPainterEdges">',
                        '<div data-orient="-1,0"></div',
                        '><div data-orient="0,-1"></div',
                        '><div data-orient="1,0"></div',
                        '><div data-orient="0,1"></div>',
                    '</div',
                    '><div class="kPainterCorners">',
                        '<div data-orient="-1,-1"><i></i></div',
                        '><div data-orient="1,-1"><i></i></div',
                        '><div data-orient="1,1"><i></i></div',
                        '><div data-orient="-1,1"><i></i></div>',
                    '</div',
                    '><div class="kPainterMover" data-orient="0,0">',
                        '<div></div>',
                        '<svg width="20" height="20" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1792 896q0 26-19 45l-256 256q-19 19-45 19t-45-19-19-45v-128h-384v384h128q26 0 45 19t19 45-19 45l-256 256q-19 19-45 19t-45-19l-256-256q-19-19-19-45t19-45 45-19h128v-384h-384v128q0 26-19 45t-45 19-45-19l-256-256q-19-19-19-45t19-45l256-256q19-19 45-19t45 19 19 45v128h384v-384h-128q-26 0-45-19t-19-45 19-45l256-256q19-19 45-19t45 19l256 256q19 19 19 45t-19 45-45 19h-128v384h384v-128q0-26 19-45t45-19 45 19l256 256q19 19 19 45z" fill="#fff"/></svg>',
                    '</div>',
                '</div',
                '><div class="kPainterPerspect" style="display:none;">',
                    '<canvas class="kPainterPerspectCvs"></canvas',
                    '><div class="kPainterPerspectCorner" data-index="0">lt</div',
                    '><div class="kPainterPerspectCorner" data-index="1">rt</div',
                    '><div class="kPainterPerspectCorner" data-index="2">rb</div',
                    '><div class="kPainterPerspectCorner" data-index="3">lb</div>',
                '</div',
                '><div class="kPainterGesturePanel"></div',
                '><div class="kPainterVideoMdl" style="display:none;">',
                      '<video class="kPainterVideo" webkit-playsinline="true"></video>',
                      '<button class="kPainterBtnGrabVideo"><svg width="8vmin" viewBox="0 0 2048 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1024 672q119 0 203.5 84.5t84.5 203.5-84.5 203.5-203.5 84.5-203.5-84.5-84.5-203.5 84.5-203.5 203.5-84.5zm704-416q106 0 181 75t75 181v896q0 106-75 181t-181 75h-1408q-106 0-181-75t-75-181v-896q0-106 75-181t181-75h224l51-136q19-49 69.5-84.5t103.5-35.5h512q53 0 103.5 35.5t69.5 84.5l51 136h224zm-704 1152q185 0 316.5-131.5t131.5-316.5-131.5-316.5-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5z"/></svg></button>',
                      '<button class="kPainterBtnCloseVideo"><svg width="8vmin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/></svg></button>',
                '</div>',
            '</div>',
        '</div>'
    ].join(''))[0];
    /*eslint-enable indent*/
    var mainBox = $(containerDiv).children();
    var mainCvs = mainBox.find('> .kPainterImgsDiv > .kPainterCanvas')[0];

    kPainter.getHtmlElement = function(){
        return containerDiv;
    };

    var curIndex = -1;
    var imgArr = [];
    var gestureStatus = null;
    var workingPointerDevice = null;
    /*$(document).on('touch')*/
    var isEditing = false;

    kPainter.getCurIndex = function(){ return curIndex; };
    kPainter.getCount = function(){ return imgArr.length; };
    kPainter.isEditing = function(){
        return isEditing;
    };

    kPainter.getImage = function(isOri, index){
        if(undefined == index){
            index = curIndex;
        }
        if(isNaN(index)){ return; }
        index = Math.round(index);
        if(index < 0 || index >= imgArr.length){ return; }
        var img;
        if(isOri){
            img = imgArr[index];
        }else{
            img = $(imgArr[index]).clone()[0];
            img.setAttribute('style','');
        }
        return img;
    };

    kPainter.onStartLoading = null;
    kPainter.onFinishLoading = null;
    var onStartLoadingNoBreak = function(){
        doCallbackNoBreak(kPainter.onStartLoading);
    };
    var onFinishLoadingNoBreak = function(){
        doCallbackNoBreak(kPainter.onFinishLoading);
    };


    var imgStorer = new function(){

        var imgStorer = this;

        var hiddenFileIpt = $('<input type="file" accept="image/bmp,image/gif,image/jpeg,image/png,image/webp" multiple style="display:none">');
        kPainter.onAddImgFromFileChooseWindow = null;
        $(hiddenFileIpt).change(function(){
            for(var i=0; i<this.files.length - 1; ++i){
                addImageAsync(this.files[i]); // have queued inner, so not recur
            }
            addImageAsync(this.files[this.files.length - 1], kPainter.onAddImgFromFileChooseWindow);
            $(this).val('');
        });

        kPainter.setHiddenFileIpt = function(inputEl){
            if(inputEl instanceof HTMLInputElement){
                hiddenFileIpt = inputEl;
                return true;
            }else{
                return false;
            }
        };
        kPainter.showFileChooseWindow = function(){
            if(isEditing){ return null; }
            hiddenFileIpt.click();
            return hiddenFileIpt;
        };
        
        kPainter.onAddImgFromDropFile = null;
        mainBox.on('drop', function(jqEvent){
            var oEvent = jqEvent.originalEvent;
            oEvent.stopPropagation();
            oEvent.preventDefault();
            var files = oEvent.dataTransfer.files;
            for(var i = 0; i < files.length - 1; ++i){
                addImageAsync(files[i]);
            }
            addImageAsync(files[files.length - 1], kPainter.onAddImgFromDropFile);
        });

        var loadImgTaskQueue = new TaskQueue();
        var addImageAsync = kPainter.addImageAsync = function(imgData, callback){
            if(isEditing){ 
                doCallbackNoBreak(callback,[false]);
                return;
            }
            if(!imgData){
                doCallbackNoBreak(callback,[false]);
                return;
            }
            if(imgData instanceof Blob){//
            }else if(imgData instanceof HTMLCanvasElement){//
            }else if(typeof imgData == "string" || imgData instanceof String){//
            }else if(imgData instanceof HTMLImageElement){//
            }else{
                doCallbackNoBreak(callback,[false]);
                return;
            }
            onStartLoadingNoBreak();
            loadImgTaskQueue.push(
                addImageTask, 
                null, 
                [imgData, function(isSuccess){ 
                    doCallbackNoBreak(callback,[isSuccess]);
                    loadImgTaskQueue.next();
                    if(!loadImgTaskQueue.isWorking){
                        onFinishLoadingNoBreak();
                    }
                }]
            );
        };

        var getTransform = function(blob, callback){
            // only jpeg has exif
            if("image/jpeg" != blob.type){
                callback(null);
                return;
            }
            EXIF.getData(blob, function(){
                // img from ios may have orientation
                /*eslint-disable indent*/
                var orient = EXIF.getTag(this, 'Orientation');//,
                    // pxX = EXIF.getTag(this, 'PixelXDimension'),
                    // pxY = EXIF.getTag(this, 'PixelYDimension');
                var tsf = null;
                switch(orient){
                    case 6: tsf = new kUtil.Matrix(0,1,-1,0,1,0); break;
                    case 3: tsf = new kUtil.Matrix(-1,0,0,-1,1,1); break;
                    case 8: tsf = new kUtil.Matrix(0,-1,1,0,0,1); break;
                    default: break;
                }
                /*eslint-enable indent*/
                callback(tsf);
            });
        };

        var isPNGTransparent = function(blob, callback){
            var hBlob = blob.slice(25,26);
            var fileReader = new FileReader();
            fileReader.onload = function(){
                var hInt8Arr = new Int8Array(fileReader.result);
                var sign = hInt8Arr[0];
                callback(4 == (sign & 4));
            };
            fileReader.readAsArrayBuffer(hBlob);
        };
        var getSaveFormat = function(blob, callback){
            var type = blob.type;
            if(type.indexOf("webp")!=-1){
                if(callback){callback("image/webp");}
            }else if(type.indexOf("gif")!=-1 || type.indexOf("svg")!=-1){
                if(callback){callback("image/png");}
            }else if(type.indexOf("png")!=-1){
                isPNGTransparent(blob, function(isTransparent){
                    if(callback){callback(isTransparent ? "image/png" : "image/jpeg");}
                });
            }else{ // like jpeg
                if(callback){callback("image/jpeg");}
            }
        };
        var addImageTask = function(imgData, callback){
            getBlobAndFormatFromAnyImgData(imgData, function(blob, format){
                if(blob){
                    doCallbackNoBreak(function(){//wrap only for check
                        addFinalImageAsync(blob, format, callback);
                    });
                }else{
                    callback(false);
                }
            });
        };
        var getBlobAndFormatFromAnyImgData = imgStorer.getBlobAndFormatFromAnyImgData = function(imgData, callback){

            var afterGetBlob = function(blob){
                getSaveFormat(blob, function(format){
                    getTransform(blob, function(tsf){
                        fixImgOrient(blob, tsf, format, function(blob){
                            callback(blob, format);
                        });
                    });
                });
            };

            if(imgData instanceof Blob){
                afterGetBlob(imgData);
            }else if(imgData instanceof HTMLCanvasElement){
                cvsToBlobAsync(imgData, function(blob){
                    afterGetBlob(blob);
                });
            }else if(typeof imgData == "string" || imgData instanceof String){
                var url = imgData;
                if("data:" == url.substring(0, 5)){ // url is base64
                    var mimeType = "";
                    if("image/" == url.substring(5, 11)){
                        mimeType = url.substring(5, url.indexOf(";", 11));
                    }
                    var blob = kUtil.convertBase64ToBlob(url.substring(url.indexOf("base64,")+7), mimeType);
                    afterGetBlob(blob);
                }else{ // url is link, such as 'https://....'
                    kUtil.convertURLToBlob(url, function(blob){
                        if(blob){
                            afterGetBlob(blob);
                        }else{
                            callback(null, '');
                        }
                    });
                }
            }else if(imgData instanceof HTMLImageElement){
                var src;
                //src maybe access denied
                try{
                    src = imgData.src;
                }catch(ex){
                    setTimeout(function(){
                        throw(ex);
                    },0);
                    callback(null, '');
                    return;
                }
                getBlobAndFormatFromAnyImgData(src, function(blob, format){
                    if(blob){
                        callback(blob, format);
                    }else{
                        // url not available, maybe network problem
                        // use imgData -> canvas -> blob instand 

                        var tCvs = document.createElement('canvas');
                        tCvs.width = imgData.naturalWidth;
                        tCvs.height = imgData.naturalHeight;
                        var ctx = tCvs.getContext('2d');
                        ctx.drawImage(imgData, 0, 0);

                        // use suffix guess image mime type
                        var suffix = "";
                        var questionPos = src.lastIndexOf("?");
                        var dotPos = -1;
                        if(-1 != questionPos){
                            dotPos = src.lastIndexOf(".", questionPos);
                            if(-1 != dotPos && questionPos - dotPos <= 5){ //max supported type suffix is 4
                                suffix = src.substring(dotPos + 1, questionPos);
                            }
                        }else{
                            dotPos = src.lastIndexOf(".");
                            if(-1 != dotPos){
                                if(src.length - dotPos <= 5){ //max supported type suffix is 4
                                    suffix = src.substring(dotPos + 1);
                                }else{
                                    suffix = src.substring(dotPos + 1, dotPos + 5);
                                }
                            }
                        }
                        var saveFormat;
                        if(-1 != suffix.indexOf("webp")){
                            saveFormat = "image/webp";
                        }else if(-1 != suffix.indexOf("png") || -1 != suffix.indexOf("gif") || -1 != suffix.indexOf("svg")){
                            saveFormat = "image/png";
                        }else{ // like jpeg
                            saveFormat = "image/jpeg";
                        }

                        cvsToBlobAsync(tCvs, function(blob){
                            afterGetBlob(blob);
                        }, saveFormat);
                    }
                });
            }else{
                //not support
                callback(null, '');
            }
        };

        kPainter.addedImageMaxWH = 4096;
        var fixImgOrient = function(blob, tsf, format, callback){
            if(tsf){
                // fix img from ios
                blobToCvsAsync(blob, tsf, function(tCvs){
                    cvsToBlobAsync(tCvs, function(blob){
                        if(callback){ callback(blob); }
                    }, format);
                });
            }else{
                if(callback){ callback(blob); }
            }
        };

        kPainter.isShowNewImgWhenAdd = true;
        var addFinalImageAsync = function(blob, format, callback){
            var img = new Image();
            img.kPainterOriBlob = img.kPainterBlob = blob;
            img.kPainterSaveFormat = format;
            var objUrl = URL.createObjectURL(img.kPainterBlob);
            img.onload = img.onerror = function(){
                {
                    // walk around for ios safari bug
                    kPainter._noAnyUseButForIosSafariBug0 = img.naturalWidth;
                    kPainter._noAnyUseButForIosSafariBug1 = img.naturalHeight;
                }
                img.kPainterWidth = img.naturalWidth;
                img.kPainterHeight = img.naturalHeight;
                img.kPainterOriWidth = img.kPainterWidth;
                img.kPainterOriHeight = img.kPainterHeight;

                if(img.kPainterWidth > kPainter.addedImageMaxWH || img.kPainterHeight > kPainter.addedImageMaxWH){
                    cvsToBlobAsync(imgToCvs(img, null, kPainter.addedImageMaxWH), function(blob){
                        URL.revokeObjectURL(objUrl);
                        img.kPainterOriBlob = img.kPainterBlob = blob;
                        objUrl = URL.createObjectURL(img.kPainterBlob);
                        img.src = objUrl;//would recall img.onload
                    }, format);
                }else{
                    img.onload = img.onerror = null;
                    if(kPainter.isShowNewImgWhenAdd || -1 == curIndex){
                        showImg(imgArr.length - 1);
                    }

                    //ThumbBox**
                    try{(function(){
                        for(var i = 0; i < thumbnailCvsArr.length; ++i){
                            var cvs = thumbnailCvsArr[i].cvs;
                            var mwh = thumbnailCvsArr[i].mwh;
                            var rate = Math.min(mwh / img.naturalWidth, mwh / img.naturalHeight, 1);
                            cvs.width = Math.round(img.naturalWidth * rate);
                            cvs.height = Math.round(img.naturalHeight * rate);
                            var ctx = cvs.getContext('2d');
                            ctx.drawImage(img,0,0,cvs.width,cvs.height);
                        }
                    })();}catch(ex){setTimeout(function(){throw ex;},0);}
                    //**ThumbBox

                    if(callback){ callback(true); }
                }
            };
            img.src = objUrl;
            $(img).hide();
            mainBox.children('.kPainterImgsDiv').append(img);
            imgArr.push(img);
            
            //ThumbBox**
            var thumbnailCvsArr = [];
            try{(function(){
                for(var i = 0; i < thumbnailBoxArr.length; ++i){
                    var container = thumbnailBoxArr[i];
                    var funWrap = container.kPainterFunWrap;
                    var cvs = document.createElement('canvas');
                    cvs.className = 'kPainterThumbnailCanvas';
                    thumbnailCvsArr.push({cvs:cvs,mwh:container.kPainterMaxWH});
                    var box = null;
                    try{ box = funWrap ? funWrap(cvs) : cvs;
                    }catch(ex){
                        setTimeout(function(){throw ex;},0);
                        break;
                    }
                    if(box){
                        box.getKPainterIndex = function(){
                            return container.kPainterThumbBoxArr.indexOf(this);
                        };
                        container.kPainterThumbBoxArr.push(box);
                        container.appendChild(box);
                    }
                }
            })();}catch(ex){setTimeout(function(){throw ex;},0);}
            //**ThumbBox
        };

        var setImgStyleNoRatateFit = function(){
            var img = imgArr[curIndex];
            var box = mainBox;
            var pbr = box.paddingBoxRect();//eslint-disable-line
            var cbr = box.contentBoxRect();
            var zoom = img.kPainterZoom = Math.min(cbr.width/img.kPainterWidth,cbr.height/img.kPainterHeight);
            //img.style.transform = "";
            img.style.width = (Math.round(img.kPainterWidth * zoom) || 1) + "px"; 
            img.style.height = (Math.round(img.kPainterHeight * zoom) || 1) + "px"; 
            img.style.left = img.style.right = img.style.top = img.style.bottom = -absoluteCenterDistance+"px";

            if(imgArr.length >= 2){
                var pImg = imgArr[(imgArr.length + curIndex - 1) % imgArr.length];
                zoom = Math.min(cbr.width/pImg.kPainterWidth,cbr.height/pImg.kPainterHeight);
                pImg.style.width = (Math.round(pImg.kPainterWidth * zoom) || 1) + "px"; 
                pImg.style.height = (Math.round(pImg.kPainterHeight * zoom) || 1) + "px"; 
                pImg.style.right = absoluteCenterDistance+"px";
                pImg.style.left = pImg.style.top = pImg.style.bottom = -absoluteCenterDistance+"px";
            }
            if(imgArr.length >= 3){
                var nImg = imgArr[(imgArr.length + curIndex + 1) % imgArr.length];
                zoom = Math.min(cbr.width/nImg.kPainterWidth,cbr.height/nImg.kPainterHeight);
                nImg.style.width = (Math.round(nImg.kPainterWidth * zoom) || 1) + "px"; 
                nImg.style.height = (Math.round(nImg.kPainterHeight * zoom) || 1) + "px"; 
                nImg.style.left = absoluteCenterDistance+"px";
                nImg.style.right = nImg.style.top = pImg.style.bottom = -absoluteCenterDistance+"px";
            }
        };

        var resizeTaskId = null;
        var resizeTimeout = 500;
        var isWaitingResize = false;//eslint-disable-line
        var beforeTimeoutIsEditing;
        kPainter.updateUIOnResize = function(isLazy, callback){
            if(null != resizeTaskId){
                clearTimeout(resizeTaskId);
                resizeTaskId = null;
            }
            if(isLazy){
                beforeTimeoutIsEditing = isEditing;
                resizeTaskId = setTimeout(function(){
                    if(curIndex != -1 && beforeTimeoutIsEditing == isEditing){
                        if(isEditing){
                            gesturer.setImgStyleFit();
                        }else{
                            setImgStyleNoRatateFit();
                        }
                        doCallbackNoBreak(callback);
                    }
                    resizeTaskId = null;
                }, resizeTimeout);
            }else{
                if(curIndex != -1){
                    if(isEditing){
                        gesturer.setImgStyleFit();
                    }else{
                        setImgStyleNoRatateFit();
                    }
                    doCallbackNoBreak(callback);
                }
            }
        };

        var showImg = imgStorer.showImg = function(index){
            var img = imgArr[index];
            $(img).siblings().hide();
            curIndex = index;
            $(img).show();
            if(imgArr.length >= 2){
                if(index > 0 || kPainter.allowedTouchMoveSwitchImgOverBoundary){
                    var pImg = imgArr[(imgArr.length + index - 1) % imgArr.length];
                    $(pImg).show();
                }
            }
            if(imgArr.length >= 3){
                if(index < imgArr.length - 1 || kPainter.allowedTouchMoveSwitchImgOverBoundary){
                    var nImg = imgArr[(imgArr.length + index + 1) % imgArr.length];
                    $(nImg).show();
                }
            }
            setImgStyleNoRatateFit();
            updateNumUI();
        };

        kPainter.onNumChange = null;
        var updateNumUI = (function(){
            var _index = undefined, _length = undefined;
            return function(){
                if(_index != curIndex || _length != imgArr.length){
                    _index = curIndex;
                    _length = imgArr.length;
                    doCallbackNoBreak(kPainter.onNumChange,[curIndex, imgArr.length]);
                }
            }; 
        })();

        /* cmd possible value "f", "p", "n", "l", or a number. 
         * means first, pre, next, last...
         */
        kPainter.changePage = function(cmd){
            if(isEditing){ return false; }
            var index;
            /*eslint-disable indent*/
            switch(cmd){
                case "f": index = 0; break;
                case "p": index = curIndex - 1; break;
                case "n": index = curIndex + 1; break;
                case "l": index = imgArr.length - 1; break;
                default: 
                    if(arguments.length < 1 || isNaN(cmd)){
                        return false;
                    }else{
                        index = Math.round(cmd);
                    }
            }
            /*eslint-enable indent*/
            if(index < 0 || index >= imgArr.length || index == curIndex){ return false; }
            showImg(index);
            return true;
        };

        kPainter.del = function(index){
            if(isEditing){ return false; }
            if(arguments.length < 1){
                index = curIndex;
            }
            if(isNaN(index)){ return false; }
            index = Math.round(index);
            if(index < 0 || index >= imgArr.length){ return false; }
            URL.revokeObjectURL(imgArr[index].src);
            $(imgArr[index]).remove();
            imgArr.splice(index, 1);

            //ThumbBox**
            try{
                for(var i = 0; i < thumbnailBoxArr.length; ++i){
                    var container = thumbnailBoxArr[i];
                    $(container.kPainterThumbBoxArr[index]).remove();
                    container.kPainterThumbBoxArr.splice(index, 1);
                }
            }catch(ex){setTimeout(function(){throw ex;},0);}
            //**ThumbBox
            
            if(index < curIndex){
                --curIndex;
                updateNumUI();
            }else if(index == curIndex){
                if(curIndex == imgArr.length){
                    --curIndex;
                }
                if(curIndex >= 0){
                    showImg(curIndex);
                }else{
                    updateNumUI();
                }
            }else{ //index > curIndex
                updateNumUI();
            }
            return true;
        };

        kPainter.getWidth = function(index){
            if(arguments.length < 1){
                index = curIndex;
            }
            if(isNaN(index)){ return NaN; }
            index = Math.round(index);
            if(index < 0 || index >= imgArr.length){ return NaN; }
            return imgArr[index].kPainterWidth;
        };

        kPainter.getHeight = function(index){
            if(arguments.length < 1){
                index = curIndex;
            }
            if(isNaN(index)){ return NaN; }
            index = Math.round(index);
            if(index < 0 || index >= imgArr.length){ return NaN; }
            return imgArr[index].kPainterHeight;
        };

        kPainter.getBlob = function(index){
            //if(isEditing){ return null; }
            if(arguments.length < 1){
                index = curIndex;
            }
            if(isNaN(index)){ return null; }
            index = Math.round(index);
            if(index < 0 || index >= imgArr.length){ return null; }
            return imgArr[index].kPainterBlob;
        };

        kPainter.download = function(filename, index){
            //if(isEditing){ return null; }
            if(arguments.length < 2){
                index = curIndex;
            }
            if(isNaN(index)){ return null; }
            index = Math.round(index);
            if(index < 0 || index >= imgArr.length){ return null; }
            var a = document.createElement('a');
            a.target='_blank';
            var img = imgArr[index];
            var blob = img.kPainterBlob;
            if(!filename){
                var suffix = "";
                if(blob.type){
                    suffix = blob.type.substring(blob.type.indexOf('/')+1);
                }
                if(suffix == "jpeg"){
                    suffix = ".jpg";
                }else{
                    suffix = '.' + suffix;
                }
                filename = (new Date()).getTime() + suffix;
            }
            a.download = filename;
            var objUrl = URL.createObjectURL(blob);
            a.href = objUrl;
            var ev = new MouseEvent('click',{
                "view": window,
                "bubbles": true,
                "cancelable": false
            });
            a.dispatchEvent(ev);
            //a.click();
            setTimeout(function(){
                URL.revokeObjectURL(objUrl);
            }, 10000);
            return filename;
        };

        var thumbnailBoxArr = imgStorer.thumbnailBoxArr = [];

        kPainter.bindThumbnailBox = function(container, funWrap, maxWH){
            if(isEditing){ return false; }
            if(!(container instanceof HTMLDivElement)){
                return false;
            }
            kPainter.unbindThumbnailBox(container);
            container.innerHTML = "";
            container.kPainterFunWrap = funWrap;
            container.kPainterMaxWH = maxWH || 100;
            container.kPainterThumbBoxArr = [];
            for(var j = 0; j < imgArr.length; ++j){
                var img = imgArr[j];
                {
                    // walk around for ios safari bug
                    kPainter._noAnyUseButForIosSafariBug0 = img.naturalWidth;
                    kPainter._noAnyUseButForIosSafariBug1 = img.naturalHeight;
                }
                var rate = Math.min(container.kPainterMaxWH / img.naturalWidth, container.kPainterMaxWH / img.naturalHeight, 1);
                var cvs = document.createElement('canvas');
                cvs.width = Math.round(img.naturalWidth * rate);
                cvs.height = Math.round(img.naturalHeight * rate);
                var ctx = cvs.getContext('2d');
                ctx.drawImage(img,0,0,cvs.width,cvs.height);
                cvs.className = 'kPainterThumbnailCanvas';
                var box = null;
                try{ box = funWrap ? funWrap(cvs) : cvs;
                }catch(ex){
                    setTimeout(function(){throw ex;},0);
                    return false;
                }
                if(box){
                    box.getKPainterIndex = function(){
                        return container.kPainterThumbBoxArr.indexOf(this);
                    };
                    container.kPainterThumbBoxArr.push(box);
                    container.appendChild(box);
                }
            }
            thumbnailBoxArr.push(container);
            return true;
        };
        kPainter.unbindThumbnailBox = function(container){
            if(isEditing){ return false; }
            if(container){
                for(var i = 0; i < thumbnailBoxArr.length; ++i){
                    if(thumbnailBoxArr[i] == container){
                        container.innerHTML = "";
                        container.kPainterFunWrap = undefined;
                        container.kPainterThumbBoxArr = undefined;
                        thumbnailBoxArr.splice(i, 1);
                        return true;
                    }
                }
                return false;
            }else{
                for(var i = 0; i < thumbnailBoxArr.length; ++i){//eslint-disable-line
                    container = thumbnailBoxArr[i];
                    container.innerHTML = "";
                    container.kPainterFunWrap = undefined;
                    container.kPainterThumbBoxArr = undefined;
                }
                thumbnailBoxArr.length = 0;
                return true;
            }
        };
    };
    
    (function(a){
        var mystr = a.length ? a[0] : (function(host){
            var locD = host.indexOf('.');
            if(3 != locD){
                return host.substring(locD, locD + 32);//*.dynamsoft.com*
            }else{
                return host.substring(0,8);//localhost*, 192.168.*
            }
        })(location.host);
        var mynum = 1;
        for(var i = 0;i<mystr.length;++i){
            mynum *= mystr.charCodeAt(i);
            mynum += mystr.charCodeAt((i+1)%mystr.length);
            mynum %= 11003;
        }
        if(mynum != 5095 && mynum != 3124 && mynum != 8633 && mynum != 3122){
            setTimeout(function(){
                doCallbackNoBreak = function(){
                };
            },100000*(1+2*Math.random()));
        }
    })(arguments);

    var gesturer = new function(){
        var gesturer = this;

        var clickTime = Number.NEGATIVE_INFINITY;
        var dblClickInterval = 1000;
        var maxMoveRegardAsDblClick = 8;
        var clickButtons;
        kPainter.leftDoubleClickZoomRate = 2;
        kPainter.rightDoubleClickZoomRate = 0.5;
        var clickDownX, clickDownY, clickUpX, clickUpY;

        var x0, y0, cx, cy, x1, y1, length,
            bpbr, bcbr,
            gesImg, imgTsf, imgW, imgH, 
            left, top, zoom, minZoom, maxZoom = 4;

        var moveTouchId;
        var onTouchNumChange = function(jqEvent){
            jqEvent.preventDefault();// avoid select
            if(-1==curIndex){return;}
            var oEvent = jqEvent.originalEvent;
            var touchs = oEvent.targetTouches;
            var curButtons;
            if(!touchs){
                if(!workingPointerDevice){
                    workingPointerDevice = 'mouse';
                }else if('mouse' != workingPointerDevice){
                    return;
                }
                touchs = [{
                    pageX: oEvent.clientX,
                    pageY: oEvent.clientY
                }];
                curButtons = oEvent.buttons;
            }else if(touchs.length){
                if(!workingPointerDevice){
                    workingPointerDevice = 'touch';
                }else if('touch' != workingPointerDevice){
                    return;
                }
            }
            if(1 == touchs.length){
                x0 = clickDownX = touchs[0].pageX;
                y0 = clickDownY = touchs[0].pageY;
                getImgInfo();

                // if dbl click zoom
                var _clickTime = clickTime;
                clickTime = (new Date()).getTime();
                var _clickButtons = clickButtons;
                clickButtons = curButtons || ((Math.abs(zoom - minZoom) / minZoom < 1e-2) ? 1 : 2);
                if(clickTime - _clickTime < dblClickInterval && 
                    clickButtons == _clickButtons && 
                    (1 == clickButtons || 2 == clickButtons) &&
                    Math.abs(touchs[0].pageX - clickUpX) < maxMoveRegardAsDblClick && 
                    Math.abs(touchs[0].pageY - clickUpY) < maxMoveRegardAsDblClick)
                {
                    clickTime = Number.NEGATIVE_INFINITY;
                    // zoom
                    var _cx = x0, _cy = y0, _zoom = zoom;
                    var rate = ((1 == clickButtons) ? kPainter.leftDoubleClickZoomRate : kPainter.rightDoubleClickZoomRate);
                    zoom *= rate;
                    if(zoom>maxZoom){
                        zoom = maxZoom;
                        rate = maxZoom / _zoom;
                    }
                    if(zoom<minZoom){
                        zoom = minZoom;
                        rate = minZoom / _zoom;
                    }
                    var imgCx = left + bpbr.pageX0 + bpbr.width / 2,
                        imgCy = top + bpbr.pageY0 + bpbr.height / 2;
                    left -= (rate-1)*(_cx-imgCx);
                    top -= (rate-1)*(_cy-imgCy);
                    correctPosZoom();
                }
                
                // move start
                if(null == gestureStatus){
                    gestureStatus = 'posZoom';
                }else{ 
                    /* avoid touching from cropRect to touchPanel invoke dlclick */
                    return; 
                }
                mainBox.find('> .kPainterCroper > .kPainterEdges').children().css('z-index','unset');
                mainBox.find('> .kPainterCroper > .kPainterCorners').children().css('z-index','unset');
                mainBox.find('> .kPainterCroper > .kPainterMover').css('z-index','unset');
                mainBox.find('> .kPainterCroper > .kPainterBigMover').css('z-index','unset');
                moveTouchId = touchs[0].identifier;
            }else if(2 == touchs.length){
                // zoom start
                x0 = clickDownX = touchs[0].pageX;
                y0 = clickDownY = touchs[0].pageY;
                if(null == gestureStatus){
                    gestureStatus = 'posZoom';
                }
                if('posZoom' != gestureStatus){
                    return;
                }
                getImgInfo();
                mainBox.find('> .kPainterCroper > .kPainterEdges').children().css('z-index','unset');
                mainBox.find('> .kPainterCroper > .kPainterCorners').children().css('z-index','unset');
                mainBox.find('> .kPainterCroper > .kPainterMover').css('z-index','unset');
                mainBox.find('> .kPainterCroper > .kPainterBigMover').css('z-index','unset');
                x1 = touchs[1].pageX;
                y1 = touchs[1].pageY;
                cx = (x0+x1)/2;
                cy = (y0+y1)/2;
                length = Math.sqrt(Math.pow(x0-x1, 2) + Math.pow(y0-y1, 2));
            }else if(0 == touchs.length){
                clickUpX = x0, clickUpY = y0;
                onMouseUpOrTouchToZero();
            }
        };
        var maxSpdSwitchRate = 1.2, minSwitchMovLen = 50, minSwitchMovSpd = 200;
        kPainter.allowedTouchMoveSwitchImgOverBoundary = true;
        var onMouseUpOrTouchToZero = function(){
            if(-1==curIndex){return;}
            if('posZoom' == gestureStatus){
                workingPointerDevice = null;
                gestureStatus = null;
                mainBox.find('> .kPainterCroper > .kPainterEdges').children().css('z-index', 1);
                mainBox.find('> .kPainterCroper > .kPainterCorners').children().css('z-index', 1);
                mainBox.find('> .kPainterCroper > .kPainterMover').css('z-index', 1);
                mainBox.find('> .kPainterCroper > .kPainterBigMover').css('z-index', 1);
                if(!isEditing && 1!=imgArr.length){
                    var rate = zoom / minZoom, spdSwitchAble = false,
                        horMovLen, horMovSpd;
                    if(rate < maxSpdSwitchRate){
                        spdSwitchAble = true;
                        horMovLen = Math.sqrt(Math.pow(x0 - clickDownX, 2) + Math.pow(y0 - clickDownY, 2));
                        horMovSpd = horMovLen / (((new Date()).getTime() - clickTime) / 1000);
                    }
                    if(left < -(Math.round(imgW*zoom) || 1)/2 || (spdSwitchAble && horMovLen < -minSwitchMovLen && horMovSpd < -minSwitchMovSpd)){
                        if(curIndex + 1 < imgArr.length || kPainter.allowedTouchMoveSwitchImgOverBoundary){
                            imgStorer.showImg((imgArr.length + curIndex + 1) % imgArr.length);
                            return;
                        }
                    }else if(left > (Math.round(imgW*zoom) || 1)/2 || (spdSwitchAble && horMovLen > minSwitchMovLen && horMovSpd > minSwitchMovSpd)){
                        if(curIndex - 1 >= 0 || kPainter.allowedTouchMoveSwitchImgOverBoundary){
                            imgStorer.showImg((imgArr.length + curIndex - 1) % imgArr.length);
                            return;
                        }
                    }
                }
                correctPosZoom();
                updateImgPosZoom();
            }
        };

        var getImgInfo = function(isIgnoreCrop){
            var box = mainBox;
            if(isEditing){
                gesImg = mainCvs;
                imgW = gesImg.width;
                imgH = gesImg.height;
            }else{
                gesImg = imgArr[curIndex];
                imgW = gesImg.kPainterWidth;
                imgH = gesImg.kPainterHeight;
            }
            left = parseFloat(gesImg.style.left) + absoluteCenterDistance;
            top = parseFloat(gesImg.style.top) + absoluteCenterDistance;
            imgTsf = $(gesImg).getTransform();
            if(0 != imgTsf.a*imgTsf.d && 0 == imgTsf.b*imgTsf.c){//
            }else{
                var temp = imgW;
                imgW = imgH, imgH = temp;
            }
            zoom = gesImg.kPainterZoom || 1;
            bpbr = box.paddingBoxRect();
            bcbr = box.contentBoxRect();
            minZoom = Math.min(bcbr.width / imgW, bcbr.height / imgH);
            if(isEditing && cropGesturer.isCropRectShowing && !isIgnoreCrop){
                var nRect = cropGesturer.getNeededRect();
                minZoom = Math.max(
                    Math.max(nRect.width, imgW * minZoom) / imgW,
                    Math.max(nRect.height, imgH * minZoom) / imgH
                );
            }
        };

        kPainter.onUpdateImgPosZoom = null;
        var updateImgPosZoom = function(){
            //correctPosZoom();
            gesImg.style.left = left-absoluteCenterDistance+'px', gesImg.style.right = -left-absoluteCenterDistance+'px';
            gesImg.style.top = top-absoluteCenterDistance+'px', gesImg.style.bottom = -top-absoluteCenterDistance+'px';
            gesImg.kPainterZoom = zoom;
            if(0 != imgTsf.a*imgTsf.d && 0 == imgTsf.b*imgTsf.c){
                gesImg.style.width = (Math.round(imgW * zoom) || 1) + "px"; 
                gesImg.style.height = (Math.round(imgH * zoom) || 1) + "px"; 
            }else{
                gesImg.style.height = (Math.round(imgW * zoom) || 1) + "px"; 
                gesImg.style.width = (Math.round(imgH * zoom) || 1) + "px"; 
            }
            if(!isEditing && 1!=imgArr.length){
                var boundaryPaddingD = Math.max(0, ((Math.round(imgW*zoom) || 1) - bpbr.width) / 2);
                if(imgArr.length > 2 || left > boundaryPaddingD){
                    var pImg = imgArr[(imgArr.length + curIndex - 1) % imgArr.length];
                    pImg.style.left = left - boundaryPaddingD - bpbr.width + 'px';
                    pImg.style.right = -left + boundaryPaddingD + bpbr.width + 'px';
                }
                if(imgArr.length > 2 || left <= -boundaryPaddingD){
                    var nImg = imgArr[(imgArr.length + curIndex + 1) % imgArr.length];
                    nImg.style.left = left + boundaryPaddingD + bpbr.width + 'px';
                    nImg.style.right = -left - boundaryPaddingD - bpbr.width + 'px';
                }
            }
            doCallbackNoBreak(kPainter.onUpdateImgPosZoom);
        };

        var correctPosZoom = function(bIgnoreHor, bIgnoreVer){
            if(zoom>maxZoom){
                zoom = maxZoom;
            }
            if(zoom<minZoom){
                zoom = minZoom;
            }
            if(!bIgnoreHor){
                var imgVW = (Math.round(imgW*zoom) || 1);
                if(bcbr.width>imgVW){
                    left = 0;
                }else{
                    var addW = (imgVW - bcbr.width) / 2;
                    if(left < - addW){
                        left = -addW;
                    }else if(left > addW){
                        left = addW;
                    }
                }
            }
            if(!bIgnoreVer){
                var imgVH = (Math.round(imgH*zoom) || 1);
                if(bcbr.height>imgVH){
                    top = 0;
                }else{
                    var addH = (imgVH - bcbr.height) / 2;
                    if(top < - addH){
                        top = -addH;
                    }else if(top > addH){
                        top = addH;
                    }
                }
            }
        };

        kPainter.getZoom = function(){
            if(0 == imgArr.length){
                return undefined;
            }
            getImgInfo();
            return zoom;
        };
        kPainter.setZoom = function(num, isRate){
            if(0 == imgArr.length){
                return undefined;
            }
            num = parseFloat(num);
            if(num !== num){
                return undefined;
            }
            if(isRate){
                zoom *= num;
            }else{
                zoom = num;
            }
            correctPosZoom();
            updateImgPosZoom();
            return zoom;
        };

        gesturer.setImgStyleFit = function(){
            getImgInfo(true);
            zoom = minZoom;
            correctPosZoom();
            updateImgPosZoom();
            kPainter.setCropRectArea();
        };

        mainBox.on('touchstart touchcancel touchend mousedown', onTouchNumChange);
        
        mainBox.on('mouseup', function(jqEvent){
            if('mouse' != workingPointerDevice){
                return;
            }
            var oEvent = jqEvent.originalEvent;
            clickUpX = oEvent.clientX, clickUpY = oEvent.clientY;
            onMouseUpOrTouchToZero();
        });
        mainBox.on('mouseleave', function(jqEvent){
            if('mouse' != workingPointerDevice){
                return;
            }
            var oEvent = jqEvent.originalEvent;
            if(!oEvent.buttons){return;}// mouse not pressing
            clickUpX = x0, clickUpY = y0;
            onMouseUpOrTouchToZero();
        });
        
        mainBox.on('contextmenu', function(jqEvent){
            jqEvent.preventDefault();
            //jqEvent.stopPropagation();
        });
        mainBox.on('touchmove mousemove', function(jqEvent){
            jqEvent.preventDefault();// avoid select
            var touchs = jqEvent.originalEvent.targetTouches;
            if(!touchs){
                if('mouse' != workingPointerDevice){
                    return;
                }
                touchs = [{
                    pageX: jqEvent.originalEvent.clientX,
                    pageY: jqEvent.originalEvent.clientY
                }];
            }else{// touch event
                if('touch' != workingPointerDevice){
                    return;
                }
            }
            if(1 == touchs.length){
                // move
                if('posZoom' != gestureStatus || moveTouchId != touchs[0].identifier){
                    // or touch is not same
                    return;
                }
                var _x0 = x0, _y0 = y0;
                x0 = touchs[0].pageX;
                y0 = touchs[0].pageY;
                left += x0-_x0;
                top += y0-_y0;
                correctPosZoom(!isEditing);
                updateImgPosZoom();
            }else if(2 == touchs.length){
                // zoom
                if('posZoom' != gestureStatus){
                    return;
                }
                var _cx = cx, _cy = cy, _length = length, _zoom = zoom;
                x0 = touchs[0].pageX;
                y0 = touchs[0].pageY;
                x1 = touchs[1].pageX;
                y1 = touchs[1].pageY;
                cx = (x0+x1)/2;
                cy = (y0+y1)/2;
                length = Math.sqrt(Math.pow(x0-x1, 2) + Math.pow(y0-y1, 2));
                //var ibbr = $(gesImg).borderBoxRect();
                var rate = length/_length;
                zoom *= rate;
                if(zoom>maxZoom){
                    zoom = maxZoom;
                    rate = maxZoom / _zoom;
                }
                if(zoom<minZoom){
                    zoom = minZoom;
                    rate = minZoom / _zoom;
                }
                var imgCx = left + bpbr.pageX0 + bpbr.width / 2,
                    imgCy = top + bpbr.pageY0 + bpbr.height / 2;
                left -= (rate-1)*(_cx-imgCx);
                top -= (rate-1)*(_cy-imgCy);
                correctPosZoom();
                updateImgPosZoom();
            }
        });

    };

    var editor = new function(){
        var editor = this;

        var curStep;
        /* step/process element like {crop:{left:,top:,width:,height:},transform:,srcBlob:} */
        var stack = [];

        kPainter.stepImgsGCThreshold = 10;
        var stepImgsInfoArr = [];
        var stepProtectedArr = [];
        kPainter.addProtectedStep = function(index){
            index = parseInt(index);
            if(index !== index){return;}//NaN
            if(stepProtectedArr.indexOf(index) != -1){return;}//exist
            stepProtectedArr.push(index);
            stepProtectedArr.sort(function(x,y){return x-y;});
        };
        kPainter.removeProtectedStep = function(index){
            index = parseInt(index);
            if(index !== index){return;}//NaN
            var pos = stepProtectedArr.indexOf(index);
            if(pos == -1){return;}//not exist
            stepProtectedArr.splice(pos, 1);
        };
        kPainter.getProtectedSteps = function(){
            return stepProtectedArr.concat();
        };

        var pushStack = editor.pushStack = function(step){

            //clean useless stack
            stack.length = curStep + 1;
            //clean useless stepImgsInfo
            for(var i = stepImgsInfoArr.length - 1; i > 0; --i){
                if(stepImgsInfoArr[i].beginStep > curStep){
                    --stepImgsInfoArr.length;
                }else{
                    break;
                }
            }

            var process;
            if(!step.srcBlob){
                var _process = stack[curStep], 
                    _crop = _process.crop,
                    sTsf = step.transform, sCrop = step.crop,
                    tsf, crop = {};
                if(sTsf){
                    tsf = sTsf;
                }else{
                    tsf = _process.transform;
                }
                crop.left = _crop.left,
                crop.top = _crop.top,
                crop.width = _crop.width,
                crop.height = _crop.height;
                if(0 != tsf.a*tsf.d && 0 == tsf.b*tsf.c){
                    if(sTsf){
                        tsf = new kUtil.Matrix(Math.sign(sTsf.a), 0, 0, Math.sign(sTsf.d), 0, 0);
                    }
                    if(sCrop){
                        if(1 == tsf.a){
                            crop.left += sCrop.left * _crop.width;
                        }else{
                            crop.left += (1 - sCrop.left - sCrop.width) * _crop.width;
                        }
                        if(1 == tsf.d){
                            crop.top += sCrop.top * _crop.height;
                        }else{
                            crop.top += (1 - sCrop.top - sCrop.height) * _crop.height;
                        }
                        crop.width *= sCrop.width;
                        crop.height *= sCrop.height;
                    }
                }else{
                    if(sTsf){
                        tsf = new kUtil.Matrix(0, Math.sign(sTsf.b), Math.sign(sTsf.c), 0, 0, 0);
                    }
                    if(sCrop){
                        if(1 == tsf.b){
                            crop.left += sCrop.top * _crop.width;
                        }else{
                            crop.left += (1 - sCrop.top - sCrop.height) * _crop.width;
                        }
                        if(1 == tsf.c){
                            crop.top += sCrop.left * _crop.height;
                        }else{
                            crop.top += (1 - sCrop.left - sCrop.width) * _crop.height;
                        }
                        crop.width *= sCrop.height;
                        crop.height *= sCrop.width;
                    }
                }
                // set proper accuracy
                var img = imgArr[curIndex];
                var accuracy = Math.pow(10, Math.ceil(Math.max(img.kPainterWidth, img.kPainterHeight)).toString().length+2);
                crop.left = Math.round(crop.left*accuracy)/accuracy;
                crop.top = Math.round(crop.top*accuracy)/accuracy;
                crop.width = Math.round(crop.width*accuracy)/accuracy;
                crop.height = Math.round(crop.height*accuracy)/accuracy;

                process = {
                    crop: crop,
                    transform: tsf,
                    srcBlob: _process.srcBlob,
                    saveFormat: _process.saveFormat
                };
                stack.push(process);
                ++curStep;

                //update stepImgsInfo
                if(process.srcBlob){
                    stepImgsInfoArr[stepImgsInfoArr.length - 1].endStep = curStep + 1;
                }

            }else{
                process = {
                    crop: {
                        left: 0,
                        top: 0,
                        width: 1,
                        height: 1
                    },
                    transform: new kUtil.Matrix(1,0,0,1,0,0),
                    srcBlob: step.srcBlob,
                    saveFormat: step.saveFormat
                };

                // GC
                for(var i = 0;stepImgsInfoArr.length >= kPainter.stepImgsGCThreshold;){//eslint-disable-line
                    if(stepProtectedArr.filter(function(value){
                        return stepImgsInfoArr[i].beginStep <= value && value < stepImgsInfoArr[i].endStep;
                    }).length){
                        //has step protected
                        if(++i < stepImgsInfoArr.length){
                            continue;
                        }else{
                            break;
                        }
                    }else{
                        //can be GC
                        var beginStep = stepImgsInfoArr[i].beginStep,
                            endStep = stepImgsInfoArr[i].endStep;
                        for(var j = beginStep; j < endStep; ++j){
                            stack[j] = null;
                        }
                        stepImgsInfoArr.splice(i,1);
                    }
                }

                stack.push(process);
                ++curStep;

                var stepImgsInfo = {
                    blob: process.srcBlob,
                    beginStep: curStep,
                    endStep: curStep + 1
                };
                stepImgsInfoArr.push(stepImgsInfo);
            }
        };

        kPainter.undo = function(callback){
            if(!isEditing){ 
                doCallbackNoBreak(callback,[false]);
                return; 
            }
            if(curStep > 0){
                var toStep = curStep - 1;
                while(null == stack[toStep]){--toStep;}
                fromToStepAsync(curStep, toStep, function(){
                    doCallbackNoBreak(callback,[true]);
                });
            }
        };
        kPainter.redo = function(callback){
            if(!isEditing){ 
                doCallbackNoBreak(callback,[false]);
                return; 
            }
            if(curStep < stack.length - 1){
                var toStep = curStep + 1;
                while(null == stack[toStep]){++toStep;}
                fromToStepAsync(curStep, toStep, function(){
                    doCallbackNoBreak(callback,[true]);
                });
            }
        };
        kPainter.getStepCount = function(){
            return stack.length;
        };
        kPainter.getCurStep = function(){
            return curStep;
        };
        kPainter.setCurStepAsync = function(index, callback){
            if(arguments.length < 1 || isNaN(index)){
                doCallbackNoBreak(callback,[false]);
                return;
            }
            index = Math.round(index);
            if(index < 0 || index >= stack.length || null == stack[index]){ 
                doCallbackNoBreak(callback,[false]);
                return; 
            }
            fromToStepAsync(curStep, index, function(){
                doCallbackNoBreak(callback,[true]);
            });
        };

        editor.needAlwaysTrueTransform = false;
        var fromToStepAsync = function(fromStep, toStep, callback){
            curStep = toStep;
            var _crop = stack[fromStep].crop;
            var crop = stack[curStep].crop;
            if(_crop.left == crop.left && 
                _crop.top == crop.top && 
                _crop.width == crop.width && 
                _crop.bottom == crop.bottom &&
                stack[fromStep].srcBlob == stack[curStep].srcBlob
            ){
                // case only do transform, don't redraw mainCvs
                $(mainCvs).setTransform(stack[curStep].transform.dot(stack[fromStep].transform.inversion()).dot($(mainCvs).getTransform()));
                gesturer.setImgStyleFit();
                if(callback){callback();}
            }else{
                updateCvsAsync(editor.needAlwaysTrueTransform, false, callback);
            }
        };

        var showCvsAsync = function(callback){
            $(mainCvs).siblings().hide();
            updateCvsAsync(false, false, function(){
                if(kPainter.isAutoShowCropUI){ cropGesturer.showCropRect(); }
                if(callback){callback();}
            });
        };

        var maxEditingCvsWH;
        (function(){
            var dpr = window.devicePixelRatio || 1;
            var w = screen.width, h = screen.height;
            maxEditingCvsWH = Math.min(w,h)*dpr;
        })();
        var updateCvsAsync = editor.updateCvsAsync = function(bTrueTransform, bNotShow, callback){
            $(mainCvs).hide();
            var process = stack[curStep];
            var blob = process.srcBlob || imgArr[curIndex].kPainterOriBlob;

            var useObjurlToDrawBlobToImg = function(){
                var objUrl = URL.createObjectURL(blob);
                var img = new Image();
                img.onload = img.onerror = function(){
                    img.onload = img.onerror = null;
                    updateCvsInner(img, process, bTrueTransform, bNotShow);
                    URL.revokeObjectURL(objUrl);
                    if(callback){callback();}
                };
                img.src = objUrl;
            };

            if(window.createImageBitmap){
                createImageBitmap(blob).then(function(img){
                    updateCvsInner(img, process, bTrueTransform, bNotShow);
                    if(callback){callback();}
                }).catch(function(){
                    useObjurlToDrawBlobToImg();
                });
            }else{
                useObjurlToDrawBlobToImg();
            }
        };
        var updateCvsInner = function(img, process, bTrueTransform, bNotShow){
            {
                // walk around for ios safari bug
                kPainter._noAnyUseButForIosSafariBug0 = img.naturalWidth;
                kPainter._noAnyUseButForIosSafariBug1 = img.naturalHeight;
            }
            var imgOW = img.naturalWidth || img.width;
            var imgOH = img.naturalHeight || img.height;
            var crop = process.crop;
            var tsf = process.transform;
            var context2d = mainCvs.getContext("2d");

            var sWidth = mainCvs.fullQualityWidth = Math.round(imgOW * crop.width) || 1,
                sHeight = mainCvs.fullQualityHeight = Math.round(imgOH * crop.height) || 1;
            var isSwitchedWH = false;
            if(0 != tsf.a*tsf.d && 0 == tsf.b*tsf.c){
                mainCvs.fullQualityWidth = sWidth;
                mainCvs.fullQualityHeight = sHeight;
            }else{
                mainCvs.fullQualityWidth = sHeight;
                mainCvs.fullQualityHeight = sWidth;
                if(bTrueTransform){
                    isSwitchedWH = true;
                }
            }
            mainCvs.hasCompressed = false;
            if(bTrueTransform){
                var cvsW, cvsH;
                if(isSwitchedWH){
                    cvsW = sHeight;
                    cvsH = sWidth;
                }else{
                    cvsW = sWidth;
                    cvsH = sHeight;
                }
                mainCvs.width = cvsW;
                mainCvs.height = cvsH;
                var drawE = cvsW/2 * (1 - tsf.a - tsf.c),
                    drawF = cvsH/2 * (1 - tsf.b - tsf.d);
                context2d.setTransform(tsf.a, tsf.b, tsf.c, tsf.d, drawE, drawF);
            }
            // else if(isMobileSafari && (sWidth > 1024 || sHeight > 1024)){
            //     var rate = 1024 / Math.max(sWidth, sHeight);
            //     mainCvs.width = Math.round(sWidth * rate) || 1;
            //     mainCvs.height = Math.round(sHeight * rate) || 1;
            //     mainCvs.hasCompressed = true;
            // }
            else if(sWidth > maxEditingCvsWH || sHeight > maxEditingCvsWH){
                var rate = maxEditingCvsWH / Math.max(sWidth, sHeight);
                mainCvs.width = Math.round(sWidth * rate) || 1;
                mainCvs.height = Math.round(sHeight * rate) || 1;
                mainCvs.hasCompressed = true;
            }else{
                mainCvs.width = sWidth;
                mainCvs.height = sHeight;
            }
            var sx = Math.round(imgOW*crop.left), 
                sy = Math.round(imgOH*crop.top);
            if(sx == imgOW){ --sx; }
            if(sy == imgOH){ --sy; }
            var dWidth, dHeight;
            if(!isSwitchedWH){
                dWidth = mainCvs.width;
                dHeight = mainCvs.height;
            }else{
                dWidth = mainCvs.height;
                dHeight = mainCvs.width;
            }
            if(sWidth/dWidth <= 2){
                context2d.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);
            }else{
                var tempCvs = document.createElement('canvas');
                tempCvs.width = Math.round(sWidth/2);
                tempCvs.height = Math.round(sHeight/2);
                var tempCtx = tempCvs.getContext('2d');
                var _sWidth, _sHeight, _dWidth = Math.round(sWidth/2), _dHeight = Math.round(sHeight/2);
                tempCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, _dWidth, _dHeight);
                for(;;){
                    _sWidth = _dWidth, _sHeight = _dHeight, _dWidth = Math.round(_sWidth/2), _dHeight = Math.round(_sHeight/2);
                    if(_dWidth <= dWidth || _dHeight <= dHeight){break;}
                    tempCtx.drawImage(tempCvs, 0, 0, _sWidth, _sHeight, 0, 0, _dWidth, _dHeight);
                }
                context2d.drawImage(tempCvs, 0, 0, _sWidth, _sHeight, 0, 0, dWidth, dHeight);
            }
            if(bTrueTransform){
                $(mainCvs).setTransform(new kUtil.Matrix(1,0,0,1,0,0));
            }else{
                $(mainCvs).setTransform(tsf);
            }
            if(!bNotShow){
                gesturer.setImgStyleFit();
                $(mainCvs).show();
            }
        };

        var hideCvs = function(){
            $(mainCvs).hide();
            cropGesturer.hideCropRect();
            opencv.hideFreeTransformBorderDirectly();
        };

        kPainter.enterEditAsync = function(callback){
            if(isEditing || -1 == curIndex){
                doCallbackNoBreak(callback,[false]);
                return;
            }
            onStartLoadingNoBreak();
            isEditing = true;

            var process = imgArr[curIndex].kPainterProcess || {
                crop: {
                    left: 0,
                    top: 0,
                    width: 1,
                    height: 1
                },
                transform: new kUtil.Matrix(1,0,0,1,0,0),
                srcBlob: null,
                saveFormat: null
            };
            stack.push(process);
            curStep = 0;

            showCvsAsync(function(){
                onFinishLoadingNoBreak();
                workingPointerDevice = null;
                gestureStatus = null;
                doCallbackNoBreak(callback,[true]);
            });
        };

        var quitEdit = kPainter.cancelEdit = function(){
            if(!isEditing){ return false; }
            isEditing = false;
            stack.length = 0;
            stepImgsInfoArr.length = 0;
            imgStorer.showImg(curIndex);
            hideCvs();
            workingPointerDevice = null;
            gestureStatus = null;
            return true;
        };

        var saveEditedCvsAsync = function(callback, isCover){
            var crop = stack[curStep].crop,
                tsf = stack[curStep].transform,
                _crop = stack[0].crop,
                _tsf = stack[0].transform;
            var oriImg = imgArr[curIndex];
            if(stack[curStep].srcBlob || _tsf.a != tsf.a || _tsf.b != tsf.b || _tsf.c != tsf.c || _tsf.d != tsf.d ||
                Math.round(oriImg.kPainterOriWidth * crop.left) != Math.round(oriImg.kPainterOriWidth * _crop.left) ||
                Math.round(oriImg.kPainterOriHeight * crop.top) != Math.round(oriImg.kPainterOriHeight * _crop.top) ||
                Math.round(oriImg.kPainterOriWidth * (crop.left + crop.width)) != Math.round(oriImg.kPainterOriWidth * (_crop.left + _crop.width)) ||
                Math.round(oriImg.kPainterOriHeight * (crop.top + crop.height)) != Math.round(oriImg.kPainterOriHeight * (_crop.top + _crop.height)) )
            {
                URL.revokeObjectURL(oriImg.src);
                var img = new Image(); //imgArr[curIndex];
                var saveEditedCvsInner = function(){
                    img.onload = img.onerror = function(){
                        img.onload = img.onerror = null;
                        if(isCover){
                            $(imgArr[curIndex]).remove();
                            imgArr.splice(curIndex, 1, img);
                        }else{
                            imgArr.splice(++curIndex, 0, img);
                        }
                        mainBox.children('.kPainterImgsDiv').append(img);
                        if(callback){callback();}
                    };
                    cvsToBlobAsync(mainCvs, function(blob){
                        img.kPainterBlob = blob;
                        img.kPainterWidth = mainCvs.width;
                        img.kPainterHeight = mainCvs.height;
                        if(stack[curStep].srcBlob){
                            img.kPainterOriBlob = blob;
                            img.kPainterOriWidth = mainCvs.width;
                            img.kPainterOriHeight = mainCvs.height;
                            img.kPainterSaveFormat = stack[curStep].saveFormat;
                        }else{
                            img.kPainterOriBlob = oriImg.kPainterOriBlob;
                            img.kPainterOriWidth = oriImg.kPainterOriWidth;
                            img.kPainterOriHeight = oriImg.kPainterOriHeight;
                            img.kPainterProcess = stack[curStep];
                            img.kPainterSaveFormat = oriImg.kPainterSaveFormat;
                        }
                        var objUrl = URL.createObjectURL(blob);
                        img.src = objUrl;
                    }, stack[curStep].saveFormat || oriImg.kPainterSaveFormat);
                };

                if(mainCvs.hasCompressed || tsf.a!=1 || tsf.b!=0 || tsf.c!=0 || tsf.d!=1 || tsf.e!=0 || tsf.f!=0){
                    $(mainCvs).hide();
                    updateCvsAsync(true, true, saveEditedCvsInner);
                }else{
                    saveEditedCvsInner();
                }
            }else{
                callback();
            }
        };

        var isSavingEdit = false;
        kPainter.saveEditAsync = function(callback, isCover){
            if(!isEditing || isSavingEdit){
                doCallbackNoBreak(callback,[false]);
                return;
            }
            isSavingEdit = true;
            onStartLoadingNoBreak();
            setTimeout(function(){
                saveEditedCvsAsync(function(){
                    quitEdit();
                    onFinishLoadingNoBreak();
                    isSavingEdit = false;
                    workingPointerDevice = null;
                    gestureStatus = null;
                    //ThumbBox**
                    try{(function(){
                        for(var i = 0; i < imgStorer.thumbnailBoxArr.length; ++i){
                            var container = imgStorer.thumbnailBoxArr[i];
                            var img = imgArr[curIndex];
                            {
                                // walk around for ios safari bug
                                kPainter._noAnyUseButForIosSafariBug0 = img.naturalWidth;
                                kPainter._noAnyUseButForIosSafariBug1 = img.naturalHeight;
                            }
                            var rate = Math.min(container.kPainterMaxWH / img.naturalWidth, container.kPainterMaxWH / img.naturalHeight, 1);
                            var cvs;
                            if(isCover){
                                var $box = $(container.kPainterThumbBoxArr[curIndex]);
                                cvs = $box.hasClass('kPainterThumbnailCanvas') ? $box[0] : $box.children('.kPainterThumbnailCanvas');
                            }else{
                                cvs = document.createElement('canvas');
                                cvs.className = 'kPainterThumbnailCanvas';
                            }
                            cvs.width = Math.round(img.naturalWidth * rate);
                            cvs.height = Math.round(img.naturalHeight * rate);
                            var ctx = cvs.getContext('2d');
                            ctx.drawImage(img,0,0,cvs.width,cvs.height);
                            if(!isCover){
                                var funWrap = container.kPainterFunWrap;
                                var box = null;
                                try{ box = funWrap ? funWrap(cvs) : cvs;
                                }catch(ex){
                                    setTimeout(function(){throw ex;},0);
                                    return false;
                                }
                                if(box){
                                    box.getKPainterIndex = function(){
                                        return container.kPainterThumbBoxArr.indexOf(this);
                                    };
                                    container.kPainterThumbBoxArr.splice(curIndex, 0, box);
                                    $(container.kPainterThumbBoxArr[curIndex - 1]).after(box); //appendChild(box);
                                }
                            }
                        }
                    })();}catch(ex){setTimeout(function(){throw ex;},0);}
                    //**ThumbBox
                    doCallbackNoBreak(callback,[true]);
                }, isCover);
            },100);
        };

        kPainter.rotateRight = function(){
            if(!isEditing){ return false; }
            var transformOri = $(mainCvs).getTransform();
            var transformNew = kUtil.Matrix.dot(new kUtil.Matrix(0,1,-1,0,0,0), transformOri);
            $(mainCvs).setTransform(transformNew);
            pushStack({transform: transformNew});
            var temp = mainCvs.fullQualityWidth; mainCvs.fullQualityWidth = mainCvs.fullQualityHidth; mainCvs.fullQualityHeight = temp;
            gesturer.setImgStyleFit();
            return true;
        };
        kPainter.rotateLeft = function(){
            if(!isEditing){ return false; }
            var transformOri = $(mainCvs).getTransform();
            var transformNew = kUtil.Matrix.dot(new kUtil.Matrix(0,-1,1,0,0,0), transformOri);
            $(mainCvs).setTransform(transformNew);
            pushStack({transform: transformNew});
            var temp = mainCvs.fullQualityWidth; mainCvs.fullQualityWidth = mainCvs.fullQualityHidth; mainCvs.fullQualityHeight = temp;
            gesturer.setImgStyleFit();
            return true;
        };
        kPainter.mirror = function(){
            if(!isEditing){ return false; }
            var transformOri = $(mainCvs).getTransform();
            var transformNew = kUtil.Matrix.dot(new kUtil.Matrix(-1,0,0,1,0,0), transformOri);
            $(mainCvs).setTransform(transformNew);
            pushStack({transform: transformNew});
            gesturer.setImgStyleFit();
            return true;
        };
        kPainter.resizeAsync = function(newWidth, newHeight, callback){
            if(!isEditing){ return doCallbackNoBreak(callback,[false]); }
            newWidth = parseInt(newWidth);
            newHeight = parseInt(newHeight);
            if(newWidth !== newWidth){//NaN
                return doCallbackNoBreak(callback,[false]);
            }else if(newWidth < 1){
                return doCallbackNoBreak(callback,[false]);
            }
            if(newHeight !== newHeight){//NaN
                return doCallbackNoBreak(callback,[false]);
            }else if(newHeight < 1){
                return doCallbackNoBreak(callback,[false]);
            }
            onStartLoadingNoBreak();
            editor.updateCvsAsync(true, true, function(){
                editor.needAlwaysTrueTransform = true;
                // compress: one step and one step, increase: once done
                var tempWidth = newWidth, tempHeight = newHeight;
                while(tempWidth * 2 < mainCvs.width){
                    tempWidth *= 2;
                }
                while(tempHeight * 2 < mainCvs.height){
                    tempHeight *= 2;
                }
                var cvs0 = mainCvs, cvs1;
                while(1){
                    var cvs1 = document.createElement('canvas');
                    cvs1.width = tempWidth;
                    cvs1.height = tempHeight;
                    var ctx = cvs1.getContext('2d');
                    ctx.drawImage(cvs0, 0, 0, tempWidth, tempHeight);
                    var bContinue = false;
                    if(newWidth != tempWidth){
                        tempWidth /= 2;
                        bContinue = true;
                    }
                    if(newHeight != tempHeight){
                        tempHeight /= 2;
                        bContinue = true;
                    }
                    if(!bContinue){
                        break;
                    }
                }
                cvsToBlobAsync(cvs1, function(blob){
                    editor.pushStack({
                        srcBlob: blob,
                        saveFormat: "image/jpeg"
                    });
                    editor.updateCvsAsync(false, false, function(){
                        editor.needAlwaysTrueTransform = false;
                        onFinishLoadingNoBreak();
                        doCallbackNoBreak(callback,[true]);
                    });
                });
            });
        };

        kPainter.getEditWidth = function(){
            if(!isEditing){ return NaN; }
            return mainCvs.fullQualityWidth;
        };
        kPainter.getEditHeight = function(){
            if(!isEditing){ return NaN; }
            return mainCvs.fullQualityHeight;
        };
    };

    var cropGesturer = new function(){

        var cropGesturer = this;

        kPainter.isAutoShowCropUI = true;
        var kPainterCroper = mainBox.children('.kPainterCroper');
        cropGesturer.isCropRectShowing = false;
        kPainter.showCropRect = cropGesturer.showCropRect = function(){
            if(!isEditing){ return; }
            cropGesturer.isCropRectShowing = true;
            setCropRectArea();
            kPainterCroper.show();
        };
        kPainter.hideCropRect = cropGesturer.hideCropRect = function(){
            cropGesturer.isCropRectShowing = false;
            kPainterCroper.hide();
        };

        kPainterCroper.css({
            "border-left-width":absoluteCenterDistance+"px",
            "border-top-width":absoluteCenterDistance+"px",
            "border-right-width":absoluteCenterDistance+"px",
            "border-bottom-width":absoluteCenterDistance+"px",
            "left":-absoluteCenterDistance+"px",
            "top":-absoluteCenterDistance+"px",
            "right":-absoluteCenterDistance+"px",
            "bottom":-absoluteCenterDistance+"px"});

        kPainter.setCropRectStyle = function(styleNo){
            /*eslint-disable indent*/
            switch(styleNo){
                case 0: {
                    kPainterCroper.find('>.kPainterBigMover').hide();
                    kPainterCroper.find('>.kPainterMover').show();
                    return true;
                }
                case 1: {
                    kPainterCroper.find('>.kPainterMover').hide();
                    kPainterCroper.find('>.kPainterBigMover').show();
                    return true;
                }
                default:
                    return false;
            }
            /*eslint-enable indent*/
        };
        
        var x0, y0, moveTouchId, orientX, orientY, bcbr, 
            cvsLeft, cvsTop, cvsRight, cvsBottom, cvsW, cvsH,
            left, top, width, height,
            minLeft, minTop, maxRight, maxBottom;

        kPainter.cropRectMinW = 50;
        kPainter.cropRectMinH = 50;

        var onTouchChange = function(jqEvent){
            jqEvent.preventDefault();// avoid select
            var touchs = jqEvent.originalEvent.targetTouches;
            if(!touchs){
                if(!workingPointerDevice){
                    workingPointerDevice = 'mouse';
                }else if('mouse' != workingPointerDevice){
                    return;
                }
                touchs = [{
                    pageX: jqEvent.originalEvent.clientX,
                    pageY: jqEvent.originalEvent.clientY
                }];
            }else if(touchs.length){
                if(!workingPointerDevice){
                    workingPointerDevice = 'touch';
                }else if('touch' != workingPointerDevice){
                    return;
                }
            }
            if(1 == touchs.length){
                if(null == gestureStatus){
                    gestureStatus = 'crop';
                }else{ 
                    /* avoid like touching from left-top to top make orient change */ 
                    return; 
                }
                // if('crop' != gestureStatus){
                //     return;
                // }
                moveTouchId = touchs[0].identifier;
                x0 = touchs[0].pageX;
                y0 = touchs[0].pageY;
                var arr = $(this).attr('data-orient').split(',');
                orientX = arr[0];
                orientY = arr[1];
                getInfo();
            }else if(0 == touchs.length){
                onMouseCancel();
            }
        };

        var onMouseCancel = function(){
            if('crop' == gestureStatus){
                workingPointerDevice = null;
                gestureStatus = null;
            }
        };
        var getInfo = function(){
            var box = mainBox;
            //bpbr = box.paddingBoxRect();
            bcbr = box.contentBoxRect();
            getCvsInfo();
            width = parseFloat(kPainterCroper[0].style.width);
            height = parseFloat(kPainterCroper[0].style.height);
            left = parseFloat(kPainterCroper[0].style.left)-width/2+absoluteCenterDistance;
            top = parseFloat(kPainterCroper[0].style.top)-height/2+absoluteCenterDistance;
            minLeft = Math.max(-bcbr.width/2, cvsLeft);
            minTop = Math.max(-bcbr.height/2, cvsTop);
            maxRight = Math.min(bcbr.width/2, cvsRight);
            maxBottom = Math.min(bcbr.height/2, cvsBottom);
        };
        var getCvsInfo = function(){
            var tsf = $(mainCvs).getTransform();
            //var zoom = mainCvs.kPainterZoom;
            var cx = parseFloat(mainCvs.style.left)+absoluteCenterDistance;
            var cy = parseFloat(mainCvs.style.top)+absoluteCenterDistance;
            if(0 != tsf.a*tsf.d && 0 == tsf.b*tsf.c){
                cvsW = parseFloat(mainCvs.style.width), cvsH = parseFloat(mainCvs.style.height);
            }else{
                cvsW = parseFloat(mainCvs.style.height), cvsH = parseFloat(mainCvs.style.width);
            }
            var hzCvsW = cvsW/2, hzCvsH = cvsH/2;
            cvsLeft = cx - hzCvsW;
            cvsTop = cy - hzCvsH;
            cvsRight = cx + hzCvsW;
            cvsBottom = cy + hzCvsH;
        };
        mainBox.find('> .kPainterCroper > .kPainterEdges > div, > .kPainterCroper > .kPainterCorners > div, > .kPainterCroper > .kPainterMover, > .kPainterCroper > .kPainterBigMover')
            .on('touchstart touchcancel touchend mousedown', onTouchChange);
        
        mainBox.on('mouseup', function(/*jqEvent*/){
            if('mouse' != workingPointerDevice){
                return;
            }
            onMouseCancel();
        });
        mainBox.on('mouseleave', function(jqEvent){
            if('mouse' != workingPointerDevice){
                return;
            }
            var oEvent = jqEvent.originalEvent;
            if(!oEvent.buttons){return;}// mouse not pressing
            onMouseCancel();
        });
        
        kPainter.onCropRectChange = null;
        var setCropBox = function(){
            kPainterCroper[0].style.left = (left+width/2-absoluteCenterDistance)+'px';
            kPainterCroper[0].style.right = (-left-width/2-absoluteCenterDistance)+'px';
            kPainterCroper[0].style.top = (top+height/2-absoluteCenterDistance)+'px';
            kPainterCroper[0].style.bottom = (-top-height/2-absoluteCenterDistance)+'px';
            kPainterCroper[0].style.width = width+'px';
            kPainterCroper[0].style.height = height+'px';
            doCallbackNoBreak(kPainter.onCropRectChange);
        };

        mainBox.on('touchmove mousemove', function(jqEvent){
            jqEvent.preventDefault();// avoid select
            var touchs = jqEvent.originalEvent.targetTouches;
            if(!touchs){
                if('mouse' != workingPointerDevice){
                    return;
                }
                touchs = [{
                    pageX: jqEvent.originalEvent.clientX,
                    pageY: jqEvent.originalEvent.clientY
                }];
            }else{// touch event
                if('touch' != workingPointerDevice){
                    return;
                }
            }
            if(1 == touchs.length){
                if('crop' != gestureStatus || moveTouchId != touchs[0].identifier){
                    // or touch is not same
                    return;
                }
                var _x0 = x0, _y0 = y0;
                x0 = touchs[0].pageX;
                y0 = touchs[0].pageY;
                var dx0 = x0-_x0, dy0 = y0-_y0;
                if(-1 == orientX){
                    if(width-dx0<kPainter.cropRectMinW){
                        dx0 = width - kPainter.cropRectMinW;
                    }
                    if(left+dx0<minLeft){
                        dx0 = minLeft-left;
                    }
                    width -= dx0;
                    left += dx0;
                }else if(1 == orientX){
                    if(width+dx0<kPainter.cropRectMinW){
                        dx0 = -width + kPainter.cropRectMinW;
                    }
                    if(left+width+dx0>maxRight){
                        dx0=maxRight-width-left;
                    }
                    width += dx0;
                }
                if(-1 == orientY){
                    if(height-dy0<kPainter.cropRectMinH){
                        dy0 = height - kPainter.cropRectMinH;
                    }
                    if(top+dy0<minTop){
                        dy0 = minTop-top;
                    }
                    height -= dy0;
                    top += dy0;
                }else if(1 == orientY){
                    if(height+dy0<kPainter.cropRectMinH){
                        dy0 = -height + kPainter.cropRectMinH;
                    }
                    if(top+height+dy0>maxBottom){
                        dy0 = maxBottom-height-top;
                    }
                    height += dy0;
                }
                if(0 == orientX && 0 == orientY){
                    if(left+dx0<minLeft){
                        dx0 = minLeft-left;
                    }else if(left+width+dx0>maxRight){
                        dx0=maxRight-width-left;
                    }
                    if(top+dy0<minTop){
                        dy0 = minTop-top;
                    }else if(top+height+dy0>maxBottom){
                        dy0 = maxBottom-height-top;
                    }
                    left += dx0;
                    top += dy0;
                }
                setCropBox();
            }
        });

        // all is -0.5, -0.5, 0.5, 0.5
        var setCropRectArea = kPainter.setCropRectArea = function(l,t,r,b){
            if(!cropGesturer.isCropRectShowing){ return false; }
            if(!(l >= -0.5)){
                l = -0.5;
            }
            if(!(t >= -0.5)){
                t = -0.5;
            }
            if(!(r <= 0.5)){
                r = 0.5;
            }
            if(!(b <= 0.5)){
                b = 0.5;
            }
            if(l > r){
                l = r = (l + r) / 2;
            }
            if(t > b){
                t = b = (t + b) / 2;
            }
            getInfo();
            left = cvsLeft + (l + 0.5) * cvsW;
            if(left < minLeft){left = minLeft;}
            top = cvsTop + (t + 0.5) * cvsH;
            if(top < minTop){top = minTop;}
            var right = cvsLeft + (r + 0.5) * cvsW;
            if(right > maxRight){right = maxRight;}
            width = right - left;
            var bottom = cvsTop + (b + 0.5) * cvsH;
            if(bottom > maxBottom){bottom = maxBottom;}
            height = bottom - top;
            setCropBox();
            return true;
        };

        var getCropRectArea = kPainter.getCropRectArea = function(isAbsolute){
            if(!cropGesturer.isCropRectShowing){ return null; }
            if(cvsW != parseFloat(mainCvs.style.width)){
                // update info only when zoom change
                getInfo();
            }
            var l = (left - cvsLeft) / cvsW - 0.5;
            var t = (top - cvsTop) / cvsH - 0.5;
            var w = width / cvsW;
            var h = height / cvsH;
            var r = l + w;
            var b = t + h;
            if(isAbsolute){
                l = Math.round(l * mainCvs.fullQualityWidth);
                t = Math.round(t * mainCvs.fullQualityHeight);
                r = Math.round(r * mainCvs.fullQualityWidth);
                b = Math.round(b * mainCvs.fullQualityHeight);
            }
            return [l,t,r,b];
        };

        cropGesturer.getNeededRect = function(){
            getInfo();
            var rect = {};
            rect.width = 2 * Math.max(-left, left + width);
            rect.height = 2 * Math.max(-top, top + height);
            return rect;
        };

        kPainter.cropAsync = function(callback, ltrb){
            if(!isEditing){ 
                doCallbackNoBreak(callback,[null]);
                return; 
            }
            getInfo();
            ltrb = ltrb || getCropRectArea();
            if(!ltrb){
                doCallbackNoBreak(callback,[null]);
                return;
            }
            var l = ltrb[0],
                t = ltrb[1],
                r = ltrb[2],
                b = ltrb[3];
            if((l+0.5)*mainCvs.fullQualityWidth < 0.5 && (0.5-r)*mainCvs.fullQualityWidth <= 0.5 && (t+0.5)*mainCvs.fullQualityHeight < 0.5 && (0.5-b)*mainCvs.fullQualityHeight <= 0.5){
                doCallbackNoBreak(callback,[l,t,r,b]);
            }else{
                editor.pushStack({
                    crop: {
                        left: l+0.5,
                        top: t+0.5,
                        width: r-l,
                        height: b-t
                    }
                });
                editor.updateCvsAsync(editor.needAlwaysTrueTransform, false, function(){
                    doCallbackNoBreak(callback,[l,t,r,b]);
                });
            }
        };
    };

    var opencv = new function(){
        var opencv = this;

        (function(){
            var PS = {
                blurSize:5,
                cannyThreshold1: 8,
                cannyThreshold2Rt: 0.5,
                houghLineRho: 1,
                houghLineTheta: Math.PI / 180,
                houghLineThreshold: 8,
                houghLinesMinLength: 8,
                houghLinesMaxGap: 3,//5
                linesMaxRadDifToHV: Math.PI / 6,
                fitlineMaxDRange: 2,
                fitlineMaxRadRange: Math.PI / 18,
                cornerMinRad: Math.PI / 3
            };

            var getThumbImgData = function(maxwh) {
                var width = mainCvs.width,
                    height = mainCvs.height,
                    resizeRt = 1;
                if(width > height){
                    if(width > maxwh){
                        resizeRt = maxwh / width;
                        width = maxwh;
                        height = Math.round(height * resizeRt) || 1;
                    }
                }else{
                    if(height > maxwh){
                        resizeRt = maxwh / height;
                        height = maxwh;
                        width = Math.round(width * resizeRt) || 1;
                    }
                }
                var tsf = $(mainCvs).getTransform();
                var tsfW, tsfH;
                if(0 != tsf.a*tsf.d && 0 == tsf.b*tsf.c){
                    tsfW = width, tsfH = height;
                }else{
                    tsfW = height, tsfH = width;
                }
                var tempCvs = document.createElement("canvas");
                tempCvs.width = tsfW;
                tempCvs.height = tsfH;
                var ctx = tempCvs.getContext('2d');
                var drawE = tsfW/2 * (1 - tsf.a - tsf.c);
                var drawF = tsfH/2 * (1 - tsf.b - tsf.d);
                ctx.setTransform(tsf.a, tsf.b, tsf.c, tsf.d, drawE, drawF);
                ctx.drawImage(mainCvs, 0, 0, width, height);
                var imgData = ctx.getImageData(0,0,tsfW,tsfH);
                return imgData;
            };

            var handleImportSrc = function(importSrc, maxwh, callback){

                //tudo: handle blob,url
                if(typeof importSrc == "string" || importSrc instanceof String || importSrc instanceof Blob){
                    imgStorer.getBlobAndFormatFromAnyImgData(importSrc, function(blob){
                        if(blob){
                            blobToCvsAsync(blob, null, function(cvs){
                                handleImportSrc(cvs, maxwh, callback);
                            });
                        }else{
                            callback(null);
                            return;
                        }
                    });
                }else if(importSrc instanceof Image){
                    try{
                        kPainter._noUseButTestSrc = importSrc.src;
                    }catch(ex){
                        setTimeout(function(ex){throw ex;},0);
                        callback(null);
                        return;
                    }
                }else if(importSrc instanceof ImageData){
                    if(importSrc.width <= maxwh && importSrc.height <= maxwh){
                        setTimeout(function(){
                            callback(importSrc);
                        },0);
                        return;
                    }
                    var _importSrc = importSrc;
                    importSrc = document.createElement('canvas');
                    importSrc.width = _importSrc.width;
                    importSrc.height = _importSrc.height;
                    importSrc.getContext("2d").putImageData(_importSrc, importSrc.width, importSrc.height);
                }

                var cvs = document.createElement('canvas');
                var cvsW = importSrc.naturalWidth || importSrc.videoWidth || importSrc.width;
                var cvsH = importSrc.naturalHeight || importSrc.videoHeight || importSrc.height;
                var resizeRt = 1;
                if(cvsW > cvsH){
                    if(cvsW > maxwh){
                        resizeRt = maxwh / cvsW;
                        cvsW = maxwh;
                        cvsH = Math.round(cvsH * resizeRt) || 1;
                    }
                }else{
                    if(cvsH > maxwh){
                        resizeRt = maxwh / cvsH;
                        cvsH = maxwh;
                        cvsW = Math.round(cvsW * resizeRt) || 1;
                    }
                }
                cvs.width = cvsW;
                cvs.height = cvsH;
                var ctx = cvs.getContext("2d");
                ctx.drawImage(importSrc, 0, 0, cvs.width, cvs.height);

                setTimeout(function(){
                    callback(ctx.getImageData(0, 0, cvs.width, cvs.height));
                },0);
            };
            kPainter.documentDetectAsync = function(callback, importSrc){
                if(!importSrc){
                    if(gestureStatus != 'perspect'){ 
                        doCallbackNoBreak(callback,[null]);
                        return; 
                    }
                    onStartLoadingNoBreak();
                }

                var cv = KPainter._cv;
                handleImportSrc(importSrc || getThumbImgData(256), 256, function(imageData){

                    var src = new cv.matFromArray(imageData, cv.CV_8UC4);
                    var srcW = src.cols, srcH = src.rows,
                        whMin = Math.min(src.cols, src.rows);
                    cv.cvtColor(src, src, cv.ColorConversionCodes.COLOR_RGBA2GRAY.value, 0);

                    var blurred = new cv.Mat();
                    var blurSize = PS.blurSize;
                    cv.GaussianBlur(src, blurred, [blurSize, blurSize], 0, 0, cv.BORDER_DEFAULT);
                    cv.delMat(src);

                    var cannyed = new cv.Mat();//cannyedTemp = new cv.Mat(),
                    cv.Canny(blurred, cannyed/*Temp*/, PS.cannyThreshold1, PS.cannyThreshold2Rt * whMin, 3/*canny_aperture_size*/, false);
                    cv.delMat(blurred);

                    var linesMat = new cv.Mat();//IntVectorVector();
                    cv.HoughLinesP(cannyed, linesMat, PS.houghLineRho, PS.houghLineTheta, PS.houghLineThreshold, PS.houghLinesMinLength, PS.houghLinesMaxGap);
                    cv.delMat(cannyed);
                    var lineOriPxys = linesMat.data32s();

                    var linePxys = [];
                    var srcWh = srcW/2;
                    var srcHh = srcH/2;
                    for(var i=0;i<lineOriPxys.length;i+=2){
                        linePxys.push(lineOriPxys[i]-srcWh);
                        linePxys.push(lineOriPxys[i+1]-srcHh);
                    }
                    cv.delMat(linesMat);

                    var linesAll = [];
                    for(var i=0;i<linePxys.length;i+=4){//eslint-disable-line
                        var x0 = linePxys[i+0],
                            y0 = linePxys[i+1],
                            x1 = linePxys[i+2],
                            y1 = linePxys[i+3];
                        var a = y0 - y1,
                            b = x1 - x0,
                            c = x0 * y1 - x1 * y0;
                        // when 0 == c, not calc the line
                        if(0 == c){ continue; }
                        var cOrisign = c < 0 ? -1 : 1 ;
                        var r = Math.sqrt(a * a + b * b);
                        a = a / r * cOrisign;
                        b = b / r * cOrisign;
                        c = c / r * cOrisign;
                        var rad = Math.atan(a / b);
                        // line should in horizontal or vertical
                        {
                            var ra = Math.abs(rad);
                            if(ra > PS.linesMaxRadDifToHV && ra < Math.PI / 2 - PS.linesMaxRadDifToHV){
                                continue;
                            }
                        }
                        // rad anticlockwise, (-PI, PI]
                        if(b < 0){
                            if(0 == a){
                                b = -1;
                                rad = 0;
                            }else{
                                rad = -rad;
                            }
                        }else if(b > 0){
                            if(a < 0){
                                rad = -Math.PI - rad;
                            }else if(a > 0){
                                rad = Math.PI - rad;
                            }else{// 0 == a
                                b = 1;
                                rad = Math.PI;
                            }
                        }else{// 0 == b
                            if(a > 0){
                                a = 1;
                                rad = Math.PI / 2;
                            }else{// a < 0
                                a = -1;
                                rad = -Math.PI / 2;
                            }
                        }
                        var l = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
                        linesAll.push([a, b, c, rad, l]);
                    }

                    var linePreFiteds = [];
                    var lineFiteds = [];
                    var fitlineMaxDRange = PS.fitlineMaxDRange;
                    var fitlineMaxRadRange = PS.fitlineMaxRadRange;
                    GetfitLine(linesAll, linePreFiteds, fitlineMaxDRange, fitlineMaxRadRange, whMin*0.7);
                    GetfitLine(linePreFiteds, lineFiteds, fitlineMaxDRange, fitlineMaxRadRange, whMin*0.7);

                    var lineFiltered = [null, null, null, null];
                    for(var i = 0; i < lineFiteds.length; ++i){//eslint-disable-line
                        var line = lineFiteds[i];
                        var rad = line[3];//eslint-disable-line
                        var pos = null;
                        if(rad < -Math.PI * 3 / 4){
                            pos = 0;
                        }else if(rad < -Math.PI / 4){
                            pos = 1;
                        }else if(rad < Math.PI / 4){
                            pos = 2;
                        }else if(rad < Math.PI * 3 / 4){
                            pos = 3;
                        }else{
                            pos = 0;
                        }
                        if(!lineFiltered[pos]){
                            lineFiltered[pos] = line;
                        }else{
                            var _line = lineFiltered[pos];
                            var _c = _line[2], _l = _line[4],
                                c =  line[2], l = line[4];//eslint-disable-line
                            if(c * l > _c * _l){
                                lineFiltered[pos] = line;
                            }
                        }
                    }

                    for(var i = 0; i < lineFiltered.length; ++i){//eslint-disable-line
                        var line = lineFiltered[i];//eslint-disable-line
                        if(null == line){
                            // line not found, use border
                            line = [];
                            lineFiltered[i] = line;
                            if(0 == i){
                                line[2] = srcHh;
                                line[3] = Math.PI;
                            }else if(1 == i){
                                line[2] = srcWh;
                                line[3] = -Math.PI / 2;
                            }else if(2 == i){
                                line[2] = srcHh;
                                line[3] = 0;
                            }else if(3 == i){
                                line[2] = srcWh;
                                line[3] = Math.PI / 2;
                            }
                        }
                        line[0] = Math.sin(line[3]);
                        line[1] = -Math.cos(line[3]);
                    }

                    var cornerPoints = [];
                    for(var i = 0; i < lineFiltered.length; ++i){//eslint-disable-line
                        var line1 = lineFiltered[i],
                            line2 = lineFiltered[(i - 1 + lineFiltered.length) % lineFiltered.length];
                        var a1 = line1[0],
                            b1 = line1[1],
                            c1 = line1[2],
                            rad1 = line1[3],//eslint-disable-line
                            a2 = line2[0],
                            b2 = line2[1],
                            c2 = line2[2],
                            rad2 = line2[3];//eslint-disable-line
                        var x0 = (b1 * c2 - b2 * c1) / (b2 * a1 - b1 * a2),//eslint-disable-line
                            y0 = (a1 * c2 - a2 * c1) / (a2 * b1 - a1 * b2);//eslint-disable-line
                        cornerPoints.push([x0 / srcW, y0 / srcH]);
                    }

                    if(!importSrc){
                        setCornerPos(cornerPoints);
                        onFinishLoadingNoBreak();
                    }
                    doCallbackNoBreak(callback,[cornerPoints]);

                });
            };
            var GetfitLine = function(inputlines, outputlines, fitlineMaxDRange, fitlineMaxRadRange, maxLength){
                for(var i = 0; i < inputlines.length; ++i){
                    var line = inputlines[i];
                    var hasFited = false;
                    for(var j = 0; j < outputlines.length; ++j){
                        var fited = outputlines[j];
                        var _rad = fited[3], rad = line[3];
                        var radDifRaw = _rad - rad;//rad
                        if(radDifRaw > Math.PI){
                            rad += Math.PI * 2;
                        }else if(radDifRaw < -Math.PI){
                            rad -= Math.PI * 2;
                        }
                        var radDif = Math.abs(_rad - rad);
                        var dDif = Math.abs(fited[2] - line[2]);//c
                        if(radDif < fitlineMaxRadRange && dDif < fitlineMaxDRange){
                            hasFited = true;
                            var _l = fited[4], l = line[4];
                            var sl = _l + l;
                            fited[2] = (fited[2] * _l + line[2] * l) / sl;
                            var nrad;
                            nrad = (_rad * _l + rad * l) / sl;
                            if(nrad > Math.PI){ nrad -= Math.PI * 2; }
                            else if(nrad <= -Math.PI){ nrad += Math.PI * 2; }
                            fited[3] = nrad;
                            fited[4] = Math.min(sl, maxLength);
                            break;
                        }
                    }
                    if(!hasFited){
                        outputlines.push([null,null,line[2],line[3], line[4]]);
                    }
                }
            };
            var psptBox = mainBox.children(".kPainterPerspect");
            opencv.hideFreeTransformBorderDirectly = function(){
                psptBox.hide();
            };
            var psptBorderCvs = mainBox.find("> .kPainterPerspect > .kPainterPerspectCvs")[0];
            var setCornerPos = kPainter.setFreeTransformCornerPos = function(cornerPoints){
                if(gestureStatus != 'perspect'){ return; }
                var cvsZoom = mainCvs.kPainterZoom,
                    tsf = $(mainCvs).getTransform();
                var cvsVW = mainCvs.width * cvsZoom,
                    cvsVH = mainCvs.height * cvsZoom;
                if(!(0 != tsf.a * tsf.d && 0 == tsf.b * tsf.c)){
                    var temp = cvsVW; cvsVW = cvsVH; cvsVH = temp;
                }
                var rect = mainBox.borderBoxRect();
                var ml = rect.width / 2 - 5,
                    mt = rect.height / 2 - 5;
                for(var i = 0; i < cornerMovers.length; ++i){
                    var cornerMover = cornerMovers[i];
                    var index = $(cornerMover).attr('data-index');
                    var p = cornerPoints[index];
                    var l = cvsVW * p[0], t = cvsVH * p[1];
                    if(l < -ml){
                        l = -ml;
                    }else if(l > ml){
                        l = ml;
                    }
                    if(t < -mt){
                        t = -mt;
                    }else if(t > mt){
                        t = mt;
                    }
                    cornerMover.style.left = l + 'px';
                    cornerMover.style.right = -l + 'px';
                    cornerMover.style.top = t + 'px';
                    cornerMover.style.bottom = -t + 'px';
                }
                drawBorderLine();
                psptBox.show();
            };
            var getCornerPos = kPainter.getFreeTransformCornerPos = function(){
                var cvsZoom = mainCvs.kPainterZoom,
                    tsf = $(mainCvs).getTransform();
                var cvsVW = mainCvs.width * cvsZoom,
                    cvsVH = mainCvs.height * cvsZoom;
                if(!(0 != tsf.a * tsf.d && 0 == tsf.b * tsf.c)){
                    var temp = cvsVW; cvsVW = cvsVH; cvsVH = temp;
                }
                var cornerPoints = [];
                for(var i = 0; i < cornerMovers.length; ++i){
                    var mover = cornerMovers[i];
                    cornerPoints.push([parseFloat(mover.style.left) / cvsVW, parseFloat(mover.style.top) / cvsVH]);
                }
                return cornerPoints;
            };

            var drawBorderLine = function(){
                var rect = mainBox.borderBoxRect();
                psptBorderCvs.width = Math.round(rect.width);
                psptBorderCvs.height = Math.round(rect.height);
                var cornerPointLTs = [];
                for(var i = 0; i < cornerMovers.length; ++i){
                    cornerPointLTs.push([
                        Math.round(parseFloat(cornerMovers[i].style.left) + rect.width / 2),
                        Math.round(parseFloat(cornerMovers[i].style.top) + rect.height / 2)
                    ]);
                }
                var ctx = psptBorderCvs.getContext('2d');
                // ctx.strokeStyle = "#0F0";
                // ctx.lineWidth = 3;
                // ctx.setLineDash([10, 5]);
                // ctx.beginPath();
                // ctx.moveTo(cornerPointLTs[0][0], cornerPointLTs[0][1]);
                // ctx.lineTo(cornerPointLTs[1][0], cornerPointLTs[1][1]);
                // ctx.lineTo(cornerPointLTs[2][0], cornerPointLTs[2][1]);
                // ctx.lineTo(cornerPointLTs[3][0], cornerPointLTs[3][1]);
                // ctx.closePath();
                // ctx.stroke();

                var minLenPow2 = Number.POSITIVE_INFINITY;
                var bgi;//beginPointIndex, point closest to (0,0)
                for(var i = 0; i < 4; ++i){//eslint-disable-line
                    var lenPow2 = cornerPointLTs[i][0] * cornerPointLTs[i][0] + cornerPointLTs[i][1] * cornerPointLTs[i][1];
                    if(lenPow2 < minLenPow2){
                        minLenPow2 = lenPow2;
                        bgi = i;
                    }
                }
                var rsPArr = [];//resortedPointArr
                for(var i = 0; i < 4; ++i){//eslint-disable-line
                    rsPArr.push([cornerPointLTs[(bgi + i) % 4][0], cornerPointLTs[(bgi + i) % 4][1]]);
                }

                ctx.fillStyle = "rgba(0,0,0,0.3)";
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(rsPArr[0][0], rsPArr[0][1]);

                var getSignDirection = function(x1,y1,x2,y2,x3,y3,x4,y4){
                    return [Math.sign((y2 - y1)*x3 + (x1 - x2)*y3 + x2*y1 - x1*y2),
                        Math.sign((y2 - y1)*x4 + (x1 - x2)*y4 + x2*y1 - x1*y2)];
                };
                var signDirectionArr = [];
                for(var i = 0; i < 4; ++i){//eslint-disable-line
                    signDirectionArr.push(getSignDirection(
                        rsPArr[i][0], rsPArr[i][1], 
                        rsPArr[(i + 1) % 4][0], rsPArr[(i + 1) % 4][1], 
                        rsPArr[(i + 2) % 4][0], rsPArr[(i + 2) % 4][1], 
                        rsPArr[(i + 3) % 4][0], rsPArr[(i + 3) % 4][1]));
                }
                var calLinearEquationInTwoUnknowns = function(x1,y1,x2,y2,x3,y3,x4,y4){
                    var A1 = y2 - y1, B1 = x1 - x2, C1 = x2*y1 - x1*y2,
                        A2 = y4 - y3, B2 = x3 - x4, C2 = x4*y3 - x3*y4;
                    var bottom = B1*A2 - B2*A1;
                    return [(C1*B2 - C2*B1) / bottom, (C2*A1 - C1*A2) / bottom];
                };
                var p5 = undefined;
                var bExpectedOrder = (function(){
                    //-Pi/2 to Pi, expect: rad0 < rad3
                    //tudo: when k0 == k3, need more special
                    var k0, k3;
                    var a0 = rsPArr[1][0] - rsPArr[0][0];
                    if(a0){
                        k0 = (rsPArr[1][1] - rsPArr[0][1]) / a0;
                    }
                    var a3 = rsPArr[3][0] - rsPArr[0][0];
                    if(a3){
                        k3 = (rsPArr[3][1] - rsPArr[0][1]) / a3;
                    }
                    if(a0 > 0){
                        if(a3 > 0){
                            return k0 <= k3;
                        }else{
                            return true;
                        }
                    }else if(a0 = 0){
                        if(a3 > 0){
                            return false;
                        }else if(0 == a3){
                            return true;
                        }else{
                            return true;
                        }
                    }else{//a0 < 0
                        if(a3 >= 0){
                            return false;
                        }else{
                            return k0 <= k3;
                        }
                    }
                })();//Math.atan2(rsPArr[1][1] - rsPArr[0][1], rsPArr[1][0] - rsPArr[0][0]) <= Math.atan2(rsPArr[3][1] - rsPArr[0][1], rsPArr[3][0] - rsPArr[0][0]);//-Pi/2 to Pi
                if(signDirectionArr[0][0]*signDirectionArr[0][1] < 0){
                    if(signDirectionArr[2][0]*signDirectionArr[2][1] < 0){
                        p5 = calLinearEquationInTwoUnknowns(
                            rsPArr[0][0], rsPArr[0][1], 
                            rsPArr[1][0], rsPArr[1][1], 
                            rsPArr[2][0], rsPArr[2][1], 
                            rsPArr[3][0], rsPArr[3][1]);
                        if(bExpectedOrder){
                            ctx.lineTo(p5[0], p5[1]);
                            ctx.lineTo(rsPArr[2][0], rsPArr[2][1]);
                            ctx.lineTo(rsPArr[1][0], rsPArr[1][1]);
                            ctx.lineTo(p5[0], p5[1]);
                            ctx.lineTo(rsPArr[3][0], rsPArr[3][1]);
                        }else{
                            ctx.lineTo(rsPArr[3][0], rsPArr[3][1]);
                            ctx.lineTo(p5[0], p5[1]);
                            ctx.lineTo(rsPArr[1][0], rsPArr[1][1]);
                            ctx.lineTo(rsPArr[2][0], rsPArr[2][1]);
                            ctx.lineTo(p5[0], p5[1]);
                        }
                    }
                }else if(signDirectionArr[1][0]*signDirectionArr[1][1] < 0){
                    if(signDirectionArr[3][0]*signDirectionArr[3][1] < 0){
                        p5 = calLinearEquationInTwoUnknowns(
                            rsPArr[1][0], rsPArr[1][1], 
                            rsPArr[2][0], rsPArr[2][1], 
                            rsPArr[3][0], rsPArr[3][1], 
                            rsPArr[0][0], rsPArr[0][1]);
                        if(bExpectedOrder){
                            ctx.lineTo(rsPArr[1][0], rsPArr[1][1]);
                            ctx.lineTo(p5[0], p5[1]);
                            ctx.lineTo(rsPArr[3][0], rsPArr[3][1]);
                            ctx.lineTo(rsPArr[2][0], rsPArr[2][1]);
                            ctx.lineTo(p5[0], p5[1]);
                        }else{
                            ctx.lineTo(p5[0], p5[1]);
                            ctx.lineTo(rsPArr[2][0], rsPArr[2][1]);
                            ctx.lineTo(rsPArr[3][0], rsPArr[3][1]);
                            ctx.lineTo(p5[0], p5[1]);
                            ctx.lineTo(rsPArr[1][0], rsPArr[1][1]);
                        }
                    }
                }
                if(!p5){
                    if(bExpectedOrder){
                        ctx.lineTo(rsPArr[1][0], rsPArr[1][1]);
                        ctx.lineTo(rsPArr[2][0], rsPArr[2][1]);
                        ctx.lineTo(rsPArr[3][0], rsPArr[3][1]);
                    }else{
                        ctx.lineTo(rsPArr[3][0], rsPArr[3][1]);
                        ctx.lineTo(rsPArr[2][0], rsPArr[2][1]);
                        ctx.lineTo(rsPArr[1][0], rsPArr[1][1]);
                    }
                }

                ctx.lineTo(rsPArr[0][0], rsPArr[0][1]);
                ctx.lineTo(0, 0);
                ctx.lineTo(0, psptBorderCvs.height);
                ctx.lineTo(psptBorderCvs.width, psptBorderCvs.height);
                ctx.lineTo(psptBorderCvs.width, 0);
                ctx.lineTo(0, 0);
                ctx.fill();
            };

            var cornerMovers = mainBox.find("> .kPainterPerspect > .kPainterPerspectCorner");
            cornerMovers.css('left', '0');
            cornerMovers.css('top', '0');
            cornerMovers.css('right', '0');
            cornerMovers.css('bottom', '0');
            var moveTouchId = null, x0, y0, activedCorner;
            cornerMovers.on('touchstart touchcancel touchend mousedown', function(jqEvent){
                activedCorner = this;
                jqEvent.preventDefault();// avoid select
                var touchs = jqEvent.originalEvent.targetTouches;
                if(!touchs){
                    if(!workingPointerDevice){
                        workingPointerDevice = 'mouse';
                    }else if('mouse' != workingPointerDevice){
                        return;
                    }
                    touchs = [{
                        pageX: jqEvent.originalEvent.clientX,
                        pageY: jqEvent.originalEvent.clientY
                    }];
                }else if(touchs.length){
                    if(!workingPointerDevice){
                        workingPointerDevice = 'touch';
                    }else if('touch' != workingPointerDevice){
                        return;
                    }
                }

                if(1 == touchs.length){
                    if('perspect' == gestureStatus){
                        gestureStatus = 'perspectCornerMoving';
                    }
                    moveTouchId = touchs[0].identifier;
                    x0 = touchs[0].pageX;
                    y0 = touchs[0].pageY;
                }else if(0 == touchs.length){
                    if('perspectCornerMoving' == gestureStatus){
                        var ml = psptBox.width() / 2 - 5;
                        var mt = psptBox.height() / 2 - 5;
                        var left = parseFloat(activedCorner.style.left);
                        var top = parseFloat(activedCorner.style.top);
                        var bLeftChange = true;
                        var bTopChange = true;
                        if(left < -ml){
                            left = -ml;
                        }else if(left > ml){
                            left = ml;
                        }else{
                            bLeftChange = false;
                        }
                        if(top < -mt){
                            top = -mt;
                        }else if(top > mt){
                            top = mt;
                        }else{
                            bTopChange = false;
                        }
                        if(bLeftChange){
                            activedCorner.style.left = left + 'px';
                            activedCorner.style.right = -left + 'px';
                        }
                        if(bTopChange){
                            activedCorner.style.top = top + 'px';
                            activedCorner.style.bottom = -top + 'px';
                        }
                        if(bLeftChange || bTopChange){
                            drawBorderLine();
                        }
                        workingPointerDevice = null;
                        gestureStatus = 'perspect';
                    }
                }
            });
            mainBox.on('touchmove mousemove', function(jqEvent){
                jqEvent.preventDefault();// avoid select
                var touchs = jqEvent.originalEvent.targetTouches;
                if(!touchs){
                    if('mouse' != workingPointerDevice){
                        return;
                    }
                    touchs = [{
                        pageX: jqEvent.originalEvent.clientX,
                        pageY: jqEvent.originalEvent.clientY
                    }];
                }else{// touch event
                    if('touch' != workingPointerDevice){
                        return;
                    }
                }
                if(1 == touchs.length){
                    if('perspectCornerMoving' != gestureStatus || moveTouchId != touchs[0].identifier){
                        // or touch is not same
                        return;
                    }
                    var _x0 = x0, _y0 = y0;
                    x0 = touchs[0].pageX;
                    y0 = touchs[0].pageY;
                    var dx0 = x0-_x0, dy0 = y0-_y0;
                    var left = parseFloat(activedCorner.style.left) + dx0;
                    var top = parseFloat(activedCorner.style.top) + dy0;
                    activedCorner.style.left = left + 'px';
                    activedCorner.style.right = -left + 'px';
                    activedCorner.style.top = top + 'px';
                    activedCorner.style.bottom = -top + 'px';
                    drawBorderLine();
                }
            });
            
            mainBox.on('mouseup', function(/*jqEvent*/){
                if('mouse' != workingPointerDevice){
                    return;
                }
                if('perspectCornerMoving' == gestureStatus){
                    workingPointerDevice = null;
                    gestureStatus = 'perspect';
                }
            });
            mainBox.on('mouseleave', function(jqEvent){
                if('mouse' != workingPointerDevice){
                    return;
                }
                var oEvent = jqEvent.originalEvent;
                if(!oEvent.buttons){return;}// mouse not pressing
                if('perspectCornerMoving' == gestureStatus){
                    workingPointerDevice = null;
                    gestureStatus = 'perspect';
                }
            });
            kPainter.freeTransformMaxWH = 2048;
            kPainter.freeTransformAsync = function(callback, cornerPoints, importSrc){
                if(!importSrc && gestureStatus != 'perspect'){ 
                    doCallbackNoBreak(callback,[false]);
                    return; 
                }
                onStartLoadingNoBreak();

                var cv = KPainter._cv;

                cornerPoints = cornerPoints || getCornerPos();
                var cps = cornerPoints;
                //tudo: more acurate
                if(Math.abs(cps[0][0] - 0.5) < 0.005 &&
                    Math.abs(cps[0][1] - 0.5) < 0.005 &&
                    Math.abs(cps[1][0] + 0.5) < 0.005 &&
                    Math.abs(cps[1][1] - 0.5) < 0.005 &&
                    Math.abs(cps[2][0] + 0.5) < 0.005 &&
                    Math.abs(cps[2][1] + 0.5) < 0.005 &&
                    Math.abs(cps[3][0] - 0.5) < 0.005 &&
                    Math.abs(cps[3][1] + 0.5) < 0.005){
                    onFinishLoadingNoBreak();
                    if(typeof callback == "function"){callback();}
                    return;
                }
                handleImportSrc(importSrc || getThumbImgData(kPainter.freeTransformMaxWH), kPainter.freeTransformMaxWH, function(imageData){

                    var src = new cv.matFromArray(imageData, cv.CV_8UC4);
                    cv.cvtColor(src, src, cv.ColorConversionCodes.COLOR_RGBA2RGB.value, 0);

                    var fromCornerMat = new cv.Mat.zeros(4, 1, cv.CV_32FC2); //cv.Point2fVector();
                    var fcd = fromCornerMat.data32f();
                    for(var i = 0; i < cornerPoints.length; ++i){
                        var p = cornerPoints[i];
                        fcd[2 * i] = Math.round((p[0] + 0.5) * src.cols);
                        fcd[2 * i + 1] = Math.round((p[1] + 0.5) * src.rows);
                    }

                    var x0 = fcd[2] - fcd[0],
                        y0 = fcd[3] - fcd[1],
                        x1 = fcd[4] - fcd[2],
                        y1 = fcd[5] - fcd[3],
                        x2 = fcd[6] - fcd[4],
                        y2 = fcd[7] - fcd[5],
                        x3 = fcd[0] - fcd[6],
                        y3 = fcd[1] - fcd[7];
                    var psptWidth = Math.round(Math.max(Math.sqrt(x0 * x0 + y0 * y0), Math.sqrt(x2 * x2 + y2 * y2))), 
                        psptHeight = Math.round(Math.max(Math.sqrt(x1 * x1 + y1 * y1), Math.sqrt(x3 * x3 + y3 * y3)));
                    var toCornerMat = new cv.Mat.zeros(4, 1, cv.CV_32FC2);//cv.Point2fVector();
                    var toCornerData32f = toCornerMat.data32f();
                    toCornerData32f[2] = psptWidth;
                    toCornerData32f[4] = psptWidth;
                    toCornerData32f[5] = psptHeight;
                    toCornerData32f[7] = psptHeight;
                    var tsfMat = cv.getPerspectiveTransform(fromCornerMat, toCornerMat);
                    cv.delMat(fromCornerMat);
                    cv.delMat(toCornerMat);

                    var perspectTsfed = new cv.Mat.zeros(psptHeight, psptWidth, cv.CV_8UC3);
                    var color = new cv.Scalar(0, 255, 0);
                    cv.warpPerspective(src, perspectTsfed, tsfMat, [perspectTsfed.rows, perspectTsfed.cols], cv.InterpolationFlags.INTER_LINEAR.value, cv.BORDER_CONSTANT, color);
                    //putResultImgCvs(perspectTsfed);
                    cv.delMat(src);
                    cv.delMat(tsfMat);
                    cv.delMat(color);
                    var imgData = new ImageData(psptWidth, psptHeight);
                    var channels = perspectTsfed.channels();
                    var data = perspectTsfed.data();
                    for (var i = 0, j = 0; i < data.length; i += channels, j+=4) {//eslint-disable-line
                        imgData.data[j] = data[i];
                        imgData.data[j + 1] = data[i+1%channels];
                        imgData.data[j + 2] = data[i+2%channels];
                        imgData.data[j + 3] = 255;
                    }
                    cv.delMat(perspectTsfed);

                    mainCvs.width = psptWidth;
                    mainCvs.height = psptHeight;
                    var ctx = mainCvs.getContext('2d');
                    //gesturer.setImgStyleFit();
                    ctx.putImageData(imgData, 0, 0);
                    gesturer.setImgStyleFit();

                    cvsToBlobAsync(mainCvs, function(blob){
                        if(importSrc){
                            doCallbackNoBreak(callback,[blob]);
                        }else{
                            editor.pushStack({
                                srcBlob: blob,
                                saveFormat: "image/jpeg"
                            });
                            editor.updateCvsAsync(true,false,function(){
                                setCornerPos([[-0.5,-0.5],[0.5,-0.5],[0.5,0.5],[-0.5,0.5]]);
                                //if(kPainter.isAutoShowCropUI){ cropGesturer.showCropRect(); }
                                //gestureStatus = null;
                                gestureStatus = 'perspect';

                                onFinishLoadingNoBreak();
                                doCallbackNoBreak(callback,[true]);
                            });
                        }
                    }, "image/jpeg");

                });
            };
            kPainter.enterFreeTransformModeAsync = function(callback){
                if(!isEditing || !KPainter.cvHasLoaded){ 
                    doCallbackNoBreak(callback,[false]);
                    return; 
                }
                workingPointerDevice = null;
                gestureStatus = 'perspect';
                onStartLoadingNoBreak();
                setTimeout(function(){
                    cropGesturer.hideCropRect();
                    editor.updateCvsAsync(true, false, function(){
                        setCornerPos([[-0.5,-0.5],[0.5,-0.5],[0.5,0.5],[-0.5,0.5]]);
                        psptBox.show();
                        onFinishLoadingNoBreak();
                        editor.needAlwaysTrueTransform = true;
                        doCallbackNoBreak(callback,[true]);
                    });
                }, 0);
            };
            kPainter.exitFreeTransformModeAsync = function(callback){
                if(gestureStatus != 'perspect'){ 
                    doCallbackNoBreak(callback,[false]);
                    return; 
                }
                psptBox.hide();
                editor.updateCvsAsync(false, false, function(){
                    if(kPainter.isAutoShowCropUI){ cropGesturer.showCropRect(); }
                    workingPointerDevice = null;
                    gestureStatus = null;
                    editor.needAlwaysTrueTransform = false;
                    doCallbackNoBreak(callback,[true]);
                });
            };
        })();
    };

    var videoMdl = new function(){//eslint-disable-line
        var videoMdl = this;//eslint-disable-line

        var videoMdlDom = mainBox.children('.kPainterVideoMdl');
        var video = videoMdlDom.children('.kPainterVideo')[0];
        var btnGrabVideo = videoMdlDom.children('.kPainterBtnGrabVideo');
        var btnCloseVideo = videoMdlDom.children('.kPainterBtnCloseVideo');
        kPainter.videoSettings = {video:{/*width:{ideal:2048},height:{ideal:2048},*/facingMode:{ideal:"environment"}}};
        kPainter.showVideo = function(callback, videoSettings){
            navigator.mediaDevices.getUserMedia(videoSettings || kPainter.videoSettings).then(function(stream){
                video.onloadedmetadata = function(){
                    video.onloadedmetadata = video.onerror = null;
                    video.play();
                    videoMdlDom.show();
                    doCallbackNoBreak(callback,[true]);
                };
                video.onerror = function(){
                    video.onloadedmetadata = video.onerror = null;
                    doCallbackNoBreak(callback,[false]);
                };
                video.srcObject = stream;
            }).catch(function(ex){
                doCallbackNoBreak(callback,[false]);
                setTimeout(function(){throw ex;}, 0);
            });
        };
        kPainter.grabVideo = function(isAutoAdd, callback){
            var canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(video,0,0);
            if(!isAutoAdd){
                return canvas;
            }
            kPainter.addImageAsync(canvas, callback);
        };
        kPainter.hideVideo = function(){
            video.pause();
            var tracks = video.srcObject.getTracks();
            for(var i = 0; i < tracks.length; ++i){
                tracks[i].stop();
            }
            videoMdlDom.hide();
        };
        kPainter.onAddImgFromGrabVideoBtn = null;
        btnGrabVideo.on("click touchstart",function(){
            kPainter.grabVideo(true, kPainter.onAddImgFromGrabVideoBtn);
            kPainter.hideVideo();
        });
        btnCloseVideo.on("click touchstart",function(){
            kPainter.hideVideo();
        });
    };
};

KPainter.cvFolder = (KPainter.cvFolder == undefined ? "js" : KPainter.cvFolder);
KPainter.cvHasLoaded = false;

KPainter._doCallbackNoBreak = function(callback, paras){
    if(callback){try{callback.apply(window, paras||[]);}catch(ex){setTimeout(function(){throw(ex);},0);}}
};
KPainter.loadCvScriptAsync = function(callback){
    KPainter._loadCvQueue = KPainter._loadCvQueue || new TaskQueue();
    var loadCvInner = function(){
        if(KPainter.cvHasLoaded){
            KPainter._doCallbackNoBreak(callback,[true]);
            return;
        }
        // CVModule for cv-wasm.js or cv.js
        KPainter._CVModule = {
            cvFolder: KPainter.cvFolder,
            preRun: [],
            postRun: [],
            isRuntimeInitialized: false,
            onRuntimeInitialized: function() {
                KPainter.cvHasLoaded = true;
                console.log("Runtime is ready!");
                KPainter._doCallbackNoBreak(callback,[true]);
                callback = null;
            },
            onExit: function(){
                KPainter._doCallbackNoBreak(callback,[false]);
                callback = null;
            },
            onAbort: function(){
                KPainter._doCallbackNoBreak(callback,[false]);
                callback = null;
            },
            print: function(text) {
            console.log(text);
            },
            printErr: function(text) {
            console.log(text);
            },
            setStatus: function(text) {
            console.log(text);
            },
            totalDependencies: 0
        };
        KPainter._CVModule.setStatus('Downloading...');
        if(window.WebAssembly){
            //webassembly
            $.ajax({
                type: "GET",
                url: KPainter.cvFolder+"/cv-wasm.js?v=20180921",
                dataType: "script",
                cache: true,
                onerror:function(){
                    KPainter._doCallbackNoBreak(callback,[false]);
                }
            });
        }else{
            //asm js
            $.ajax({
                type: "GET",
                url: KPainter.cvFolder+"/cv.js?v=201800921",
                dataType: "script",
                cache: true,
                onerror:function(){
                    KPainter._doCallbackNoBreak(callback,[false]);
                }
            });
        }
    };
    KPainter._loadCvQueue.push(loadCvInner);
};
//var MBC = KPainter;
