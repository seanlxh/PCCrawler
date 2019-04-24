package com.example.demo.service.Impl;

import com.example.demo.IDao.resultColumnMapper;
import com.example.demo.entity.paraInfo;
import com.example.demo.entity.resultColumn;
import com.example.demo.service.BaseService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
@Service("resultColumnservice")
public class resultColumnImpl implements BaseService<resultColumn>{

    @Resource
    private resultColumnMapper resultColumnDao;

    @Override
    public void save(resultColumn entity) {
        resultColumnDao.insert(entity);
    }

    @Override
    public void delete(resultColumn entity) {

    }

    @Override
    public void update(resultColumn entity) {

    }

    @Override
    public resultColumn findById(Long id) {
        return resultColumnDao.selectByPrimaryKey(id);
    }

    @Override
    public List<resultColumn> getAll() {
        return null;
    }

    public resultColumn selectByPrimaryKey(Long id){
        return resultColumnDao.selectByPrimaryKey(id);
    }
}
