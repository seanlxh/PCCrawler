package com.example.demo.service.Impl;

import com.example.demo.IDao.dataTaskMapper;
import com.example.demo.IDao.u_userMapper;
import com.example.demo.entity.paraInfo;
import com.example.demo.entity.u_user;
import com.example.demo.service.BaseService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service("u_userService")
public class u_userImpl implements BaseService<u_user> {

    @Resource
    private u_userMapper u_userMapper;

    @Override
    public void save(u_user entity) {
        u_userMapper.insert(entity);
    }

    @Override
    public void delete(u_user entity) {

    }

    @Override
    public void update(u_user entity) {
        u_userMapper.updateByPrimaryKey(entity);
    }

    @Override
    public u_user findById(Long id) {
        return u_userMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<u_user> getAll() {
        return u_userMapper.getAll();
    }

    public List<u_user> selectByMap(Map<String, Object> map){
        System.out.println(map.get("nickname").toString());
        System.out.println(map.get("pswd")+"sas");
        return u_userMapper.selectByMap(map);
    }
}
