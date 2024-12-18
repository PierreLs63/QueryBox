import { useState } from 'react'
import toast from 'react-hot-toast';
import baseURL from '../../utils/variables';

const useCreateParamRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [requestId, setRequestId] = useState(null);
    const [url, setUrl] = useState(null);
    const [method, setMethod] = useState(null);
    const [body, setBody] = useState(null);
    const [header, setHeader] = useState(null);
    const [parameters, setParameters] = useState(null);
    const [responses, setResponses] = useState(null);

    const createParamRequest = async (requestId, url, method, body, header, parameters, responses) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        setRequestId(requestId);
        setUrl(url);
        setMethod(method);
        setBody(body);
        setHeader(header);
        setParameters(parameters);
        setResponses(responses);
        const api = `${baseURL}/requests/${requestId}/paramRequest`;
        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({url, method, body, header, parameters, responses})
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
    return { loading, error, success, createParamRequest, requestId, url, method, body, header, parameters, responses }
}

export default useCreateParamRequest