/**
 * project: dbr.video.js
 * version: 0.1.0.20190315
 * dependency: dbr-<v>.min.js (v >= 6.4.1)
 * authur: www.dynamsoft.com
 * 
 * Basic use:
 * ```js
 * var videoReader = new dynamsoft.BarcodeReader.VideoReader({
 *   onFrameRead:function(results){console.log(results);},
 *   onDiffCodeRead:function(txt, result){alert(txt);}
 * });
 * videoReader.read();
 * ```
 * API:
 * ```ts
 * declare class VideoReader{
 *   constructor(config?: VideoReaderConfig);
 *   isReading: () => boolean;
 *   // The ui element.
 *   htmlElement: HTMLElement;
 *   // Video play settings.
 *   // Refer [MediaStreamConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Syntax).
 *   // Example: { video: { width: 1280, height: 720, facingMode: "environment" } }
 *   // If during reading, need close() then read() to make it effective.
 *   videoSettings?: MediaStreamConstraints;
 *   // A raw result, whose confidence equals or larger than the confidence, will be regarded as a reliable result. Dafault 30.
 *   confidence: number;
 *   // Relex time between two read. Default 100(ms).
 *   intervalTime: number;
 *   // Runtime settings about decoding.
 *   // Refer [RuntimeSettings](https://www.dynamsoft.com/help/Barcode-Reader/struct_dynamsoft_1_1_barcode_1_1_public_runtime_settings.html).
 *   runtimeSettings: DBRPublicRuntimeSettings;
 *   // like (video)=>{return [video, sx, sy, sWidth, sHeight, dWidth, dHeight];}
 *   beforeDecodeVideo?: (video: HTMLVideoElement) => Promise<HTMLVideoElement || any[]>;
 *   // like (config)=>{return config.reader.decodeVideo.apply(config.reader, config.args);}
 *   duringDecodeVideo?: (config: VideoReaderDecodeVideoConfig) => Promise<DBRTextResult[]>;
 *   // The callback will be called after each time decoding.
 *   // Refer [TextResult](https://www.dynamsoft.com/help/Barcode-Reader/class_dynamsoft_1_1_barcode_1_1_text_result.html).
 *   onFrameRead?: (results: DBRTextResult[]) => void;
 *   // One code will be remember for `forgetTime`. After `forgetTime`, when the code comes up again, it will be regard as a new different code.
 *   forgetTime: number;
 *   // When a new different code comes up, the function will be called.
 *   // Refer [TextResult](https://www.dynamsoft.com/help/Barcode-Reader/class_dynamsoft_1_1_barcode_1_1_text_result.html).
 *   onDiffCodeRead?: (txt: string, result: DBRTextResult) => void;
 *   // Strat the video and read barcodes.
 *   read(): Promise<VideoReaderReadCallback>;
 *   // Change video settings during reading
 *   play(deviceId?: string, width?: number, height?: number): Promise<VideoReaderPlayCallback>;
 *   // Pause the video.
 *   pause(): void;
 *   // Close the video.
 *   close(): void;
 *   // Update device list
 *   updateDevice(): Promise<VideoReaderUpdateDeviceCallback>;
 * }
 * 
 * interface VideoReaderConfig{
 *   htmlElement?: HTMLElement;
 *   videoSettings?: MediaStreamConstraints;
 *   confidence?: number;
 *   intervalTime?: number;
 *   runtimeSettings?: DBRPublicRuntimeSettings;
 *   beforeDecodeVideo?: (video: HTMLVideoElement) => Promise<any[]>;
 *   duringDecodeVideo?: (config: VideoReaderDecodeVideoConfig) => Promise<DBRTextResult[]>;
 *   onFrameRead?: (results: DBRTextResult[]) => void;
 *   forgetTime?: number;
 *   onDiffCodeRead?: (txt: string, result: DBRTextResult) => void;
 * }
 * 
 * interface VideoDeviceInfo{
 *   deviceId: string;
 *   label: string;
 * }
 * 
 * interface VideoReaderDecodeVideoConfig{
 *   reader: dynamsoft.BarcodeReader,
 *   args: any[]
 * }
 * 
 * interface VideoReaderPlayCallback{
 *   width: number,
 *   height: number
 * }
 * 
 * interface VideoReaderUpdateDeviceCallback{
*   current?: VideoDeviceInfo,
*   all: VideoDeviceInfo[]
 * }
 * 
 * interface VideoReaderReadCallback extends VideoReaderPlayCallback, VideoReaderUpdateDeviceCallback {
 * }
 * 
 * ```
*/

