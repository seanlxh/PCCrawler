package com.example.demo.controller;

import com.example.demo.DTO.taskDTO;
import com.example.demo.entity.dataTask;
import com.example.demo.service.Impl.dataTaskImpl;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/task")
public class taskController {
    @Resource
    private dataTaskImpl dataTaskService;

    @RequestMapping("/getTaskByID")
    @ResponseBody
    public List<taskDTO> getTaskByID(HttpServletRequest request, Model model){
        Long Id = Long.parseLong(request.getParameter("id"));
        List<dataTask> tasks = this.dataTaskService.findByDsId(Id);
        List<taskDTO> res = new ArrayList<taskDTO>();
        for(int i = 0 ; i < tasks.size(); i ++) {
            String result;
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            long lt = new Long(tasks.get(i).getTimestamp());
            Date date = new Date(lt);
            result = simpleDateFormat.format(date);
            taskDTO tmp = new taskDTO(tasks.get(i).getTaskId(),tasks.get(i).getDsId(),tasks.get(i).getState(),tasks.get(i).getUsername(),result,tasks.get(i).getThreadId());
            res.add(tmp);
        }
        return res;
    }
    @RequestMapping("/getTask")
    @ResponseBody
    public List<taskDTO> toIndex(HttpServletRequest request, Model model){
        //int userId = Integer.parseInt(request.getParameter("id"));
        List<dataTask> tasks = this.dataTaskService.getAll();
        List<taskDTO> res = new ArrayList<taskDTO>();
        for(int i = 0 ; i < tasks.size(); i ++) {
            String result;
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            long lt = new Long(tasks.get(i).getTimestamp());
            Date date = new Date(lt);
            result = simpleDateFormat.format(date);
            taskDTO tmp = new taskDTO(tasks.get(i).getTaskId(),tasks.get(i).getDsId(),tasks.get(i).getState(),tasks.get(i).getUsername(),result,tasks.get(i).getThreadId());
            res.add(tmp);
        }
        return res;
    }
    @RequestMapping("/getUserTask")
    @ResponseBody
    public List<taskDTO> getUserTask(HttpServletRequest request, Model model){
        //int userId = Integer.parseInt(request.getParameter("id"));
        List<dataTask> tasks = this.dataTaskService.findByName(request.getParameter("id"));
        List<taskDTO> res = new ArrayList<taskDTO>();
        for(int i = 0 ; i < tasks.size(); i ++) {
            String result;
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            long lt = new Long(tasks.get(i).getTimestamp());
            Date date = new Date(lt);
            result = simpleDateFormat.format(date);
            taskDTO tmp = new taskDTO(tasks.get(i).getTaskId(),tasks.get(i).getDsId(),tasks.get(i).getState(),tasks.get(i).getUsername(),result,tasks.get(i).getThreadId());
            res.add(tmp);
        }
        return res;
    }
}


