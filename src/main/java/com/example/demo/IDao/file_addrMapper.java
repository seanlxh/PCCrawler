package com.example.demo.IDao;

import com.example.demo.entity.file_addr;

public interface file_addrMapper {
    int deleteByPrimaryKey(Long dsId);

    int insert(file_addr record);

    int insertSelective(file_addr record);

    file_addr selectByPrimaryKey(Long dsId);

    int updateByPrimaryKeySelective(file_addr record);

    int updateByPrimaryKey(file_addr record);
}