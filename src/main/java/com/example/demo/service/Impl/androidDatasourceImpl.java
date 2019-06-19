package com.example.demo.service.Impl;

import com.example.demo.IDao.AndroidDataSourceMapper;
import com.example.demo.IDao.dataSourceMapper;
import com.example.demo.entity.AndroidDataSource;
import com.example.demo.entity.dataSource;
import com.example.demo.service.BaseService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service("androidDatasourceService")
public class androidDatasourceImpl implements BaseService<AndroidDataSource> {

    @Resource
    private AndroidDataSourceMapper dataSourceDao;

    @Override
    public void save(AndroidDataSource entity) {
        dataSourceDao.insert(entity);
    }

    @Override
    public void delete(AndroidDataSource entity) {

    }

    @Override
    public void update(AndroidDataSource entity) {

    }

    @Override
    public AndroidDataSource findById(Long id) {
        return null;
    }

    @Override
    public List<AndroidDataSource> getAll() {
        return dataSourceDao.getAll();
    }
}
