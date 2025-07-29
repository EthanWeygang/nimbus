import { useState } from "react";

function FileUploader(){
    const [file, setFile] = useState("");
    const [status, setStatus] = useState("idle");

    function handleFileChange(e){
        if (e.target.files){
            setFile(e.target.files[0]);
        }
        setStatus("loaded")
    }

    function handleFileUpload(e) {
        console.log("Handling file upload")
        e.preventDefault();
        
        if (!file) return;

        setStatus("uploading");

        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("jwt");

        fetch("/api/upload", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            if(data === "File successfully uploaded."){
                setStatus("success");
            } else {
                alert(data)
                setStatus("error");
            }
            
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to upload to server.');
            setStatus("error");
        });
    }

    return (
      <div className="w-full max-w-md mx-auto">
        <form onSubmit={handleFileUpload} className="flex flex-col gap-4">
          <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {status === "loaded" && file && (
            <div className="bg-gray-100 rounded p-2">
              <p>File name: {file.name}</p>
              <p>Size: {(file.size/1024).toFixed(2)} KB</p>
              <p>Type: {file.type}</p>
            </div>
          )}
          {file && status !== "uploading" && (
            <button type="submit" className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700 transition mt-2">Upload</button>
          )}
        </form>
        {status === "success" && <p className="text-green-600 mt-2">File successfully uploaded!</p>}
        {status === "error" && <p className="text-red-600 mt-2">Error, file not uploaded.</p>}
      </div>
    );
}
export default FileUploader;