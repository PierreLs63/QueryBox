import { useState } from 'react'
import toast from 'react-hot-toast';
import {baseURL} from '../../utils/variables';

const useCreate = () => {
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const createWorkspace = async () => {
        const api = `${baseURL}/workspace`;
        try {
            setLoading(true);
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setWorkspace(data);
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
    return { workspace, loading, error, success, createWorkspace }
}

export default useCreate