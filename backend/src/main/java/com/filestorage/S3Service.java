package com.filestorage;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.filestorage.filestorage.config.FileStorageConfig;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Component
public class S3Service {
    
    private final S3Client s3Client;
	private FileStorageConfig config;

    S3Service(S3Client s3Client, FileStorageConfig config){
        this.s3Client = s3Client;
		this.config = config;
    }

    public void addToBucket(String fileName, byte[] fileData, String email){
        PutObjectRequest request = PutObjectRequest.builder()
                                .bucket(config.getBucketName())
                                .key(email + "/" + fileName)
                                .build();
    
        s3Client.putObject(request, RequestBody.fromBytes(fileData));
    }

    public void removeFromBucket(String fileName, String email){
        DeleteObjectRequest request = DeleteObjectRequest.builder()
                                    .bucket(config.getBucketName())
                                    .key(email + "/" + fileName)
                                    .build();
        
        s3Client.deleteObject(request);
    }

    public List<String> listFilesInFolder(String folderName) {
        // Ensure folder name ends with "/" for proper prefix matching
        String folderNameWithPrefix = folderName + "/";
        
        ListObjectsV2Request request = ListObjectsV2Request.builder()
                                        .bucket(config.getBucketName())
                                        .prefix(folderNameWithPrefix)
                                        .build();
        
        ListObjectsV2Response response = s3Client.listObjectsV2(request);
        
        return response.contents()
                      .stream()
                      .map(s3Object -> s3Object.key())
                      .filter(key -> !key.equals(folderNameWithPrefix)) // Exclude the folder itself if it exists
                      .collect(Collectors.toList());
    }

}
