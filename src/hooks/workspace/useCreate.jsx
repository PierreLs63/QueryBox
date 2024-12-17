import { useState } from 'react'
import toast from 'react-hot-toast';
import dotenv from 'dotenv';

dotenv.config();

const useCreate = () => {
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const createWorkspace = async () => {
        // eslint-disable-next-line no-undef
        const api = `http://localhost:5001/api/${process.env.VERSION || "v1"}/workspace/create`;
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