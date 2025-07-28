import FileUploader from "./FileUploader";
import { useNavigate } from 'react-router-dom';
import useJwt from '../hooks/useJwt';

function Upload(){
    const navigate = useNavigate();
    const { loading } = useJwt(); // This automatically handles authentication

    // Show loading while checking authentication
    if (loading) {
        return (
            <div align="center">
                <h2>Loading...</h2>
            </div>
        );
    }

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

