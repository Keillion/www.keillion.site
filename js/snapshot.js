(()=>{
    let video = document.querySelector('video');
    let cvs = document.createElement('canvas');
    cvs.width = video.videoWidth;
    cvs.height = video.videoHeight;
    let ctx = cvs.getContext('2d');
    ctx.drawImage(video,0,0);
    cvs.toBlob(blob => {
        let a = document.createElement('a');
        a.target='_blank';
        a.download = 'dynamsoft-snapshot-img.png';
        a.href = URL.createObjectURL(blob);

        var ev = new MouseEvent('click',{
            "view": window,
            "bubbles": true,
            "cancelable": false
        });
        a.dispatchEvent(ev);

        setTimeout(function(){
            URL.revokeObjectURL(a.href);
        }, 10000);

    },"image/png");
})();