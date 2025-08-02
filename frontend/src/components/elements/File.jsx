import useJwt from "../../hooks/useJwt";
import { useState } from 'react';
import DownloadIcon from "../svg/DownloadIcon";
import DeleteIcon from "../svg/DeleteIcon";

function File({ filename, loadFiles }) {
  const {getToken} = useJwt();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  async function downloadFile(){
    setIsDownloading(true);
    try{
      const response = await fetch(`/api/download?fileName=${encodeURIComponent(filename)}`,
        {
          method: "GET",
          headers: 
          {
            "Authorization" : `Bearer ${getToken()}`,
            "Content-Type" : "application/json"
          }
        }
      )

      if(response.ok){
        const blob = await response.blob()

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // or whatever filename you want
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch(e){
      console.log("error: " + e)
    } finally { 
      setIsDownloading(false);
    }
  }

  async function deleteFile(){
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }
    
    setIsDeleting(true);
    try{
      const response = await fetch("/api/files",
        {
          method: "DELETE",
          headers: 
          {
            "Authorization" : `Bearer ${getToken()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({"fileName" : filename})
        });

      if (response.ok){
        loadFiles()
      }

    } catch (error) {
      console.error("Failed to delete file:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  // Get file extension for icon
  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const getFileIcon = (extension) => {
    const iconMap = {
      pdf: "📄",
      doc: "📝", docx: "📝",
      xls: "📊", xlsx: "📊",
      ppt: "📽️", pptx: "📽️",
      jpg: "🖼️", jpeg: "🖼️", png: "🖼️", gif: "🖼️",
      mp4: "🎥", avi: "🎥", mov: "🎥",
      mp3: "🎵", wav: "🎵",
      zip: "📦", rar: "📦",
      txt: "📋"
    };
    return iconMap[extension] || "📄";
  };

  const extension = getFileExtension(filename);
  const icon = getFileIcon(extension);
  
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-sage/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] p-6">
      <div className="flex flex-col items-center h-full">
        {/* File Icon */}
        <div className="text-4xl mb-4">
          {icon}
        </div>
        
        {/* File Name */}
        <h3 className="font-semibold text-lg text-charcoal mb-2 text-center break-words w-full line-clamp-2">
          {filename}
        </h3>
        
        {/* File Extension Badge */}
        <div className="mb-4">
          <span className="px-2 py-1 bg-sage/20 text-forest text-xs font-medium rounded-full uppercase">
            {extension}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto w-full">
          <button 
            onClick={downloadFile} 
            disabled={isDownloading}
            className="flex-1 px-3 py-2 bg-sage text-white rounded-lg hover:bg-forest transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <DownloadIcon/>
                Download
              </>
            )}
          </button>
          
          <button 
            onClick={deleteFile} 
            disabled={isDeleting}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <DeleteIcon/>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default File;