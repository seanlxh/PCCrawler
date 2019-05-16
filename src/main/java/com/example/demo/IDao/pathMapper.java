package com.example.demo.IDao;

import com.example.demo.entity.path;

import java.util.List;

public interface pathMapper {
    int deleteByPrimaryKey(String languageName);

    int insert(path record);

    int insertSelective(path record);

    path selectByPrimaryKey(String languageName);

    int updateByPrimaryKeySelective(path record);

    int updateByPrimaryKey(path record);

    List<path> getAll();
}