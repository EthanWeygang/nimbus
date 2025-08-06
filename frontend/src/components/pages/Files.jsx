import { Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import useJwt from '../../hooks/useJwt';
import File from "../elements/File";
import Loading from "../elements/Loading";
import UploadIcon from "../svg/UploadIcon";

function Files() {
  const [files, setFiles] = useState([]);
  const { isAuthenticated, loading, getToken } = useJwt();

  const loadFiles = useCallback(async () => {
    const token = getToken();
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files`, {
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
      <Loading/>
    );
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-mint">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Your Files</h1>
          <p className="text-darkSage text-lg">Manage and organize your uploaded files</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/files/upload">
            <button className="w-full sm:w-auto px-6 py-3 bg-sage text-white rounded-xl hover:bg-forest transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center">
              <UploadIcon/>
              Upload New File
            </button>
          </Link>
        </div>
        
        {/* Files Grid */}
        <div className="max-w-7xl mx-auto">
          {files.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-sage/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">No files yet</h3>
                <p className="text-darkSage mb-6">Upload your first file to get started!</p>
                <Link to="/files/upload">
                  <button className="px-6 py-2 bg-sage text-white rounded-lg hover:bg-forest transition-colors">
                    Upload Files
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files.map((file) => {
                const name = file.split("/")[1];
                return <File key={name} filename={name} loadFiles={loadFiles}/>;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Files;