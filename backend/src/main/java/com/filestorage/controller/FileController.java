package com.filestorage.controller;

import java.util.List;
import java.util.Map;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.filestorage.service.JwtService;
import com.filestorage.service.S3Service;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class FileController {

    private final S3Service s3Service;
    private final JwtService jwtService;

    FileController(S3Service s3Service, JwtService jwtService) {
        this.s3Service = s3Service;
        this.jwtService = jwtService;
    }


    @GetMapping("/files")
    public ResponseEntity<?> getUsersFiles(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        // System.out.println("=== FILES ENDPOINT HIT ===");
        // System.out.println("Auth header: " + (authHeader != null ? "PROVIDED" : "NULL"));

        if(authHeader == null){
            return ResponseEntity.badRequest().body(Map.of("error", "No authorization header present."));
        }
        
        try {

            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractUsername(token);
            // System.out.println("Extracted email from token: " + email);

            
            // System.out.println("Fetching files for user: " + email);
            List<String> files = s3Service.listFilesInFolder(email);
            return ResponseEntity.ok(files);

        } catch (Exception e) {
            // System.out.println("Files endpoint error: " + e.getMessage());
            return ResponseEntity.badRequest().body(e);
        }
    }

    @DeleteMapping("/files")
    public ResponseEntity<?> deleteFile(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, String> body){
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

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        // System.out.println("=== TEST ENDPOINT HIT ===");
        return ResponseEntity.ok("Test endpoint working!");
    }

    @GetMapping("/test-s3")
    public ResponseEntity<?> testS3Connection() {
        try {
            // System.out.println("=== TESTING S3 CONNECTION ===");
            List<String> files = s3Service.listFilesInFolder("test");
            return ResponseEntity.ok("S3 connection working! Found " + files.size() + " files.");
        } catch (Exception e) {
            // System.out.println("S3 test failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("S3 connection failed: " + e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> addFile(@RequestParam(value = "file", required = false) MultipartFile file, 
                                   @RequestHeader(value = "Authorization", required = false) String authHeader) {
        // System.out.println("=== UPLOAD ENDPOINT HIT ===");
        // System.out.println("File: " + (file != null ? file.getOriginalFilename() : "NULL"));
        // System.out.println("Auth header: " + (authHeader != null ? "PROVIDED" : "NULL"));
        
        if (file == null) {
            System.err.println("No file provided in upload request");
            return ResponseEntity.badRequest().body("No file provided");
        }
        
        // For debugging - let's temporarily use a hardcoded email
        String email = "test-user@example.com";
        if (authHeader != null) {
            try {
                String token = authHeader.replace("Bearer ", "");
                email = jwtService.extractUsername(token);
                // System.out.println("Extracted email from token: " + email);
            } catch (Exception e) {
                System.err.println("Failed to extract email from token, using default: " + e.getMessage());
            }
        }
        
        try {
            byte[] fileBytes = file.getBytes();
            List<String> currentFiles = s3Service.listFilesInFolder(email);

            if(s3Service.countFiles(email) >= 51){
                return ResponseEntity.badRequest().body("Exceeded maximum amount of files allowed for one account (50 files).");
            }

            if (currentFiles.contains(email + "/" + file.getOriginalFilename())) {
                return ResponseEntity.badRequest().body("A file with this name already exists.");
            }

            // System.out.println("Uploading file to S3: " + file.getOriginalFilename() + " for user: " + email);
            s3Service.addToBucket(file.getOriginalFilename(), fileBytes, email);
            // System.out.println("Upload to S3 completed for: " + file.getOriginalFilename());

            return ResponseEntity.ok("File successfully uploaded.");

        } catch (Exception e) {
            System.err.println("File upload failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("File upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/download")
    public ResponseEntity<?> downloadFile(@RequestHeader("Authorization") String authHeader, @RequestParam("fileName") String fileName){
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractUsername(token);

            InputStreamResource object = s3Service.downloadFile(fileName, email);

            // Content disposition tells the browser to force a download rather than trying to display the file
            // Application_Octet_Stream is a generic binary file for when you're not sure what type of media it being sent (is it text? is it image?)
            // It tells the browser to treat the stream as raw bytes. Used for when you dont know the specific file type
            // or want the browser to treat it as a download
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(object);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e);
        }
    }
}
