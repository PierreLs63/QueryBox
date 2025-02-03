import { useState } from 'react'
import toast from 'react-hot-toast';
import {baseURL} from '../../utils/variables';

const useCreate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
            if (data.message && !response.ok) {
                throw new Error(data.error);
            };
            toast.success("Workspace created successfully");
            return {success: true, data};
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
    return { loading, error, createWorkspace }
}

export default useCreate