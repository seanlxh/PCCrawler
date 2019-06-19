package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.service.Impl.*;
import com.example.demo.util.JDBCUtil;
import com.example.demo.util.LogUtil;
import net.sf.json.JSONObject;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ClassUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

import static com.example.demo.util.classUtil.*;

@Controller
@RequestMapping("/collection")
public class threadController {
    @Resource
    private dataTaskImpl dataTaskService;
    @Resource
    private dataTaskOverTimeImpl dataTaskOverTimeService;
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

    private ConcurrentHashMap<Long,Thread> currentThread = new ConcurrentHashMap<>();

    private ExecutorService pool = Executors.newFixedThreadPool(100);





    public class Thread1 implements Runnable{

        private Long id;

        private Long curTime;

        private Map<String,String[]> request1 = new HashMap<String, String[]>();

        public Thread1(Long id, Map<String,String[]> request, Long curTime) {
            this.id = id;
            this.curTime = curTime;
            request1.putAll(request);
        }

        @Override
        public void run() {
            ArrayList<ArrayList<String>> listContent = new ArrayList<ArrayList<String>>();
            //LogUtil.startRecordTime();
            HashMap<Integer,Object> integerObjectHashMap = new HashMap<Integer,Object>();
            dataSource ds = dataSourceService.findById(id);
            Long taskId = System.currentTimeMillis();
            //u_user user = (u_user) SecurityUtils.getSubject().getPrincipal();
            dataTask tmp1 = new dataTask(taskId,ds.getDsId(),1,"admin",System.currentTimeMillis(), curTime);
            dataTaskService.updateAllStateByPrimaryKey(Thread.currentThread().getId());
            dataTaskService.save(tmp1);
            List<functionLogic> functionLogics = functionLogicService.selectByDSIDWithLogic(ds.getDsId());
            List<inputPara> inputParas = inputParaService.findBytypeId(ds.getType());
            resultColumn resultColumn =  resultColumnService.selectByPrimaryKey(ds.getDsId());
            if(ds.getType() == 2){
                listContent.clear();
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
                                tmpObj = Integer.parseInt(request1.get(para.getInputPara())[0]);
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
                    if (resultText != null&&i == functionLogics.size()-1) {
                        Collection collection = setItems(resultText);
                        String[] columnname = resultColumn.getColumnname().split("\\|");
//                        listContent.add(new ArrayList<String>());
//                    listContent.add(new ArrayList<String>());
//                    listContent.get(listContent.size() - 1).add("第" + String.valueOf(i + 1) + "个：");
                        String CName = "";
//                        for(int t = 0 ; t < columnname.length; t ++){
////                            if(t == 0)
////                                CName += (columnname[t]);
////                            else
////                                CName += (","+columnname[t]);
//                            listContent.get(listContent.size() - 1).add(columnname[t]);
//                        }

                        if(functionLogics.size() - 1  == i){
                            if (collection != null) {
                                Iterator it = collection.iterator();
                                int num1 = Integer.parseInt(request1.get("Num")[0]);
                                int count = 0;
                                while (it.hasNext()) {
                                    if(count >= num1)
                                        break;
                                    count++;
                                    listContent.add(new ArrayList<String>());

                                    Object obj = it.next();
                                    Collection collection1 = setItems(obj);
                                    if (collection1 != null) {
                                        ArrayList<Object> tmp = new ArrayList<Object>(collection1);
                                        for (int m = 0; m < tmp.size(); m++) {
                                            Object value = tmp.get(m);
                                            if(value == null){
                                                listContent.get(listContent.size() - 1).add("");
                                            }
                                            else {
                                                if (judgeBasicType(value)) {
                                                    //result.appendText(value.toString()+" ");
                                                    listContent.get(listContent.size() - 1).add(value.toString());
                                                } else {
                                                    //result.appendText(ReflectionToStringBuilder.toString(value)+" ");
                                                    listContent.get(listContent.size() - 1).add(ReflectionToStringBuilder.toString(value));
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        listContent.add(new ArrayList<String>());
                                        if (judgeBasicType(obj)) {
                                            //result.appendText(obj.toString()+" ");
                                            listContent.get(listContent.size() - 1).add(obj.toString());
                                        } else {
                                            //result.appendText(ReflectionToStringBuilder.toString(obj)+" ");
                                            listContent.get(listContent.size() - 1).add(ReflectionToStringBuilder.toString(obj));
                                        }
                                        //result.appendText("\n");
                                    }
                                }
                            }
                            else {

                                if (judgeBasicType(resultText)) {
                                    listContent.add(new ArrayList<String>());
                                    //result.appendText(resultText.toString()+" ");
                                    listContent.get(listContent.size() - 1).add(resultText.toString());
                                } else {

                                    if(functionLogics.get(i).getResulttype().equals("java.sql.ResultSet")){
                                        ResultSet tmp = (ResultSet)resultText;
                                        try {
                                            List list = new ArrayList();
                                            ResultSetMetaData md = tmp.getMetaData();
                                            int columnCount = md.getColumnCount();
                                            while (tmp.next()) {
                                                listContent.add(new ArrayList<String>());
                                                JSONObject jsonArray1 = new JSONObject();
                                                for (int n = 1; n <= columnCount; n++) {
                                                    String key = md.getColumnName(n);
                                                    String value;
                                                    if(tmp.getObject(n)!=null){
                                                        value = tmp.getObject(n).toString();
                                                    }else {
                                                        value = "";
                                                    }
                                                    listContent.get(listContent.size() - 1).add(value);//获取键名及值
                                                }
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
                                        listContent.add(new ArrayList<String>());
                                        listContent.get(listContent.size() - 1).add(ReflectionToStringBuilder.toString(resultText));
                                    }





                                    //result.appendText(ReflectionToStringBuilder.toString(resultText)+" ");
//                                    listContent.get(listContent.size() - 1).add(ReflectionToStringBuilder.toString(resultText));
                                }

                                //result.appendText("\n");
                            }
                        }
                    }
                }
                boolean isSucess=false;
                java.io.FileOutputStream out=null;
                java.io.OutputStreamWriter osw=null;
                java.io.BufferedWriter bw=null;
                try {
                    SimpleDateFormat dateformat = new SimpleDateFormat("yyyyMMddHHmmss");
                    String dateStr = dateformat.format(System.currentTimeMillis());
                    out = new java.io.FileOutputStream(ClassUtils.getDefaultClassLoader().getResource("").getPath()+dateStr+".csv",true);
                    System.out.println(ClassUtils.getDefaultClassLoader().getResource("").getPath());
                    osw = new java.io.OutputStreamWriter(out,"GBK");
                    bw =new java.io.BufferedWriter(osw);
                    Map<String,Object> map = new HashMap<String, Object>();
                    map.put("tableName",dateStr);
                    ArrayList<String> list = new ArrayList<>();
                    for (int p = 0 ; p < listContent.get(1).size(); p ++)
                        list.add(String.valueOf(p));
                    map.put("list",list);
                    JDBCUtil jdbcUtil = new JDBCUtil();
                    jdbcUtil.createTable(map);
                    ArrayList<ArrayList<String>> arrayLists = new ArrayList<>();
                    for(int m = 0 ; m < listContent.size() ; m ++){
                        String a =  "";
                        ArrayList<String> arrayList = new ArrayList<String>();
                        for(int n = 0 ; n < 18 ; n ++){
                            if(listContent.get(m).get(n) != null){
                                a += listContent.get(m).get(n)+",";
                                arrayList.add(listContent.get(m).get(n));
                            }
                            else{
                                a += "null"+",";
                                arrayList.add("null");
                            }
                        }
                        bw.append(a).append("\n");
                        if(m != 0)
                            arrayLists.add(arrayList);

                    }
                    jdbcUtil.insertTable(dateStr,arrayLists);
                    System.out.println("123");
                    isSucess=true;
                    jdbcUtil.Close();

                } catch (Exception e) {
                    isSucess=false;
                }finally{
                    if(bw!=null){
                        try {
                            bw.close();
                            bw=null;
                        } catch (java.io.IOException e) {
                            e.printStackTrace();
                        }
                    }
                    if(osw!=null){
                        try {
                            osw.close();
                            osw=null;
                        } catch (java.io.IOException e) {
                            e.printStackTrace();
                        }
                    }
                    if(out!=null){
                        try {
                            out.close();
                            out=null;
                        } catch (java.io.IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
                JSONObject result = new JSONObject();
                result.put("code","0000");
                result.put("msg","服务调用成功");

                dataTaskService.updateFinishStateByPrimaryKey(taskId);
                currentThread.remove(Thread.currentThread().getId());
                //  LogUtil.endRecordTime(String.valueOf(listContent.size()));
                return;
            }
            else if(ds.getType() == 3){
                listContent.clear();
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
                            if (para.getParaType().contains("[ ]")) {
                                tmpClass = getClassFromName(para.getParaType().split("\\[")[0] + "[ ]");
                            } else {
                                tmpClass = getClassFromName(para.getParaType());
                            }
                            curInputClasses.add(tmpClass);
                            Object tmpObj = null;
                            if (para.getOriType() == 2) {
                                Object tmptmpObj;
                                if(judgeBasicTypeByName(tmpClass)){
                                    tmpObj = getObjectFromStringAndClass(tmpClass, para.getInputContent().substring(1,para.getInputContent().length()-1));
                                }
//                                else{
//                                    JSONObject tmpStr = (JSONObject)jsonArray.get(0);
//                                    tmptmpObj = (Object)JSONObject.toBean(tmpStr, tmpClass);
//                                }
                            } else if(para.getOriType() == 1){
                                tmpObj = integerObjectHashMap.get(para.getFuncResult());
                            }
                            else if(para.getOriType() == 3){
                                tmpObj = Integer.parseInt(request1.get(para.getInputPara())[0]);
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
                    if (resultText != null) {
                        Collection collection = setItems(resultText);
                        integerObjectHashMap.put(i+1,resultText);
                        String[] columnname = resultColumn.getColumnname().split("\\|");
//                    listContent.add(new ArrayList<String>());
//                    listContent.get(listContent.size() - 1).add("第" + String.valueOf(i + 1) + "个：");

                        String CName = "";
                        for(int t = 0 ; t < columnname.length; t ++) {
                            if (t == 0)
                                CName += (columnname[t]);
                            else
                                CName += ("," + columnname[t]);
                        }
                        listContent.add(new ArrayList<String>());
                        listContent.get(listContent.size() - 1).add(CName);
                        if(functionLogics.size() - 1 == i){
                            if (collection != null) {
                                Iterator it = collection.iterator();
                                int num1 = Integer.parseInt(request1.get("Num")[0]);
                                int count = 0;
                                while (it.hasNext()) {
                                    if(count >= num1)
                                        break;
                                    count++;
                                    listContent.add(new ArrayList<String>());
                                    Object obj = it.next();
                                    Collection collection1 = setItems(obj);
                                    if (collection1 != null) {
                                        ArrayList<Object> tmp = new ArrayList<Object>(collection1);


                                        for (int m = 0; m < tmp.size(); m++) {
                                            Object value = tmp.get(m);
                                            if (judgeBasicType(value)) {
                                                //result.appendText(value.toString()+" ");
                                                listContent.get(listContent.size() - 1).add(value.toString());
                                            } else {
                                                //result.appendText(ReflectionToStringBuilder.toString(value)+" ");
                                                listContent.get(listContent.size() - 1).add(ReflectionToStringBuilder.toString(value));
                                            }
                                        }


                                    }
                                    else {
                                        listContent.add(new ArrayList<String>());
                                        if (judgeBasicType(obj)) {
                                            //result.appendText(obj.toString()+" ");
                                            listContent.get(listContent.size() - 1).add(obj.toString());
                                        } else {
                                            //result.appendText(ReflectionToStringBuilder.toString(obj)+" ");
                                            listContent.get(listContent.size() - 1).add(ReflectionToStringBuilder.toString(obj));
                                        }
                                        //result.appendText("\n");
                                    }

                                }

                            }
                            else {
                                listContent.add(new ArrayList<String>());
                                if (judgeBasicType(resultText)) {
                                    //result.appendText(resultText.toString()+" ");
                                    listContent.get(listContent.size() - 1).add(resultText.toString());
                                } else {
                                    //result.appendText(ReflectionToStringBuilder.toString(resultText)+" ");
                                    listContent.get(listContent.size() - 1).add(ReflectionToStringBuilder.toString(resultText));
                                }

                                //result.appendText("\n");
                            }
                        }
                    }
                }
                boolean isSucess=false;
                java.io.FileOutputStream out=null;
                java.io.OutputStreamWriter osw=null;
                java.io.BufferedWriter bw=null;
                try {
                    out = new java.io.FileOutputStream(ClassUtils.getDefaultClassLoader().getResource("").getPath()+System.currentTimeMillis()+".csv",true);
                    System.out.println(ClassUtils.getDefaultClassLoader().getResource("").getPath());
                    osw = new java.io.OutputStreamWriter(out,"GBK");
                    bw =new java.io.BufferedWriter(osw);

                    for(int m = 0 ; m < listContent.size() ; m ++){
                        String a =  "";
                        for(int n = 0 ; n < listContent.get(m).size() ; n ++){
                            a += listContent.get(m).get(n)+"',";

                        }
                        bw.append(a).append("\n");
                    }
                    System.out.println("123");
                    isSucess=true;

                } catch (Exception e) {
                    isSucess=false;
                }finally{
                    if(bw!=null){
                        try {
                            bw.close();
                            bw=null;
                        } catch (java.io.IOException e) {
                            e.printStackTrace();
                        }
                    }
                    if(osw!=null){
                        try {
                            osw.close();
                            osw=null;
                        } catch (java.io.IOException e) {
                            e.printStackTrace();
                        }
                    }
                    if(out!=null){
                        try {
                            out.close();
                            out=null;
                        } catch (java.io.IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
                JSONObject result = new JSONObject();
                result.put("code","0000");
                result.put("msg","服务调用成功");
                dataTaskService.updateFinishStateByPrimaryKey(taskId);
                currentThread.remove(Thread.currentThread().getId());
                // LogUtil.endRecordTime(String.valueOf(listContent));
                return ;
            }


            JSONObject result = new JSONObject();
            result.put("code","0001");
            result.put("msg","服务调用失败");
            dataTaskService.updateFinishStateByPrimaryKey(taskId);
            currentThread.remove(Thread.currentThread().getId());
            //  LogUtil.endRecordTime(String.valueOf(listContent));
            return ;
        }
    }


    class Thread2 implements Runnable{

        @Override
        public void run() {
            for (int i = 0 ; i < 100 ; i ++){
                try {
                    System.out.println(i);
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }



    @Async
    @RequestMapping("/collection")
    @ResponseBody
    public JSONObject threadStart(HttpServletRequest request, Model model) throws InterruptedException {
        Long typeId = Long.parseLong(request.getParameter("id"));
        Map<String,String[]> tmp = request.getParameterMap();
        Long curTime = System.currentTimeMillis();
        Thread thread = new Thread(new Thread1(typeId,tmp,curTime));
//        Thread thread = new Thread(new Thread2());

        currentThread.put(curTime,thread);
        pool.execute(thread);
        // thread.start();
        JSONObject result = new JSONObject();
        result.put("code","0000");
        result.put("msg","服务调用成功");
        return result;
    }

    @RequestMapping("/pause")
    @ResponseBody
    public JSONObject threadPause(HttpServletRequest request, Model model) throws InterruptedException {
        Long typeId = Long.parseLong(request.getParameter("id"));
        dataTask dataTask = dataTaskService.findById(typeId);
        JSONObject result = new JSONObject();
        if(currentThread.containsKey(dataTask.getThreadId())&&dataTask.getState()==1){
            currentThread.get(dataTask.getThreadId()).suspend();
            dataTaskService.updateSuspendStateByPrimaryKey(dataTask.getTaskId());
            result.put("code","0000");
            result.put("msg","服务调用成功");
        }else{
            result.put("code","0001");
            result.put("msg","job不存在或者意外停止");
        }
        return result;
    }

    @RequestMapping("/continue")
    @ResponseBody
    public JSONObject threadContinue(HttpServletRequest request, Model model) throws InterruptedException {
        Long typeId = Long.parseLong(request.getParameter("id"));
        dataTask dataTask = dataTaskService.findById(typeId);
        JSONObject result = new JSONObject();
        if(currentThread.containsKey(dataTask.getThreadId())&&dataTask.getState()==2){
            currentThread.get(dataTask.getThreadId()).resume();
            dataTaskService.updateStartStateByPrimaryKey(dataTask.getTaskId());
            result.put("code","0000");
            result.put("msg","服务调用成功");
        }
        else {
            result.put("code","0001");
            result.put("msg","job不存在或者意外停止");
        }

        return result;
    }

    @RequestMapping("/stop")
    @ResponseBody
    public JSONObject threadStop(HttpServletRequest request, Model model) throws InterruptedException {
        Long typeId = Long.parseLong(request.getParameter("id"));
        JSONObject result = new JSONObject();
        dataTask dataTask = dataTaskService.findById(typeId);
        if(currentThread.containsKey(dataTask.getThreadId())&&dataTask.getState()!=3){
            currentThread.get(dataTask.getThreadId()).interrupt();
            currentThread.remove(dataTask.getThreadId());
            dataTaskService.updateFinishStateByPrimaryKey(dataTask.getTaskId());
            result.put("code","0000");
            result.put("msg","服务调用成功");
        }
        else {
            result.put("code","0001");
            result.put("msg","job不存在或者意外停止");
        }

        return result;
    }

    @RequestMapping("/deleteTask")
    @ResponseBody
    public JSONObject deleteTask(HttpServletRequest request, Model model) throws InterruptedException {
        Long typeId = Long.parseLong(request.getParameter("id"));
        JSONObject result = new JSONObject();
        dataTask dataTask = dataTaskService.findById(typeId);
        if(dataTask.getState()==3){
            dataTaskService.delete(dataTask.getTaskId());
            result.put("code","0000");
            result.put("msg","服务调用成功");
        }
        else if(dataTask.getState()==2 || dataTask.getState()==1){
            if(currentThread.containsKey(dataTask.getThreadId())){
                currentThread.remove(dataTask.getThreadId());
                dataTaskService.delete(dataTask.getTaskId());
            }
            else{
                dataTaskService.delete(dataTask.getTaskId());
            }
            result.put("code","0000");
            result.put("msg","服务调用成功");
        }
        else{
            result.put("code","0001");
            result.put("msg","无法获取信息");
        }
        return result;
    }
    @RequestMapping("/getFinishTime")
    @ResponseBody
    public JSONObject FinishTime(HttpServletRequest request, Model model) throws InterruptedException {
        Long typeId = Long.parseLong(request.getParameter("id"));
        dataTaskOverTime dataTaskOverTime = dataTaskOverTimeService.findById(typeId);
        JSONObject result = new JSONObject();
        if(dataTaskOverTime!=null){
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            long lt = new Long(dataTaskOverTime.getOverTime());
            Date date = new Date(lt);
            result.put("code","0000");
            result.put("msg",simpleDateFormat.format(date));
        }
        else{
            result.put("code","0001");
            result.put("msg","无法获取信息");
        }
        return result;
    }

}
