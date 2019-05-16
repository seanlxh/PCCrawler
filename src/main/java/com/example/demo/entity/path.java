package com.example.demo.entity;

public class path {
    private String languageName;

    private String libpath;

    private String csvpath;

    private String hadooppath;

    public String getLanguageName() {
        return languageName;
    }

    public void setLanguageName(String languageName) {
        this.languageName = languageName == null ? null : languageName.trim();
    }

    public String getLibpath() {
        return libpath;
    }

    public void setLibpath(String libpath) {
        this.libpath = libpath == null ? null : libpath.trim();
    }

    public String getCsvpath() {
        return csvpath;
    }

    public void setCsvpath(String csvpath) {
        this.csvpath = csvpath == null ? null : csvpath.trim();
    }

    public String getHadooppath() {
        return hadooppath;
    }

    public void setHadooppath(String hadooppath) {
        this.hadooppath = hadooppath == null ? null : hadooppath.trim();
    }
}