import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useGetRequestName = () => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [responseId, setResponseId] = useState(null);

    const getRequestName = async (responseId) => {
        setResponseId(responseId);
        setLoading(true);
        setError(null);
        setResponse(null);
        const api = `${baseURL}/response/${responseId}/requestName/`;
        try {
            const response = await fetch(api, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setResponse(data);
            return data.name;
        }
        catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }
    return { response, loading, error, getRequestName, responseId }
}

export default useGetRequestName