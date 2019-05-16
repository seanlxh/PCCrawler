package com.example.demo.entity;

public class dataTaskOverTime {
    private Long taskId;

    private Long overTime;

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getOverTime() {
        return overTime;
    }

    public void setOverTime(Long overTime) {
        this.overTime = overTime;
    }

    public dataTaskOverTime(Long taskId, Long overTime) {
        this.taskId = taskId;
        this.overTime = overTime;
    }
}