/*global dynamsoft*/
dynamsoft.BarcodeReader.VideoReader = function(config){
    config = config || {};
    this.htmlElement = config.htmlElement || (function(){
        var div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.left = '0';
        div.style.top = '0';
        div.style.background = '#eee';
        /*eslint-disable indent*/
        div.innerHTML = [
            '<p style="width:100%;height:32px;line-height:32px;position:absolute;margin:auto 0;top:0;bottom:0;text-align:center;">loading</p>',
            '<video class="dbrVideoReader-video" playsinline="true" style="width:100%;height:100%;position:absolute;left:0;top:0;"></video>',
            '<select class="dbrVideoReader-sel-camera" style="position:absolute;left:0;top:0;">',
            '</select>',
            '<select class="dbrVideoReader-sel-resolution" style="position:absolute;left:0;top:20px;">',
            '</select>',
            '<button class="dbrVideoReader-btn-close" style="position:absolute;right:0;top:0;">',
                '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/></svg>',
            '</button>',
        ].join('');
        /*eslint-enable indent*/
        return div;
    })();
    this.videoSettings = config.videoSettings;
    this.confidence = config.confidence;
    if(this.confidence == undefined){
        this.confidence = 30;
    }
    this.intervalTime = config.intervalTime;
    if(this.intervalTime == undefined){
        this.intervalTime = 100;
    }
    this.runtimeSettings = config.runtimeSettings || {};
    this.beforeDecodeVideo = config.beforeDecodeVideo;
    this.duringDecodeVideo = config.duringDecodeVideo;
    this.onFrameRead = config.onFrameRead;
    this.forgetTime = config.forgetTime;
    if(this.forgetTime == undefined){
        this.forgetTime = 3000;
    }
    this.onDiffCodeRead = config.onDiffCodeRead;
    this._isReading = false;
};

