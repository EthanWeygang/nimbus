package com.filestorage;

import org.springframework.stereotype.Component;

import com.filestorage.filestorage.config.FileStorageConfig;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Component
public class S3Service {
    
    private final S3Client s3Client;
	private FileStorageConfig config;

    S3Service(S3Client s3Client, FileStorageConfig config){
        this.s3Client = s3Client;
		this.config = config;
    }

    public void addToBucket(String fileName, byte[] fileData){
        PutObjectRequest request = PutObjectRequest.builder()
                                .bucket(config.getBucketName())
                                .key(fileName)
                                .build();
    
        s3Client.putObject(request, RequestBody.fromBytes(fileData));
    }

    public void removeFromBucket(String filename){
        DeleteObjectRequest request = DeleteObjectRequest.builder()
                                    .bucket(config.getBucketName())
                                    .key(filename)
                                    .build();
        
        s3Client.deleteObject(request);
    }

}
