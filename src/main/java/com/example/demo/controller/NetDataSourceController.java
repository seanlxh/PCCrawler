package com.example.demo.controller;

import com.example.demo.DTO.dataSourceDTO;
import com.example.demo.entity.*;
import com.example.demo.service.Impl.NetDataSourceImpl;
import com.example.demo.service.Impl.pathImpl;
import com.example.demo.service.Impl.resultColumnImpl;
import com.example.demo.util.jsonUtil;
import net.sf.json.JSONArray;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import com.jacob.activeX.ActiveXComponent;
import com.jacob.com.ComThread;
import com.jacob.com.Dispatch;
import com.jacob.com.Variant;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
public class NetDataSourceController {
    @Resource
    private NetDataSourceImpl netDataSourceService;
    @Resource
    private resultColumnImpl resultColumnService;
    @Resource
    private pathImpl pathService;

    @RequestMapping("/getNetDataSource")
    @ResponseBody
    public List<dataSourceDTO> getNetDataSource(HttpServletRequest request, Model model){
        List<NetDataSource> netDataSources = netDataSourceService.getAll();
        List<dataSourceDTO> res = new ArrayList<dataSourceDTO>();
        for(int i = 0 ; i < netDataSources.size(); i ++) {
            String result;
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            long lt = new Long(netDataSources.get(i).getTimestamp());
            Date date = new Date(lt);
            result = simpleDateFormat.format(date);
            dataSourceDTO tmp = new dataSourceDTO(netDataSources.get(i).getDsId(),netDataSources.get(i).getDsName(),netDataSources.get(i).getDsDesc(),netDataSources.get(i).getType(),result,netDataSources.get(i).getState());
            res.add(tmp);
        }
        return res;
    }

    /**
     * 实现多文件上传
     * */
    @RequestMapping(value="netcsvjarfileUpload",method= RequestMethod.POST)
    public String netcsvjarfileUpload(HttpServletRequest request){
        long time =  System.currentTimeMillis();
        List<MultipartFile> files = ((MultipartHttpServletRequest)request).getFiles("fileName");
        String name = request.getParameter("name");
        String desc = request.getParameter("desc");
        String csvPath = files.get(0).getOriginalFilename();
        NetDataSource ds = new NetDataSource(time,csvPath,name,desc,1,time,1);
        netDataSourceService.save(ds);
        String columnName = request.getParameter("columnName");
        String columnTitle = "";
        JSONArray jsonArray = jsonUtil.getJsonArrayFromString(columnName);
        for(int m = 0 ; m < jsonArray.size(); m ++){
            String obj = jsonArray.get(m).toString();
            if(m != 0){
                columnTitle += ("|"+obj.toString());
            }
            else{
                columnTitle += obj.toString();
            }
        }
        resultColumn rc = new resultColumn(time,jsonArray.size(),columnTitle);
        resultColumnService.save(rc);
        if(files.isEmpty()){
            return "fail";
        }

        String path1 = pathService.findById(".net").getCsvpath() ;
        String path2 = pathService.findById(".net").getLibpath() ;

        MultipartFile file1 = files.get(0);

        String fileName = file1.getOriginalFilename();
        int size = (int) file1.getSize();
        System.out.println(fileName + "-->" + size);
        File dest1;
        if(file1.isEmpty()){
            return "fail";
        }else{
            dest1 = new File(path1 + "/" + fileName);

            if(!dest1.getParentFile().exists()){ //判断文件父目录是否存在
                dest1.getParentFile().mkdir();
            }
            try {
                    file1.transferTo(dest1);
            }catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
                return "fail";
            }
        }
        for(int i = 1 ; i < files.size(); i ++){
            MultipartFile file2 = files.get(i);
            File dest2;
            String fileName2 = file2.getOriginalFilename();
            if(file2.isEmpty()){
                return "fail";
            }
            else{
                dest2 = new File(path2 + "/" + fileName2);
                if(!dest2.getParentFile().exists()){ //判断文件父目录是否存在
                    dest2.getParentFile().mkdir();
                }
                try {
                    file2.transferTo(dest2);
                }catch (Exception e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                    return "fail";
                }
            }

        }

        return "success";
    }

    @RequestMapping("/netExecute")
    @ResponseBody
    public Map<String,String> netExecute(HttpServletRequest request, Model model){
        String id = request.getParameter("id");
        ActiveXComponent dotnetCom = new ActiveXComponent("InvokeCSharp.InvokeClass");
        String path = pathService.findById(".net").getCsvpath() ;
        NetDataSource netDataSource = netDataSourceService.findById(Long.parseLong(id));
        Variant var = Dispatch.call(dotnetCom,"Execute",path+netDataSource.getCsvname(),"C:\\",resultColumnService.findById(Long.parseLong(id)).getColumnname(),"C:\\123.csv");
        String str  = var.toString();
        System.out.println(str);
        Map<String,String> res = new HashMap<String, String>();
        res.put("result","success");
        return res;
    }
}
