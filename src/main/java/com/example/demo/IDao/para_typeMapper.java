package com.example.demo.IDao;

import com.example.demo.entity.para_type;

import java.util.List;

public interface para_typeMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(para_type record);

    int insertSelective(para_type record);

    para_type selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(para_type record);

    int updateByPrimaryKey(para_type record);

    List<para_type> getAll();
}