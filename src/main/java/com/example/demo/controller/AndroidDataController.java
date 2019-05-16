package com.example.demo.controller;

import com.example.demo.DTO.dataSourceDTO;
import com.example.demo.entity.AndroidDataSource;
import com.example.demo.entity.dataSource;
import com.example.demo.service.Impl.androidDatasourceImpl;
import com.example.demo.service.Impl.dataSourceImpl;
import com.example.demo.util.JDBCUtil;
import org.apache.http.HttpEntity;
import org.apache.http.ParseException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/Android")
@ResponseBody
public class AndroidDataController {

    @Resource
    private androidDatasourceImpl androidDatasourceService;


    @RequestMapping("/executeAndroid")
    @ResponseBody
    public Map<String,String> executeAndroid(HttpServletRequest request, Model model){
        String path = request.getParameter("path");
        String msg = sendGet(path);
        Map<String,String> res = new HashMap<>();
        res.put("msg",msg);
        return res;
    }


    @RequestMapping("/showDataSource")
    @ResponseBody
    public List<AndroidDataSource> toIndex(HttpServletRequest request, Model model){
        //int userId = Integer.parseInt(request.getParameter("id"));
        List<AndroidDataSource> res = this.androidDatasourceService.getAll();
        return res;
    }


    public static String unicodeToString(String str) {

        Pattern pattern = Pattern.compile("(\\\\u(\\p{XDigit}{4}))");

        Matcher matcher = pattern.matcher(str);

        char ch;

        while (matcher.find()) {

            ch = (char) Integer.parseInt(matcher.group(2), 16);

            str = str.replace(matcher.group(1), ch+"" );

        }

        return str;

    }


    public static String sendGet(String url) {
        //1.获得一个httpclient对象
        CloseableHttpClient httpclient = HttpClients.createDefault();
        //2.生成一个get请求
        HttpGet httpget = new HttpGet(url);
        CloseableHttpResponse response = null;
        try {
            //3.执行get请求并返回结果
            response = httpclient.execute(httpget);
        } catch (IOException e1) {
            e1.printStackTrace();
        }
        String result = null;
        try {
            //4.处理结果，这里将结果返回为字符串
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                result = EntityUtils.toString(entity);
            }
        } catch (ParseException | IOException e) {
            e.printStackTrace();
        } finally {
            try {
                response.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    @RequestMapping(value="test",method= RequestMethod.POST)
    public String getdata(HttpServletRequest request){
        InputStream reader = null;
        try {
            reader = request.getInputStream();
        } catch (IOException e) {
            e.printStackTrace();
        }
        String result = request.getParameter("data");
        result = unicodeToString(result);
        Map<String,Object> map = new HashMap<String, Object>();
        String tablename = request.getParameter("tablename");

        JDBCUtil jdbcUtil = new JDBCUtil();
        jdbcUtil.insertData(tablename,result);
        System.out.println(result);
        return result;
    }
}
