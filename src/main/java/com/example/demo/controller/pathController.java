package com.example.demo.controller;

import com.example.demo.entity.path;
import com.example.demo.service.Impl.pathImpl;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.*;

@Controller
public class pathController {
    @Resource
    private pathImpl pathService;

    @RequestMapping("/getPath")
    @ResponseBody
    public List<path> getPaths(HttpServletRequest request, Model model){
        //int userId = Integer.parseInt(request.getParameter("id"));
        List<path> paths = this.pathService.getAll();
        if(paths!=null&&paths.size()!=0)
            return paths;
        else
            return null;
    }

    @RequestMapping("/editPath")
    @ResponseBody
    public Map<String,String> editPath(HttpServletRequest request, Model model) throws UnsupportedEncodingException {
        String languageName = request.getParameter("languageName");
        String id = request.getParameter("id");
        String content = URLDecoder.decode(request.getParameter("content"),"utf-8");
        path path1 = new path();
        if(languageName.equals("java")){
            path1.setLanguageName("java");
        }
        else if(languageName.equals("net")){
            path1.setLanguageName(".net");
        }
        if(id.contains("javajar")){
            path1.setLibpath(content);
        }
        else if(id.contains("javacsv")){
            path1.setCsvpath(content);
        }
        else if(id.contains("netdll")){
            path1.setLibpath(content);
        }
        else if(id.contains("netcsv")){
            path1.setCsvpath(content);
        }
        pathService.update(path1);
        Map<String,String> res = new HashMap<String, String>();
        res.put("result","success");
        return res;
    }

}
