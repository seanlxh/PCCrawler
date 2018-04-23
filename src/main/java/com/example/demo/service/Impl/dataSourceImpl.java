package com.example.demo.service.Impl;

import com.example.demo.IDao.dataSourceMapper;
import com.example.demo.entity.dataSource;
import com.example.demo.service.BaseService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.List;

@Service("dataSourceService")
public class dataSourceImpl implements BaseService<dataSource> {

    @Resource
    private dataSourceMapper dataSourceDao;

    @Override
    public void save(dataSource entity) {
        dataSourceDao.insert(entity);
    }

    @Override
    public void delete(dataSource entity) {
        dataSourceDao.deleteByPrimaryKey(entity.getDsId());
    }

    @Override
    public void update(dataSource entity) {
        dataSourceDao.updateByPrimaryKey(entity);
    }

    @Override
    public dataSource findById(Long id) {
        return dataSourceDao.selectByPrimaryKey(id);
    }

    @Override
    public List<dataSource> getAll() {
        return dataSourceDao.getAll();
    }
}