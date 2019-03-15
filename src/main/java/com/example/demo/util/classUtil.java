package com.example.demo.util;

import com.example.demo.entity.path;
import com.example.demo.service.Impl.pathImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.io.File;
import java.lang.reflect.Array;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Component
public class classUtil {

    @Autowired
    private pathImpl pathService;

    private static classUtil classUtilService;

    public classUtil() {
        super();
        // TODO Auto-generated constructor stub
    }
    @PostConstruct
    public void init() {
        System.out.println("实例化成功");
        classUtilService = this;
        classUtilService.pathService = this.pathService;

    }

    static URL[] urls = new URL[] {};
    static MyClassLoader classLoader = new MyClassLoader(urls, null);

    static class MyClassLoader extends URLClassLoader {

        public MyClassLoader(URL[] urls) {
            super(urls);
        }

        public MyClassLoader(URL[] urls, ClassLoader parent) {
            super(urls, parent);
        }

        public Class<?> loadClass1(String name){
            try {
                return loadClass(name, true);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
            return null;
        }

        public void addJar(URL url) {
            this.addURL(url);
        }

    }
    public static Boolean judgeBasicTypeByName(Class obj){
        Class cls = obj;
        if(cls == (int.class))
            return true;
        else if(cls == (boolean.class))
            return true;
        else if(cls == char.class)
            return true;
        else if(cls == byte.class)
            return true;
        else if(cls == short.class)
            return true;
        else if(cls == long.class)
            return true;
        else if(cls == double.class)
            return true;
        else if(cls == float.class)
            return true;
        else if(cls == String.class)
            return true;
        else if(cls == java.math.BigDecimal.class)
            return true;
        else if(cls == java.math.BigInteger.class)
            return true;
        else if(cls == Boolean.class)
            return true;
        else if(cls == Byte.class)
            return true;
        else if(cls == Character.class)
            return true;
        else if(cls == CharSequence.class)
            return true;
        else if(cls == Double.class)
            return true;
        else if(cls == Float.class)
            return true;
        else if(cls == Integer.class)
            return true;
        else if(cls == Long.class)
            return true;
        else if(cls == Number.class)
            return true;
        else if(cls == Short.class)
            return true;
        else if(cls.isArray())
            return true;
        else
            return false;
    }

