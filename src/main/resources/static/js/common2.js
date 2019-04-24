/**
 * Created by ZhangYE on 2016/5/10.
 */
$(function(){
	$('body').on('click','.m-tab>.tab-header>ul>li',function(){
        var count = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $(this).parent().parent().siblings('.tab-body').children().children('li').hide().eq(count).show();
        //触发tab页面切换事件
        $("body .m-tab").trigger("tabChange", [$(this).attr("target"),""]);  
    });
	
    //下载排行-改变颜色
    $('.rank-list li').each(function(){
        if($(this).index()<3){
            $(this).find('span').css('background-color','rgb(23, 144, 207)');
        }
    });
    
    //导航栏判断是否被选中
	var url = window.document.location.href;
	/*if (url.indexOf("catalog") > 0) {
		$(".nav-list>ul>li").eq(1).addClass("active");
	} else if (url.indexOf("map") > 0) {
		$(".nav-list>ul>li").eq(2).addClass("active");
	} else if (url.indexOf("analyse") > 0) {
		$(".nav-list>ul>li").eq(3).addClass("active");
	} else if (url.indexOf("relnet") > 0) {
		$(".nav-list>ul>li").eq(4).addClass("active");
	} else if (url.indexOf("appcenter") > 0) {
		$(".nav-list>ul>li").eq(5).addClass("active");
	} else if (url.indexOf("interact") > 0) {
		$(".nav-list>ul>li").eq(6).addClass("active");
	}else if (url.indexOf("developer") > 0) {
		$(".nav-list>ul>li").eq(7).addClass("active");
	}else{
		$(".nav-list>ul>li").eq(0).addClass("active");
	}*/
	if (url.indexOf("catalog") > 0) {
		$(".nav-list>ul>li").eq(1).addClass("active");
	} else if (url.indexOf("map") > 0) {
		$(".nav-list>ul>li").eq(2).addClass("active");
	}/* else if (url.indexOf("api") > 0) {
		$(".nav-list>ul>li").eq(2).addClass("active");
	} */else if (url.indexOf("analyse") > 0) {
		$(".nav-list>ul>li").eq(3).addClass("active");
	} else if (url.indexOf("relnet") > 0) {
		$(".nav-list>ul>li").eq(4).addClass("active");
	} else if (url.indexOf("appcenter") > 0) {
		$(".nav-list>ul>li").eq(5).addClass("active");
	}else if (url.indexOf("interact") > 0) {
		$(".nav-list>ul>li").eq(6).addClass("active");
	}else if (url.indexOf("developer/service") > 0) {
		$(".nav-list>ul>li").removeClass("active");
		$(".nav-list>ul>li").eq(8).addClass("active");
	}else if (url.indexOf("dev/developer") > 0) {
		$(".nav-list>ul>li").removeClass("active");
		$(".nav-list>ul>li").eq(7).addClass("active");
	}else if (url.indexOf("dev/document") > 0) {
		$(".nav-list>ul>li").removeClass("active");
		$(".nav-list>ul>li").eq(7).addClass("active");
	}else{
		$(".nav-list>ul>li").eq(0).addClass("active");
	}
	
	//判断浏览器版本
	var _uat=navigator.userAgent;
	if(_uat.indexOf("MSIE 6.0")>0)  
    {   
   		window.location.href = odweb+"/browser/download.htm";
    }   
    if(_uat.indexOf("MSIE 7.0")>0)  
   	{  
    	window.location.href = odweb+"/browser/download.htm";
   	}   
    
});
/** 轮播 **/
function carousel(cid,cstyle,ctime){
    if(cstyle==null){
        cstyle='fade';
    }
    if(ctime==null){
        ctime = 3000;
    }
    var caro_finish = true;
    var caro_width = parseInt($('#'+cid+' .caro-main ul li').css('width'));
    //tab点击切换
    $('#'+cid+' .caro-tab ul li').click(function(event) {
        var count_obj = $(this).index();//获取点击的是第几个
        var caro_now;//记录当前显示的是第几个
        var caro_show = $(this).parents('.carousel').find('.caro-main li');
        $(this).parents('.carousel').find('.caro-main li').each(function(){
            if($(this).css('display')!='none'){
                caro_now = $(this).index();
            }
        });
        if(caro_finish == true){
            if(cstyle=='fade'){
                if(caro_now!=count_obj){
                    caro_finish = false;
                    caro_show.fadeOut(500);
                    caro_show.eq(count_obj).fadeIn(500,callback);
                }
            }
            if(cstyle=='slide'){
                clearInterval(_interval);
                caro_finish = false;
                if(caro_now<count_obj){
                    caro_show.eq(count_obj).css('left',caro_width +'px').css('display','list-item');
                    caro_show.eq(caro_now).animate({left:-caro_width +'px'},1000);
                    caro_show.eq(count_obj).animate({left:0},1000,slidecall);
                }
                if(caro_now>count_obj){
                    caro_show.eq(count_obj).css('left',-caro_width +'px').css('display','list-item');
                    caro_show.eq(caro_now).animate({left:caro_width +'px'},1000);
                    caro_show.eq(count_obj).animate({left:0},1000,slidecall);
                }
            }
            $(this).siblings('li').removeClass('active');
            $(this).addClass('active');
        }
        function slidecall() {
            caro_show.eq(caro_now).hide(callback);
        }
    });
    //箭头点击切换
    $('#'+cid+' .caro-arrow div').click(function(event) {
        var arrow_obj = $(this).index();//获取点击的是哪个箭头
        var caro_now;//记录当前显示的是第几个
        var caro_next;//记录将要显示第几个
        var caro_show = $(this).parents('.carousel').find('.caro-main li');
        var tab_show = $(this).parents('.carousel').find('.caro-tab li');
        $(this).parents('.carousel').find('.caro-main li').each(function(){
            if($(this).css('display')!='none'){
                caro_now = $(this).index();
            }
        });
        if(arrow_obj==0){
            caro_next = caro_now - 1;
            if(caro_next<0){
                caro_next=caro_show.length - 1;
            }
        }
        if(arrow_obj==1){
            caro_next = caro_now + 1;
            if(caro_next==caro_show.length){
                caro_next=0;
            }
        }
        if(caro_finish == true){
            if(cstyle=='fade'){
                caro_finish = false;
                if(caro_now!=caro_next){
                    caro_show.fadeOut(500);
                    caro_show.eq(caro_next).fadeIn(500,callback);
                }
            }
            if(cstyle=='slide'){
                caro_finish = false;
                clearInterval(_interval);
                var slide_side;
                if(arrow_obj == 0){
                    caro_show.eq(caro_next).css('left',-caro_width +'px').css('display','list-item');
                    caro_show.eq(caro_now).animate({left:caro_width +'px'},1000);
                    caro_show.eq(caro_next).animate({left:0},1000,slidecall);
                }
                if(arrow_obj == 1){
                    caro_show.eq(caro_next).css('left',caro_width +'px').css('display','list-item');
                    caro_show.eq(caro_now).animate({left:-caro_width +'px'},1000);
                    caro_show.eq(caro_next).animate({left:0},1000,slidecall);
                }
            }
            tab_show.eq(caro_now).removeClass('active');
            tab_show.eq(caro_next).addClass('active');
        }
        function slidecall() {
            caro_show.eq(caro_now).hide(callback);
        }
    });
    //定时切换
    function carotime(){
        var caro_show = $('#'+cid+' .caro-main li');
        var tab_show = $('#'+cid+' .caro-tab li')
        var caro_now;
        var caro_next;
        caro_show.each(function(){
            if($(this).css('display')!='none'){
                caro_now = $(this).index();
            }
        });
        caro_next = caro_now + 1;
        if(caro_next==caro_show.length){
            caro_next=0;
        }
        if(caro_finish == true){
            if(cstyle=='fade'){
                caro_finish = false;
                caro_show.fadeOut(500);
                caro_show.eq(caro_next).fadeIn(500,callback);
            }
            if(cstyle=='slide'){
                caro_finish = false;
                var slide_side;
                caro_show.eq(caro_next).css('left',caro_width +'px').css('display','list-item');
                caro_show.eq(caro_now).animate({left:-caro_width +'px'},1000);
                caro_show.eq(caro_next).animate({left:0},1000,slidecall);
            }
            tab_show.eq(caro_now).removeClass('active');
            tab_show.eq(caro_next).addClass('active');
        }
        function slidecall() {
            caro_show.eq(caro_now).hide(callback);
        }
    }
    function callback() {
        clearInterval(_interval);
        _interval = setInterval(carotime,ctime);
        caro_finish = true;
    }
    _interval = setInterval(carotime,ctime);
}

//获取根路径
//js获取项目根路径，如： http://localhost:8083/uimcardprj
function getRootPath(){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return(localhostPaht+projectName);
}

/**
* 判断用户是否登录
*/
function isLogged(){
  var ssoToken = getCookie('sso_token');
	return ssoToken != null;
}

function showLoginDialog() {
	$('#bounceIn').click();
}
