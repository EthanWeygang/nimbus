import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function useJwt() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const deleteJwt = useCallback(() => {
        localStorage.removeItem("jwt");
        setIsAuthenticated(false);
        navigate("/login");
    }, [navigate]);

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem("jwt");

        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            navigate("/login");
            return false;
        }

        try {
            // Test the token by making a request to a protected endpoint
            const response = await fetch("/api/auth", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                setIsAuthenticated(true);
                setLoading(false);
                return true; 

            } else if (response.status === 401) {
                // Token is invalid/expired
                deleteJwt()
                setIsAuthenticated(false);
                setLoading(false);
                navigate("/login");
                return false;

            } else {
                // Some other error
                console.error("Auth check failed:", response.status);
                setIsAuthenticated(false);
                setLoading(false);
                navigate("/login");
                return false;
            }
        } catch (error) {
            console.error("Network error during auth check:", error);
            setIsAuthenticated(false);
            setLoading(false);
            navigate("/login");
            return false;
        }
    }, [navigate, deleteJwt]);

    const getToken = useCallback(()=> {
        return localStorage.getItem("jwt");
    }, []);

    // This runs on hook usage
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return {
        isAuthenticated,
        loading,
        checkAuth,
        deleteJwt,
        getToken
    };
}

export default useJwt;
