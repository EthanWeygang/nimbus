package com.filestorage.filestorage;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
public class FileController {

    private final S3Service s3Service;


    FileController(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @PutMapping("/{fileName}")
    public void addFile(@PathVariable String fileName) {
        byte[] dummyData = "Dummy Data".getBytes();

        s3Service.addToBucket(fileName, dummyData);
        System.out.println("Data send successfully.");
    }

    @DeleteMapping("/{fileName}")
    public void removeFile(@PathVariable String fileName){
        s3Service.removeFromBucket(fileName);
        System.out.println("File deleted successfully.");
    }

}
