package com.filestorage.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Component;

import com.filestorage.config.FileStorageConfig;

import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Component
public class S3Service {
    
    private static final Logger logger = LoggerFactory.getLogger(S3Service.class);
    private final S3Client s3Client;
	private final FileStorageConfig config;

    S3Service(S3Client s3Client, FileStorageConfig config){
        this.s3Client = s3Client;
		this.config = config;
    }

    public void addToBucket(String fileName, byte[] fileData, String email){
        try {
            logger.info("=== S3 UPLOAD DEBUG ===");
            logger.info("Bucket: " + config.getBucketName());
            logger.info("Key: " + email + "/" + fileName);
            logger.info("File size: " + fileData.length + " bytes");
            
            PutObjectRequest request = PutObjectRequest.builder()
                                    .bucket(config.getBucketName())
                                    .key(email + "/" + fileName)
                                    .build();
        
            s3Client.putObject(request, RequestBody.fromBytes(fileData));
            logger.info("S3 upload successful!");
        } catch (Exception e) {
            logger.error("S3 upload failed: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to trigger FileController catch block
        }
    }

    public void removeFromBucket(String fileName, String email){
        DeleteObjectRequest request = DeleteObjectRequest.builder()
                                    .bucket(config.getBucketName())
                                    .key(email + "/" + fileName)
                                    .build();
        
        s3Client.deleteObject(request);
    }

    public List<String> listFilesInFolder(String email) {
        try {
            logger.info("=== S3 LIST DEBUG ===");
            logger.info("Bucket: " + config.getBucketName());
            logger.info("Prefix: " + email + "/");
            
            ListObjectsV2Request request = ListObjectsV2Request.builder()
                                            .bucket(config.getBucketName())
                                            .prefix(email + "/")
                                            .build();
            
            ListObjectsV2Response response = s3Client.listObjectsV2(request);
            
            List<String> files = response.contents()
                          .stream()
                          .map(s3Object -> s3Object.key())
                          .filter(key -> !key.equals(email + "/")) // Exclude the folder itself if it exists
                          .collect(Collectors.toList());
            
            logger.info("Found " + files.size() + " files: " + files);
            return files;
        } catch (Exception e) {
            logger.error("S3 list failed: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to trigger FileController catch block
        }
    }

    public InputStreamResource downloadFile(String fileName, String email){
        GetObjectRequest request = GetObjectRequest.builder()
                                    .bucket(config.getBucketName())
                                    .key(email + "/" + fileName)
                                    .build();
        
        ResponseInputStream object = s3Client.getObject(request);
        
        // Input Stream resource is the type used for binary streams that Spring uses
        return new InputStreamResource(object);
    }

    public int countFiles(String email){
        int fileAmount = listFilesInFolder(email).size();

        return fileAmount;
    }

}