    public static Class getClassFromName(String className){
        if(className.equals("int"))
            return int.class;
        else if(className.equals("boolean"))
            return boolean.class;
        else if(className.equals("char"))
            return char.class;
        else if(className.equals("byte"))
            return byte.class;
        else if(className.equals("short"))
            return short.class;
        else if(className.equals("long"))
            return long.class;
        else if(className.equals("double"))
            return double.class;
        else if(className.equals("float"))
            return float.class;
        else if(className.contains("[ ]")){
            Class temp = getClassFromName(className.substring(0,className.length()-3));
            Class result = Array.newInstance(temp, 1).getClass();
            return result;
        }
        else if(className.contains("[]")){
            Class temp = getClassFromName(className.substring(0,className.length()-2));
            Class result = Array.newInstance(temp, 1).getClass();
            return result;
        }
        else{
            try {
                getClassLoader();
                Class<?> clazz = classLoader.loadClass(className);
                return clazz;
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
        }

        return null;
    }

    public static Object getObjectFromStringAndClass(Class className , String value){
        Object object = null;
        if(className.getTypeName() == "int"){
            object = Integer.parseInt(value);
        }
        else if(className.getTypeName() == "boolean"){
            object = Boolean.parseBoolean(value);
        }
        else if(className.getTypeName() == "char"){
            object = value.charAt(0);
        }
        else if(className.getTypeName() == "short"){
            object = Short.parseShort(value);
        }
        else if(className.getTypeName() == "long"){
            object = Long.parseLong(value);
        }
        else if(className.getTypeName() == "double"){
            object = Double.parseDouble(value);
        }

        else if(className.getTypeName() == "float"){
            object = Float.parseFloat(value);
        }
        //
        else if(className.getTypeName().contains("[")||className.getTypeName().contains("]")){

            int count = 1;
            int last = 0;
            ArrayList<String> strs = new ArrayList<String>();
            String tmp = "";
            for(int i = 0 ; i < value.length() ; i ++){
                if(value.charAt(i) != '"')
                    tmp += value.charAt(i);
            }
            value = tmp;

            for(int i = 0 ; i < value.length() ; i ++){
                if(value.charAt(i) == ','){
                    count ++;
                    strs.add(value.substring(last,i));
                    last = i + 1;
                }

            }
            strs.add(value.substring(last,value.length()));


            Class temp = getClassFromName(className.getTypeName().substring(0,className.getTypeName().length()-2));

            Object[] result = new Object[count];

            for(int i = 0 ; i < count ; i ++){
                result[i] = getObjectFromStringAndClass(temp,strs.get(i));
            }

            object = result;



        }

        else if(className.getTypeName() == "java.lang.String"){
            object = value;
        }
        else{
            try {
                object = Class.forName(className.getTypeName()).newInstance();
                object = value;
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InstantiationException e) {
                e.printStackTrace();
            }
        }
        return object;
    }
    public static Object execute(String className , String functionName,Class[] classes,Object[] objects){

        String className1 = className;
        String functionName1 = functionName;
        Class claz = null;
        Object tmp = null;
        try {
            claz = Class.forName(className1);
            Constructor constructor = claz.getDeclaredConstructor();
            constructor.setAccessible(true);
            Object obj = constructor.newInstance();
            Method mth = obj.getClass().getDeclaredMethod(functionName1,classes);
            tmp =  mth.invoke(obj,objects);
        } catch (Exception e) {
            try {
                getClassLoader();
                Class<?> clazz = classLoader.loadClass1(className1);
                Constructor constructor = clazz.getDeclaredConstructor();
                constructor.setAccessible(true);
                Object obj = constructor.newInstance();
                Method method = obj.getClass().getDeclaredMethod(functionName1,classes);
                tmp =  method.invoke(obj,objects);
            }
             catch (NoSuchMethodException e1) {
                e1.printStackTrace();
            } catch (IllegalAccessException e1) {
                e1.printStackTrace();
            } catch (InstantiationException e1) {
                e1.printStackTrace();
            } catch (InvocationTargetException e1) {
                e1.printStackTrace();
            }

        }
        return tmp;
    }
    public static Collection setItems(Object items) {
        if(items instanceof List) {
            return (List) items;
        }

        if(items instanceof Collection) {
            return (Collection) items;
        }

        if(items instanceof Map) {
            Map map = (Map) items;
            return map.entrySet();  //Set
        }

        if(items.getClass().isArray()) {
            Collection coll = new ArrayList();
            int length = Array.getLength(items);
            for(int i=0;i<length;i++) {
                Object value = Array.get(items, i);
                coll.add(value);
            }
            return coll;
        }

        return null;
    }

    public static Boolean judgeBasicType(Object obj){
        Class cls = obj.getClass();
        if(cls == (int.class))
            return true;
        else if(cls == (boolean.class))
            return true;
        else if(cls == char.class)
            return true;
        else if(cls == byte.class)
            return true;
        else if(cls == short.class)
            return true;
        else if(cls == long.class)
            return true;
        else if(cls == double.class)
            return true;
        else if(cls == float.class)
            return true;
        else if(cls == String.class)
            return true;
        else if(cls == java.math.BigDecimal.class)
            return true;
        else if(cls == java.math.BigInteger.class)
            return true;
        else if(cls == Boolean.class)
            return true;
        else if(cls == Byte.class)
            return true;
        else if(cls == Character.class)
            return true;
        else if(cls == CharSequence.class)
            return true;
        else if(cls == Double.class)
            return true;
        else if(cls == Float.class)
            return true;
        else if(cls == Integer.class)
            return true;
        else if(cls == Long.class)
            return true;
        else if(cls == Number.class)
            return true;
        else if(cls == Short.class)
            return true;
        else if(cls.isArray())
            return true;
        else
            return false;
    }

    public static void getClassLoader(){
        List<path> paths= classUtilService.pathService.getAll();
        String path = paths.get(1).getLibpath();
        File file = new File(path);
        File[] fileList = file.listFiles();
        for (int i = 0; i < fileList.length; i++) {
            String fileName = fileList[i].getName();
            String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
            if (fileList[i].isFile() && suffix.equals("jar")) {
                try {
                    classLoader.addJar(new File(fileList[i].getPath()).toURI().toURL());
                } catch (MalformedURLException e) {
                    e.printStackTrace();
                }
            }
        }

    }
}
