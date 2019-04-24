var username ;
var password ;
$(document).ready(function() {
$("#ajaxLogin").click(function abc() {
    username = $("#username").val();
    password = $("#password").val();
    repassword = $("#retry").val();
    email = $("#email").val();
    apos=email.indexOf("@")
    dotpos=email.lastIndexOf(".")
    if(apos<1||dotpos-apos<2){
        alert("邮箱错误");
        return;
    }
    else if(password != repassword){
        alert("密码不一致");
        return;
    }
    else if(username.length > 15){
        alert("用户名有误");
        return;
    }
    else{
    $.post("/ajaxRegist?username="+username+"&password="+password+"&email="+email, {
    }, function(result) {
        if (result.status == 200) {
            location.href = "login";
        }
        else {
            alert("注册失败");
        }
    });
    }

});
});