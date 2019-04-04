/* global dynamsoft, $*/

var bPC = !navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
var bMobileSafari = /Safari/.test(navigator.userAgent) && /iPhone/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

// By default, js will load `dbr-<version>.min.js` & `dbr-<version>.wasm` in the same folder as the context.
// `dbr-<version>.min.js` & `dbr-<version>.wasm` should always put in same folder.
// Modify this setting when you put `dbr-<version>.min.js` & `dbr-<version>.wasm` somewhere else.
dynamsoft.dbrEnv.resourcesPath = 'js';//'https://static.keillion.site';

// https://www.dynamsoft.com/CustomerPortal/Portal/TrialLicense.aspx
dynamsoft.dbrEnv.licenseKey = 't0068NQAAAAzvNPJCRq3x/GnfazosnAmiNnAA3hYp00H3cXdjQQ7+CKwfgn/zWLNIM7Mz2wZxirhTBIdQkh+wxgBn93pUeRI=';//"f0084VQAAADlesByufM7ffGJZgXvlWZy947c1DhfgPoCpYGAxmWPldBlQuW+MhlsKBJuk1Wt3LHfs+vAOqeOm+0RNTQE0HFWPmfmIxJYoKCeYqH11eRX7";

dynamsoft.dbrEnv.bUseWorker = true; //uncomment it to use worker

var video = document.getElementById('dbrVideoReader-video');
var divCvsContainer = document.getElementById('div-canvas-container');
var divDbrResultTxtboxContainer = document.getElementById('div-dbrResultTxtbox-container');

var videoReader = new dynamsoft.BarcodeReader.VideoReader({
    htmlElement: document.body,
    //confidence: 0,
    onFrameRead: function(results){
        // tudo, resize when video too big
        divCvsContainer.style.width = video.videoWidth + 'px';
        divCvsContainer.style.height = video.videoHeight + 'px';
        
        var videoComputedStyle = window.getComputedStyle(video);
        var videoComputedWidth = Math.round(parseFloat(videoComputedStyle.getPropertyValue('width')));
        var resizeRate = 1;
        if(videoComputedWidth < video.videoWidth){
            resizeRate = videoComputedWidth / video.videoWidth; 
        }
        divCvsContainer.style.transform = 'matrix('+[resizeRate,0,0,resizeRate,0,0].join(',')+')';

        for(let result of results){
            let cvs = document.createElement('canvas');
            cvs.style.position = 'absolute';
            var x1 = result.LocalizationResult.X1;
            var x2 = result.LocalizationResult.X2;
            var x3 = result.LocalizationResult.X3;
            var x4 = result.LocalizationResult.X4;
            var y1 = result.LocalizationResult.Y1;
            var y2 = result.LocalizationResult.Y2;
            var y3 = result.LocalizationResult.Y3;
            var y4 = result.LocalizationResult.Y4;
            var leftMin = Math.min(x1, x2, x3, x4);
            var rightMax = Math.max(x1, x2, x3, x4);
            var topMin = Math.min(y1, y2, y3, y4);
            var bottomMax = Math.max(y1, y2, y3, y4);
            cvs.style.left = leftMin +'px';
            cvs.style.top = topMin +'px';
            cvs.width = rightMax - leftMin;
            cvs.height = bottomMax - topMin;
    
            var _x1 = x1 - leftMin;
            var _x2 = x2 - leftMin;
            var _x3 = x3 - leftMin;
            var _x4 = x4 - leftMin;
            var _y1 = y1 - topMin;
            var _y2 = y2 - topMin;
            var _y3 = y3 - topMin;
            var _y4 = y4 - topMin;
            var ctx = cvs.getContext('2d');
            ctx.fillStyle = 'rgba(254,180,32,0.3)';
            ctx.beginPath();
            ctx.moveTo(_x1,_y1);
            ctx.lineTo(_x2,_y2);
            ctx.lineTo(_x3,_y3);
            ctx.lineTo(_x4,_y4);
            ctx.fill();
            divCvsContainer.append(cvs);
            setTimeout(function(){
                $(cvs).remove();
            }, 500);
        }
        var resultBoxs = $(divDbrResultTxtboxContainer).find('.div-dbrResultTxtbox');
        resultBoxs.each(function(){
            let txt = this.dbrResultBoxTxt;
            let format = this.dbrResultBoxFormat;
            let bExist = false;
            for(let i = 0; i < videoReader.arrDiffCodeInfo.length; ++i){
                var info = videoReader.arrDiffCodeInfo[i];
                if(info.result.BarcodeFormat == format && info.result.BarcodeText == txt){
                    bExist = true;
                    break;
                }
            }
            if(!bExist){
                $(this).remove();
            }
        });
    },
    onDiffCodeRead: function(txt, result){
        var div = document.createElement('div');
        div.className = 'div-dbrResultTxtbox';
        
        var possibleLink = txt;
        if(!txt.startsWith('http') && (
            txt.startsWith('www') ||
            -1 != txt.indexOf('.com') ||
            -1 != txt.indexOf('.net') ||
            -1 != txt.indexOf('.org') ||
            -1 != txt.indexOf('.edu')
        )){
            possibleLink = 'http://' + txt;
        }
        
        var a;
        if(possibleLink.startsWith('http')){
            a = document.createElement('a');
            a.href = possibleLink;
            a.target = '_blank';
        }else{
            a = document.createElement('span');
        }
        a.innerText = txt;
        
        div.innerText = result.BarcodeFormatString + ': ';
        div.innerHTML += a.outerHTML;
        div.dbrResultBoxTxt = txt;
        div.dbrResultBoxFormat = result.BarcodeFormat;
        divDbrResultTxtboxContainer.appendChild(div);
        console.log(div.innerText);
    }
});

$('.cb-preBarcodeFormat').change(function(){
    if($('#frame-supportAndSetting .cb-preBarcodeFormat:checked').length){
        $('#btn-processSupportAndSettings').removeAttr('disabled');
    }else{
        $('#btn-processSupportAndSettings').attr('disabled', 'disabled');
    }
});

$('#btn-processSupportAndSettings').click(function(){
    var checkedIpts = $('#frame-supportAndSetting .cb-preBarcodeFormat:checked');
    var preSelBarcodeFormat = 0;
    checkedIpts.each(function(){
        preSelBarcodeFormat = preSelBarcodeFormat | this.value;
    });
    videoReader.runtimeSettings.mBarcodeFormatIds = preSelBarcodeFormat;
    $('.ipt-barcodeFormat').each(function(){
        this.checked = (this.value & preSelBarcodeFormat) == this.value;
    });
    videoReader.read();
    $('#frame-supportAndSetting').hide();
});

$('.menu-father > p').click(function(){
    //tudo
    $(this).siblings('div').toggle();
});

$('.ipt-barcodeFormat').change(function(){
    videoReader.runtimeSettings.mBarcodeFormatIds += parseInt(this.checked ? this.value : -this.value);
});

$('.rd-interval').change(function(){
    videoReader.intervalTime = this.value;
});

$('#frame-white').hide();
