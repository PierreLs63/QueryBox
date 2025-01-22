import { useState } from 'react'
import toast from 'react-hot-toast';
import {baseURL} from '../../utils/variables';


const useJoin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [workspaceId, setWorkspaceId] = useState(null);
    const join = async (workspaceId) => {
        setWorkspaceId(workspaceId);
        setLoading(true);
        setError(null);
        setSuccess(null);
        const api = `${baseURL}/workspace/${workspaceId}/join`;
        try {
            const response = await fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log(data);
            if (data.message && !response.ok) {
                throw new Error(data.message);
            }
            toast.success(data.message);
            setSuccess(data.message);
            return {success: true, message: data.message};
        }
        catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }
    return { loading, error, success, join, workspaceId }
}

export default useJoin