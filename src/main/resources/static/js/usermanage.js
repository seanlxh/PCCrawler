var list = 0;
var occupyNum = [];
var addNum = [];
$(function () {
    $('#hover, #striped, #condensed').click(function () {
        var classes = 'table';

        if ($('#hover').prop('checked')) {
            classes += ' table-hover';
        }
        if ($('#condensed').prop('checked')) {
            classes += ' table-condensed';
        }
        $('#table-style').bootstrapTable('destroy')
            .bootstrapTable({
                classes: classes,
                striped: $('#striped').prop('checked')
            });
    });
});


$('#table').bootstrapTable({
    url: "/userData/userData",
    pageSize: 15,
    pageList: [5, 10, 15, 20],
    dataType: "json",
    pagination: true,
    singleSelect: false,
    locale:"zh-US",
    showColumns: true,
    search: true,
    showRefresh: true,
    showToggle: true,
    // sidePagination: "server",
    columns: [
        {
            title: '用户ID',
            field: 'id',
            align: 'center',
            valign: 'middle'
        },
    {
        title: '昵称',
        field: 'typeName',
        align: 'center',
        valign: 'middle'
    },
    {
        title: '邮箱',
        field: 'num',
        align: 'center',
        valign: 'middle',
    },
    {
        title: '最后登录时间',
        field: 'lastLoginTime',
        align: 'center'
    },
        {
            title: '账户状态',
            field: 'status',
            align: 'center'
        },
    {
        title: '操作',
        field: 'id',
        align: 'center',
        formatter:function(value,row,index){
            var e = '<a data-toggle="modal" data-target="#jsonModal" href="#" mce_href="#" onclick="edit(\''+ row.id + '\')">编辑</a> ';
            var d = '<a href="#" mce_href="#" onclick="ds(\''+ row.id +'\')">数据源权限</a> ';
            return e+d;
        }
    }
]
});
function ds() {
    $('#ds').bootstrapTable({
        url: "/DataSource/showDataSource",
        pageSize: 15,
        pageList: [5, 10, 15, 20],
        dataType: "json",
        pagination: true,
        singleSelect: false,
        locale:"zh-US",
        showColumns: true,
        search: true,
        showRefresh: true,
        showToggle: true,
        // sidePagination: "server",
        columns: [
            {
                title: '数据源id',
                field: 'dsId',
                align: 'center',
                valign: 'middle'
            },
            {
                title: '数据源名称',
                field: 'dsName',
                align: 'center',
                valign: 'middle'
            },
            {
                title: '操作',
                field: 'id',
                align: 'center',
                formatter:function(value,row,index){
                    var e = '<a data-toggle="modal" data-target="#jsonModal" href="#" mce_href="#" onclick="edit(\''+ row.id + '\')">删除权限</a> ';
                    var d = '<a href="#" mce_href="#" onclick="del(\''+ row.id +'\')">删除</a> ';
                    return e+d;
                }
            }
        ]
    });
}


function rowStyle(row, index) {
    var classes = ['active', 'success', 'info', 'warning', 'danger'];

    if (index % 2 === 0 && index / 2 < classes.length) {
        return {
            classes: classes[index / 2]
        };
    }
    return {};
}

function del(id) {
    var con;
    con=confirm("确认删除吗");
    if(con==true){
        deletePara(id);
        refresh();
    }
    else {
        return;
    }
}

function deletePara(id){
    // $.getJSON('/inputPara/deleteData',{"id":id},function(ret){
    //     alert(ret.msg);
    // })
}

function deleteElement(id) {
    $("#line"+id.toString()).remove();
    for (var i = 0 ; i < occupyNum.length; i ++){
        if(occupyNum[i] == id)
            occupyNum.splice(i,1);
    }
}

function deleteAddElement(id) {
    $("#line"+id.toString()).remove();
    for (var i = 0 ; i < addNum.length; i ++){
        if(addNum[i] == id)
            addNum.splice(i,1);
    }
}



