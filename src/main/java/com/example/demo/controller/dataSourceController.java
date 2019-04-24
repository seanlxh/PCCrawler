package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.service.Impl.*;
import javafx.scene.control.TreeItem;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ClassUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Array;
import java.lang.reflect.Method;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.*;

import static com.example.demo.util.classUtil.*;
import static com.example.demo.util.classUtil.judgeBasicTypeByName;

@Controller
@RequestMapping("/execute")
public class dataSourceController {
    @Resource
    private dataTaskImpl dataTaskService;
    @Resource
    private dataSourceImpl dataSourceService;
    @Resource
    private functionLogicImpl functionLogicService;
    @Resource
    private inputParaImpl inputParaService;
    @Resource
    private paraInfoImpl paraInfoService;
    @Resource
    private resultColumnImpl resultColumnService;

    private static ArrayList<ArrayList<String>> listContent = new ArrayList<ArrayList<String>>();

    private static ArrayList<Integer> arrayList = new ArrayList<Integer>();


    @RequestMapping("/execute")
    @ResponseBody
    public Object toIndex(HttpServletRequest request, Model model){
        HashMap<Integer,Object> integerObjectHashMap = new HashMap<Integer,Object>();
        Long typeId = Long.parseLong(request.getParameter("id"));
        dataSource ds = this.dataSourceService.findById(typeId);
        List<functionLogic> functionLogics = functionLogicService.selectByDSIDWithLogic(ds.getDsId());
        List<inputPara> inputParas = inputParaService.findBytypeId(ds.getType());
        resultColumn resultColumn =  resultColumnService.selectByPrimaryKey(ds.getDsId());
        if(ds.getType() == 1){
            for(int i = 0 ; i < functionLogics.size(); i ++){
                    String methodName = functionLogics.get(i).getMethodname();
                    String className = functionLogics.get(i).getClassname();
                    int num = functionLogics.get(i).getParanum();
                    List<paraInfo> paras = null;
                    if(num != 0){
                        paras = paraInfoService.getParaInfoByFuncId(functionLogics.get(i).getFunctionId());
                    }
                    ArrayList<Object> objectArray = new ArrayList<Object>();
                    ArrayList<Object> curInputClasses = new ArrayList<Object>();
                    Object[] objectFinalArray;
                if(paras!=null) {
                    for (int k = 0; k < paras.size(); k++) {
                        paraInfo para = paras.get(k);
                        Class tmpClass;
                        if (para.getParaType().contains("[]")) {
                            tmpClass = getClassFromName(para.getParaType().split("\\[")[0] + "[ ]");
                        } else {
                            tmpClass = getClassFromName(para.getParaType());
                        }
                        curInputClasses.add(tmpClass);
                        Object tmpObj = null;
                        if (para.getOriType() == 2) {
                            if(judgeBasicTypeByName(tmpClass)){
                                tmpObj = getObjectFromStringAndClass(tmpClass, para.getInputContent().substring(1,para.getInputContent().length()-1));
                            }
                            else{
                                JSONObject tmpStr = JSONObject.fromObject(para.getInputContent().substring(1,para.getInputContent().length()-1));
                                tmpObj = (Object)JSONObject.toBean(tmpStr, tmpClass);
                            }
                        } else if(para.getOriType() == 1){
                            tmpObj = integerObjectHashMap.get(para.getFuncResult());
                        }
                        else if(para.getOriType() == 3){
                            tmpObj = Integer.parseInt(request.getParameter(para.getInputPara()));
                        }

                        objectArray.add(tmpObj);
                    }
                }
                    objectFinalArray = (Object[]) objectArray.toArray();
                    Class[] classArray = (Class[]) curInputClasses.toArray(new Class[curInputClasses.size()]);
                    Object resultText = null;
                    try {
                        resultText = execute(className,
                                methodName , classArray, objectFinalArray);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    integerObjectHashMap.put(i+1,resultText);
                    if (resultText != null && i == functionLogics.size() - 1) {
                            JSONObject json = new JSONObject();
                            Collection collection = setItems(resultText);
                            if(collection!=null){
                                json.put("count", collection.size());
                            }
                            else{
                                json.put("count", 1);
                            }
                             JSONArray jsonArray = new JSONArray();
                             jsonArray.add(0, json);
                             JSONObject result = new JSONObject();
                             result.put("result",jsonArray);
                             result.put("code","0000");
                             result.put("msg","服务调用成功");
                            return result;
                    }
            }
        }
        else if(ds.getType() == 2){

            for(int i = 0 ; i < functionLogics.size(); i ++){
                String methodName = functionLogics.get(i).getMethodname();
                String className = functionLogics.get(i).getClassname();
                int num = functionLogics.get(i).getParanum();
                List<paraInfo> paras = null;
                if(num != 0){
                    paras = paraInfoService.getParaInfoByFuncId(functionLogics.get(i).getFunctionId());
                }
                ArrayList<Object> objectArray = new ArrayList<Object>();
                ArrayList<Object> curInputClasses = new ArrayList<Object>();
                Object[] objectFinalArray;
                if(paras!=null) {
                    for (int k = 0; k < paras.size(); k++) {
                        paraInfo para = paras.get(k);
                        Class tmpClass;
                        if (para.getParaType().contains("[]")) {
                            tmpClass = getClassFromName(para.getParaType().split("\\[")[0] + "[ ]");
                        } else {
                            tmpClass = getClassFromName(para.getParaType());
                        }
                        curInputClasses.add(tmpClass);
                        Object tmpObj = null;
                        if (para.getOriType() == 2) {
                            if(judgeBasicTypeByName(tmpClass)){
                                tmpObj = getObjectFromStringAndClass(tmpClass, para.getInputContent().substring(1,para.getInputContent().length()-1));
                            }
                            else{
                                JSONObject tmpStr = JSONObject.fromObject(para.getInputContent().substring(1,para.getInputContent().length()-1));
                                tmpObj = (Object)JSONObject.toBean(tmpStr, tmpClass);
                            }
                        } else if(para.getOriType() == 1){
                            tmpObj = integerObjectHashMap.get(para.getFuncResult());
                        }
                        else if(para.getOriType() == 3){
                            tmpObj = Integer.parseInt(request.getParameter(para.getInputPara()));
                        }

                        objectArray.add(tmpObj);
                    }
                }

                objectFinalArray = (Object[]) objectArray.toArray();
                Class[] classArray = (Class[]) curInputClasses.toArray(new Class[curInputClasses.size()]);
                Object resultText = null;
                try {
                    resultText = execute(className,
                            methodName , classArray, objectFinalArray);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                integerObjectHashMap.put(i+1,resultText);
                if (resultText != null && i == functionLogics.size() - 1) {
                    Collection collection = setItems(resultText);
                    JSONArray jsonArray = new JSONArray();
                    if (collection != null) {
                        Iterator it = collection.iterator();
                        int num1 = Integer.parseInt(request.getParameter("Num"));
                        int count = 0;
                        while (it.hasNext()) {
                            if(count >= num1)
                                break;
                            count++;
                            JSONObject jsonArray1 = new JSONObject();
                            Object obj = it.next();
                                Collection collection1 = setItems(obj);
                                if (collection1 != null) {
                                    ArrayList<Object> tmp = new ArrayList<Object>(collection1);
                                    String[] columnname = resultColumn.getColumnname().split("\\|");

                                    for (int m = 0; m < tmp.size(); m++) {
                                        Object value = tmp.get(m);
                                        if(value == null){
                                            jsonArray1.put(m,"");
                                        }
                                        else{
                                            if (judgeBasicType(value)) {
                                                //result.appendText(value.toString()+" ");
                                                jsonArray1.put(m,value.toString());
                                            } else {
                                                //result.appendText(ReflectionToStringBuilder.toString(value)+" ");
                                                jsonArray1.put(m,ReflectionToStringBuilder.toString(value));
                                            }
                                        }

                                    }


                                }
                                else {
                                    if (judgeBasicType(obj)) {
                                        //result.appendText(obj.toString()+" ");
                                        jsonArray1.put("obj",obj.toString());
                                    } else {
                                        //result.appendText(ReflectionToStringBuilder.toString(obj)+" ");
                                        jsonArray1.put("obj",ReflectionToStringBuilder.toString(obj));
                                    }
                                    //result.appendText("\n");
                                }
                            jsonArray.add(jsonArray1);
                        }

                    }
                    else {
                            if (judgeBasicType(resultText)) {
                                //result.appendText(resultText.toString()+" ");
                                jsonArray.add(resultText.toString());
                            }
                            else {

                                if(functionLogics.get(i).getResulttype().equals("java.sql.ResultSet")){
                                    ResultSet tmp = (ResultSet)resultText;
                                    try {
                                        List list = new ArrayList();
                                        ResultSetMetaData md = tmp.getMetaData();
                                        int columnCount = md.getColumnCount();
                                        while (tmp.next()) {
                                            JSONObject jsonArray1 = new JSONObject();
                                            for (int n = 1; n <= columnCount; n++) {
                                                String key = md.getColumnName(n);
                                                String value;
                                                if(tmp.getObject(n)!=null){
                                                    value = tmp.getObject(n).toString();
                                                }else {
                                                    value = "";
                                                }
                                                jsonArray1.put(key, value);//获取键名及值
                                            }
                                        jsonArray.add(jsonArray1);
                                        }
                                    } catch (SQLException e) {
                                        e.printStackTrace();
                                    }

//                    rs.beforeFirst();
//                    String data[][] = new String[row][col];
//                    //取结果集中的数据, 放在data数组中
//                    for (int i = 0; i < row; i++) {
//                        rs.next();
//                        for (int j = 0; j < col; j++) {
//                            data[i][j] = rs.getString (j + 1);
//                            //System.out.println (data[i][j]);
//                        }
//                    }//End for
                                }else{
                                    jsonArray.add(ReflectionToStringBuilder.toString(resultText));
                                }
                                //result.appendText(ReflectionToStringBuilder.toString(resultText)+" ");

                            }

                            //result.appendText("\n");
                        }


                    JSONObject result = new JSONObject();
                    result.put("result",jsonArray);
                    result.put("code","0000");
                    result.put("msg","服务调用成功");
                    return result;
                }
            }


        }
        else if(ds.getType() == 3){

            for(int i = 0 ; i < functionLogics.size(); i ++){
                String methodName = functionLogics.get(i).getMethodname();
                String className = functionLogics.get(i).getClassname();
                int num = functionLogics.get(i).getParanum();
                List<paraInfo> paras = null;
                if(num != 0){
                    paras = paraInfoService.getParaInfoByFuncId(functionLogics.get(i).getFunctionId());
                }
                ArrayList<Object> objectArray = new ArrayList<Object>();
                ArrayList<Object> curInputClasses = new ArrayList<Object>();
                Object[] objectFinalArray;
                if(paras!=null) {
                    for (int k = 0; k < paras.size(); k++) {
                        paraInfo para = paras.get(k);
                        Class tmpClass;
                        if (para.getParaType().contains("[]")) {
                            tmpClass = getClassFromName(para.getParaType().split("\\[")[0] + "[ ]");
                        } else {
                            tmpClass = getClassFromName(para.getParaType());
                        }
                        curInputClasses.add(tmpClass);
                        Object tmpObj = null;
                        if (para.getOriType() == 2) {
                            if(judgeBasicTypeByName(tmpClass)){
                                tmpObj = getObjectFromStringAndClass(tmpClass, para.getInputContent().substring(1,para.getInputContent().length()-1));
                            }
                            else{
                                JSONObject tmpStr = JSONObject.fromObject(para.getInputContent().substring(1,para.getInputContent().length()-1));
                                tmpObj = (Object)JSONObject.toBean(tmpStr, tmpClass);
                            }
                        } else if(para.getOriType() == 1){
                            tmpObj = integerObjectHashMap.get(para.getFuncResult());
                        }
                        else if(para.getOriType() == 3){
                            tmpObj = Integer.parseInt(request.getParameter(para.getInputPara()));
                        }

                        objectArray.add(tmpObj);
                    }
                }

                objectFinalArray = (Object[]) objectArray.toArray();
                Class[] classArray = (Class[]) curInputClasses.toArray(new Class[curInputClasses.size()]);


                Object resultText = null;
                try {
                    resultText = execute(className,
                            methodName , classArray, objectFinalArray);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                integerObjectHashMap.put(i+1,resultText);
                if (resultText != null && i == functionLogics.size() - 1) {
                    Collection collection = setItems(resultText);
                    JSONArray jsonArray = new JSONArray();
                    if (collection != null) {
                        Iterator it = collection.iterator();
                        int num1 = Integer.parseInt(request.getParameter("Num"));
                        int count = 0;
                        while (it.hasNext()) {
                            if(count >= num1)
                                break;
                            count++;
                            JSONObject jsonArray1 = new JSONObject();
                            Object obj = it.next();
                            Collection collection1 = setItems(obj);
                            if (collection1 != null) {
                                ArrayList<Object> tmp = new ArrayList<Object>(collection1);
                                String[] columnname = resultColumn.getColumnname().split("\\|");

                                for (int m = 0; m < tmp.size(); m++) {
                                    Object value = tmp.get(m);
                                    if(value == null){
                                        jsonArray1.put(m,"");
                                    }
                                    else{
                                        if (judgeBasicType(value)) {
                                            //result.appendText(value.toString()+" ");
                                            jsonArray1.put(m,value.toString());
                                        } else {
                                            //result.appendText(ReflectionToStringBuilder.toString(value)+" ");
                                            jsonArray1.put(m,ReflectionToStringBuilder.toString(value));
                                        }
                                    }
                                }
                            }
                            else {
                                if (judgeBasicType(obj)) {
                                    //result.appendText(obj.toString()+" ");
                                    jsonArray1.put("obj",obj.toString());
                                } else {
                                    //result.appendText(ReflectionToStringBuilder.toString(obj)+" ");
                                    jsonArray1.put("obj",ReflectionToStringBuilder.toString(obj));
                                }
                                //result.appendText("\n");
                            }
                            jsonArray.add(jsonArray1);
                        }
                    }
                    else {
                        if (judgeBasicType(resultText)) {
                            //result.appendText(resultText.toString()+" ");
                            jsonArray.add(resultText.toString());
                        } else {
                            //result.appendText(ReflectionToStringBuilder.toString(resultText)+" ");
                            jsonArray.add(ReflectionToStringBuilder.toString(resultText));
                        }
                        //result.appendText("\n");
                    }
                    JSONObject result = new JSONObject();
                    result.put("result",jsonArray);
                    result.put("code","0000");
                    result.put("msg","服务调用成功");
                    return result;
                }
            }
        }
        return ds;
    }





//
//    @RequestMapping("/store")
//    @ResponseBody
//    public JSONObject toStore(HttpServletRequest request, Model model){
//        Long typeId = Long.parseLong(request.getParameter("id"));
//        return threadController.threadStart(typeId,request);
////        HashMap<Integer,Object> integerObjectHashMap = new HashMap<Integer,Object>();
////        Long typeId = Long.parseLong(request.getParameter("id"));
////        dataSource ds = this.dataSourceService.findById(typeId);
////        List<functionLogic> functionLogics = functionLogicService.selectByDSIDWithLogic(ds.getDsId());
////        List<inputPara> inputParas = inputParaService.findBytypeId(ds.getType());
////        resultColumn resultColumn =  resultColumnService.selectByPrimaryKey(ds.getDsId());
////
////        if(ds.getType() == 2){
////            listContent.clear();
////            for(int i = 0 ; i < functionLogics.size(); i ++){
////                String methodName = functionLogics.get(i).getMethodname();
////                String className = functionLogics.get(i).getClassname();
////                int num = functionLogics.get(i).getParanum();
////                List<paraInfo> paras = null;
////                if(num != 0){
////                    paras = paraInfoService.getParaInfoByFuncId(functionLogics.get(i).getFunctionId());
////                }
////                ArrayList<Object> objectArray = new ArrayList<Object>();
////                ArrayList<Object> curInputClasses = new ArrayList<Object>();
////                Object[] objectFinalArray;
////                if(paras!=null) {
////                    for (int k = 0; k < paras.size(); k++) {
////                        paraInfo para = paras.get(k);
////                        Class tmpClass;
////                        if (para.getParaType().contains("[ ]")) {
////                            tmpClass = getClassFromName(para.getParaType().split("\\[")[0] + "[ ]");
////                        } else {
////                            tmpClass = getClassFromName(para.getParaType());
////                        }
////                        curInputClasses.add(tmpClass);
////                        Object tmpObj = null;
////                        if (para.getOriType() == 2) {
////                            Object tmptmpObj;
////                            if(judgeBasicTypeByName(tmpClass)){
////                                tmpObj = getObjectFromStringAndClass(tmpClass, para.getInputContent().substring(1,para.getInputContent().length()-1));
////                            }
//////                                else{
//////                                    JSONObject tmpStr = (JSONObject)jsonArray.get(0);
//////                                    tmptmpObj = (Object)JSONObject.toBean(tmpStr, tmpClass);
//////                                }
////                        } else if(para.getOriType() == 1){
////                            tmpObj = integerObjectHashMap.get(para.getFuncResult());
////                        }
////                        objectArray.add(tmpObj);
////                    }
////                }
////
////                objectFinalArray = (Object[]) objectArray.toArray();
////                Class[] classArray = (Class[]) curInputClasses.toArray(new Class[curInputClasses.size()]);
////
////
////                Object resultText = null;
////                try {
////                    resultText = execute(className,
////                            methodName , classArray, objectFinalArray);
////                } catch (Exception e) {
////                    e.printStackTrace();
////                }
////                if (resultText != null) {
////                    Collection collection = setItems(resultText);
////                    integerObjectHashMap.put(i+1,resultText);
////                    String[] columnname = resultColumn.getColumnname().split("\\|");
////                    listContent.add(new ArrayList<String>());
//////                    listContent.add(new ArrayList<String>());
//////                    listContent.get(listContent.size() - 1).add("第" + String.valueOf(i + 1) + "个：");
////                    String CName = "";
////                    for(int t = 0 ; t < columnname.length; t ++){
////                        if(t == 0)
////                            CName += (columnname[t]);
////                        else
////                            CName += (","+columnname[t]);
////                    }
////                    listContent.get(listContent.size() - 1).add(CName);
////                    if(functionLogics.size() - 1  == i){
////                        if (collection != null) {
////                            Iterator it = collection.iterator();
////                            int num1 = Integer.parseInt(request.getParameter("Num"));
////                            int count = 0;
////                            while (it.hasNext()) {
////                                if(count >= num1)
////                                    break;
////                                count++;
////                                listContent.add(new ArrayList<String>());
////
////                                Object obj = it.next();
////                                Collection collection1 = setItems(obj);
////                                if (collection1 != null) {
////                                    ArrayList<Object> tmp = new ArrayList<Object>(collection1);
////
////
////                                    for (int m = 0; m < tmp.size(); m++) {
////                                        Object value = tmp.get(m);
////                                        if (judgeBasicType(value)) {
////                                            //result.appendText(value.toString()+" ");
////
////                                            listContent.get(listContent.size() - 1).add(value.toString());
////                                        } else {
////                                            //result.appendText(ReflectionToStringBuilder.toString(value)+" ");
////                                            listContent.get(listContent.size() - 1).add(ReflectionToStringBuilder.toString(value));
////                                        }
////                                    }
////
////
////                                }
////                                else {
////                                    listContent.add(new ArrayList<String>());
////                                    if (judgeBasicType(obj)) {
////                                        //result.appendText(obj.toString()+" ");
////                                        listContent.get(listContent.size() - 1).add(obj.toString());
////                                    } else {
////                                        //result.appendText(ReflectionToStringBuilder.toString(obj)+" ");
////                                        listContent.get(listContent.size() - 1).add(ReflectionToStringBuilder.toString(obj));
////                                    }
////                                    //result.appendText("\n");
////                                }
////
////                            }
////
////                        }
////                        else {
////                            listContent.add(new ArrayList<String>());
////                            if (judgeBasicType(resultText)) {
////                                //result.appendText(resultText.toString()+" ");
////                                listContent.get(listContent.size() - 1).add(resultText.toString());
////                            } else {
////                                //result.appendText(ReflectionToStringBuilder.toString(resultText)+" ");
////                                listContent.get(listContent.size() - 1).add(ReflectionToStringBuilder.toString(resultText));
////                            }
////
////                            //result.appendText("\n");
////                        }
////                    }
////
////
////
////                }
////            }
////            boolean isSucess=false;
////            java.io.FileOutputStream out=null;
////            java.io.OutputStreamWriter osw=null;
////            java.io.BufferedWriter bw=null;
////            try {
////                out = new java.io.FileOutputStream(ClassUtils.getDefaultClassLoader().getResource("").getPath()+System.currentTimeMillis()+".csv",true);
////                System.out.println(ClassUtils.getDefaultClassLoader().getResource("").getPath());
////                osw = new java.io.OutputStreamWriter(out,"GBK");
////                bw =new java.io.BufferedWriter(osw);
////
////                for(int m = 0 ; m < listContent.size() ; m ++){
////                    String a =  "";
////                    for(int n = 0 ; n < listContent.get(m).size() ; n ++){
////                        a += listContent.get(m).get(n)+"',";
////
////                    }
////                    bw.append(a).append("\n");
////                }
////                System.out.println("123");
////                isSucess=true;
////
////            } catch (Exception e) {
////                isSucess=false;
////            }finally{
////                if(bw!=null){
////                    try {
////                        bw.close();
////                        bw=null;
////                    } catch (java.io.IOException e) {
////                        e.printStackTrace();
////                    }
////                }
////                if(osw!=null){
////                    try {
////                        osw.close();
////                        osw=null;
////                    } catch (java.io.IOException e) {
////                        e.printStackTrace();
////                    }
////                }
////                if(out!=null){
////                    try {
////                        out.close();
////                        out=null;
////                    } catch (java.io.IOException e) {
////                        e.printStackTrace();
////                    }
////                }
////            }
////            JSONObject result = new JSONObject();
////            result.put("code","0000");
////            result.put("msg","服务调用成功");
////            dataTask tmp = new dataTask(System.currentTimeMillis(),ds.getDsId(),1,"userName",System.currentTimeMillis());
////            dataTaskService.save(tmp);
////            return result;
////
////
////        }
////        else if(ds.getType() == 3){
////            listContent.clear();
////            for(int i = 0 ; i < functionLogics.size(); i ++){
////                String methodName = functionLogics.get(i).getMethodname();
////                String className = functionLogics.get(i).getClassname();
////                int num = functionLogics.get(i).getParanum();
////                List<paraInfo> paras = null;
////                if(num != 0){
////                    paras = paraInfoService.getParaInfoByFuncId(functionLogics.get(i).getFunctionId());
////                }
////                ArrayList<Object> objectArray = new ArrayList<Object>();
////                ArrayList<Object> curInputClasses = new ArrayList<Object>();
////                Object[] objectFinalArray;
////                if(paras!=null) {
////                    for (int k = 0; k < paras.size(); k++) {
////                        paraInfo para = paras.get(k);
////                        Class tmpClass;
////                        if (para.getParaType().contains("[ ]")) {
////                            tmpClass = getClassFromName(para.getParaType().split("\\[")[0] + "[ ]");
////                        } else {
////                            tmpClass = getClassFromName(para.getParaType());
////                        }
////                        curInputClasses.add(tmpClass);
////                        Object tmpObj = null;
////                        if (para.getOriType() == 2) {
////                            Object tmptmpObj;
////                            if(judgeBasicTypeByName(tmpClass)){
////                                tmpObj = getObjectFromStringAndClass(tmpClass, para.getInputContent().substring(1,para.getInputContent().length()-1));
////                            }
//////                                else{
//////                                    JSONObject tmpStr = (JSONObject)jsonArray.get(0);
//////                                    tmptmpObj = (Object)JSONObject.toBean(tmpStr, tmpClass);
//////                                }
////                        } else if(para.getOriType() == 1){
////                            tmpObj = integerObjectHashMap.get(para.getFuncResult());
////                        }
////                        else if(para.getOriType() == 3){
////                            tmpObj = Integer.parseInt(request.getParameter("PageNum"));
////                        }
////                        objectArray.add(tmpObj);
////                    }
////                }
////
////                objectFinalArray = (Object[]) objectArray.toArray();
////                Class[] classArray = (Class[]) curInputClasses.toArray(new Class[curInputClasses.size()]);
////
////
////                Object resultText = null;
////                try {
////                    resultText = execute(className,
////                            methodName , classArray, objectFinalArray);
////                } catch (Exception e) {
////                    e.printStackTrace();
////                }
////                if (resultText != null) {
////                    Collection collection = setItems(resultText);
////                    integerObjectHashMap.put(i+1,resultText);
////                    String[] columnname = resultColumn.getColumnname().split("\\|");
//////                    listContent.add(new ArrayList<String>());
//////                    listContent.get(listContent.size() - 1).add("第" + String.valueOf(i + 1) + "个：");
////
////                    String CName = "";
////                    for(int t = 0 ; t < columnname.length; t ++) {
////                        if (t == 0)
////                            CName += (columnname[t]);
////                        else
////                            CName += ("," + columnname[t]);
////                    }
////                    listContent.add(new ArrayList<String>());
////                    listContent.get(listContent.size() - 1).add(CName);
////                    if(functionLogics.size() - 1 == i){
////                        if (collection != null) {
////                            Iterator it = collection.iterator();
////                            int num1 = Integer.parseInt(request.getParameter("Num"));
////                            int count = 0;
////                            while (it.hasNext()) {
////                                if(count >= num1)
////                                    break;
////                                count++;
////                                listContent.add(new ArrayList<String>());
////                                Object obj = it.next();
////                                Collection collection1 = setItems(obj);
////                                if (collection1 != null) {
////                                    ArrayList<Object> tmp = new ArrayList<Object>(collection1);
////
////
////                                    for (int m = 0; m < tmp.size(); m++) {
////                                        Object value = tmp.get(m);
////                                        if (judgeBasicType(value)) {
////                                            //result.appendText(value.toString()+" ");
////                                            listContent.get(listContent.size() - 1).add(value.toString());
////                                        } else {
////                                            //result.appendText(ReflectionToStringBuilder.toString(value)+" ");
////                                            listContent.get(listContent.size() - 1).add(ReflectionToStringBuilder.toString(value));
////                                        }
////                                    }
////
////
////                                }
////                                else {
////                                    listContent.add(new ArrayList<String>());
////                                    if (judgeBasicType(obj)) {
////                                        //result.appendText(obj.toString()+" ");
////                                        listContent.get(listContent.size() - 1).add(obj.toString());
////                                    } else {
////                                        //result.appendText(ReflectionToStringBuilder.toString(obj)+" ");
////                                        listContent.get(listContent.size() - 1).add(ReflectionToStringBuilder.toString(obj));
////                                    }
////                                    //result.appendText("\n");
////                                }
////
////                            }
////
////                        }
////                        else {
////                            listContent.add(new ArrayList<String>());
////                            if (judgeBasicType(resultText)) {
////                                //result.appendText(resultText.toString()+" ");
////                                listContent.get(listContent.size() - 1).add(resultText.toString());
////                            } else {
////                                //result.appendText(ReflectionToStringBuilder.toString(resultText)+" ");
////                                listContent.get(listContent.size() - 1).add(ReflectionToStringBuilder.toString(resultText));
////                            }
////
////                            //result.appendText("\n");
////                        }
////                    }
////
////
////                }
////            }
////
////
////            boolean isSucess=false;
////            java.io.FileOutputStream out=null;
////            java.io.OutputStreamWriter osw=null;
////            java.io.BufferedWriter bw=null;
////            try {
////                out = new java.io.FileOutputStream(ClassUtils.getDefaultClassLoader().getResource("").getPath()+System.currentTimeMillis()+".csv",true);
////                System.out.println(ClassUtils.getDefaultClassLoader().getResource("").getPath());
////                osw = new java.io.OutputStreamWriter(out,"GBK");
////                bw =new java.io.BufferedWriter(osw);
////
////                for(int m = 0 ; m < listContent.size() ; m ++){
////                    String a =  "";
////                    for(int n = 0 ; n < listContent.get(m).size() ; n ++){
////                        a += listContent.get(m).get(n)+"',";
////
////                    }
////                    bw.append(a).append("\n");
////                }
////                System.out.println("123");
////                isSucess=true;
////
////            } catch (Exception e) {
////                isSucess=false;
////            }finally{
////                if(bw!=null){
////                    try {
////                        bw.close();
////                        bw=null;
////                    } catch (java.io.IOException e) {
////                        e.printStackTrace();
////                    }
////                }
////                if(osw!=null){
////                    try {
////                        osw.close();
////                        osw=null;
////                    } catch (java.io.IOException e) {
////                        e.printStackTrace();
////                    }
////                }
////                if(out!=null){
////                    try {
////                        out.close();
////                        out=null;
////                    } catch (java.io.IOException e) {
////                        e.printStackTrace();
////                    }
////                }
////            }
////            JSONObject result = new JSONObject();
////            result.put("code","0000");
////            result.put("msg","服务调用成功");
////            dataTask tmp = new dataTask(System.currentTimeMillis(),ds.getDsId(),1,"userName",System.currentTimeMillis());
////            dataTaskService.save(tmp);
////            return result;
////
////
////        }
////
////        JSONObject result = new JSONObject();
////        result.put("code","0001");
////        result.put("msg","服务调用失败");
////        return result;
//
//    }










}