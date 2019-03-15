var cars = [];
//组织结构初始化
function getOrg(index){
	var listorg;
	if(index==1){
		 listorg = $("#A-G");
	}
	if(index==2){
		 listorg = $("#H-N");
	}
	if(index==3){
		 listorg = $("#O-T");
	}
	if(index==4){
		 listorg = $("#U-Z");
	}
	$.ajax({
		url: getRootPath()+"/dev/developer/serviceList.do?method=queryOrgList",
		type: "POST",
		data: {
			"value": index			
		},
		success: function(data) {
			if(data!=""&&data!=null){
				var html = "";
				for (var i = 0; i < data.length; i++) {
					var obj = data[i];
					var org_name = obj.short_name;
					var short_name = org_name.substring(org_name.indexOf("市"));
					html = html + "<li title='"+org_name+"' rel='"+obj.org_code+"'>"+short_name+"</a></li>";
				}
				listorg.html(html);
			}else{
				listorg.html("");
			}
		},
		error: function(data) {
			// easyDialog.open({
			// 	container : {
			// 		content : '未设定组织'
			// 	},
			// 	autoClose : 2000
			// });
		},dataType:"json"
    });
}

function loadXMLDoc1(id)
{
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        // IE6, IE5 浏览器执行代码
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            var obj = xmlhttp.responseText;
            $("#json-result").html(obj);
        }
    }
    var url='/execute/execute?id='+id;
    for(var i = 0 ;i < cars.length; i ++){
        url += '&'+cars[i]+'='+document.getElementById(cars[i]).value;
    }
    xmlhttp.open("GET",url,true);
    xmlhttp.send();
}

//打开调用页面
function ontest(id){
    $("#json-result").html('检索中');
    while(cars.length!=0){
        cars.pop();
    }
    $.getJSON('/inputPara/inputPara',{'id': id},function(ret){
        var content =  '';
        content += ('<input type="text" name="id" value= "'+id+'"id="para" class="form-control" style="visibility: hidden;margin-top: opx;"/>');
        for (var i=0; i<ret.length; i++){
            content += ("<br>参数名："+ ret[i].name + "      类型："+ret[i].type+"      描述："+ret[i].des+"</br>");
            content += ('<input type="text" name="'+ret[i].name+'" id="'+ret[i].name+'" class="form-control" style="width: 280px;" placeholder=""/>');
            cars.push(ret[i].name);
        }
        content += '<button type="button" class="btn btn-primary" onClick="loadXMLDoc1('+id+')">调用</button>';
        $("#json-result").html(content);
    })
}

/**
 * 用户收藏操作
 * @param id 收藏对象Id
 * @param type 收藏对象类型 数据目录、服务、应用
 * @param name 收藏对象名称
 */
function collection(id,type,name){
	$.ajax({
		type : "POST",
		url : getRootPath()+"/dev/developer/serviceDetail.do?method=Collection",
		data : {
			"id":id,
			"obj_type":type,
			"obj_name":name
		},
		dataType : "json",
		success : function(data) {
			if(data.code=="000001"){
				$('#bounceIn').click();
			}else{
				dialog.info(data.msg,function(){
					if(data.code=="000000"){
						document.getElementById("cancleCollection"+id).style.display = '';
						document.getElementById("collection"+id).style.display = 'none';
					}
				},3000);
			}
		},
		error : function(data) {
			dialog.info("网络忙，请稍后再试",function(){},3000);
		}
	});
}

function cancleCollection(id,type,name){
	$.ajax({
		type : "POST",
		url : getRootPath()+"/dev/developer/serviceDetail.do?method=CancelCollection",
		data : {
			"id":id,
			"obj_type":type,
			"obj_name":name
		},
		dataType : "json",
		success : function(data) {
			dialog.info(data.msg,function(){
				if(data.code=="000000"){
					document.getElementById("cancleCollection"+id).style.display = 'none';
					document.getElementById("collection"+id).style.display = '';
				}
			},3000);
		},
		error : function(data) {
			dialog.info("网络忙，请稍后再试",function(){},3000);
		}
	});
}

//服务申请
function serviceApply(id){
	$.ajax({
		type : "POST",
		url : getRootPath()+"/dev/developer/serviceList.do?method=CheckLogin",
		data : {},
		dataType : "json",
		success : function(data) {
			if("1" == data || 1 == data){
				$('#bounceIn').click();
			}else if("2" == data || 2 == data){
				dialog.info("请先认证成为平台开发者",function(){
					location.href=getRootPath()+"/dev/console/developer.htm";
				},3000);
			}else{
				//跳转服务申请页面
				location.href = getRootPath()+"/dev/console/serviceApply.htm?service_id="+id;
			}
		},
		error : function(data) {
			dialog.info("网络忙，请稍后再试",function(){},3000);
		}
	});
}


