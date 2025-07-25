import FileUploader from "./FileUploader";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Upload(){
    const navigate = useNavigate();

    // Check if user is authenticated when component loads
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("/login"); // Redirect if no token
        }
    }, [navigate]);

    return(
        <>
        <div align="center">
            <h1>Upload File</h1>
            <FileUploader/>
            <br/>
            <button onClick={() => navigate("/files")}>Back to Files</button>
        </div>
        </>
    );
}



export default Upload;