dynamsoft.BarcodeReader.VideoReader.prototype.isReading = function(){
    return this._isReading;
};
dynamsoft.BarcodeReader.VideoReader.prototype.read = function(){
    var videoReader = this;
    if(videoReader._isReading){
        return Promise.reject('The VideoReader is reading.');
    }else{
        videoReader._isReading = true;
    }
    var htmlElement = videoReader.htmlElement;
    var video, cameraSel, resolutionSel, optGotRsl, btnClose;
    (function(){
        var htmlProgenys = [];
        for(let node of htmlElement.childNodes){
            if(node.nodeType == Node.ELEMENT_NODE){
                htmlProgenys.push(node);
            }
        }
        for(let i = 0; i < htmlProgenys.length; ++i){
            for(let node of htmlProgenys[i].childNodes){
                if(node.nodeType == Node.ELEMENT_NODE){
                    htmlProgenys.push(node);
                }
            }
        }
        for(var el of htmlProgenys){
            if(el.classList.contains('dbrVideoReader-video')){
                video = el;
            }else if(el.classList.contains('dbrVideoReader-sel-camera')){
                cameraSel = el;
            }else if(el.classList.contains('dbrVideoReader-sel-resolution')){
                resolutionSel = el;
                if(!resolutionSel.options.length){
                    resolutionSel.innerHTML = [
                        '<option class="dbrVideoReader-opt-gotResolution" value="got"></option>',
                        '<option data-width="3840" data-height="2160">ask 3840 x 2160</option>',
                        '<option data-width="2560" data-height="1440">ask 2560 x 1440</option>',
                        '<option data-width="1920" data-height="1080">ask 1920 x 1080</option>',
                        '<option data-width="1600" data-height="1200">ask 1600 x 1200</option>',
                        '<option data-width="1280" data-height="720">ask 1280 x 720</option>',
                        '<option data-width="800" data-height="600">ask 800 x 600</option>',
                        '<option data-width="640" data-height="480">ask 640 x 480</option>',
                        '<option data-width="640" data-height="360">ask 640 x 360</option>'
                    ].join('');
                    optGotRsl = resolutionSel.options[0];
                }
            }else if(el.classList.contains('dbrVideoReader-opt-gotResolution')){
                optGotRsl = el;
            }else if(el.classList.contains('dbrVideoReader-btn-close')){
                btnClose = el;
            }
        }
    })();
    
    var updateDevice = videoReader._updateDevice = function(){
        return navigator.mediaDevices.enumerateDevices().then(deviceInfos=>{
            let arrVideoDeviceInfo = [];
            let oldVal, selOpt;
            if(cameraSel){
                oldVal = cameraSel.value;
                cameraSel.innerHTML = "";
            }
            for(let i = 0; i < deviceInfos.length; ++i){
                let info = deviceInfos[i];
                if(info.kind != 'videoinput'){
                    continue;
                }
                let reOrgInfo = {};
                reOrgInfo.deviceId = info.deviceId;
                reOrgInfo.label = info.label || 'camera '+ i;
                arrVideoDeviceInfo.push(reOrgInfo);
            }
            let selInfo;
            for(let track of video.srcObject.getTracks()){
                if(selInfo){
                    break;
                }
                if('video' == track.kind){
                    for(let info of arrVideoDeviceInfo){
                        if(track.label == info.label){
                            selInfo = info;
                            break;
                        }
                    }
                }
            }
            if(cameraSel){
                for(let info of arrVideoDeviceInfo){
                    let opt = document.createElement('option');
                    opt.value = info.deviceId;
                    opt.innerText = info.label;
                    cameraSel.appendChild(opt);
                    if(oldVal == info.deviceId){
                        selOpt = opt;
                    }
                }
                let optArr = cameraSel.childNodes;
                if(!selOpt && selInfo && optArr.length){
                    for(var opt of optArr){
                        if(selInfo.label == opt.innerText){
                            selOpt = opt;
                            break;
                        }
                    }
                }
                if(selOpt){
                    cameraSel.value = selOpt.value;
                }
            }
            return Promise.resolve({current: selInfo, all: arrVideoDeviceInfo});
        });
    };

    videoReader._pausevideo = function(){
        video.pause();
    };

    var stopVideo = function(){
        if(video.srcObject){
            if(self.kConsoleLog)self.kConsoleLog('======stop video========');
            video.srcObject.getTracks().forEach(function(track) {
                track.stop();
            });
        }
    };
    
    var playvideo = videoReader._playvideo = (deviceId, width, height)=>{
        return new Promise((resolve,reject)=>{

            stopVideo();
    
            if(self.kConsoleLog)self.kConsoleLog('======before video========');
            var constraints = videoReader.videoSettings = videoReader.videoSettings || { 
                video: { 
                    facingMode: { ideal: 'environment' }
                } 
            };
            var bMobileSafari = /Safari/.test(navigator.userAgent) && /iPhone/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
            if(bMobileSafari){
                if(width >= 1280){
                    constraints.video.width = 1280;
                }else if(width >= 640){
                    constraints.video.width = 640;
                }else if(width >= 320){
                    constraints.video.width = 320;
                }
            }else{
                if(width){constraints.video.width = { ideal: width };}
                if(height){constraints.video.height = { ideal: height };}
            }
            if(deviceId){
                constraints.video.facingMode = undefined;
                constraints.video.deviceId = {exact: deviceId};
            }
            
            var hasTryedNoWidthHeight = false;
            var getAndPlayVideo = ()=>{
                if(self.kConsoleLog)self.kConsoleLog('======try getUserMedia========');
                if(self.kConsoleLog)self.kConsoleLog('ask '+JSON.stringify(constraints.video.width)+'x'+JSON.stringify(constraints.video.height));
                navigator.mediaDevices.getUserMedia(constraints).then((stream)=>{
                    if(self.kConsoleLog)self.kConsoleLog('======get video========');
                    return new Promise((resolve2, reject2)=>{
                        video.srcObject = stream;
                        video.onloadedmetadata = ()=>{
                            if(self.kConsoleLog)self.kConsoleLog('======play video========');
                            video.play().then(()=>{
                                if(self.kConsoleLog)self.kConsoleLog('======played video========');
                                var gotRsl = 'got '+video.videoWidth+'x'+video.videoHeight;
                                if(resolutionSel && optGotRsl){
                                    optGotRsl.setAttribute('data-width', video.videoWidth);
                                    optGotRsl.setAttribute('data-height', video.videoHeight);
                                    resolutionSel.value = 'got';
                                    optGotRsl.innerText = gotRsl;
                                }
                                if(self.kConsoleLog)self.kConsoleLog(gotRsl);
                                resolve2();
                                resolve({width: video.videoWidth, height: video.videoHeight});
                            },(ex)=>{
                                reject2(ex);
                            });
                        };
                        video.onerror = ()=>{reject2();};
                    });
                }).catch((ex)=>{
                    if(self.kConsoleLog)self.kConsoleLog(ex);
                    if(!hasTryedNoWidthHeight && constraints.video){
                        hasTryedNoWidthHeight = true;
                        constraints.video.width = undefined;
                        constraints.video.height = undefined;
                        getAndPlayVideo();
                    }else{
                        reject(ex);
                    }
                });
            };
            getAndPlayVideo();
        });
    };

    videoReader.arrDiffCodeInfo = [];
    var barcodeReader;
    var loopReadVideo = function(){
        if(!videoReader._isReading){
            if(barcodeReader){
                barcodeReader.deleteInstance();
                barcodeReader = undefined;
            }
            return;
        }
        if(video.paused){
            if(self.kConsoleLog)self.kConsoleLog('Video is paused. Ask in 1s.');
            return setTimeout(loopReadVideo, 1000);
        }
    
        if(self.kConsoleLog)self.kConsoleLog('======= once read =======');
    
        var timestart = (new Date()).getTime();
        Promise.all([(()=>{
            if(JSON.stringify(barcodeReader.getRuntimeSettings()) != JSON.stringify(videoReader.runtimeSettings)){
                return barcodeReader.updateRuntimeSettings(videoReader.runtimeSettings);
            }else{
                return Promise.resolve();
            }
        })(),(()=>{
            if(videoReader.beforeDecodeVideo){
                return videoReader.beforeDecodeVideo(video);
            }else{
                return video;
            }
        })()]).then(function(values){
            if(videoReader.duringDecodeVideo){
                return videoReader.duringDecodeVideo({
                    reader: barcodeReader,
                    args: values[1]
                });
            }else{
                var args = values[1];
                if(!(args instanceof Array)){
                    args = [args];
                }
                return barcodeReader.decodeVideo.apply(barcodeReader, args);
            }
        }).then((results)=>{
            var timeGetResult = new Date().getTime();
            if(self.kConsoleLog)self.kConsoleLog('time cost: ' + (timeGetResult - timestart) + 'ms');

            var confidenceResults = [];
            for(let i=0;i<results.length;++i){
                var result = results[i];
                var txt = result.BarcodeText;
                if(self.kConsoleLog)self.kConsoleLog(txt);
                var curConfidence = result.LocalizationResult.ExtendedResultArray[0].Confidence;
                if(curConfidence >= videoReader.confidence){
                    confidenceResults.push(result);
                }
            }

            var arrLeaveConfidenceResults = JSON.parse(JSON.stringify(confidenceResults));
            for(let infoIndex = 0; infoIndex < videoReader.arrDiffCodeInfo.length; ++infoIndex){
                var info = videoReader.arrDiffCodeInfo[infoIndex];
                var resultIndex = -1;
                for(let i in arrLeaveConfidenceResults){
                    let result = arrLeaveConfidenceResults[i];
                    if(info.result.BarcodeText == result.BarcodeText && info.result.BarcodeFormat == result.BarcodeFormat){
                        resultIndex = i;
                    }
                }
                if(-1 != resultIndex){
                    info.time = timeGetResult;
                    info.result = arrLeaveConfidenceResults[resultIndex];
                    arrLeaveConfidenceResults.splice(resultIndex, 1);
                }else if(timeGetResult - info.time > videoReader.forgetTime){
                    videoReader.arrDiffCodeInfo.splice(infoIndex, 1);
                    --infoIndex;//don't change index in next loop
                }
            }
            //remove posible multiple location
            for(let i = 0; i < arrLeaveConfidenceResults.length; ++i){
                var r0 = arrLeaveConfidenceResults[i];
                for(let j = i + 1; j < arrLeaveConfidenceResults.length; ){
                    var r1 = arrLeaveConfidenceResults[j];
                    if(r0.BarcodeText == r1.BarcodeText && r0.BarcodeFormat == r1.BarcodeFormat){
                        arrLeaveConfidenceResults.splice(j, 1);
                    }else{
                        ++j;
                    }
                }
            }
            for(let result of arrLeaveConfidenceResults){
                videoReader.arrDiffCodeInfo.push({
                    result: result,
                    time: timeGetResult
                });
            }
            //onFrameRead
            if(videoReader.onFrameRead){
                videoReader.onFrameRead(JSON.parse(JSON.stringify(results)));
            }
            //onDiffCodeRead
            for(let result of arrLeaveConfidenceResults){
                if(videoReader.onDiffCodeRead){
                    videoReader.onDiffCodeRead(result.BarcodeText, JSON.parse(JSON.stringify(result)));
                }
            }
    
            setTimeout(loopReadVideo, videoReader.intervalTime);
        }).catch(ex=>{
            if(self.kConsoleLog)self.kConsoleLog(ex);
            setTimeout(loopReadVideo, videoReader.intervalTime);
            throw ex;
        });
    };

    var onCameraSelChange = function(){
        playvideo(cameraSel.value).then(function(){
            if(!videoReader._isReading){
                stopVideo();
            }
        }).catch(function(ex){
            alert('Play video failed: ' + (ex.message || ex));
        });
    };
    if(cameraSel){
        cameraSel.addEventListener('change', onCameraSelChange);
    }

    var onResolutionSelChange = function(){
        var width, height;
        if(resolutionSel && -1 != resolutionSel.selectedIndex){
            var selRslOpt = resolutionSel.options[resolutionSel.selectedIndex];
            width = selRslOpt.getAttribute('data-width');
            height = selRslOpt.getAttribute('data-height');
        }
        playvideo(undefined, width, height).then(function(){
            if(!videoReader._isReading){
                stopVideo();
            }
        }).catch(function(ex){
            alert('Play video failed: ' + (ex.message || ex));
        });
    };
    if(resolutionSel){
        resolutionSel.addEventListener('change', onResolutionSelChange);
    }

    var isOriHtmlELementHasParent = !!htmlElement.parentNode;

    var closeWindow = videoReader._closeWindow = function(){
        stopVideo();
        videoReader._isReading = false;
        if(cameraSel){
            cameraSel.removeEventListener('change', onCameraSelChange);
        }
        if(resolutionSel){
            resolutionSel.removeEventListener('change', onResolutionSelChange);
        }
        videoReader._closeWindow = undefined;
        if(btnClose){
            btnClose.removeEventListener('click', closeWindow);
        }
        var parent = htmlElement.parentNode;
        if(parent && !isOriHtmlELementHasParent){
            parent.removeChild(htmlElement);
        }
    };
    if(btnClose){btnClose.addEventListener('click', closeWindow);}

    if(!isOriHtmlELementHasParent){document.body.appendChild(htmlElement);}

    return Promise.all([dynamsoft.BarcodeReader.loadWasm(),playvideo()]).then(function(values){
        if(!videoReader._isReading){
            stopVideo();
            return Promise.resolve();
        }
        barcodeReader = new dynamsoft.BarcodeReader();
        var runtimeSettings = barcodeReader.getRuntimeSettings();
        runtimeSettings.mAntiDamageLevel = 3;
        runtimeSettings.mDeblurLevel = 0;
        //runtimeSettings.mLocalizationAlgorithmPriority = "ConnectedBlocks";
        for(var index in videoReader.runtimeSettings){
            if(runtimeSettings[index] != undefined){
                runtimeSettings[index] = videoReader.runtimeSettings[index];
            }
        }
        videoReader.runtimeSettings = runtimeSettings;
        return Promise.all([values[1], barcodeReader.updateRuntimeSettings(runtimeSettings)]);
    }).then(function(values){
        loopReadVideo();
        return Promise.all([values[0], updateDevice()]);
    }).then(function(values){
        var videoResolution = values[0];
        var videoDeviceInfos = values[1];
        return Promise.resolve({
            width: videoResolution.width,
            height: videoResolution.height,
            current: videoDeviceInfos.current,
            all: videoDeviceInfos.all
        });
    });

};
dynamsoft.BarcodeReader.VideoReader.prototype.play = function(deviceId, width, height){
    if(this._isReading){
        return this._playvideo(deviceId, width, height);
    }else{
        return Promise.reject('It has not started reading.');
    }
};
dynamsoft.BarcodeReader.VideoReader.prototype.pause = function(){
    if(this._isReading){
        this._pausevideo();
    }
};
dynamsoft.BarcodeReader.VideoReader.prototype.close = function(){
    if(this._isReading){
        this._closeWindow();
    }
};
dynamsoft.BarcodeReader.VideoReader.prototype.updateDevice = function(){
    if(this._isReading){
        return this._updateDevice();
    }else{
        return Promise.reject('It has not started reading.');
    }
};


