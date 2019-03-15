package com.example.demo.service.Impl;

import com.example.demo.IDao.NetDataSourceMapper;
import com.example.demo.entity.NetDataSource;
import com.example.demo.service.BaseService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service("NetDataSourceImpl")
public class NetDataSourceImpl implements BaseService<NetDataSource>{
    @Resource
    private NetDataSourceMapper netDataSourceMapper;

    @Override
    public void save(NetDataSource entity) {
        netDataSourceMapper.insert(entity);
    }

    @Override
    public void delete(NetDataSource entity) {

    }

    @Override
    public void update(NetDataSource entity) {

    }

    @Override
    public NetDataSource findById(Long id) {
        return netDataSourceMapper.selectByPrimaryKey(id) ;
    }

    @Override
    public List<NetDataSource> getAll() {
        return netDataSourceMapper.getAll();
    }
}
