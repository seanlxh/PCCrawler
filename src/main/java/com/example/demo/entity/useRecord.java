package com.example.demo.entity;

import java.sql.Timestamp;
import java.util.Date;

public class useRecord {
    private Long useId;

    private Timestamp useTime;

    private Integer type;

    private String userName;

    public useRecord(Long useId, Timestamp useTime, Integer type, String userName) {
        this.useId = useId;
        this.useTime = useTime;
        this.type = type;
        this.userName = userName;
    }

    public Long getUseId() {
        return useId;
    }

    public void setUseId(Long useId) {
        this.useId = useId;
    }

    public Date getUseTime() {
        return useTime;
    }

    public void setUseTime(Timestamp useTime) {
        this.useTime = useTime;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName == null ? null : userName.trim();
    }
}