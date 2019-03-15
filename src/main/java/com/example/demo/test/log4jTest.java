package com.example.demo.test;

import groovy.util.logging.Log4j;
import org.apache.log4j.PropertyConfigurator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class log4jTest {
    private static final Logger logger = LoggerFactory.getLogger(log4jTest.class);

    public static void main(String[] args) {

        PropertyConfigurator.configure( "/Users/seanlxh/Downloads/PCCrawler/src/main/resources/log4j.properties" );
        // 记录debug级别的信息
        logger.debug("This is debug message.");
        // 记录info级别的信息
        logger.info("This is info message.");
        // 记录error级别的信息
        logger.error("This is error message.");
    }
}
