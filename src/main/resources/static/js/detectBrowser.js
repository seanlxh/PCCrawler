$(function(){
	//判断浏览器版本
	var _uat=navigator.userAgent;
	if(_uat.indexOf("MSIE 6.0")>0)  
    {   
   		window.location.href = document.getElementById("dataUrl").value+"/browser/download.htm";
    }   
    if(_uat.indexOf("MSIE 7.0")>0)  
   	{  
    	window.location.href = document.getElementById("dataUrl").value+"/browser/download.htm";
   	}  
    
});