function addElement() {
    var content = '';
    content += ('<div id="line'+list+'" class="row">');
    // content += ('<div class="col-lg-2"><label>类型</label><input type="text" name="type" id="type'+list+'" class="form-control" placeholder="输入参数类型" style="width: 100px;" placeholder=""/></div>');
    content += ('<div class="col-lg-2"><label>类型</label> <select name="type" style="font-size:20px;width:80px;" value="" id="type'+list+'">' +
        '            <option value="" disabled selected style="display:none;">Please Choose</option>  ' +
        '            <option value="int">int</option>' +
        '            <option value="double">double</option>' +
        '            <option value="float">float</option>' +
        '            <option value="long">long</option>' +
        '            <option value="java.lang.String">String</option>' +
        '            </select></div>');
    content += ('<div class="col-lg-4"><label>参数名</label><input type="text" name="name" id="name'+list+'" class="form-control" placeholder="输入参数名" style="width: 200px;" placeholder=""/></div>');
    content += ('<div class="col-lg-5"><label>描述</label><input type="text" name="desc" id="desc'+list+'" class="form-control" placeholder="输入参数描述" style="width: 200px;" placeholder=""/><button type="button" class="btn btn-primary" onClick="deleteElement('+list+')">删除</button></div>');
    content += ('</div>');
    occupyNum.push(list);
    list ++;
    document.getElementById('para').innerHTML += content;
}

function addParaElement() {
    var content = '';
    content += ('<div id="line'+list+'" class="row">');
    // content += ('<div class="col-lg-2"><label>类型</label><input type="text" name="type" id="type'+list+'" class="form-control" placeholder="输入参数类型" style="width: 100px;" placeholder=""/></div>');
    content += ('<div class="col-lg-2"><label>类型</label> <select name="type" style="font-size:20px;width:80px;" value="" id="type'+list+'">' +
        '            <option value="" disabled selected style="display:none;">Please Choose</option>  ' +
        '            <option value="int">int</option>' +
        '            <option value="double">double</option>' +
        '            <option value="float">float</option>' +
        '            <option value="long">long</option>' +
        '            <option value="java.lang.String">String</option>' +
        '            </select></div>');
    content += ('<div class="col-lg-4"><label>参数名</label><input type="text" name="name" id="name'+list+'" class="form-control" placeholder="输入参数名" style="width: 200px;" placeholder=""/></div>');
    content += ('<div class="col-lg-5"><label>描述</label><input type="text" name="desc" id="desc'+list+'" class="form-control" placeholder="输入参数描述" style="width: 200px;" placeholder=""/><button type="button" class="btn btn-primary" onClick="deleteAddElement('+list+')">删除</button></div>');
    content += ('</div>');
    addNum.push(list);
    list ++;
    document.getElementById('para').innerHTML += content;
}

function addNewPara() {
    var tmpName = document.getElementById("name").value;
    var paraList = new Array();
    for(var i = 0 ; i < addNum.length; i ++){
        var type = document.getElementById("type"+addNum[i].toString()).value;
        var name = document.getElementById("name"+addNum[i].toString()).value;
        var desc = document.getElementById("desc"+addNum[i].toString()).value;
        if(type==""||name==""||desc==""){
            alert("不能为空");
            return;
        }
        var model = {"type":type,"name":name,"desc":desc};
        paraList.push(model);
    }
    $.ajax({
        async:"false",
        type:'post',
        url:'/inputPara/addData',
        data:{paraList:JSON.stringify(paraList),name:tmpName},
        dataType : 'json',
        success:function(data){
            $("#para-result").html(data.msg);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown){
            alert("error");
        }
    });
}


function editPara(id) {
    var tmpName = document.getElementById("name").value;
    var paraList = new Array();
    for(var i = 0 ; i < occupyNum.length; i ++){
        var type = document.getElementById("type"+occupyNum[i].toString()).value;
        var name = document.getElementById("name"+occupyNum[i].toString()).value;
        var desc = document.getElementById("desc"+occupyNum[i].toString()).value;
        if(type==""||name==""||desc==""){
            alert("不能为空");
            return;
        }
        var model = {"type":type,"name":name,"desc":desc};
        paraList.push(model);
    }
    $.ajax({
        async:"false",
        type:'post',
        url:'/inputPara/editData',
        data:{id:id,paraList:JSON.stringify(paraList),name:tmpName},
        dataType : 'json',
        success:function(data){
            $("#para-result").html(data.msg);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown){
            alert("error");
        }
    });
}

