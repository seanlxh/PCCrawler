/**
* 获取特定cookie的值
*/
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) 
    return parts.pop().split(";").shift();

  return null;
}

function getSrceenWH() {
	w = $(window).width();
	h = $(window).height();
	$('#dialogBg').width(w).height(h);
}

/**
 * 用户登录窗口
 */
function UCLoginDialog(config) {
	
	this.config = $.extend(this.config, config);

    this.loginAction = this.config.ucweb + '/uc/login/Login.do?method=login&callbackparam=?';
    this.verifyImg = this.config.ucweb + '/uc/index/verify.htm';
    this.signUp = this.config.ucweb + '/uc/index/signup.htm';
    this.web_getpwd = this.config.ucweb + '/uc/password/getPwd.htm';
    this.weibobtn = this.config.ucweb + '/img/uc/login/weibobtn.png';
    this.qqbtn = this.config.ucweb + '/img/uc/login/qqbtn.png';
    this.qqurl = this.config.ucweb + '/uc/login/login.do?method=otherLogin&type=qq';
    this.dlgHtml = [
            '<style>',
            '.modal-dialog{',
            'z-index:1050;',
            '}</style>',
    		'<div id="dialogBg"></div>',
    		'<div id="dialog" style="padding: 0px;">',
    		'<form id="login_form" action="<?=loginAction?>"  method="post" onkeydown="if(event.keyCode==13){return false;}">',
    		'<div class="loginBox">',
    		'<div class="loginBoxCenter">',
    		'<div class="loginTitle">',
    		'<a href="javascript:;" class="claseDialogBtn"  onclick="closebtn()" ><div class="closebutton">关闭</div></a>',
    		'</div>',
    		'<p><label for="username">用户账号：</label></p>',
    		'<p><input type="text" id="account" name="account" class="loginInput" autofocus="autofocus" required="required" autocomplete="off" placeholder="" value="" /></p>',
    		'<p><label for="password">密码：</label></p>',
    		'<p style="position:relative;"><input type="password" id="password" name="password" class="loginInput" required="required" autocomplete="off" placeholder="" value="" />',
    		'<a href="<?=web_getpwd?>" class="forgetLink" style="position:absolute;top:-30px;right:0;width:60px;">忘记密码?</a></p>',
    		'<input id="pwd" name="pwd" type="hidden" value="">',
    		'<input id="is_internal_web" name="is_internal_web" type="hidden" value="open">',
    		'</div>',
    		'<div class="loginBoxButtons">',
    		'<input id="remember" type="checkbox" name="remember" value="1" />',
    		'<label for="remember">记住登录状态</label>',
    		'<button class="reginBtn" id="reginbutton" onclick="reginbtn()" style="margin-top:0px"/>',
    		'<button class="loginBtn" type="button" id="btn_submit"></button>',
    		'<div class="threelogin">',
    		'<span>使用第三方帐号登录</span>',
    		'<a title="使用Sina微博账号登录" href="javascript:;" temphref="+this._ucURL+/uc/login/login.do?method=otherLogin&type=sina" hideFocus="hidefocus">',
    		'<img src="<?=weibobtn?>" alt=""></a>',
    		'<a title="使用QQ账号登录" href="<?=qqurl?>" hideFocus="hidefocus">',
    		'<img src="<?=qqbtn?>" alt=""></a>',
    		'</div>',
    		'</div>',
    		'</div>',
    		'</form>',
    		'</div>'
        ].join('');
    //alert(this.dlgHtml);
    //$("#loginheader").append(this.dlgHtml);
    // 绑定事件
    this.bindEvent();
    // 过滤ajax请求
    //this.interceptor();
    
    this.config.afterlogin();
}

$(function(){
	getSrceenWH();
})

function closebtn(){
	$('#dialogBg').fadeOut(300, function() {
		$('#dialog').addClass('bounceOutUp').fadeOut();
		$('#dialogBg').fadeOut();
	});
}

function reginbtn(){
	var register_url = $("#register_url").val();
	location.href = register_url;
}

