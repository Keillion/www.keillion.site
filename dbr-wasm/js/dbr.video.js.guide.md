# dbr.video.js guide

It is a Guide depends on dbr-wasm-6.5.0.2. May have some change in later version.

In this guide, you need a camera and keep network.

## Hello World

Copy these codes to a file and open it in browser.
```html
<!DOCTYPE html>
<html>
<body>
<script src="https://demo.dynamsoft.com/dbr_wasm/js/dbr-6.5.0.2.min.js"></script>
<script src="dbr.video.js"></script>
<script>
    dynamsoft.dbrEnv.resourcesPath = 'https://demo.dynamsoft.com/dbr_wasm/js';
    dynamsoft.dbrEnv.licenseKey = 't0068NQAAABxhryrSwCH8u6P4k0oIAV34DJsMgZTRQhXXZxI669+sn7tR3/OXMkdkGx3jduML+lx8+dvNbQ6Eeg4SN1DfqXU=';
    dynamsoft.dbrEnv.bUseWorker = true;
    let videoReader = new dynamsoft.BarcodeReader.VideoReader({
        onFrameRead: results => {console.log(results);},
        onDiffCodeRead: (txt, result) => {alert(txt);}
    });
    videoReader.read();
</script>
</body>
</html>
```

## Use More Config

Example:
```js
// Use config when new the object
let videoReader = new dynamsoft.BarcodeReader.VideoReader({
    // Use back camera in mobile. Set width and height.
    videoSettings: { video: { width: 1280, height: 720, facingMode: "environment" } },
    // The camera can auto focus. Give up too blur image too make decode quicker.
    runtimeSettings: { mDeblurLevel: 0 },
    // The same code awlways alert? Set forgetTime longer.
    forgetTime: 10000,
    onFrameRead: results => {console.log(results);},
    onDiffCodeRead: (txt, result) => {alert(txt);}
});
// change config
videoReader.forgetTime = 20000;
videoReader.onFrameRead = undefined;
```

You can find more explanation in head of `dbr.video.js`.

## Custom the UI

Try it.
```html
<!DOCTYPE html>
<html>
<body>
    <video class="dbrVideoReader-video" playsinline="true"></video>
<script src="https://demo.dynamsoft.com/dbr_wasm/js/dbr-6.5.0.2.min.js"></script>
<script src="dbr.video.js"></script>
<script>
    dynamsoft.dbrEnv.resourcesPath = 'https://demo.dynamsoft.com/dbr_wasm/js';
    // https://www.dynamsoft.com/CustomerPortal/Portal/TrialLicense.aspx
    dynamsoft.dbrEnv.licenseKey = 't0068NQAAABxhryrSwCH8u6P4k0oIAV34DJsMgZTRQhXXZxI669+sn7tR3/OXMkdkGx3jduML+lx8+dvNbQ6Eeg4SN1DfqXU=';
    dynamsoft.dbrEnv.bUseWorker = true;
    let videoReader = new dynamsoft.BarcodeReader.VideoReader({
        htmlElement: document.body,
        onFrameRead: results => {console.log(results);},
        onDiffCodeRead: (txt, result) => {alert(txt);}
    });
    videoReader.read();
</script>
</body>
</html>
```

How about add a select.
```html
<select class="dbrVideoReader-sel-camera"></select>
```

And another select.
```html
<select class="dbrVideoReader-sel-resolution"></select>
```

Try it.

Only want to provide limited resolutions and hide the gotten resolution?
```html
<select class="dbrVideoReader-sel-resolution">
    <!-- <option class="dbrVideoReader-opt-gotResolution" value="got"></option> -->
    <option data-width="1920" data-height="1080">1920 x 1080</option>
    <option data-width="1280" data-height="720">1280 x 720</option>
    <option data-width="640" data-height="480">640 x 480</option>
</select>
```

If you want to use custom UI(not a select tag) to change resolution, you can write you own UI, then change resolution by API.
You can set any width and height. But they may not be accurate. Finally you will get the cloasest result the device supported.
```js
videoReader.play(null, 1920, 1080).then(r=>{
    console.log(r.width+'x'+r.height);
});
```

You can get device list by the promise result of `read` or `updateDevice`.
And change device by `play`.
```js
videoReader.read().then(r=>{
    console.log(r.width+'x'+r.height);
    console.log(r.current);
    console.log(r.all);
    // play the last device
    videoReader.play(r.all[r.all.length - 1].deviceId);
});
```

Now you can do anything to your UI.

## Complete a Form

Let's base on the html with custom video tag, so you can see the change process of input tags.

Add some `<input>`.
```html
<input id="ipt-0">
<input id="ipt-1">
<input id="ipt-2">
```

Modify VideoReaderConfig to complete the form and close automatically.
```js
let iptIndex = 0;
let videoReader = new dynamsoft.BarcodeReader.VideoReader({
    onDiffCodeRead:(txt)=>{
        document.getElementById('ipt-' + iptIndex).value = txt;
        if(3 == ++iptIndex){
            videoReader.onDiffCodeRead = undefined;
            videoReader.close();
        }
    }
});
```

## Decode Part of Video

```js
videoReader.beforeDecodeVideo = (video) => {
    // take a center part of the video and resize the part before decode
    // also see: [drawImage](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)
    var vw = video.videoWidth, vh = video.videoHeight;
    var sx = vw / 4, sy = vh / 4, sWidth = vw / 2, sHeight = vh / 2, dWidth = vw / 4, dHeight = vh / 4;
    return [video, sx, sy, sWidth, sHeight, dWidth, dHeight];
};
```


