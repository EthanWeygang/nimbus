package com.filestorage;

import java.util.List;
import java.util.Map;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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
    public ResponseEntity<?> getUsersFiles(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractUsername(token);
            List<String> files = s3Service.listFilesInFolder(email);
            return ResponseEntity.ok(files);

        } catch (Exception e) {
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

    @PostMapping("/upload")
    public ResponseEntity<?> addFile(@RequestParam("file") MultipartFile file, @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractUsername(token);
            byte[] fileBytes = file.getBytes();
            List<String> currentFiles = s3Service.listFilesInFolder(email);

            if(s3Service.countFiles(email) >= 51){
                return ResponseEntity.badRequest().body("Exceeded maximum amount of files allowed for one account (50 files).");
            }

            if (currentFiles.contains(email + "/" + file.getOriginalFilename())) {
                return ResponseEntity.badRequest().body("A file with this name already exists.");
            }

            s3Service.addToBucket(file.getOriginalFilename(), fileBytes, email);

            return ResponseEntity.ok("File successfully uploaded.");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e);
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
