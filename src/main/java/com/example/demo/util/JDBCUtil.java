package com.example.demo.util;

import com.sun.org.apache.xpath.internal.operations.Bool;
import org.springframework.beans.factory.annotation.Value;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JDBCUtil {
    private Connection conn;
    private Statement stmt;

    public JDBCUtil() {
        String DB_URL = "jdbc:mysql://localhost:3306/APIPlatform?useUnicode=true&characterEncoding=utf-8";
        String JDBC_DRIVER = "com.mysql.jdbc.Driver";
        String USER = "root";
        String PASS = "lxh960119";
//        String DB_URL = "jdbc:oracle:thin:@//10.24.11.181:1621/helowin";
//        String JDBC_DRIVER = "oracle.jdbc.driver.OracleDriver";
//        String USER = "SJCJ_FGW";
//        String PASS = "SJCJ_FGW";
        try {
            Class.forName(JDBC_DRIVER);
            conn = DriverManager.getConnection(DB_URL, USER, PASS);
            conn.setAutoCommit(false);
            stmt = conn.createStatement();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    public Boolean insertTable(String tableName, ArrayList<ArrayList<String>> list){
        try {
            for (int j = 0 ; j < list.size() ; j ++){
                String tmp = "";
                for(int i = 0 ; i < 18; i ++){
                    if(list.get(j).get(i) != null){
                        if(i == 0)
                            tmp += ("'" + list.get(j).get(i) + "'");
                        else
                            tmp += (",'" + list.get(j).get(i) + "'");
                    }
                    else{
                        if(i == 0)
                            tmp += ("'" + "null" + "'");
                        else
                            tmp += (",'" + "null" + "'");
                    }
                }
                String sql = "INSERT INTO t"+tableName+" VALUES("+
                        tmp+
                        ")";
                stmt.addBatch(sql);
                if((j+1) % 200 == 0||j == list.size() - 1){
                    int[] updateCounts = stmt.executeBatch();
                    conn.commit();
                    stmt.clearBatch();
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return true;

    }

    public Boolean createTable(Map<String,Object> map){
        try {
            String tmp = "";
            for(int i = 1; i <= ((List)(map.get("list"))).size() ; i ++ ){
                if(i == 1){
                    tmp += (String.valueOf((char)(i + 96))+" VARCHAR(255)");
                }
                else{
                    tmp += (","+String.valueOf((char)(i + 96))+" VARCHAR(255)");
                }
            }
            String sql = "CREATE TABLE t"+map.get("tableName") +
                    "(" +
                    tmp
                    + ")";

            stmt.executeUpdate(sql);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return true;
    }

    public boolean Close(){
        try {
            stmt.close();
            conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return true;
    }



}
