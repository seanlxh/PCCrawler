package com.example.demo.IDao;

import com.example.demo.entity.AndroidDataSource;
import com.example.demo.entity.dataSource;

import java.util.List;

public interface AndroidDataSourceMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(AndroidDataSource record);

    int insertSelective(AndroidDataSource record);

    AndroidDataSource selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(AndroidDataSource record);

    int updateByPrimaryKey(AndroidDataSource record);

    List<AndroidDataSource> getAll();
}