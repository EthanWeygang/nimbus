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
    <div className="border border-gray-300 p-4 rounded-lg bg-white shadow-md flex flex-col items-center w-64 h-40 box-border mx-2 my-2">
      <h3 className="font-semibold text-lg break-all mb-4">{filename}</h3>
      <div className="flex gap-2 mt-auto">
        <button onClick={downloadFile} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Download</button>
        <button onClick={deleteFile} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Delete</button>
      </div>
    </div>
  );
}

export default File;