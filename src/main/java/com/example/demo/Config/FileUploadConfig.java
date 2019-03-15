package com.example.demo.Config;
import javax.servlet.MultipartConfigElement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
/**
 * @author SHAREVE
 * */
@Configuration
public class FileUploadConfig {
    /**
     * 文件上传配置
     *
     * @return MultipartConfigElement
     */
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        // 单个文件最大
        factory.setMaxFileSize(50 * 1024 * 1024);
        // 设置总上传数据总大小
        factory.setMaxRequestSize(100 * 1024 * 1024);
        return factory.createMultipartConfig();
    }
}
