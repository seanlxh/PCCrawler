var cars = [];
// require.config({
// 	paths : {
// 		'echarts' : '/static/js/echarts'
// 	}
// });

var url=location.href;
var tmp1=url.split("?")[1];
var tmp3=tmp1.split("=")[1];

	function showLine(id){
		$.ajax({
			type : "POST",
			url : getRootPath()+"/dev/developer/serviceDetail.do?method=GetRespData",
			data : {
				"service_id":id
			},
			dataType : "json",
			success : function(data) {
				if(null != data && data.length > 0){
					var xArray = new Array();
					var yArray = new Array();
					for(var i=0; i< data.length; i++){
						var obj = data[i];
						xArray.push(obj["name"]);
						yArray.push(obj["count"]);
					}
			    var line_option = {
			            tooltip : {
			                trigger: 'axis'
			            },
			            legend: {
			                data:['响应时间(单位：毫秒)']
			            },
			            calculable : true,
			            xAxis : [
			                {
			                    type : 'category',
			                    boundaryGap : false,
			                    data : xArray
			                }
			            ],
			            yAxis : [
			                {
			                    type : 'value',
			                    axisLabel : {
			                        formatter: '{value} ms'
			                    }
			                }
			            ],
			            series : [
			                {
			                    name:'响应时间(单位：毫秒)',
			                    type:'line',
			                    data:yArray,
			                    markPoint : {
			                        data : [
			                            {type : 'max', name: '最大值'},
			                            {type : 'min', name: '最小值'}
			                        ]
			                    },
			                    markLine : {
			                        data : [
			                            {type : 'average', name: '平均响应时间'}
			                        ]
			                    }
			                }
			            ]
			        };
				    require(['static/js/echarts','static/js/line'],function(ec, theme){
				        var lineChart = ec.init(document.getElementById("api-line"),theme);
				        lineChart.setOption(line_option);
				        $('.data-download').click(function(){
				            lineChart.clear();
				            lineChart.setOption(line_option);
				        });
				    });
				}
			},
			error : function(data) {
				easyDialog.open({
					container : {
						content : '网络异常'
					},
					autoClose : 2000
				});
			}
		});
	}


$(function(){
    $('.detail-collection').click(function(event) {
    	if($(this).hasClass('active')){
    		$.ajax({
    			type : "POST",
    			url : getRootPath()+"/dev/developer/ServiceDetail.do?method=CancelCollection",
    			data : {
    				"id":$("#serviceId").val(),
    				"obj_type":2,
    				"obj_name":$("#serviceTitle").val()
    			},
    			dataType : "json",
    			success : function(data) {
    				if(data.code=="000001"){
						$('#bounceIn').click();
					} else {
	    				dialog.info(data.msg,function(){
	    					if("000000" == data.code){
	    						$('.detail-collection').removeClass('active');
	    						$('.detail-collection').children('em').text('收藏');
	    					}
	    				},3000);
					}
    			},
    			error : function(data) {
    				dialog.info("网络忙，请稍后再试",function(){},3000);
    			}
    		});
    	}else{
    		$.ajax({
    			type : "POST",
    			url : getRootPath()+"/dev/developer/ServiceDetail.do?method=Collection",
    			data : {
    				"id":$("#serviceId").val(),
    				"obj_type":2,
    				"obj_name":$("#serviceTitle").val()
    			},
    			dataType : "json",
    			success : function(data) {
					if(data.code=="000001"){
						$('#bounceIn').click();
					} else {
	    				dialog.info(data.msg,function(){
	    					if("000000" == data.code){
	    						$('.detail-collection').addClass('active');
	    						$('.detail-collection').children('em').text('已收藏');
	    					}
	    				},3000);
					}
    			},
    			error : function(data) {
    				dialog.info("网络忙，请稍后再试",function(){},3000);
    			}
    		});
    	}
    });
})




function testService(id){
	window.location.href=getRootPath()+"/dev/developer/serviceTest.htm?service_id="+id;
}

