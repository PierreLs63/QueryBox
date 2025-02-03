import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useDeleteResponse = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [responseId, setResponseId] = useState(null);

    const deleteResponse = async (responseId) => {
        setResponseId(responseId);
        setLoading(true);
        const api = `${baseURL}/response/${responseId}`;
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
            toast.success(data.message, {style: {wordBreak: 'break-word'}});;
            return {success: true};
        }
        catch (error) {
            setError(error.message);
            toast.error(error.message);
            return {success: false};
        }
        finally {
            setLoading(false);
        }
    }
    return { loading, error, success, deleteResponse, responseId }
}

export default useDeleteResponse