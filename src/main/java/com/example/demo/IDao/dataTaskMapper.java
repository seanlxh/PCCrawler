package com.example.demo.IDao;

import com.example.demo.entity.dataSource;
import com.example.demo.entity.dataTask;

import java.util.List;

public interface dataTaskMapper {
    int deleteByPrimaryKey(Long taskId);

    int insert(dataTask record);

    int insertSelective(dataTask record);

    dataTask selectByPrimaryKey(Long taskId);

    int updateByPrimaryKeySelective(dataTask record);

    int updateByPrimaryKey(dataTask record);

    List<dataTask> getAll();

    int updateFinishStateByPrimaryKey(Long taskId);

    int updateSuspendStateByPrimaryKey(Long taskId);

    int updateStartStateByPrimaryKey(Long taskId);

    int updateAllStateByPrimaryKey(Long threadId);

    List<dataTask> selectByName(String name);

    List<dataTask> findByDsId(Long id);

}