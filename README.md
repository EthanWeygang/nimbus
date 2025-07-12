# File Storage Application

A full-stack application with Spring Boot backend and React frontend for managing file storage with AWS S3.

## Project Structure

```
filestorage/
├── backend/                    # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/filestorage/filestorage/
│   │   │   │       ├── FilestorageApplication.java
│   │   │   │       ├── FileController.java
│   │   │   │       ├── S3Service.java
│   │   │   │       └── config/
│   │   │   │           ├── FileStorageConfig.java
│   │   │   │           ├── WebConfig.java
│   │   │   │           └── CorsConfig.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── File.jsx
│   │   │   ├── Files.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   └── package.json
├── pom.xml                     # Parent POM for both modules
├── mvnw
└── mvnw.cmd
```

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+ (for frontend development)
- Maven 3.6+

### Building the Project

**Build everything from root:**
```bash
./mvnw clean compile
```

**Build and package:**
```bash
./mvnw clean package
```

### Development

**Backend only:**
```bash
cd backend
./mvnw spring-boot:run
```
The backend will start on `http://localhost:8080`

**Frontend only:**
```bash
cd frontend
npm start
```
The frontend will start on `http://localhost:3000`

**Full stack development:**
1. Start the backend: `cd backend && ./mvnw spring-boot:run`
2. In another terminal, start the frontend: `cd frontend && npm start`

### Configuration

The backend includes CORS configuration to allow communication with the React frontend during development. The frontend is configured to run on port 3000, and the backend on port 8080.

### AWS S3 Configuration

Configure your AWS credentials and S3 bucket settings in `backend/src/main/resources/application.properties`.

## API Endpoints

- Backend API: `http://localhost:8080`
- Frontend: `http://localhost:3000`

The CORS configuration allows the frontend to communicate with the backend seamlessly during development.
