package com.example.demo.service.Impl;

import com.example.demo.IDao.dataTaskOverTimeMapper;
import com.example.demo.IDao.file_addrMapper;
import com.example.demo.entity.dataTaskOverTime;
import com.example.demo.entity.file_addr;
import com.example.demo.service.BaseService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service("fileAddrService")
public class fileAddrService implements BaseService<file_addr> {
    @Resource
    private file_addrMapper file_addrDao;


    @Override
    public void save(file_addr entity) {
        file_addrDao.insert(entity);
    }

    @Override
    public void delete(file_addr entity) {

    }

    @Override
    public void update(file_addr entity) {

    }

    @Override
    public file_addr findById(Long id) {
        return null;
    }

    @Override
    public List<file_addr> getAll() {
        return null;
    }
}
