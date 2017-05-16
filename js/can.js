var WritingPad = function (w,h) {

    var current = null;
    $(function () {
        initHtml();
        initSignature();
        initDrawimg();
        if ($(".modal")) {
            $(".modal").modal("toggle");
        } else {
            alert("没用手写面板");
        }
        //$(document).on("click", "#myClose,.close", null, function () {
        //    //$('#mymodal').modal('hide');
        //    //$("#mymodal").remove();
        //    //$('.now_td').removeClass('now_td');
        //    //$('#myImg').empty();
        //    //$('body').removeAttr('style');
        //    $("#mySave").click();
        //});
        $(document).on("click", "#mySave", null, function(){
            var myImg = $('#myImg').empty();
            var dataUrl = $('.js-signature').jqSignature('getDataURL');
            var img = $('<img>').attr('src', dataUrl);
            if(dataUrl!='[object Object]'){
                img.css({'width':w,'height':h,'display':'block'});
                $('.now_td').find('img').remove();
                $('.now_td').append(img);
            }
            $("#mymodal").remove();
            $('.modal-backdrop').remove();
            $('body').removeAttr('style');
        });
        //关掉bootstrap的点击空白处时关掉弹窗的功能
        $('.modal-backdrop').modal({backdrop: 'static', keyboard: false});
        //点击遮罩层时触发保存按钮的点击事件
        $(document).on('click','.modal-backdrop,.close',function(){
            $("#mySave").click();
        });
        $(document).on("click", "#myEmpty", null, function () {
            $('.js-signature').jqSignature('clearCanvas');
        });
        $("#mymodal").on('hide.bs.modal', function () {
            $("#mymodal").remove();
            $('body').removeAttr('style');
        });
        //点击xClose时关闭弹窗和遮罩层
        $('.sr-only,.close').on('click',function(){
            $("#mySave").click();
            $("#mymodal").remove();
            $('.modal-backdrop').remove();
        })
    });
    function initHtml() {
        var html = '<div class="modal" id="mymodal">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close btn btn-default sr-only" style="float:right;" data-dismiss="modal">×Close</button>' +
            '<button type="button" class="btn btn-default" style="float:right;margin-right:10px;" id="myEmpty">清空面板</button>'+
            '<h4 class="modal-title">手写面板</h4>' +
            '</div>'+
            '<div class="modal-body">' +
            '<div class="js-signature" id="mySignature">' +
            '</div>' +
            //'<div>' +
            //'<button type="button" class="btn btn-default" id="myEmpty">清空面板</button>' +
            //'</div>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-primary" id="mySave">保存</button>' +
            '<div id="myImg">' +
            '<div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        $('body').append(html);
    }

    function initSignature() {
        if (window.requestAnimFrame) {
            var signature = $("#mySignature");
            var max_w = $(window).width();
            var cw = w,ch = h;
            if(max_w<2*w){
                cw = max_w/2 - 32;
                ch = cw*h / w;
            }
            $('.modal').css({'width':2*cw+32+'px'});
            signature.jqSignature({ width: 2*cw, height: 2*ch, border: '1px solid red', background: '#fff', lineColor: '#000', lineWidth: 2, autoFit: false });
        } else {
            alert("请加载jq-signature.js");
            return;
        }
        $('body').css({'overflow':'hidden'});
        $('.modal-footer').css('display','none');
    }
    function initDrawimg(){
        var now_img = $('.now_td').find('img');
        var beauty = new Image();
        beauty.src  = now_img.attr('src');
        if(now_img){
            var drawimg = $('.js-signature').jqSignature('drawCanvas',beauty);
        }
    }
    function init() {
    }
    return {
        init: function () {
            init();
        }
    };

}
function table_click(mtd){
    var w = $(mtd).width(),h = $(mtd).height();
    $(mtd).click(function(){
        $(mtd).removeClass('now_td');
        $(this).addClass('now_td');
        var wp = new WritingPad(w,h);
    });
}
function table_bigimg(mtd){
    var click_num = 0;
    $(mtd).click(function(){
        var _img =  $(this).find('img');
        var html  = '<div class="bigimg"><img src="" alt="" /></div>';
        var w = _img.width(),h = _img.height();
        var imgurl = _img.attr('src');
        var num = $(this).attr('data-animate-type');
        var off_top = $(this).offset().top;
        var Itop=0,Ileft=0,Iright=0,Ibottom=0;
        var win_h = $(window).height();
        var doc_h = $(document).height();
        var scr_t = $(document).scrollTop();
        //console.log('scr_t:'+scr_t);
        //console.log('win_h:'+win_h);
        //console.log('off_top:'+off_top);
        //console.log('2*h:'+2*h);
        var chazhi =  2*h+off_top -win_h - scr_t;
        var bottom_chazhi = off_top - scr_t;
        if(click_num==0){
            if(2*h>h+off_top){
                Ibottom = h-off_top+6;
            }
            if(off_top+2*h>doc_h){
                Itop = h +6;
            }
            if(chazhi>-13&&(num==1||num==2)){
                console.log(chazhi);
                $(document).scrollTop(chazhi+scr_t+15);
            }
            if(chazhi>134&&(num==3||num==4)){
                $(document).scrollTop(chazhi+scr_t-119);
            }
            if(bottom_chazhi<h&&(num==3||num==4)){
                $(document).scrollTop(off_top-h-6);
            }
            if(scr_t>off_top&&(num==1||num==2)) {
                $(document).scrollTop(off_top);
            }
            //加载元素方式
            if(num==1||num==2){
                $(this).prepend(html);
            }else if(num==3||num==4){
                $(this).append(html);
            }
            var Bigimg =  $('.bigimg');
            $('.bigimg img').attr('src',imgurl);
            /*1:选左上角为基准点，2：选右上角为基准点，3：选左下角为基准点，4：选右下角为基准点*/
            switch (num){
                case '1': Bigimg.animate({'height':2*h,'width':2*w,'top':-Itop,'left':Ileft,'display':'block'},500);
                    break;
                case '2': Bigimg.animate({'height':2*h,'width':2*w,'top':-Itop,'right':Iright,'display':'block'},500);
                    break;
                case '3': Bigimg.animate({'height':2*h,'width':2*w,'bottom':-Ibottom,'left':Ileft,'display':'block'},500);
                    break;
                case '4': Bigimg.animate({'height':2*h,'width':2*w,'bottom':-Ibottom,'right':Iright,'display':'block'},500);
                    break;
                default:;
            }
            $(".bigimg img").animate({'height':2*h,'width':2*w});
            click_num = 1 ;
        }else{
            if(num==3||num==4){
                $('.bigimg').animate({'width':'0px','height':'0px','bottom':0},500,function(){
                    $(this).remove();
                });
            }else{
                $('.bigimg').animate({'width':'0px','height':'0px','top':0},500,function(){
                    $(this).remove();
                });
            }
            click_num = 0;
        }
    });
}