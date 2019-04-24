/*!
 * jQuery Json Plugin (with Transition Definitions)
 * Examples and documentation at: http://json.cn/
 * Copyright (c) 2012-2013  China.Ren.
 * Version: 1.0.2 (19-OCT-2013)
 * Dual licensed under the MIT and GPL licenses.
 * http://jquery.malsup.com/license.html
 * Requires: jQuery v1.3.1 or later
 */
var cars = [];
var pageSize = 15;    //每页显示的记录条数
var curPage=0;        //当前页
var lastPage;        //最后页
var direct=0;        //方向
var len;            //总行数
var page;            //总页数
var begin;
var end;
var User;


var pageSizert = 15;    //每页显示的记录条数
var curPagert=0;        //当前页
var lastPagert;        //最后页
var directrt=0;        //方向
var lenrt;            //总行数
var pagert;            //总页数
var beginrt;
var endrt;


var pageSizepz = 15;    //每页显示的记录条数
var curPagepz=0;        //当前页
var lastPagepz;        //最后页
var directpz=0;        //方向
var lenpz;            //总行数
var pagepz;            //总页数
var beginpz;
var endpz;

var JSONFormat = (function(){
    var _toString = Object.prototype.toString;

    function format(object, indent_count){
        var html_fragment = '';
        switch(_typeof(object)){
            case 'Null' :0
                html_fragment = _format_null(object);
                break;
            case 'Boolean' :
                html_fragment = _format_boolean(object);
                break;
            case 'Number' :
                html_fragment = _format_number(object);
                break;
            case 'String' :
                html_fragment = _format_string(object);
                break;
            case 'Array' :
                html_fragment = _format_array(object, indent_count);
                break;
            case 'Object' :
                html_fragment = _format_object(object, indent_count);
                break;
        }
        return html_fragment;
    };

    function _format_null(object){
        return '<span class="json_null">null</span>';
    }

    function _format_boolean(object){
        return '<span class="json_boolean">' + object + '</span>';
    }

    function _format_number(object){
        return '<span class="json_number">' + object + '</span>';
    }

    function _format_string(object){
        object = object.replace(/\</g,"&lt;");
        object = object.replace(/\>/g,"&gt;");
        if(0 <= object.search(/^http/)){
            object = '<a href="' + object + '" target="_blank" class="json_link">' + object + '</a>'
        }
        return '<span class="json_string">"' + object + '"</span>';
    }

    function _format_array(object, indent_count){
        var tmp_array = [];
        for(var i = 0, size = object.length; i < size; ++i){
            tmp_array.push(indent_tab(indent_count) + format(object[i], indent_count + 1));
        }
        return '<span data-type="array" data-size="' + tmp_array.length + '"><i  style="cursor:pointer;" class="fa fa-minus-square-o" onclick="hide(this)"></i>[<br/>'
            + tmp_array.join(',<br/>')
            + '<br/>' + indent_tab(indent_count - 1) + ']</span>';
    }

    function _format_object(object, indent_count){
        var tmp_array = [];
        for(var key in object){
            tmp_array.push( indent_tab(indent_count) + '<span class="json_key">"' + key + '"</span>:' +  format(object[key], indent_count + 1));
        }
        return '<span  data-type="object"><i  style="cursor:pointer;" class="fa fa-minus-square-o" onclick="hide(this)"></i>{<br/>'
            + tmp_array.join(',<br/>')
            + '<br/>' + indent_tab(indent_count - 1) + '}</span>';
    }

    function indent_tab(indent_count){
        return (new Array(indent_count + 1)).join('&nbsp;&nbsp;&nbsp;&nbsp;');
    }

    function _typeof(object){
        var tf = typeof object,
            ts = _toString.call(object);
        return null === object ? 'Null' :
            'undefined' == tf ? 'Undefined'   :
                'boolean' == tf ? 'Boolean'   :
                    'number' == tf ? 'Number'   :
                        'string' == tf ? 'String'   :
                            '[object Function]' == ts ? 'Function' :
                                '[object Array]' == ts ? 'Array' :
                                    '[object Date]' == ts ? 'Date' : 'Object';
    };

    function loadCssString(){
        var style = document.createElement('style');
        style.type = 'text/css';
        var code = Array.prototype.slice.apply(arguments).join('');
        try{
            style.appendChild(document.createTextNode(code));
        }catch(ex){
            style.styleSheet.cssText = code;
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    loadCssString(
        '.json_key{ color: #92278f;font-weight:bold;}',
        '.json_null{color: #f1592a;font-weight:bold;}',
        '.json_string{ color: #3ab54a;font-weight:bold;}',
        '.json_number{ color: #25aae2;font-weight:bold;}',
        '.json_link{ color: #717171;font-weight:bold;}',
        '.json_array_brackets{}');

    var _JSONFormat = function(origin_data){
        //this.data = origin_data ? origin_data :
        //JSON && JSON.parse ? JSON.parse(origin_data) : eval('(' + origin_data + ')');
        this.data = JSON.parse(origin_data);
    };

    _JSONFormat.prototype = {
        constructor : JSONFormat,
        toString : function(){
            return format(this.data, 1);
        }
    }

    return _JSONFormat;

})();
var last_html = '';
function hide(obj){
    var data_type = obj.parentNode.getAttribute('data-type');
    var data_size = obj.parentNode.getAttribute('data-size');
    obj.parentNode.setAttribute('data-inner',obj.parentNode.innerHTML);
    if (data_type === 'array') {
        obj.parentNode.innerHTML = '<i  style="cursor:pointer;" class="fa fa-plus-square-o" onclick="show(this)"></i>Array[<span class="json_number">' + data_size + '</span>]';
    }else{
        obj.parentNode.innerHTML = '<i  style="cursor:pointer;" class="fa fa-plus-square-o" onclick="show(this)"></i>Object{...}';
    }

}

function show(obj){
    var innerHtml = obj.parentNode.getAttribute('data-inner');
    obj.parentNode.innerHTML = innerHtml;
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


function getpara(id){
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


function execute(id){
    $("#json-result").html('检索中');
    while(cars.length!=0){
        cars.pop();
    }
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

function edit(id){
    $("#json-result").html('检索中');
    $.getJSON('/DataSource/showDataSourceByID',{'id': id},function(ret){
        var content =  '';
            content += ("<br>数据源ID："+"</br>");
            content += ('<input type="text" name="id" id="id" class="form-control" value="'+ret.dsId+'" style="width: 280px;" placeholder=""/>');
            content += ("<br>数据源名称："+"</br>");
            content += ('<input type="text" name="name" id="name" class="form-control" value="'+ret.dsName+'" style="width: 280px;" placeholder=""/>');
            content += ("<br>数据源描述："+"</br>");
            content += ('<input type="text" name="desc" id="desc" class="form-control" value="'+ret.dsDesc+'" style="width: 280px;" placeholder=""/>');
            content += ("<br>数据源类型："+"</br>");
            content += ('<input type="text" name="type" id="type" class="form-control" value="'+ret.type+'" style="width: 280px;" placeholder=""/>');
            content += ("<br>创建时间："+"</br>");
            content += ('<input type="time" name="timestamp" id="timestamp" class="form-control" value="'+ret.timestamp+'" style="width: 280px;" placeholder=""/>');
            content += '<button type="button" class="btn btn-primary" onClick="loadXMLDoc1('+id+')">调用</button>';
        $("#json-result").html(content);
    })
}

function delete1(id){
    $("#json-result").html('检索中');
    $.getJSON('/DataSource/deleteDataSourceByID',{'id': id},function(ret){
            $("#json-result").html(ret.code);
    })
}

function startDS(id){
    $("#json-result").html('检索中');
    $.getJSON('/DataSource/startDataSourceByID',{'id': id},function(ret){
        $("#json-result").html(ret.code);
    })
    return;
}

function stopDS(id){
    $("#json-result").html('检索中');
    $.getJSON('/DataSource/stopDataSourceByID',{'id': id},function(ret){
        $("#json-result").html(ret.code);
    })
    return;
}

function refreshTask(){
    $.getJSON('/task/getUserTask',{'id':User},function(ret){
        var template = "<button type='button' class='btn btn-info' onClick='refreshTask()'>刷新</button><table class=\"table table-striped table-bordered\" border=1>";
        template +=  "<tr class=\"success\"><td>任务ID</td><td>数据源ID</td><td>状态</td><td>创建人</td><td>创建时间</td><td>操作</td></tr>";
        for (var i=0; i<ret.length; i++){
            template += ("<tr>");
            template += ("<td>"+ ret[i].taskID +"</td>");
            template += ("<td>"+ ret[i].dsID +"</td>");
            template += ("<td>"+ ret[i].state +"</td>");
            template += ("<td>"+ ret[i].userName +"</td>");
            template += ("<td>"+ ret[i].timestamp +"</td>");
            if(ret[i].state == 1)
                template += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="pauseTask('+ret[i].taskID+')">暂停</button>&nbsp&nbsp&nbsp<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#jsonModal" onClick="finishTask('+ret[i].taskID+')">结束</button></td>';
            else if(ret[i].state == 2)
                template += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="continueTask('+ret[i].taskID+')">继续</button>&nbsp&nbsp&nbsp<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#jsonModal" onClick="finishTask('+ret[i].taskID+')">结束</button></td>';
            else if(ret[i].state == 3)
                template += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="taskInfo('+ret[i].taskID+')">查看详情</button></td>';
            template += ("</tr>");
        }
        template += "</table>";
        document.getElementById("tabtest").innerHTML=template ;
    })
    return;
}

$.getJSON('/getUser',function(ret){
    document.getElementById("curUser").innerHTML=ret.user ;
    User = ret.user;
    $.getJSON('/task/getUserTask',{'id':ret.user},function(ret){
        var template = "<button type='button' class='btn btn-info' onClick='refreshTask()'>刷新</button><table id=\"dsTablert\" class=\"table table-striped table-bordered\" border=1>";
        template +=  "<tr class=\"success\"><td>任务ID</td><td>数据源ID</td><td>状态</td><td>创建人</td><td>创建时间</td><td>操作</td></tr>";
        for (var i=0; i<ret.length; i++){
            template += ("<tr>");
            template += ("<td>"+ ret[i].taskID +"</td>");
            template += ("<td>"+ ret[i].dsID +"</td>");
            template += ("<td>"+ ret[i].state +"</td>");
            template += ("<td>"+ ret[i].userName +"</td>");
            template += ("<td>"+ ret[i].timestamp +"</td>");
            if(ret[i].state == 1)
                template += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="pauseTask('+ret[i].taskID+')">暂停</button>&nbsp&nbsp&nbsp<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#jsonModal" onClick="finishTask('+ret[i].taskID+')">结束</button></td>';
            else if(ret[i].state == 2)
                template += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="continueTask('+ret[i].taskID+')">继续</button>&nbsp&nbsp&nbsp<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#jsonModal" onClick="finishTask('+ret[i].taskID+')">结束</button></td>';
            else if(ret[i].state == 3)
                template += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="taskInfo('+ret[i].taskID+')">查看详情</button></td>';
            template += ("</tr>");
        }
        template += "</table>";
        document.getElementById("tabtest").innerHTML=template ;
        displayrt();
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




$.getJSON('/DataSource/showDataSource',function(ret){
    // var template = '<a id="btn0">asaasa</a>' +
    //     '                <input id="pageSize" type="text" size="1" maxlength="2" value="getDefaultValue()"/><a> 条 </a> <a href="#" id="pageSizeSet">设置</a>&nbsp;' +
    //     '                <a id="sjzl"></a>&nbsp;' +
    //     '                <a  href="#" id="btn1">首页</a>' +
    //     '                <a  href="#" id="btn2">上一页</a>' +
    //     '                <a  href="#" id="btn3">下一页</a>' +
    //     '                <a  href="#" id="btn4">尾页</a>&nbsp;' +
    //     '                <a>转到&nbsp;</a>' +
    //     '                <input id="changePage" type="text" size="1" maxlength="4"/>' +
    //     '                <a>页&nbsp;</a>' +
    //     '                <a  href="#" id="btn5">跳转</a>';
    var template = "<table id=\"dsTable\" class=\"table table-striped table-bordered\" border=1>";
    template +=  "<tr class=\"success\"><td>数据源ID</td><td>数据源名称</td><td>描述</td><td>类型</td><td>创建时间</td><td>操作</td></tr>";
    for (var i=0; i<ret.length; i++){
        template += ("<tr>");
        template += ("<td>"+ ret[i].dsId +"</td>");
        template += ("<td>"+ ret[i].dsName +"</td>");
        template += ("<td>"+ ret[i].dsDesc +"</td>");
        template += ("<td>"+ ret[i].type +"</td>");
        template += ("<td>"+ ret[i].timestamp +"</td>");
        if(ret[i].state == 1)
            template += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="getpara('+ret[i].dsId+')">测试</button>&nbsp&nbsp&nbsp<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="execute('+ret[i].dsId+')">调用</button></td>';
        else
            template += '<td><button type="button" disabled="disabled" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="getpara('+ret[i].dsId+')">测试</button>&nbsp&nbsp&nbsp<button type="button" disabled="disabled" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="execute('+ret[i].dsId+')">调用</button></td>';
        template += ("</tr>");
    }
    template += "</table>";
    document.getElementById("envtest").innerHTML=template ;
    display();
})

$.getJSON('/getUser',function(ret){
    document.getElementById("curUser").innerHTML=ret.user ;
    User = ret.user;
})

$.getJSON('/DataSource/showDataSource',function(ret){
    var template = "<table id=\"dsTablepz\" class=\"table table-striped table-bordered\" border=1>";
    template +=  "<tr class=\"success\"><td>数据源ID</td><td>数据源名称</td><td>描述</td><td>类型</td><td>创建时间</td><td>操作</td></tr>";
    for (var i=0; i<ret.length; i++){
        template += ("<tr>");
        template += ("<td>"+ ret[i].dsId +"</td>");
        template += ("<td>"+ ret[i].dsName +"</td>");
        template += ("<td>"+ ret[i].dsDesc +"</td>");
        template += ("<td>"+ ret[i].type +"</td>");
        template += ("<td>"+ ret[i].timestamp +"</td>");
        if(ret[i].state == 1)
            template += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="edit('+ret[i].dsId+')">修改</button>&nbsp&nbsp&nbsp<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="delete1('+ret[i].dsId+')">删除</button>&nbsp&nbsp&nbsp<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#jsonModal" onClick="stopDS('+ret[i].dsId+')">停用</button></td>';
        else
            template += '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="edit('+ret[i].dsId+')">修改</button>&nbsp&nbsp&nbsp<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#jsonModal" onClick="delete1('+ret[i].dsId+')">删除</button>&nbsp&nbsp&nbsp<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#jsonModal" onClick="startDS('+ret[i].dsId+')">启用</button></td>';
        template += ("</tr>");
    }
    template += "</table>";
    document.getElementById("peizhi").innerHTML=template ;
    displaypz();
})





// $(document).ready(
function display() {
        len = $("#dsTable tr").length - 1;
        page = len % pageSize == 0 ? len / pageSize : Math.floor(len / pageSize) + 1;
        curPage = 1;
        displayPage(1);

        document.getElementById("btn0").innerHTML = "当前 " + curPage + "/" + page + " 页    每页 ";
        document.getElementById("sjzl").innerHTML = "数据总量 " + len + "";
        document.getElementById("pageSize").value = pageSize;
}
function displayrt() {
    lenrt = $("#dsTablert tr").length - 1;
    pagert = lenrt % pageSizert == 0 ? lenrt / pageSizert : Math.floor(lenrt / pageSizert) + 1;
    curPagert = 1;
    displayPagert(1);

    document.getElementById("btn0rt").innerHTML = "当前 " + curPagert + "/" + pagert + " 页    每页 ";
    document.getElementById("sjzlrt").innerHTML = "数据总量 " + lenrt + "";
    document.getElementById("pageSizert").value = pageSizert;
}

function displaypz() {
    lenpz = $("#dsTablepz tr").length - 1;
    pagepz = lenpz % pageSizepz == 0 ? lenpz / pageSizepz : Math.floor(lenpz / pageSizepz) + 1;
    curPagepz = 1;
    displayPagepz(1);

    document.getElementById("btn0pz").innerHTML = "当前 " + curPagepz + "/" + pagepz + " 页    每页 ";
    document.getElementById("sjzlpz").innerHTML = "数据总量 " + lenpz + "";
    document.getElementById("pageSizepz").value = pageSizepz;
}
function firstPage() {
    curPage = 1;
    direct = 0;
    displayPage();
}
$(document).ready(function() {
    $("#btn1").click(function firstPage() {
        curPage = 1;
        direct = 0;
        displayPage();
    });
    $("#btn2").click(function frontPage() {
        direct = -1;
        displayPage();
    });
    $("#btn3").click(function nextPage() {
        direct = 1;
        displayPage();
    });
    $("#btn4").click(function lastPage() {
        curPage = page;
        direct = 0;
        displayPage();
    });
    $("#btn5").click(function changePage() {
        curPage = document.getElementById("changePage").value * 1;
        if (!/^[1-9]\d*$/.test(curPage)) {
            alert("请输入正整数");
            return;
        }
        if (curPage > page) {
            alert("超出数据页面");
            return;
        }
        direct = 0;
        displayPage();
    });


    $("#pageSizeSet").click(function setPageSize() {
        pageSize = document.getElementById("pageSize").value;
        if (!/^[1-9]\d*$/.test(pageSize)) {
            alert("请输入正整数");
            return;
        }
        len = $("#dsTable tr").length - 1;
        page = len % pageSize == 0 ? len / pageSize : Math.floor(len / pageSize) + 1;
        curPage = 1;
        direct = 0;
        firstPage();
    });
});
function firstPagert() {
    curPagert = 1;
    directrt = 0;
    displayPagert();
}
$(document).ready(function() {
    $("#btn1rt").click(function firstPagert() {
        curPagert = 1;
        directrt = 0;
        displayPagert();
    });
    $("#btn2rt").click(function frontPagert() {
        directrt = -1;
        displayPagert();
    });
    $("#btn3rt").click(function nextPagert() {
        directrt = 1;
        displayPagert();
    });
    $("#btn4rt").click(function lastPagert() {
        curPagert = pagert;
        directrt = 0;
        displayPagert();
    });
    $("#btn5rt").click(function changePagert() {
        curPagert = document.getElementById("changePagert").value * 1;
        if (!/^[1-9]\d*$/.test(curPagert)) {
            alert("请输入正整数");
            return;
        }
        if (curPagert > pagert) {
            alert("超出数据页面");
            return;
        }
        directrt = 0;
        displayPagert();
    });


    $("#pageSizeSetrt").click(function setPageSizert() {
        pageSizert = document.getElementById("pageSizert").value;
        if (!/^[1-9]\d*$/.test(pageSizert)) {
            alert("请输入正整数");
            return;
        }
        lenrt = $("#dsTablert tr").length - 1;
        pagert = lenrt % pageSizert == 0 ? lenrt / pageSizert : Math.floor(lenrt / pageSizert) + 1;
        curPagert = 1;
        directrt = 0;
        firstPagert();
    });
});
function firstPagepz() {
    curPagepz = 1;
    directpz = 0;
    displayPagepz();
}
$(document).ready(function() {
    $("#btn1pz").click(function firstPagepz() {
        curPagepz = 1;
        directpz = 0;
        displayPagepz();
    });
    $("#btn2pz").click(function frontPagepz() {
        directpz = -1;
        displayPagepz();
    });
    $("#btn3pz").click(function nextPagepz() {
        directpz = 1;
        displayPagepz();
    });
    $("#btn4pz").click(function lastPagepz() {
        curPagepz = pagepz;
        directpz = 0;
        displayPagepz();
    });
    $("#btn5pz").click(function changePagepz() {
        curPagepz = document.getElementById("changePagepz").value * 1;
        if (!/^[1-9]\d*$/.test(curPagepz)) {
            alert("请输入正整数");
            return;
        }
        if (curPagepz > pagepz) {
            alert("超出数据页面");
            return;
        }
        directpz = 0;
        displayPagepz();
    });


    $("#pageSizeSetpz").click(function setPageSizepz() {
        pageSizepz = document.getElementById("pageSizepz").value;
        if (!/^[1-9]\d*$/.test(pageSizepz)) {
            alert("请输入正整数");
            return;
        }
        lenpz = $("#dsTablepz tr").length - 1;
        pagepz = lenpz % pageSizepz == 0 ? lenpz / pageSizepz : Math.floor(lenpz / pageSizepz) + 1;
        curPagepz = 1;
        directpz = 0;
        firstPagepz();
    });
});
// );

function displayPage(){
    if(curPage <=1 && direct==-1){
        direct=0;
        alert("已经是第一页了");
        return;
    } else if (curPage >= page && direct==1) {
        direct=0;
        alert("已经是最后一页了");
        return ;
    }

    lastPage = curPage;

    if (len > pageSize) {
        curPage = ((curPage + direct + len) % len);
    } else {
        curPage = 1;
    }


    document.getElementById("btn0").innerHTML="当前 " + curPage + "/" + page + " 页    每页 ";

    begin=(curPage-1)*pageSize + 1;
    end = begin + 1*pageSize - 1;
    if(end > len ) end=len;
    $("#dsTable tr").hide();
    $("#dsTable tr").each(function(i){
        if((i>=begin && i<=end) || i==0 )
            $(this).show();
    });

}
function displayPagert(){
    if(curPagert <=1 && directrt==-1){
        directrt=0;
        alert("已经是第一页了");
        return;
    } else if (curPagert >= pagert && directrt==1) {
        directrt=0;
        alert("已经是最后一页了");
        return ;
    }

    lastPagert = curPagert;

    if (lenrt > pageSizert) {
        curPagert = ((curPagert + directrt + lenrt) % lenrt);
    } else {
        curPagert = 1;
    }


    document.getElementById("btn0rt").innerHTML="当前 " + curPagert+ "/" + pagert + " 页    每页 ";

    beginrt=(curPagert-1)*pageSizert + 1;
    endrt = beginrt + 1*pageSizert - 1;
    if(endrt > lenrt ) endrt=lenrt;
    $("#dsTablert tr").hide();
    $("#dsTablert tr").each(function(i){
        if((i>=beginrt && i<=endrt) || i==0 )
            $(this).show();
    });

}

function displayPagepz(){
    if(curPagepz <=1 && directpz==-1){
        directpz=0;
        alert("已经是第一页了");
        return;
    } else if (curPagepz >= pagepz && directpz==1) {
        directpz=0;
        alert("已经是最后一页了");
        return ;
    }

    lastPagepz = curPagepz;

    if (lenpz > pageSizepz) {
        curPagepz = ((curPagepz + directpz + lenpz) % lenpz);
    } else {
        curPagepz = 1;
    }


    document.getElementById("btn0").innerHTML="当前 " + curPagepz + "/" + pagepz + " 页    每页 ";

    beginpz=(curPagepz-1)*pageSizepz + 1;
    endpz = beginpz + 1*pageSizepz - 1;
    if(endpz > lenpz ) endpz=lenpz;
    $("#dsTablepz tr").hide();
    $("#dsTablepz tr").each(function(i){
        if((i>=beginpz && i<=endpz) || i==0 )
            $(this).show();
    });

}

