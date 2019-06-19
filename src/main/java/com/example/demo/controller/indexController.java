package com.example.demo.controller;

import com.example.demo.entity.dataSource;
import com.example.demo.entity.inputPara;
import com.example.demo.service.Impl.dataSourceImpl;
import com.example.demo.service.Impl.inputParaImpl;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
@RequestMapping("/index")
public class indexController {
    @RequestMapping("/index")
    public String toIndex(HttpServletRequest request, Model model){
        return "ltpt";
    }
    @RequestMapping("/android")
    public String android(HttpServletRequest request, Model model){
        return "android";
    }
    @RequestMapping("/userIndex")
    public String userIndex(HttpServletRequest request, Model model){
        return "userltpt";
    }
    @RequestMapping("/add")
    public String toAdd(HttpServletRequest request, Model model){
        return "sjydy";
    }
    @RequestMapping("/charts")
    public String charts(HttpServletRequest request, Model model){
        return "charts";
    }
    @RequestMapping("/dashbord")
    public String dashbord(HttpServletRequest request, Model model){
        return "dashbord";
    }
    @RequestMapping("/table")
    public String table(HttpServletRequest request, Model model){
        return "tables";
    }
    @RequestMapping("/form")
    public String form(HttpServletRequest request, Model model){
        return "forms";
    }
    @RequestMapping("/usermanage")
    public String usermanage(HttpServletRequest request, Model model){
        return "usermanage";
    }
    @RequestMapping("/serviceList")
    public String serviceList(HttpServletRequest request, Model model){
        return "serviceList";
    }
    @RequestMapping("/serviceDetail")
    public String serviceDetail(HttpServletRequest request, Model model){
        return "serviceDetail";
    }
}