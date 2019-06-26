package com.example.demo.entity;

public class NetDataSource {
    public NetDataSource() {
    }

    private Long dsId;

    private String csvname;

    private String dsName;

    private String dsDesc;

    private Integer type;

    private Long timestamp;

    private Integer state;

    public Long getDsId() {
        return dsId;
    }

    public void setDsId(Long dsId) {
        this.dsId = dsId;
    }

    public String getCsvname() {
        return csvname;
    }


    public void setCsvname(String csvname) {
        this.csvname = csvname == null ? null : csvname.trim();
    }

    public String getDsName() {
        return dsName;
    }

    public void setDsName(String dsName) {
        this.dsName = dsName == null ? null : dsName.trim();
    }

    public String getDsDesc() {
        return dsDesc;
    }

    public void setDsDesc(String dsDesc) {
        this.dsDesc = dsDesc == null ? null : dsDesc.trim();
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    public NetDataSource(Long dsId, String csvname, String dsName, String dsDesc, Integer type, Long timestamp, Integer state) {
        this.dsId = dsId;
        this.csvname = csvname;
        this.dsName = dsName;
        this.dsDesc = dsDesc;
        this.type = type;
        this.timestamp = timestamp;
        this.state = state;
    }
}