//分页方法
var pageselectCallback = function(page_id, jq) {
	queryResByPage(page_id + 1);
	//执行查询，展现分页内容
};
//创建分页元素
var reloadPage = function(totlePage) {
	$("#Pagination").pagination(totlePage, {
		num_edge_entries: 2,
		num_display_entries: 4,
		items_per_page:8,
		callback: pageselectCallback
		//回调函数
	});
};
var queryResByPage = function(page) {
	
	dialog.loading({text:'加载中',parent:$('#cata-main')});
	var subjectId = $("#subjectId").val();
	var orgId = $("#orgId").val();
	var orderType = $("#orderType").val();
	var key = $("#key").val();
	var pageSize = 8; //每页显示条数初始化，修改显示条数，修改这里即可
	//ajax请求，并初始化资源列表
	$.ajax({
		url: "/getPageList",
		type: "POST",
		data: {
			"subjectId": subjectId,
			"orgId": orgId,
			"orderType":orderType,
			"page": page,
			"pageSize": pageSize,
			"key":key
		},
		success: function(root) {
			$('#cata-main>.dialog-loading').modal('hide');
			if(root!=""&&root!=null){
				var html = "";
              for (var i = 0; i < root.data.length; i++) {
            	    var obj = root.data[i];
            	    html = html +"<li class='cata-item'>";
            	    html = html +"    <div class='item-icon'><i class='glyphicon'>&#x2601;</i></div>";
            	    html = html +"    <div class='item-content'>";
            	    html = html +"        <div class='item-header'>";
            	    html = html +"            <div class='item-operation'>";
            	    html = html +"                <ul>";
            	    var isFav = obj.isCol;
            	    if(isFav==1){
            	    	html = html +"                    <li onclick=\"cancleCollection('"+obj.service_id+"',2,'"+obj.service_name+"')\" id='cancleCollection"+obj.service_id+"' style='color:#DAA520'><i class='iconfont'>&#xe006;</i>已收藏</li>";
            	    	html = html +"                    <li onclick=\"collection('"+obj.service_id+"',2,'"+obj.service_name+"')\" id='collection"+obj.service_id+"' style='display:none;'><i class='iconfont'>&#xe006;</i>收藏</li>";
            	    }else{
            	    	html = html +"                    <li onclick=\"collection('"+obj.service_id+"',2,'"+obj.service_name+"')\" id='collection"+obj.service_id+"'><i class='iconfont'>&#xe006;</i>收藏</li>";
            	    	html = html +"                    <li onclick=\"cancleCollection('"+obj.service_id+"',2,'"+obj.service_name+"')\" id='cancleCollection"+obj.service_id+"' style='display:none;color:#DAA520'><i class='iconfont'>&#xe006;</i>已收藏</li>";
            	    }
            	    //html = html +"                    <li onclick=\"collection('"+obj.service_id+"',2,'"+obj.service_name+"')\"><i class='iconfont'>&#xe691;</i>收藏</li>";
            	    html = html +"                    <li data-toggle=\"modal\" class='btn btn-default' data-target=\"#jsonModal\" onclick=\"ontest('"+obj.dsId+"')\" ><i class='iconfont'>&#xe065;</i>测试</li>";
            	    html = html +"                    <li href='/index/serviceDetail?service_id="+obj.dsId+"' ><i class='iconfont'>&#xe129;</i>配置</li>";
            	    html = html +"                </ul>";
            	    html = html +"            </div>";
            	    html = html +"            <div class='item-title'>";
            	    html = html +"                <a href='/index/serviceDetail?service_id="+obj.dsId+"' target='_blank'>"+obj.dsName+"</a>";
            	    html = html +"            </div>";
            	    html = html +"        </div>";
            	    html = html +"        <div class='item-body'>";
            	    html = html +"<div class='item-info'>";
            	    if(obj.state = 1)
            	    	html = html +"    <div class='item-theme'>接口状态：正常 </div>";
            	    else if(obj.state = 2)
                        html = html +"    <div class='item-theme'>接口状态：停用 </div>";
            	    html = html +"    <div class='item-text'>";
            	    html = html +"        <span>提供人："+obj.org_name+"</span>";
            	    html = html +"        <span>调用次数："+obj.total_visits_count+"</span>";
            	    html = html +"        <span>连接应用数："+"1"+"</span>";
            	    html = html +"        <span>创建时间："+obj.timestamp+"</span>";
            	    html = html +"    </div>";
            	    if("null" != obj.service_desc && null != obj.service_desc){
            	    	 html = html +"    <div>"+obj.service_desc+"</div>";
            	    }
            	    html = html +"</div>";
            	    html = html +"        </div>";
            	    html = html +"    </div>";
            	    html = html +"</li>";
              }
              $("#apiList").html(html);
				//获取总页码
				$("#record_count").html("共"+root.count+"个API");
                $("#json-result").html("as");
				if (root.count>pageSize) {
					if(page == 1){
						reloadPage(root.count);
					}
				}else{
					$("#Pagination").empty();
				}
				if(root.count <= 0){
					$("#Pagination").html("暂无数据");
					$("#record_count").html("共0个API");
				}
			}else{
				if (page == 1) {
					$("#Pagination").html("暂无数据");
				}
				$("#record_count").html("共0个API");
			}
		},
		error: function(data) {
  			dialog.info('请求失败，请稍后重试',function(){},3000);
  			$('#cata-main>.dialog-loading').modal('hide');
		},dataType:"json"
	});
};



