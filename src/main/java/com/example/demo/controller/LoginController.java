package com.example.demo.controller;

import com.example.demo.entity.u_user;
import com.example.demo.service.Impl.u_userImpl;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import static com.example.demo.util.MyDES.encryptBasedDes;

@Controller
public class LoginController {

    @Resource
    private u_userImpl u_userService;

    //跳转到登录表单页面
    @RequestMapping("/login")
    public String login() {
        return "login1";
    }
    @RequestMapping("/register")
    public String register() {
        return "register";
    }

    /**
     * ajax登录请求
     * @param username
     * @param password
     * @return
     */
    @RequestMapping(value="ajaxLogin",method= RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> submitLogin(@RequestParam(value = "username", required = true) String username, @RequestParam(value = "password", required = true) String password, Model model) {
        Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
        try {
            UsernamePasswordToken token = new UsernamePasswordToken(username, encryptBasedDes(password+username));
            SecurityUtils.getSubject().login(token);
            u_user u_user = (u_user)SecurityUtils.getSubject().getPrincipal();
            if(u_user.getRoleId()==1){
                resultMap.put("status", 200);
                resultMap.put("message", "登录成功");
            }else if(u_user.getRoleId()==2){
                resultMap.put("status", 201);
                resultMap.put("message", "登录成功");
            }
        }
         catch (Exception e) {
            resultMap.put("status", 500);
            resultMap.put("message", e.getMessage());
        }
        return resultMap;
    }


    @RequestMapping(value="ajaxRegist",method= RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> submitRegist(@RequestParam(value = "username", required = true) String username, @RequestParam(value = "password", required = true) String password, @RequestParam(value = "email", required = true) String email, Model model) {
        Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
        try {
            int size = u_userService.getAll().size();
            Date date = new Date();
            Timestamp currentTime1 = new Timestamp(date.getTime());
            u_user u_user = new u_user(Long.valueOf(size + 1),username,email,password,currentTime1,null,Long.valueOf(1), 2);
            u_userService.save(u_user);
            resultMap.put("status", 200);
            resultMap.put("message", "success");
        }
        catch (Exception e) {
            resultMap.put("status", 500);
            resultMap.put("message", e.getMessage());
        }
        return resultMap;
    }


    @RequestMapping("/getUser")
    @ResponseBody
    public Map<String,String> getUser() {
        u_user user = (u_user)SecurityUtils.getSubject().getPrincipal();
        Map<String,String> curUser = new HashMap<>();
        curUser.put("user",user.getNickname());
        return curUser;
    }


}
