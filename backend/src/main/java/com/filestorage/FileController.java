package com.filestorage;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api")
public class FileController {

    private final S3Service s3Service;


    FileController(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> addFile(@RequestParam("file") MultipartFile file) {
        try {
            byte[] fileBytes = file.getBytes();

            s3Service.addToBucket(file.getOriginalFilename(), fileBytes); // Filename can be vunerability
            System.out.println("Data sent successfully.");

            return ResponseEntity.ok("File successfully uploaded.");

        } catch (IOException ex) {
            System.out.println(ex);
            return ResponseEntity.badRequest().body("Error while uploading file.");
        }
    }

    @PutMapping("/{fileName}")
    public void addFile2(@PathVariable String fileName) {
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
