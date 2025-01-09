import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useCreateParamRequest = () => {
    const [loadingreateParamRequest, setLoadingreateParamRequest] = useState(false);
    const [errorreateParamRequest, setErrorreateParamRequest] = useState(null);
    const [successreateParamRequest, setSuccessreateParamRequest] = useState(null);
    const [requestId, setRequestId] = useState(null);
    const [url, setUrl] = useState(null);
    const [method, setMethod] = useState(null);
    const [body, setBody] = useState(null);
    const [header, setHeader] = useState(null);
    const [parameters, setParameters] = useState(null);
    const [responses, setResponses] = useState(null);

    const createParamRequest = async (requestId, url, method, body, header, parameters, responses) => {
        setLoadingreateParamRequest(true);
        setErrorreateParamRequest(null);
        setSuccessreateParamRequest(null);
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
            setSuccessreateParamRequest(data.message);
        }
        catch (error) {
            setErrorreateParamRequest(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingreateParamRequest(false);
        }
    }
    return { loadingreateParamRequest, errorreateParamRequest, successreateParamRequest, createParamRequest, requestId, url, method, body, header, parameters, responses }
}

export default useCreateParamRequest