import { useState } from "react";

function FileUploader(){
    const [file, setFile] = useState("");
    const [status, setStatus] = useState("idle");
    const [dragActive, setDragActive] = useState(false);

    function handleFileChange(e){
        if (e.target.files){
            setFile(e.target.files[0]);
        }
        setStatus("loaded")
    }

    function handleDrag(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setStatus("loaded");
        }
    }

    function handleFileUpload(e) {
        console.log("Handling file upload")
        e.preventDefault();
        
        if (!file) return;

        setStatus("uploading");

        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("jwt");
        console.log("Token:", token ? "Present" : "Missing");
        console.log("File size:", file.size, "bytes");
        console.log("Making request to backend...");

        // Try direct backend connection to bypass proxy issues
        fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        .then(response => {
            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);
            console.log("Response OK:", response.ok);
            return response.text().then(text => ({ status: response.status, text: text, ok: response.ok }));
        })
        .then(result => {
            console.log("Response data:", result.text);
            console.log("Status code:", result.status);
            
            // If we get a 200 status, consider it successful even if response text is empty
            if(result.ok && (result.text === "File successfully uploaded." || result.text === "")) {
                setStatus("success");
                setTimeout(() => {
                    setFile("");
                    setStatus("idle");
                }, 1500);
            } else {
                alert(result.text && result.text.trim() ? result.text : "File upload failed. Please try again.");
                setStatus("error");
            }
            
        })
        .catch(error => {
            console.error('Full error details:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            alert('Failed to upload to server.');
            setStatus("error");
        });
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
      <div className="w-full max-w-md mx-auto">
        <form onSubmit={handleFileUpload} className="space-y-6">
          {/* Drag and Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              dragActive ? 'border-sage bg-sage/10' : file ? 'border-forest bg-forest/5' : 'border-sage/40 hover:border-sage hover:bg-sage/5'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
            
            {!file ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-sage/20 rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-charcoal mb-2">
                    {dragActive ? 'Drop your file here' : 'Drop files here or click to browse'}
                  </p>
                  <p className="text-darkSage text-sm">
                    Support for all file types
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-forest/20 rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-charcoal">File Ready!</p>
                  <p className="text-sm text-darkSage">Click upload or drop another file to replace</p>
                </div>
              </div>
            )}
          </div>
          
          {/* File Details */}
          {status === "loaded" && file && (
            <div className="bg-forest/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal">File name:</span>
                <span className="text-sm text-darkSage break-all">{file.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal">Size:</span>
                <span className="text-sm text-darkSage">{formatFileSize(file.size)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal">Type:</span>
                <span className="text-sm text-darkSage">{file.type || 'Unknown'}</span>
              </div>
            </div>
          )}
          
          {/* Upload Button */}
          {file && status !== "uploading" && status !== "success" && (
            <button 
              type="submit" 
              className="w-full bg-sage text-white font-semibold py-3 px-4 rounded-xl hover:bg-forest transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload File
            </button>
          )}
          
          {/* Upload Progress */}
          {status === "uploading" && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto mb-2"></div>
              <p className="text-sage font-medium">Uploading your file...</p>
            </div>
          )}
        </form>
        
        {/* Status Messages */}
        {status === "success" && (
          <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-800 font-medium">File successfully uploaded!</p>
            </div>
          </div>
        )}
        
        {status === "error" && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">Error uploading file. Please try again.</p>
            </div>
          </div>
        )}
      </div>
    );
}

export default FileUploader;