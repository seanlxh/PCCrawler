package com.example.demo.controller;

import com.example.demo.entity.dataSource;
import com.example.demo.entity.inputPara;
import com.example.demo.entity.para_type;
import com.example.demo.service.Impl.dataSourceImpl;
import com.example.demo.service.Impl.inputParaImpl;
import com.example.demo.service.Impl.para_typeImpl;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import static java.lang.System.currentTimeMillis;

@Controller
@RequestMapping("/inputPara")
public class inputParaController {
    @Resource
    private inputParaImpl inputParaService;
    @Resource
    private dataSourceImpl dataSourceService;
    @Resource
    private para_typeImpl para_typeService;
    @RequestMapping("/inputPara")
    @ResponseBody
    public List<inputPara> toIndex(HttpServletRequest request, Model model){
        Long id = Long.parseLong(request.getParameter("id"));
        List<inputPara> inputParas = this.inputParaService.findBytypeId(dataSourceService.findById(id).getType());
        return inputParas;
    }

    @RequestMapping("/getpara_type")
    @ResponseBody
    public List<para_type> getpara_type(HttpServletRequest request, Model model){
        List<para_type> para_types = this.para_typeService.getAll();
        return para_types;
    }


    @RequestMapping("/tableData")
    @ResponseBody
    public List<Map<String,String>> tableData(HttpServletRequest request, Model model){
        List<Map<String,String>> result = new ArrayList<>();
        List<para_type> list =  para_typeService.getAll();
        int limit = Integer.valueOf(request.getParameter("limit"));
        int offset = Integer.valueOf(request.getParameter("offset"));
        for(int i = 0 ; i < list.size(); i ++){
            para_type paraType = list.get(i);
            List<inputPara> inputParas = this.inputParaService.findBytypeId(paraType.getId());
            Map<String,String> res = new HashMap<>();
            res.put("id",String.valueOf(paraType.getId()));
            res.put("typeName",paraType.getName());
            res.put("num",String.valueOf(inputParas.size()));
            String paraName = "";
            for(int j = 0 ; j < inputParas.size(); j ++){
                if(j == inputParas.size()-1)
                    paraName += (inputParas.get(j).getType() +" "+ inputParas.get(j).getName());
                else
                    paraName += (inputParas.get(j).getType() +" "+ inputParas.get(j).getName()+",");
            }
            res.put("paraName",paraName);
            result.add(res);
        }
        return result;
    }

    @RequestMapping("/tableDataByID")
    @ResponseBody
    public Map<String,Object> tableDataByID(HttpServletRequest request, Model model){
            Long id = Long.valueOf(request.getParameter("id"));
            para_type paraType = para_typeService.findById(id);
            List<inputPara> inputParas = this.inputParaService.findBytypeId(paraType.getId());
            Map<String,Object> res = new HashMap<>();
            res.put("id",String.valueOf(paraType.getId()));
            res.put("typeName",paraType.getName());
            res.put("num",String.valueOf(inputParas.size()));
            List<String> paraName = new ArrayList<String>();
            for(int j = 0 ; j < inputParas.size(); j ++){
                    paraName.add(inputParas.get(j).getType() +" "+ inputParas.get(j).getName()+" "+inputParas.get(j).getDes());
            }
            res.put("paraName",paraName);
        return res;
    }

    @RequestMapping("/deleteData")
    @ResponseBody
    public Map<String,String> deleteData(HttpServletRequest request, Model model){
        Map<String,String> result = new HashMap<>();
        int typeId = Integer.valueOf(request.getParameter("id"));
        para_typeService.delete(typeId);
        List<inputPara> list = inputParaService.findBytypeId(typeId);
        for(int i = 0 ; i < list.size(); i ++){
            inputParaService.delete(list.get(i));
        }
        result.put("code","0000");
        result.put("msg","删除成功");
        return result;
    }

    @RequestMapping(value = "/editData", method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> editData(HttpServletRequest request, Model model){
        Map<String,String> result = new HashMap<>();
        String name = request.getParameter("name");
        String paraList = request.getParameter("paraList");
        JSONArray paraListList = JSONArray.fromObject(paraList);
        String id = request.getParameter("id");
        para_type paraType = new para_type(Integer.valueOf(id),name);
        System.out.println(id + name + paraListList);
        para_typeService.update(paraType);
        inputParaService.delete(Integer.valueOf(id));
        for(int i = 0 ; i < paraListList.size(); i ++){
            JSONObject inputPara1  = (JSONObject)paraListList.get(i);
            inputPara inputPara = new inputPara(Integer.valueOf(id),(String)inputPara1.get("name"),(String)inputPara1.get("type"),i+1,(String)inputPara1.get("desc"));
            inputParaService.save(inputPara);
        }
        result.put("code","0000");
        result.put("msg","修改成功");
        return result;
    }
    @RequestMapping(value = "/addData", method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> addData(HttpServletRequest request, Model model){
        Map<String,String> result = new HashMap<>();
        String name = request.getParameter("name");
        String paraList = request.getParameter("paraList");
        JSONArray paraListList = JSONArray.fromObject(paraList);
        long cur = currentTimeMillis();
        String id = String.valueOf(cur).substring(4);
        para_type paraType = new para_type(Integer.valueOf(id),name);
        System.out.println(id + name + paraListList);
        para_typeService.save(paraType);
        inputParaService.delete(Integer.valueOf(id));
        for(int i = 0 ; i < paraListList.size(); i ++){
            JSONObject inputPara1  = (JSONObject)paraListList.get(i);
            inputPara inputPara = new inputPara(Integer.valueOf(id),(String)inputPara1.get("name"),(String)inputPara1.get("type"),i+1,(String)inputPara1.get("desc"));
            inputParaService.save(inputPara);
        }
        result.put("code","0000");
        result.put("msg","添加成功");
        return result;
    }

}