import { Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import useJwt from '../hooks/useJwt';
import File from "./File";

function Files() {
  const [files, setFiles] = useState([]);
  const { isAuthenticated, loading, deleteJwt, getToken } = useJwt();

  const loadFiles = useCallback(async () => {
    const token = getToken();
    
    try {
      const response = await fetch("/api/files", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      } else {
        console.error("Error loading files:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }, [getToken]);

  useEffect(() => {
    // Only load files if authenticated
    if (isAuthenticated && !loading) {
      loadFiles();
    }
  }, [isAuthenticated, loading, loadFiles]);


  // Show loading while validating token
  if (loading) {
    return (
      <div align="center">
        <h2>Loading...</h2>
      </div>
    );
  }
  

  return (
    <div align="center">
      <h1>Your Files</h1>
      
      <div style={{display: "flex", flexDirection: "column", gap: "10px", width: "80%"}}>
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          files.map((file) => {
            const name = file.split("/")[1];
            return <File key={name} filename={name} loadFiles={loadFiles}/>;
          })
        )}
      </div>
      
      <div style={{marginTop: "20px"}}>
        <Link to="/files/upload">
          <button>Upload New File</button>
        </Link>
        <button 
          style={{marginLeft: "10px", backgroundColor: "#ff4444", color: "white"}}
          onClick={deleteJwt}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Files;