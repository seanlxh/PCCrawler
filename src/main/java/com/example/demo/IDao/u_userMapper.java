package com.example.demo.IDao;

import com.example.demo.entity.u_user;

import java.util.List;
import java.util.Map;

public interface u_userMapper {
    int deleteByPrimaryKey(Long id);

    int insert(u_user record);

    int insertSelective(u_user record);

    u_user selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(u_user record);

    int updateByPrimaryKey(u_user record);

    List<u_user> selectByMap(Map<String, Object> map);

    List<u_user> getAll();
}