function addPara() {
    $("#para-result").html('检索中');
    addNum = []
    var content =  '';
    content += ("<br>数据源类型名称："+"</br>");
    content += ('<input type="text" name="name" id="name" class="form-control" value="" style="width: 280px;" placeholder=""/>');
    content += ("<br>参数列表：(int Num 是标准数据量参数)"+"</br>");
    content += ('<div id="para">')
    content += ('<div id="line'+list+'" class="row">');
    // content += ('<div class="col-lg-2"><label>类型</label><input type="text" name="type" id="type'+list+'" class="form-control" value="" style="width: 100px;" placeholder="输入参数类型"/></div>');
    content += ('<div class="col-lg-2"><label>类型</label> <select name="type" style="font-size:20px;width:80px;" value="" id="type'+list+'">' +
        '            <option value="" disabled selected style="display:none;">Please Choose</option>  ' +
        '            <option value="int">int</option>' +
        '            <option value="double">double</option>' +
        '            <option value="float">float</option>' +
        '            <option value="long">long</option>' +
        '            <option value="java.lang.String">String</option>' +
        '            </select></div>');
    content += ('<div class="col-lg-4"><label>参数名</label><input type="text" name="name" id="name'+list+'" class="form-control" value="" style="width: 200px;" placeholder="输入参数名"/></div>');
    content += ('<div class="col-lg-5"><label>描述</label><input type="text" name="desc" id="desc'+list+'" class="form-control" value="" style="width: 200px;" placeholder="输入参数描述"/><button type="button" class="btn btn-primary" onClick="deleteAddElement('+list+')">删除</button></div>');
    content += ('</div>')
    addNum.push(list);
    list++;
    content += ('</div>')
    content += '<button type="button" class="btn btn-primary" onClick="addParaElement()">添加行</button>&nbsp;&nbsp;';
    content += ('<button type="button" class="btn btn-primary" onClick="addNewPara()">确定增加</button>');
    $("#para-result").html(content);
}

function edit(id){
    $("#para-result").html('检索中');
    occupyNum = [];
    $.getJSON('/userData/userDataById',{"id":id},function(ret){
        var content =  '';
        content += ("<br>用户ID："+"</br>");
        content += ('<input type="text" name="id" id="id" class="form-control" value="'+ret.id+'" style="width: 280px;" disabled="disabled" placeholder=""/>');
        content += ("<br>用户昵称："+"</br>");
        content += ('<input type="text" name="name" id="name" class="form-control" value="'+ret.nickname+'" style="width: 280px;" placeholder=""/>');
        content += ("<br>用户邮箱："+"</br>");
        content += ('<input type="text" name="email" id="email" class="form-control" value="'+ret.email+'" style="width: 280px;" disabled="disabled" placeholder=""/>');
        content += ("<br>用户状态："+"</br>");
        content += ('<input type="text" name="status" id="status" class="form-control" value="'+ret.status+'" style="width: 280px;" disabled="disabled" placeholder=""/>');
        content += ("<br>用户最后登录时间："+"</br>");
        content += ('<input type="text" name="lastLoginTime" id="lastLoginTime" class="form-control" value="'+ret.lastLoginTime+'" style="width: 280px;" disabled="disabled" placeholder=""/>');
        content += ('<button type="button" class="btn btn-primary" onClick="editPara('+ret.id+')">确定修改</button>');
        $("#para-result").html(content);
    })
}


!function ($) {
    $(document).on("click","ul.nav li.parent > a > span.icon", function(){
        $(this).find('em:first').toggleClass("glyphicon-minus");
    });
    $(".sidebar span.icon").find('em:first').addClass("glyphicon-plus");
}(window.jQuery);

$(window).on('resize', function () {
    if ($(window).width() > 768) $('#sidebar-collapse').collapse('show')
})
$(window).on('resize', function () {
    if ($(window).width() <= 767) $('#sidebar-collapse').collapse('hide')
})