$(function() {
    var afterlogin = function(data){
        var nick_name = getCookie("uc_nick_name");
        if(nick_name!=null){
            nick_name = decodeURIComponent(nick_name);
            var loginhtml = '<span style="color:#2bc6ff;cursor:pointer" onclick="loginInfo()" id="loginInfo" ">'+ nick_name + '</span><span style="color:#2bc6ff;"> | </span><span id="logout" onclick="logout()" style="color:#2bc6ff;cursor:pointer" >退出</span>';
            if(document.getElementById('bounceIn')!= null){
                document.getElementById('bounceIn').style.display = "none";
                document.getElementById('bounceRe').style.display = "none";
            }
            $(".m-login").html(loginhtml);
        }
    }

    var loginDialog = new UCLoginDialog({
        ucweb: $('#uc_home_url').val(),
        go: 'http://127.0.0.1/odweb',
        afterlogin: afterlogin
    });

    $('#bounceIn').on("click",
        function() {
// 	   loginDialog.login();
            window.location.href="http://zwfw.sd.gov.cn/sdsfjis/front/login.do?uuid=ihxm0K163isC"
            var href=window.location.href;
            var str=decodeURIComponent($.trim(href));
            $.cookie('callbackUrl', str,{path:'/',domain:'.sd.gov.cn'});
        })

    /* var region_name = getCookie("region_name");
    region_name = decodeURIComponent(region_name);
    if(region_name!=''&&region_name!=null){
        document.getElementById("region_name").innerHTML = region_name;
        document.getElementById("region_name").style.display = "none";
    } */
});

var token = $.cookie('sso_token');
var sso_token =escape(escape(token));
var uc_nick_name = $.cookie('uc_nick_name');
$("#jnIframe").attr("src","http://www.jndata.gov.cn/odweb/index.htm?uc_nick_name="+uc_nick_name+"&sso_token="+sso_token);
$("#qdIframe").attr("src","http://data.qingdao.gov.cn/odweb/index.htm?uc_nick_name="+uc_nick_name+"&sso_token="+sso_token);
//登录信息
function loginInfo(){
    var reginUrl = $("#uc_home_url").val() + "/uc/account/account.htm";
    window.location.href = reginUrl;
}

function logout(){
    $("#jnIframe").attr("src","http://www.jndata.gov.cn/odweb/logout.htm");
    $("#qdIframe").attr("src","http://data.qingdao.gov.cn/odweb/logout.htm");
    var logoutUrl = $("#logoutUrl").val();
    var dataUrl = $("#dataUrl").val();
    $.ajax({
        type : "get",
        url : logoutUrl,
        data:{callback_url:dataUrl+"/index.htm"},
        success : function(data) {
            dialog.info(data.substring(0,7),function(){},2000);
            $("#refushhtml").html(data);
        },
        error : function(e) {
            dialog.info("网络异常",function(){},2000);
        }
    });
}

$(function(){

    $("#searchButton").click(function(){
        var flag = checkSearch();
        if(flag){
            $("#searchFormat").submit();
        }

    });

    //注册
    $('#bounceRe').on("click",
        function() {
            var reginUrl = $("#register_url").val();
// 				window.location.href = reginUrl;
            var href=window.location.href;
            var str=decodeURIComponent($.trim(href));
            $.cookie('callbackUrl', str,{path:'/'});
            window.location.href="http://zwfw.sd.gov.cn/sdsfjis/front/register/register.do?uuid=ihxm0K163isC"
        });
});

function checkSearch(){
    var searchAllKey = $("#searchAllKey").val();

    if(null == searchAllKey || "" == searchAllKey || typeof(searchAllKey) == undefined){
        dialog.info("搜索关键字不能为空",function(){},2000);
        return false;
    }
    return true;
};
