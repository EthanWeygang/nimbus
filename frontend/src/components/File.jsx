import { Link } from 'react-router-dom';
import useJwt from "../hooks/useJwt";

function File({ filename, loadFiles }) {
  const {getToken} = useJwt();

  async function downloadFile(){
    try{
      const response = await fetch("/api/download",
        {
          method: "GET",
          headers: 
          {
            "Authentication" : `Bearer ${getToken()}`,
            "Content-Type" : "application/json"
          },
          body: JSON.stringify({"fileName" : filename})
        }
      )

      if(response.ok){
        loadFiles()
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
      <button onClick={downloadFile()}>Download</button>
      <button onClick={deleteFile()}>Delete</button>
    </div>
  );
}

export default File;