import FileUploader from "../elements/FileUploader";
import { useNavigate } from 'react-router-dom';
import useJwt from '../../hooks/useJwt';
import Loading from "../elements/Loading";

function Upload(){
    const navigate = useNavigate();
    const { loading } = useJwt(); // This automatically handles authentication

    // Show loading while checking authentication
    if (loading) {
        return (
            <Loading/>
        );
    }

    return(
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-mint">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-charcoal mb-4">Upload Files</h1>
                        <p className="text-darkSage text-lg">Share your files securely to the cloud</p>
                    </div>
                    
                    {/* Upload Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6">
                        <FileUploader/>
                    </div>
                    
                    {/* Navigation */}
                    <div className="text-center">
                        <button 
                            className="px-6 py-3 bg-forest text-white rounded-xl hover:bg-darkSage transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center mx-auto" 
                            onClick={() => navigate("/files")}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Files
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Upload;

