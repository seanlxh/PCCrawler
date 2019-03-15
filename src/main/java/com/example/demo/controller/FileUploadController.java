package com.example.demo.controller;
import com.example.demo.entity.dataSource;
import com.example.demo.entity.functionLogic;
import com.example.demo.entity.paraInfo;
import com.example.demo.entity.resultColumn;
import com.example.demo.service.Impl.*;
import com.example.demo.util.jsonUtil;
import net.sf.json.JSONArray;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.util.List;

@Controller
public class FileUploadController {
    @Resource
    private dataSourceImpl dataSourceService;
    @Resource
    private resultColumnImpl resultColumnService;
    @Resource
    private functionLogicImpl functionLogicService;
    @Resource
    private paraInfoImpl paraInfoService;
    @Resource
    private pathImpl pathService;
    /*
     * 获取file.html页面
     */
    @RequestMapping("file")
    public String file(){
        return "/file";
    }

    /**
     * 实现文件上传
     * */
    @RequestMapping("fileUpload")
    @ResponseBody
    public String fileUpload(@RequestParam("fileName") MultipartFile file){
        if(file.isEmpty()){
            return "false";
        }
        String fileName = file.getOriginalFilename();
        int size = (int) file.getSize();
        System.out.println(fileName + "-->" + size);

        String path = "/Users/seanlxh/Library/ApacheTomcat/webapps/demo-0.0.1-SNAPSHOT/WEB-INF/lib" ;
        File dest = new File(path + "/" + fileName);
//        if(!dest.getParentFile().exists()){ //判断文件父目录是否存在
//            dest.getParentFile().mkdir();
//        }
        System.out.println(dest.getPath());
        try {
            file.transferTo(dest); //保存文件
            return "true";
        } catch (IllegalStateException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return "false";
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return "false";
        }
    }

    @RequestMapping("multifile")
    public String multifile(){
        return "/multifile";
    }

    /**
     * 实现多文件上传
     * */
    @RequestMapping(value="multifileUpload",method= RequestMethod.POST)
    public @ResponseBody String multifileUpload(HttpServletRequest request){

        List<MultipartFile> files = ((MultipartHttpServletRequest)request).getFiles("fileName");

        if(files.isEmpty()){
            return "false";
        }

        String path = "/Users/seanlxh/Library/ApacheTomcat/webapps/demo-0.0.1-SNAPSHOT/WEB-INF/lib" ;

        for(MultipartFile file:files){
            String fileName = file.getOriginalFilename();
            int size = (int) file.getSize();
            System.out.println(fileName + "-->" + size);

            if(file.isEmpty()){
                return "false";
            }else{
                File dest = new File(path + "/" + fileName);
                if(!dest.getParentFile().exists()){ //判断文件父目录是否存在
                    dest.getParentFile().mkdir();
                }
                try {
                    file.transferTo(dest);
                }catch (Exception e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                    return "false";
                }
            }
        }
        return "true";
    }

    /**
     * 实现多文件上传
     * */
    @RequestMapping(value="csvjarfileUpload",method= RequestMethod.POST)
    public String csvjarfileUpload(HttpServletRequest request){
        long time =  System.currentTimeMillis();
        List<MultipartFile> files = ((MultipartHttpServletRequest)request).getFiles("fileName");
        String name = null;
        String desc = null;
        try {
            name = new String(request.getParameter("name").getBytes("gbk"),"UTF-8");
            desc = new String(request.getParameter("desc").getBytes("gbk"),"UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        int type = Integer.valueOf(request.getParameter("type"));
        dataSource ds = new dataSource(time,name+"(java)",desc,type,time,1);
        dataSourceService.save(ds);
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

        String path1 = pathService.findById("java").getCsvpath() ;
        String path2 = pathService.findById("java").getLibpath() ;

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

        try {
            BufferedReader reader = new BufferedReader(new FileReader(dest1));
//            reader.readLine();//第一行信息，为标题信息，不用,如果需要，注释掉
            String line = null;
            int i = 0;
            while((line=reader.readLine())!=null){
                i ++;
                String item[] = line.split(";");//CSV格式文件为逗号分隔符文件，这里根据逗号切分
                String className = item[0];
                String methodName = item[1];
                int paraNum = Integer.valueOf(item[2]);
                String resultType = item[item.length-1];
                //int value = Integer.parseInt(last);//如果是数值，可以转化为数值
                long functime =  System.currentTimeMillis();
                functionLogic functionLogic = new functionLogic(functime,time,className,methodName,paraNum,i,resultType);
                functionLogicService.save(functionLogic);
                for(int j = 0 ; j < paraNum; j ++){
                    long tmptime =  System.currentTimeMillis()+j;
                    String paraType = item[3+j*2];
                    String para = item[4+j*2];
                    int pathCode = Integer.valueOf(para);
                    String content = item[3 + paraNum * 2 + j];
                    if(pathCode == 1){
                        paraInfo paraInfo = new paraInfo();
                        paraInfo.setParaId(tmptime);
                        paraInfo.setFuncId(functime);
                        paraInfo.setParaType(paraType);
                        paraInfo.setOriType(2);
                        paraInfo.setInputContent(content);
                        paraInfoService.save(paraInfo);
                    }
                    else if(pathCode == 2){
                        paraInfo paraInfo = new paraInfo();
                        paraInfo.setParaId(tmptime);
                        paraInfo.setFuncId(functime);
                        paraInfo.setParaType(paraType);
                        paraInfo.setOriType(1);
                        paraInfo.setFuncResult(Integer.valueOf(content));
                        paraInfoService.save(paraInfo);
                    }
                    else if(pathCode == 3){
                        paraInfo paraInfo = new paraInfo();
                        paraInfo.setParaId(tmptime);
                        paraInfo.setFuncId(functime);
                        paraInfo.setParaType(paraType);
                        paraInfo.setOriType(3);
                        paraInfo.setInputPara(content);
                        paraInfoService.save(paraInfo);
                    }
                }
                System.out.println(line);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }


        return "success";
    }
}