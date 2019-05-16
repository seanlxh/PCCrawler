package com.example.demo.IDao;

import com.example.demo.entity.useRecord;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

public interface useRecordMapper {
    int deleteByPrimaryKey(Long useId);

    int insert(useRecord record);

    int insertSelective(useRecord record);

    useRecord selectByPrimaryKey(Long useId);

    int updateByPrimaryKeySelective(useRecord record);

    int updateByPrimaryKey(useRecord record);

    List<useRecord> selectByTime(Map<String, Timestamp> map);
}