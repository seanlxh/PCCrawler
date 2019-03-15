$.getJSON('/getPath',{},function(ret){
    document.getElementById("javacsv").value = ret[0].csvpath;
    document.getElementById("javajar").value = ret[0].libpath;
    document.getElementById("netcsv").value = ret[1].csvpath;
    document.getElementById("netdll").value = ret[1].libpath;
    document.getElementById("hadoop").value = ret[0].hadooppath;
})

function editPath(id,language) {
    var content = document.getElementById(id).value;
    content=encodeURI(content,"utf-8");
    $.getJSON('/editPath',{"id":id,"languageName":language,"content":content},function(ret){
        alert(ret.result)
    })
}