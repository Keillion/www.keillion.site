//chrome.runtime.id is only valid in extension. Replace it with a actual id when out of the extension.
var extensionId = "enenadioefhagdbobnlpimjfbicjfakk";
document.getElementById("extensionId").innerText = extensionId;

//check if extesion is added
chrome.runtime.sendMessage(extensionId, {method:"testConn"}, function(response){
  if(!response){
    document.getElementById("div-install").style.display = "block";
  }
});

var dcsObject = dynamsoft.lib.dcs("imgShowMdl");
dcsObject.addEventListener("onRefreshUI", function(curIndex, length){
	document.getElementById("pageNum").innerHTML = ((curIndex+1)+"/"+length);
});
dcsObject.addEventListener("onStartLoading", function(){
  document.getElementById("grayFog").style.display="block";
});
dcsObject.addEventListener("onFinishLoading", function(){
  document.getElementById("grayFog").style.display="none";
});
document.getElementById('iptFile').addEventListener("change", function(){
	for(var i=0; i<this.files.length; ++i){
		dcsObject.addFileAsync(this.files[i]); // have queued inner, so not recur
	}
	this.value = '';
});

document.getElementById("btn-undo").addEventListener("click", function(){
  dcsObject.undo();
});
document.getElementById("btn-redo").addEventListener("click", function(){
  dcsObject.redo();
});
document.getElementById("btn-rl").addEventListener("click", function(){
  dcsObject.rotateLeft();
});
document.getElementById("btn-rr").addEventListener("click", function(){
  dcsObject.rotateRight();
});
document.getElementById("btn-mirr").addEventListener("click", function(){
  dcsObject.mirror();
});
document.getElementById("btn-crop").addEventListener("click", function(){
  dcsObject.crop();
});
document.getElementById("btn-save").addEventListener("click", function(){
  dcsObject.saveEditAsync(function(){
    document.getElementById('imgEditMdl').style.display='none';
    document.getElementById('switchImgMdl').style.display='';
    document.getElementById('addUplMdl').style.display='';
  });
});
document.getElementById("btn-cancel").addEventListener("click", function(){
  dcsObject.cancelEdit();
  document.getElementById('imgEditMdl').style.display='none';
  document.getElementById('switchImgMdl').style.display='';
  document.getElementById('addUplMdl').style.display='';
});
document.getElementById("btn-first").addEventListener("click", function(){
  dcsObject.first();
});
document.getElementById("btn-previous").addEventListener("click", function(){
  dcsObject.previous();
});
document.getElementById("btn-next").addEventListener("click", function(){
  dcsObject.next();
});
document.getElementById("btn-last").addEventListener("click", function(){
  dcsObject.last();
});
document.getElementById("btn-remove").addEventListener("click", function(){
  dcsObject.remove();
});
document.getElementById("btn-edit").addEventListener("click", function(){
  if(dcsObject.edit()){
    document.getElementById('switchImgMdl').style.display='none';
    document.getElementById('addUplMdl').style.display='none';
    document.getElementById('imgEditMdl').style.display='';
    dcsObject.showCropRect();
  }
});
var logAndShow = function(obj){
  kConsoleLog(obj);
  document.getElementById("grayFog").style.display="none";
  if(!$('#kConsoleLogDiv').is(':visible')){
    document.getElementById("kConsoleShowHideBtn").click();
  }
};
var errorAndShow = function(obj){
  kConsoleError(obj);
  if(!$('#kConsoleLogDiv').is(':visible')){
    document.getElementById("kConsoleShowHideBtn").click();
  }
  document.getElementById("grayFog").style.display="none";
};
document.getElementById("btn-scan").addEventListener("click", function(){
  document.getElementById("grayFog").style.display="block";
  var request = {"method":"documentScan"};
  var maxImages = document.getElementById("maxScanImages").value;
  if(!isNaN(maxImages)){
    maxImages = parseInt(maxImages);
  }
  if(maxImages > 0){
    request.maxImages = maxImages;
  }
  chrome.runtime.sendMessage(extensionId, request, function(response){
    if(response && response.dataUrls){
      var img = new Image();
      img.src = response.dataUrls[0];
      dcsObject.painter.addImageAsync(img);
    }else{
      var responseStr;
      try{
        responseStr = JSON.stringify(response);
      }catch(ex){
        responseStr = "" + response;
      }
      errorAndShow(responseStr);
    }
  });
});
document.getElementById("btn-capture").addEventListener("click", function(){
  navigator.mediaDevices.getUserMedia({video:true}).then(function(stream){
    var video = document.getElementById("video-camera");
    video.srcObject = stream;
    video.onloadedmetadata = function(){
      video.play();
    };
    document.getElementById("videoMdl").style.display = "block";
  }).catch(function(ex){
    errorAndShow(ex);
    errorAndShow(ex.name);
  });
});
document.getElementById("btn-snapshot").addEventListener("click", function(){
  var video = document.getElementById("video-camera");
  var canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(video,0,0);
  var img = new Image();
  img.src = canvas.toDataURL();
  dcsObject.painter.addImageAsync(img);
  document.getElementById("btn-captureClose").click();
});
document.getElementById("btn-captureClose").addEventListener("click", function(){
  var video = document.getElementById("video-camera");
  video.pause();
  video.srcObject.getTracks()[0].stop();
  document.getElementById("videoMdl").style.display = "none";
});
document.getElementById("btn-fromFile").addEventListener("click", function(){
  document.getElementById('iptFile').click();
});
document.getElementById("btn-barcode").addEventListener("click", function(){
  var img = dcsObject.painter.getImage();
  if(!img){
    return;
  }
  document.getElementById("grayFog").style.display="block";
  var b64Img = img.src;
  var pattern = ";base64,";
  var posB64 = b64Img.indexOf(pattern) + pattern.length;
  b64Img = b64Img.substring(posB64);
  var request = {
    method: "readBarcode",
    image: b64Img
  };
  chrome.runtime.sendMessage(extensionId, request, function(response){
    if(typeof response.errorCode != "undefined"){
      if(0 == response.errorCode){
        logAndShow(response);
      }else{
        errorAndShow(response);
      }
    }else{
      errorAndShow(response.exception);
    }
  });
});
document.getElementById("btn-ocr").addEventListener("click", function(){
  var img = dcsObject.painter.getImage();
  if(!img){
    return;
  }
  document.getElementById("grayFog").style.display="block";
  // get base64, get info
  var b64Img = img.src;
  var pattern = ";base64,";
  var posB64 = b64Img.indexOf(pattern);
  var imgType = b64Img.substring(5, posB64); // 5 == "data:".length
  posB64 += pattern.length;
  b64Img = b64Img.substring(posB64);
  var ddcKey = document.getElementById('ipt-ddcKey').value;
  
  var request = {
    method: "ocr",
    image: b64Img,
    imgType: imgType,
    ddcKey: ddcKey
  };
  
  chrome.runtime.sendMessage(extensionId, request, function(response){
    if(!response.exception){
      logAndShow(response);
    }else{
      errorAndShow(response.exception);
    }
  });
});
document.getElementById("btn-download").addEventListener("click", function(){
  dcsObject.painter.download(document.getElementById('ipt-downloadName').value);
});


document.getElementById("grayFog").style.display="none";
