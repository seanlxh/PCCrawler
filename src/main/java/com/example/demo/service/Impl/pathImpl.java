package com.example.demo.service.Impl;

import com.example.demo.IDao.paraInfoMapper;
import com.example.demo.IDao.pathMapper;
import com.example.demo.entity.path;
import com.example.demo.service.BaseService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
@Service("pathservice")
public class pathImpl implements BaseService<path>{

    @Resource
    private pathMapper pathDao;

    @Override
    public void save(path entity) {

    }

    @Override
    public void delete(path entity) {

    }

    @Override
    public void update(path entity) {
        pathDao.updateByPrimaryKeySelective(entity);
    }

    public path findById(String languageName) {
        return pathDao.selectByPrimaryKey(languageName);
    }
    @Override
    public path findById(Long id) {
        return null;
    }

    @Override
    public List<path> getAll() {
        return pathDao.getAll();
    }
}
