$.getJSON('/inputPara/getpara_type',{},function(ret){
    for(var i = 0 ; i < ret.length; i ++){
        newopt = document.createElement("option");
        newopt.text = ret[i].name;
        newopt.value = ret[i].id;
        //第二个参数是选项的指定位置
        document.getElementById("type").options.add(newopt, i+1);
    }

    newopt = document.createElement("option");
    newopt.text = "java数据接口增加";
    newopt.value = 1;
    //第二个参数是选项的指定位置
    document.getElementById("ptype").options.add(newopt, i+1);
    newopt = document.createElement("option");
    newopt.text = ".NET数据接口增加";
    newopt.value = 2;
    //第二个参数是选项的指定位置
    document.getElementById("ptype").options.add(newopt, i+1);
    newopt = document.createElement("option");
    newopt.text = "C++桌面应用数据接口增加";
    newopt.value = 4;
    //第二个参数是选项的指定位置
    document.getElementById("ptype").options.add(newopt, i+1);
    newopt = document.createElement("option");
    newopt.text = "安卓数据接口增加";
    newopt.value = 3;
    //第二个参数是选项的指定位置
    document.getElementById("ptype").options.add(newopt, i+1);
    // for(var i = 0 ; i < ret.length; i ++){
    //     newopt = document.createElement("option");
    //     newopt.text = ret[i].name;
    //     newopt.value = ret[i].id;
    //     //第二个参数是选项的指定位置
    //     document.getElementById("typecsv").options.add(newopt, i+1);
    // }


})
