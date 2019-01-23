/* global MBC, $ */

/*========================= prevent page swipe back and forward in other browser ====================*/
var isMobileSafari = (/iPhone/i.test(navigator.platform) || /iPod/i.test(navigator.platform) || /iPad/i.test(navigator.userAgent)) && !!navigator.appVersion.match(/(?:Version\/)([\w\._]+)/); 
if(isMobileSafari){
    /* In safari at ios, 
     * when open this page by '_blank' mode,
     * and run the script in every pages which this page can link to, 
     * can disable ios safari swipe back and forward.
     */
    window.history.replaceState(null, null, "#");
}
// prevent page swipe back and forward in other browser
$("#imgShowMdl").on("touchmove", function(ev){
    ev.preventDefault();
    ev.stopPropagation();
});

/*====================================== load doc detect module ==================================*/
//MBC.cvFolder = 'js';//default 'js', folder of cv.wasm.js & cv.wasm
MBC.loadCvScriptAsync(function(bSuccess){
    if(bSuccess){
        $('#div-main-step3-loading').hide();
        $('#div-main-step3').show();
    }else{
        $('#div-main-step3-loading').text('load document detect module fail (>_<).');
    }
});

/*================================== init painter =========================*/
var painter = new MBC('f0068MgAAAJGgjjlyaXV+dGz7kw2D6DXxsONcG1iMPSTZYfbNGDOobF1wJO1mqRdPTEYLqziZ6/2OXfBXEaDayluoHPIDwKM=');
painter.onStartLoading = function(){ $("#grayFog").show(); };
painter.onFinishLoading = function(){ $("#grayFog").hide(); };
var painterDOM = painter.getHtmlElement();
painterDOM.style.width = '100%';
painterDOM.style.height = '100%';
$("#div-painter").append(painterDOM);
painter.isAutoShowCropUI = false;
//painter.freeTransformMaxWH = 4096;//default 2048, img quality
$(window).resize(function(){
    painter.updateUIOnResize(true);
});

/*============================ frame-main ===============================*/
$('#div-main-addPhoto').click(function(){
    painter.showFileChooseWindow();
});

var $divTplImgBlock = $('#div-tpl-imgBlock');
$divTplImgBlock.remove();
$divTplImgBlock.removeAttr('id');

$('#div-main-step3').on('click','.btn-removeImg',function(){
    $(this).closest('.div-imgBlock').remove();
});

/*============================ frame-adjust ===============================*/
$('#btn-close-adjust').click(function(){
    if(painter.isEditing()){
        painter.cancelEdit();
    }
    while(painter.getCount()){painter.del();}
    $('#frame-adjust').hide();
});

var initAdjust = function(){
    painter.changePage(0);
    $('#frame-adjust').show();
    $('#div-adjust-confirm').hide();
    $('#div-adjust-docDetect').show();
    painter.enterEditAsync(function(){
        painter.enterFreeTransformModeAsync(function(){
            painter.documentDetectAsync(function(){

            });
        });
    });
};

painter.onAddImgFromFileChooseWindow = function(){
    if(painter.getCount() && !$('#frame-adjust').is(':visible')){
        initAdjust();
    }
};

$('#div-adjust-docDetect .btn-back').click(function(){
    painter.cancelEdit();
    painter.del();
    if(painter.getCount()){
        initAdjust();
    }else{
        $('#frame-adjust').hide();
    }
});

$('#div-adjust-docDetect .btn-rr').click(function(){
    painter.rotateRight();
});

var freeTransformCornerPos = null;
$('#div-adjust-docDetect .btn-next').click(function(){
    freeTransformCornerPos = painter.getFreeTransformCornerPos();
    painter.freeTransformAsync(function(){
        painter.exitFreeTransformModeAsync(function(){
            $('#div-adjust-docDetect').hide();
            $('#div-adjust-confirm').show();
        });
    });
});

$('#div-adjust-confirm .btn-back').click(function(){
    painter.undo(function(){
        painter.enterFreeTransformModeAsync(function(){
            painter.documentDetectAsync(function(){
                painter.setFreeTransformCornerPos(freeTransformCornerPos);
                $('#div-adjust-confirm').hide();
                $('#div-adjust-docDetect').show();
            });
        });
    });
});

$('#div-adjust-confirm .btn-rr').click(function(){
    painter.rotateRight();
});

$('#div-adjust-confirm .btn-save').click(function(){
    painter.saveEditAsync(function(){
        var blob = painter.getImage(true).kPainterBlob;
        var img = painter.getImage();
        var $imgBlock = $divTplImgBlock.clone();
        $imgBlock.find('.div-imgBorder').append(img);
        $imgBlock[0].theBlob = blob; // [tip]: get blob for upload here
        $('#div-main-addPhoto').before($imgBlock);
        var parentDiv = $('#div-main-addPhoto').parent()[0];
        parentDiv.scrollLeft = parentDiv.scrollWidth;
        painter.del();
        if(painter.getCount()){
            initAdjust();
        }else{
            $('#frame-adjust').hide();
        }
    }, true);
});
