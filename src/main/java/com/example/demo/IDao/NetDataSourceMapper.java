package com.example.demo.IDao;

import com.example.demo.entity.NetDataSource;

import java.util.List;

public interface NetDataSourceMapper {
    int deleteByPrimaryKey(Long dsId);

    int insert(NetDataSource record);

    int insertSelective(NetDataSource record);

    NetDataSource selectByPrimaryKey(Long dsId);

    int updateByPrimaryKeySelective(NetDataSource record);

    int updateByPrimaryKey(NetDataSource record);

    List<NetDataSource> getAll();
}