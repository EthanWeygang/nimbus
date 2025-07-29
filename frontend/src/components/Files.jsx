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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-2xl font-semibold">Loading...</h2>
      </div>
    );
  }
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 mt-8">Your Files</h1>
      <div className="flex flex-row flex-wrap justify-center items-start w-full max-w-6xl">
        {files.length === 0 ? (
          <p className="text-gray-500">No files uploaded yet.</p>
        ) : (
          files.map((file) => {
            const name = file.split("/")[1];
            return <File key={name} filename={name} loadFiles={loadFiles}/>;
          })
        )}
      </div>
      
      <div className="mt-6 flex gap-4">
        <Link to="/files/upload">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Upload New File</button>
        </Link>
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={deleteJwt}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Files;