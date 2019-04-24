package com.example.demo.controller;

import com.example.demo.entity.inputPara;
import com.example.demo.entity.para_type;
import com.example.demo.entity.u_user;
import com.example.demo.service.Impl.dataSourceImpl;
import com.example.demo.service.Impl.u_userImpl;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Controller
@RequestMapping("/userData")
public class UserInfoController {
    @Resource
    private u_userImpl u_userService;
    @RequestMapping("/userData")
    @ResponseBody
    public List<Map<String,String>> userData(HttpServletRequest request, Model model){
        List<Map<String,String>> result = new ArrayList<>();
        List<u_user> list =  u_userService.getAll();
        int limit = Integer.valueOf(request.getParameter("limit"));
        int offset = Integer.valueOf(request.getParameter("offset"));
        for(int i = 0 ; i < list.size(); i ++){
            u_user u_user = list.get(i);
            Map<String,String> res = new HashMap<>();
            res.put("id",String.valueOf(u_user.getId()));
            res.put("typeName",u_user.getNickname());
            res.put("num",String.valueOf(u_user.getEmail()));
            res.put("status",u_user.getStatus()==1?"可用":"停用");
            if(u_user.getLastLoginTime() != null)
                res.put("lastLoginTime",u_user.getLastLoginTime().toString());
            else
                res.put("lastLoginTime","");
            result.add(res);
        }
        return result;
    }

    @RequestMapping("/userDataById")
    @ResponseBody
    public Map<String,String> userDataById(HttpServletRequest request, Model model){
        Map<String,String> res = new HashMap<>();
        long id = Long.valueOf(request.getParameter("id"));
        u_user user =  u_userService.findById(id);
            res.put("id",String.valueOf(user.getId()));
            res.put("nickname",user.getNickname());
            res.put("email",String.valueOf(user.getEmail()));
            res.put("status",user.getStatus()==1?"可用":"停用");
            if(user.getLastLoginTime() != null)
                res.put("lastLoginTime",user.getLastLoginTime().toString());
            else
                res.put("lastLoginTime","");
        return res;
    }

}
