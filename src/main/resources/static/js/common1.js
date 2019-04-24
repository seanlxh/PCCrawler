/**
 * Created by zhang_yerj on 2017/11/6.
 */
$(function () {
    $m.Select.init($('.m-hd'));
    //导航条添加active样式
    var url = window.document.location.href;
    if (url.indexOf("catalog") > 0) {
        $("#pCatalog").addClass("active");
    }
    else if (url.indexOf("statistic") > 0) {
        $("#pStatistic").addClass("active");
    }
    else if (url.indexOf("developer") > 0) {
        $("#pApi").addClass("active");
    }
    else if (url.indexOf("app") > 0) {
        $("#pApp").addClass("active");
    }
    else if (url.indexOf("analyse/index") > 0) {
        $("#pDynamic").addClass("active");
    }
    else if (url.indexOf("interact") > 0) {
        $("#pInteract").addClass("active");
    }
    else if (url.indexOf("developer/index") > 0) {
        $("#pDev").addClass("active");
    }
    else if (url.indexOf("map") > 0) {
        $("#pMap").addClass("active");
    }
    else{
        $("#pIndex").addClass("active");
    }
});
function getRootPath() {
    var protocol = window.location.protocol + '//',
        host = window.location.host + '/',
        pathName = window.location.pathname.split('/');
    var projectName = pathName[1];
    return (protocol + host + projectName );
}