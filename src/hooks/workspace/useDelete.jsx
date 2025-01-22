import { useState } from 'react'
import toast from 'react-hot-toast';
import {baseURL} from '../../utils/variables';
import useCurrentState from '../../zustand/CurrentState';

const useDelete = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const CurrentState = useCurrentState();
    
    
    const deleteWorkspace = async (workspaceId) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        const api = `${baseURL}/workspace/${workspaceId}`;
        try {
            const response = await fetch(api, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.message && !response.ok) {
                throw new Error(data.message);
            }
            setSuccess(data.message);
            toast.success(data.message);
            CurrentState.clearAll();
            return {success: true, message: data.message};
        }
        catch (error) {
            setError(error.message);
            toast.error(error.message);
            return {success: false, message: error.message};
        }
        finally {
            setLoading(false);
        }
    }
    return { loading, error, success, deleteWorkspace }
}

export default useDelete
