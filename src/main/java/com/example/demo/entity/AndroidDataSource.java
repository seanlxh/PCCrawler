package com.example.demo.entity;



public class AndroidDataSource {
    private Integer id;

    private String name;

    private String apppackage;

    private String appactivity;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getApppackage() {
        return apppackage;
    }

    public void setApppackage(String apppackage) {
        this.apppackage = apppackage == null ? null : apppackage.trim();
    }

    public String getAppactivity() {
        return appactivity;
    }

    public void setAppactivity(String appactivity) {
        this.appactivity = appactivity == null ? null : appactivity.trim();
    }
}