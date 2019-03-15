package com.example.demo.DTO;

public class NetdataSourceDTO {
    private Long dsId;

    private String dsName;

    private String dsDesc;

    private Integer type;

    private String timestamp;

    private int state;


    public NetdataSourceDTO(Long dsId, String dsName, String dsDesc, Integer type, String timestamp, int state) {
        this.dsId = dsId;
        this.dsName = dsName;
        this.dsDesc = dsDesc;
        this.type = type;
        this.timestamp = timestamp;
        this.state = state;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    public Long getDsId() {
        return dsId;
    }

    public void setDsId(Long dsId) {
        this.dsId = dsId;
    }

    public String getDsName() {
        return dsName;
    }

    public void setDsName(String dsName) {
        this.dsName = dsName;
    }

    public String getDsDesc() {
        return dsDesc;
    }

    public void setDsDesc(String dsDesc) {
        this.dsDesc = dsDesc;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
