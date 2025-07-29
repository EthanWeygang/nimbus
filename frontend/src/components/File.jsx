import { Link } from 'react-router-dom';
import useJwt from "../hooks/useJwt";

function File({ filename, loadFiles }) {
  const {getToken} = useJwt();

  async function downloadFile(){
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
    }
  }



  async function deleteFile(){
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
    }

  }
  
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "15px",
      borderRadius: "5px",
      backgroundColor: "#f9f9f9"
    }}>
      <h3>{filename}</h3>
        <button onClick={downloadFile}>Download</button>
        <button onClick={deleteFile}>Delete</button>
    </div>
  );
}

export default File;