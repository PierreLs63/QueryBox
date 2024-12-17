//je veux créer un hook pour supprimer un workspace la route est la suivante: http://localhost:5001/api/v1/workspace/:workspaceId et la méthode est DELETE

import { useState } from 'react'
import toast from 'react-hot-toast';
import dotenv from 'dotenv';
dotenv.config();

const useDelete = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [workspaceId, setWorkspaceId] = useState(null);
    
    const deleteWorkspace = async (workspaceId) => {
        setWorkspaceId(workspaceId);
        setLoading(true);
        setError(null);
        setSuccess(null);
        // eslint-disable-next-line no-undef
        const api = `http://localhost:5001/api/${process.env.VERSION || "v1"}/workspace/${workspaceId}`;
        try {
            const response = await fetch(api, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setSuccess(data.message);
        }
        catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }
    return { loading, error, success, deleteWorkspace, workspaceId }
}

export default useDelete
