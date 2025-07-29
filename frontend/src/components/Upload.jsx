import FileUploader from "./FileUploader";
import { useNavigate } from 'react-router-dom';
import useJwt from '../hooks/useJwt';

function Upload(){
    const navigate = useNavigate();
    const { loading } = useJwt(); // This automatically handles authentication

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <h2 className="text-2xl font-semibold">Loading...</h2>
            </div>
        );
    }

    return(
        <div className="flex flex-col items-center min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 mt-8">Upload File</h1>
            <FileUploader/>
            <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={() => navigate("/files")}>Back to Files</button>
        </div>
    );
}



export default Upload;

