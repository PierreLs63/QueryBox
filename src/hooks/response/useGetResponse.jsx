import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useGetResponse = () => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [responseId, setResponseId] = useState(null);

    const getResponse = async (responseId) => {
        setResponseId(responseId);
        setLoading(true);
        setError(null);
        setResponse(null);
        const api = `${baseURL}/response/${responseId}/paramRequest/`;
        try {
            const response = await fetch(api, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setResponse(data);
            return {success: true, paramResponse: data.paramResponse, paramRequest: data.paramRequest};
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
    return { response, loading, error, getResponse, responseId }
}

export default useGetResponse