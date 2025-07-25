import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';

function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const validateTokenAndLoadFiles = useCallback(async () => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Send GET request with JWT token
      const response = await fetch("/api/files", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        // Token is valid! Load the files and show page
        const data = await response.json();
        setFiles(data);
        setLoading(false);

      } else if (response.status === 401) {
        // Token is invalid/expired - backend said "no way!"
        localStorage.removeItem("jwt"); // Clear bad token
        navigate("/login"); // Redirect to login

      } else {
        // Some other error
        console.error("Error loading files:", response.status);
        navigate("/login");
      }

    } catch (error) {
      // Network error or other issue
      console.error("Network error:", error);
      navigate("/login");
    }

  }, [navigate]);


  // This runs when the component loads
  useEffect(() => {
    validateTokenAndLoadFiles();
  }, [validateTokenAndLoadFiles]);


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
          files.map((filename, index) => (
            <div key={index} style={{
              border: "1px solid #ccc", 
              padding: "15px", 
              borderRadius: "5px",
              backgroundColor: "#f9f9f9"
            }}>
              <h3>{filename}</h3>
              <button>Download</button>
            </div>
          ))
        )}
      </div>
      
      <div style={{marginTop: "20px"}}>
        <Link to="/files/upload">
          <button>Upload New File</button>
        </Link>
        <button 
          style={{marginLeft: "10px", backgroundColor: "#ff4444", color: "white"}}
          onClick={() => {
            localStorage.removeItem("jwt");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Files;