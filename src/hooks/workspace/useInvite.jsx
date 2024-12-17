import { useState } from 'react'
import toast from 'react-hot-toast';
import dotenv from 'dotenv';
dotenv.config();

const useInvite = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [workspaceId, setWorkspaceId] = useState(null);
    
    const invite = async (workspaceId, username, level) => {
        setWorkspaceId(workspaceId);
        setLoading(true);
        setError(null);
        setSuccess(null);
        // eslint-disable-next-line no-undef
        const api = `http://localhost:5001/api/${process.env.VERSION || "v1"}/workspace/${workspaceId}/invite`;
        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, level})
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
    return { loading, error, success, invite, workspaceId }
}

export default useInvite