function serviceApply(id){
	$.ajax({
		type : "POST",
		url : getRootPath()+"/dev/developer/serviceList.do?method=CheckLogin",
		data : {},
		dataType : "json",
		success : function(data) {
			if("1" == data || 1 == data){
				$('#bounceIn').click();
				//dialog.info("您尚未登录，请先登录",function(){},3000);
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
// var token = $.cookie('sso_token');
// var sso_token =escape(escape(token));
// var uc_nick_name = $.cookie('uc_nick_name');
// $("#jnIframe").attr("src","http://www.jndata.gov.cn/odweb/index.htm?uc_nick_name="+uc_nick_name+"&sso_token="+sso_token);
// $("#qdIframe").attr("src","http://data.qingdao.gov.cn/odweb/index.htm?uc_nick_name="+uc_nick_name+"&sso_token="+sso_token);
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
//
// $(function() {
//     var afterlogin = function(data){
//         var nick_name = getCookie("uc_nick_name");
//         if(nick_name!=null){
//             nick_name = decodeURIComponent(nick_name);
//             var loginhtml = '<span style="color:#2bc6ff;cursor:pointer" onclick="loginInfo()" id="loginInfo"></span>'+ nick_name + '<span style="color:#2bc6ff;"> | </span><span id="logout" onclick="logout()" style="color:#2bc6ff;cursor:pointer" >退出</span>';
//             if(document.getElementById('bounceIn')!= null){
//                 document.getElementById('bounceIn').style.display = "none";
//                 document.getElementById('bounceRe').style.display = "none";
//             }
//             $(".m-login").html(loginhtml);
//         }
//     }
//
//     // var loginDialog = new UCLoginDialog({
//     //     ucweb: $('#uc_home_url').val(),
//     //     go: 'http://127.0.0.1/odweb',
//     //     afterlogin: afterlogin
//     // });
//
// //     $('#bounceIn').on("click",
// //         function() {
// // // 	   loginDialog.login();
// //             window.location.href="http://zwfw.sd.gov.cn/sdsfjis/front/login.do?uuid=ihxm0K163isC"
// //             var href=window.location.href;
// //             var str=decodeURIComponent($.trim(href));
// //             $.cookie('callbackUrl', str,{path:'/',domain:'.sd.gov.cn'});
// //         })
// //
// //
//  });

$(document).ready(function(){
    $.ajax({
        type : "GET",
        url : "/DataSource/showDataSourceByID",
        data : {"id":tmp3},
        dataType : "json",
        success : function(data) {
            document.getElementById("api-detailname").innerHTML=data.dsDesc
            document.getElementById("detail-titlename").innerHTML=data.dsName
            document.getElementById("detail-simple-info").innerHTML="<div>接口状态："+data.state+"</div>" +
                "            <div>提供部门：</div>" +
                "            <div>服务简介："+data.dsName+"</div>" +
				" <div class=\"detail-count\" id=\"detail-count\">" +
                "<span>调用次数：</span>" +
                "<span>连接应用数：1</span>" +
                " <span>最近更新时间："+data.timestamp+"</span>" +
                "                        </div>"
        },
        error : function(data) {
            dialog.info("网络忙，请稍后再试",function(){},3000);
        }
    });
    $.getJSON('/inputPara/inputPara',{'id': tmp3},function(ret){
        var content =  '';
        content += ('<div>私有参数</div><tbody><table>' +
            '<thead>' +
            '<tr>' +
            '<th width="25%">参数名称</th>' +
            '<th width="15%">是否必须</th>' +
            '<th width="10%">类型</th>' +
            '<th width="50%">描述</th>' +
            '</tr>' +
            '</thead>');
        for (var i=0; i<ret.length; i++){
            content += ('<tr> <td><span>'+ret[i].name+'</span></td> <td><span>必填</span></td> <td><span>'+ret[i].type+'</span></td> <td><span>'+ret[i].des+'</span></td> </tr>');
        }
        content += '</tbody> </table>';
        $("#privateapi_table").html(content);
    })



    $.getJSON('/task/getTaskByID',{"id":tmp3},function(ret){
        var template = "<table>\n" +
            "<thead>" +
            "<tr>" +
            "                                                                        <th width=\"15%\">任务ID</th>" +
            "                                                                        <th width=\"15%\">数据源ID</th>" +
            "                                                                        <th width=\"15%\">状态</th>" +
            "                                                                        <th width=\"15%\">创建人</th>" +
            "                                                                        <th width=\"15%\">创建时间</th>" +
            "                                                                        <th width=\"25%\">操作</th>" +
            "                                                                    </tr>" +
            "                                                                    </thead>" +
            "                                                                    <tbody>"
        for (var i=0; i<ret.length; i++){
            template += ("<tr>");
            template += ("<td>"+ ret[i].taskID +"</td>");
            template += ("<td>"+ ret[i].dsID +"</td>");
            template += ("<td>"+ ret[i].state +"</td>");
            template += ("<td>"+ ret[i].userName +"</td>");
            template += ("<td>"+ ret[i].timestamp +"</td>");
            if(ret[i].state == 1)
                template += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="pauseTask('+ret[i].taskID+')">暂停</button>&nbsp&nbsp&nbsp<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#jsonModal" onClick="finishTask('+ret[i].taskID+')">结束</button>&nbsp&nbsp&nbsp<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#jsonModal" onClick="deleteTask('+ret[i].taskID+')">删除</button></td>';
            else if(ret[i].state == 2)
                template += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="continueTask('+ret[i].taskID+')">继续</button>&nbsp&nbsp&nbsp<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#jsonModal" onClick="finishTask('+ret[i].taskID+')">结束</button>&nbsp&nbsp&nbsp<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#jsonModal" onClick="deleteTask('+ret[i].taskID+')">删除</button></td>';
            else if(ret[i].state == 3)
                template += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="taskInfo('+ret[i].taskID+')">查看详情</button>&nbsp&nbsp&nbsp<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#jsonModal" onClick="deleteTask('+ret[i].taskID+')">删除</button></td>';

        }
        template += ("</tr> </tbody>" +
            "</table>");
        document.getElementById("api-table").innerHTML=template ;
    })
})

function pauseTask(id){
    $("#json-result").html('检索中');
    $.getJSON('/collection/pause',{'id': id},function(ret){
        $("#json-result").html(ret.msg);
        refreshTask();
    })
    return;
}
function continueTask(id){
    $("#json-result").html('检索中');
    $.getJSON('/collection/continue',{'id': id},function(ret){
        $("#json-result").html(ret.msg);
        refreshTask();
    })
    return;
}
function finishTask(id){
    $("#json-result").html('检索中');
    $.getJSON('/collection/stop',{'id': id},function(ret){
        $("#json-result").html(ret.msg);
        refreshTask();
    })
    return;
}

function taskInfo(id) {
    $("#json-result").html('检索中');
    $.getJSON('/collection/getFinishTime',{'id': id},function(ret){
        $("#json-result").html("结束时间："+ret.msg);
    })
    return;
}


function getPara(){
    $("#json-result").html('检索中');
    while(cars.length!=0){
        cars.pop();
    }
    var id = tmp3
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

function getPara(){
    $("#json-result").html('检索中');
    while(cars.length!=0){
        cars.pop();
    }
    var id = tmp3
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
function getExecute(){
    $("#json-result").html('检索中');
    while(cars.length!=0){
        cars.pop();
    }
    var id = tmp3
    $.getJSON('/inputPara/inputPara',{'id': id},function(ret){
        var content =  '';
        // content += ('<input type="text" name="id" value= "'+id+'"id="para" class="form-control" style="visibility: hidden;margin-top: opx;"/>');
        for (var i=0; i<ret.length; i++){
            content += ("<br>参数名："+ ret[i].name + "      类型："+ret[i].type+"      描述："+ret[i].des+"</br>");
            content += ('<input type="text" name="'+ret[i].name+'" id="'+ret[i].name+'" class="form-control" style="width: 280px;" placeholder=""/>');
            cars.push(ret[i].name);
        }
        content += '<button type="button" class="btn btn-primary" onClick="loadXMLDoc('+id+')">调用</button>';
        $("#json-result").html(content);
    })
}

function loadXMLDoc(id)
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
    var url='/collection/collection?id='+id;
    for(var i = 0 ;i < cars.length; i ++){
        url += '&'+cars[i]+'='+document.getElementById(cars[i]).value;
    }
    xmlhttp.open("GET",url,true);
    xmlhttp.send();
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
