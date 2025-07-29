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

    return(
    <>
    <div>
        <form onSubmit={(e) => {handleFileUpload(e)}}>
        <input type="file" onChange={(e) => handleFileChange(e)}></input>
        {status === "loaded" && file &&
            <div>
            <p>File name: {file.name}</p>
            <p>Size: {(file.size/1024).toFixed(2)} KB</p>
            <p>Type: {file.type}</p>
            </div>
        }
        {file && status !== "uploading" &&
        <div>
            <br/>
            <button type="submit">Upload</button>
        </div>
            }
        </form>

        {status === "success" && <p>File successfully uploaded!</p>}
        {status === "error" && <p>Error, file not uploaded.</p>}
    </div>
    </>
)
}
export default FileUploader;