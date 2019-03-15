package com.example.demo.controller;

import com.example.demo.DTO.dataSourceDTO;
import com.example.demo.entity.dataSource;
import com.example.demo.service.Impl.dataSourceImpl;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
public class DataSourcePageListController {
    @Resource
    private dataSourceImpl dataSourceService;
    @RequestMapping(value="getPageList",method= RequestMethod.POST)
    @ResponseBody
    public JSONObject getPageList(HttpServletRequest request) {
        JSONObject result = new JSONObject();
        int page = Integer.valueOf(request.getParameter("page"));
        int pageSize = Integer.valueOf(request.getParameter("pageSize"));
        if (page <= 0 || pageSize <= 0) {
            result.put("code", "1001");
            return result;
        }
        List<dataSource> user = this.dataSourceService.getAll();
        if (user == null) {
            result.put("code", "1002");
            return result;
        }
        List<dataSourceDTO> res = new ArrayList<dataSourceDTO>();
        int start = (page - 1) * pageSize;
        int end = start + pageSize - 1 >= user.size() ? (user.size()-1):(start + pageSize - 1);
        for(int i = start ; i <= end; i ++) {
            String tmpString;
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            long lt = new Long(user.get(i).getTimestamp());
            Date date = new Date(lt);
            tmpString = simpleDateFormat.format(date);
            dataSourceDTO tmp = new dataSourceDTO(user.get(i).getDsId(),user.get(i).getDsName(),user.get(i).getDsDesc(),user.get(i).getType(),tmpString,user.get(i).getState());
            res.add(tmp);
        }
        result.put("code", "1000");
        result.put("data", res);
        result.put("count", user.size());
        return result;

    }

}
