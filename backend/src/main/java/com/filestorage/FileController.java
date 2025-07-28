package com.filestorage;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api")
public class FileController {

    private final S3Service s3Service;
    private final JwtService jwtService;


    FileController(S3Service s3Service, JwtService jwtService) {
        this.s3Service = s3Service;
        this.jwtService = jwtService;
    }

    @GetMapping("/files")
    public ResponseEntity<List<String>> getUsersFiles(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractUsername(token);
            List<String> files = s3Service.listFilesInFolder(email);
            return ResponseEntity.ok(files);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/files")
    public ResponseEntity deleteFile(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, String> body){
        try {
            String fileName = body.get("fileName");
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractUsername(token);

            s3Service.removeFromBucket(fileName, email);

            return ResponseEntity.ok("File successfully deleted.");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> addFile(@RequestParam("file") MultipartFile file, @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractUsername(token);
            byte[] fileBytes = file.getBytes();

            s3Service.addToBucket(file.getOriginalFilename(), fileBytes, email);

            return ResponseEntity.ok("File successfully uploaded.");

        } catch (IOException ex) {
            System.out.println(ex);
            return ResponseEntity.badRequest().body("Error while uploading file.");
        }
    }
}
