import { useState } from 'react'
import toast from 'react-hot-toast';
import dotenv from 'dotenv';
dotenv.config();

const useChangeName = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const changeName = async (workspaceId, newName) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        // eslint-disable-next-line no-undef
        const api = `http://localhost:5001/api/${process.env.VERSION || "v1"}/workspace/${workspaceId}/name`;
        try {
            const response = await fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: newName})
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
    return { loading, error, success, changeName }
}

export default useChangeName