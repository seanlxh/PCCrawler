package com.example.demo.IDao;

import com.example.demo.entity.dataTaskOverTime;

public interface dataTaskOverTimeMapper {
    int deleteByPrimaryKey(Long taskId);

    int insert(dataTaskOverTime record);

    int insertSelective(dataTaskOverTime record);

    dataTaskOverTime selectByPrimaryKey(Long taskId);

    int updateByPrimaryKeySelective(dataTaskOverTime record);

    int updateByPrimaryKey(dataTaskOverTime record);
}