/**
* 认证请求的配置
*/
UCLoginDialog.prototype.ajaxConfig = function() {
	var account = document.getElementById("account").value;
    var $this = this;
    return {
        dataType: "jsonp",
        jsonp: "callbackparam",
        async: false,
		success : function(data) {
			if (data&&data.res == "1") {
				if(data!=null&&data!=""){
					//document.cookie = "sso_token=" + encodeURIComponent(data.sso_token) +";path=/";
					//document.cookie = "uc_nick_name=" + encodeURIComponent(data.uc_nick_name) +";path=/";
					 $this.config.afterlogin();
				}
			}else if(data.res == "-5"){
				dialog.info("用户不存在",function(){
				},2000);
			}else if(data.res == "-1"){
				dialog.info("用户名或密码错误",function(){
				},2000);
			}else if(data.res == "6"){
				dialog.info("该用户密码已经过期,请及时联系管理员",function(){
				},2000);
			}else if(data.res == "7"){
				dialog.info("该用户已经在线,不能重复登录",function(){
				},2000);
			}else if(data.res == "8"){
				dialog.info("该用户是内网用户,您不能登录",function(){
				},2000);
			}else if(data.res == "0"){
				dialog.info("该用户尚未激活,请激活后重新登录",function(){
				},2000);
			}else if(data.res == "2"){
				dialog.info("账号被锁定，请稍后重试",function(){
				},2000);
			}else{
				dialog.info("登录失败",function(){
				},2000);
			}
			return false;
		},
        error: function() {
            $("#btn_submit").removeAttr("disabled");
            $("#btn_submit").removeClass("disabled");
			dialog.info("登录失败",function(){
			},2000);
        }
    }
};

/**
* 触发事件
*/
UCLoginDialog.postEvent = function(event, data) {
    $('body').trigger(event, [data]);
}

/**
* 提交表单
*/
UCLoginDialog.prototype.okSubmit = function() {
    if ($.trim($('#account').val()) == "") {
        //$("#account").tipBox({ tips: "请输入用户名！" });
		dialog.info("请输入用户名！",function(){
		},1000);
        return;
    }
    if ($.trim($('#password').val()) == "") {
        //$("#password").tipBox({ tips: "请输入密码！" });
		dialog.info("请输入密码！",function(){
		},1000);
        return;
    }
    var password = $('#password').val();
    var login_salt = $('#login_salt').val();
    $("#pwd").val(toMD5Str(toMD5Str(password) + login_salt));
    $('#RelayState').val(this.config.go);
	$("#dialog").hide();
	$("#dialogBg").hide();
    $("#login_form").ajaxSubmit(this.ajaxConfig());
};

/**
* 绑定事件
*/
UCLoginDialog.prototype.bindEvent = function() {
	$this = this;
    $('body').on('keydown', '#password', function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) { // enter 键
            $this.okSubmit();
        }
    })

    .on('keydown', '#verify', function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) { // enter 键
            $this.okSubmit();
        }
    })

    .on('click', '#btn_submit', function() {
        $this.okSubmit();
    })

    .on('click', '#verifyImg', function() {
        var img = $(this);
        var date = new Date();
        var ttime = date.getTime();
        img.attr('src', $this.verifyImg + '&_=' + ttime);
    })
    
    .on('shown.bs.modal', '#loginDialog', function() {
    	
    })
    .on('hidden.bs.modal', '#loginDialog', function() {

    });
};

/**
* 弹出登录框，强制用户登录
*/
UCLoginDialog.prototype.login = function(config) {
    $this = this;
    if ($('#loginDialog').length == 0) {

        var render = template.compile($this.dlgHtml);
        var html = render({
            loginAction: $this.loginAction,
            verifyImg: $this.verifyImg,
            web_getpwd: $this.web_getpwd,
            weibobtn: $this.weibobtn,
            qqbtn: $this.qqbtn,
            qqurl: $this.qqurl,
            signUpUrl: $this.signUp
        });
        $("body").append(html);
    }
    
	className = $(this).attr('class');
	$('#dialogBg').fadeIn(300);
	$('#dialog').removeAttr('class').addClass('animated ' + className + '').fadeIn();
	
//    var login_fail_time = 3;
//    if (login_fail_time >= 1) {
//        document.getElementById('verify_code_div').style.display = "block";
//    } else {
//        document.getElementById('verify_code_div').style.display = "none";
//    }
};

/**
* 判断用户是否登录
*/
UCLoginDialog.prototype.isLogged = function() {

  var ssoToken = getCookie('sso_token');
	return ssoToken != null;
}


/**
* 拦截未经授权的ajax请求
*/
UCLoginDialog.prototype.interceptor = function() {
	var s_ajaxListener = new Object(), that = this;
	s_ajaxListener.tempSend = XMLHttpRequest.prototype.send;
	s_ajaxListener.tempOpen = XMLHttpRequest.prototype.open;
	
	// 检测是否登录
	s_ajaxListener.beforesend = function() {
		var isLogged = that.isLogged();
		return isLogged;
	}

	XMLHttpRequest.prototype.open = function(method, url) {
		this.requestURL = url;
		return s_ajaxListener.tempOpen.apply(this, arguments);
	};

	XMLHttpRequest.prototype.send = function(data) {

		// 如果是登录地址，则直接请求，不检测是否登录
		var url = this.requestURL;
		if (url && url.indexOf(that.loginAction) != -1) {
			s_ajaxListener.tempSend.apply(this, arguments);
			return;
		}

		var canSend = s_ajaxListener.beforesend();
		if (!canSend) {
			that.login();
			return;
		}

		s_ajaxListener.tempSend.apply(this, arguments);
	}
}