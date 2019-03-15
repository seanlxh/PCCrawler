package com.example.demo.service.Impl;

import com.example.demo.IDao.dataSourceMapper;
import com.example.demo.IDao.dataTaskMapper;
import com.example.demo.IDao.dataTaskOverTimeMapper;
import com.example.demo.entity.dataSource;
import com.example.demo.entity.dataTask;
import com.example.demo.entity.dataTaskOverTime;
import com.example.demo.service.BaseService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.List;

@Service("dataTaskService")
public class dataTaskImpl implements BaseService<dataTask> {

    @Resource
    private dataTaskMapper dataTaskDao;

    @Resource
    private dataTaskOverTimeMapper dataTaskOverTimeDao;

    @Override
    public void save(dataTask entity) {
        dataTaskDao.insert(entity);
    }

    @Override
    public void delete(dataTask entity) {

    }

    public void delete(Long id) {
        dataTaskDao.deleteByPrimaryKey(id);
        dataTaskOverTimeDao.deleteByPrimaryKey(id);
    }

    @Override
    public void update(dataTask entity) {

    }

    @Override
    public dataTask findById(Long id) {
        return dataTaskDao.selectByPrimaryKey(id);
    }

    public List<dataTask> findByName(String name) {
        return dataTaskDao.selectByName(name);
    }

    public List<dataTask> findByDsId(Long id){return dataTaskDao.findByDsId(id);}

    @Override
    public List<dataTask> getAll() {
        return dataTaskDao.getAll();
    }

    public int updateFinishStateByPrimaryKey(long taskId){
        Long timeMillis = System.currentTimeMillis();
        dataTaskOverTimeDao.insert(new dataTaskOverTime(taskId,timeMillis));
        return dataTaskDao.updateFinishStateByPrimaryKey(taskId);}
    public int updateSuspendStateByPrimaryKey(long taskId){return dataTaskDao.updateSuspendStateByPrimaryKey(taskId);}
    public int updateStartStateByPrimaryKey(long taskId){return dataTaskDao.updateStartStateByPrimaryKey(taskId);}
    public int updateAllStateByPrimaryKey(long threadId){return dataTaskDao.updateAllStateByPrimaryKey(threadId);}

}