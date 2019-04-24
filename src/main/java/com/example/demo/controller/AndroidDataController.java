package com.example.demo.controller;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/Android")
@ResponseBody
public class AndroidDataController {
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

    @RequestMapping(value="test",method= RequestMethod.POST)
    public String csvjarfileUpload(HttpServletRequest request){
        InputStream reader = null;
        try {
            reader = request.getInputStream();
        } catch (IOException e) {
            e.printStackTrace();
        }
        String result = new BufferedReader(new InputStreamReader(reader))
                .lines().parallel().collect(Collectors.joining(System.lineSeparator()));
        result = unicodeToString(result);
        System.out.println(result);
        return result;
    }
}
