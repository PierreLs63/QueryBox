import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';
import useRequestInputStore from '../../zustand/RequestInput';
import useCreateRequest from './useCreateRequest';

const useCreateParamRequest = () => {
    const [loadingreateParamRequest, setLoadingreateParamRequest] = useState(false);
    const [errorreateParamRequest, setErrorreateParamRequest] = useState(null);
    const [successreateParamRequest, setSuccessreateParamRequest] = useState(null);
    const [requestId, setRequestId] = useState("6780d4b7994d27f8df1ca425");
    const RequestInputs = useRequestInputStore();
    const {CreateRequest} = useCreateRequest();

    const createParamRequest = async () => {
        setLoadingreateParamRequest(true);
        setErrorreateParamRequest(null);
        setSuccessreateParamRequest(null);
        const api = `${baseURL}/request/${requestId}/paramRequest`;
        const { url, method, body, headers, params } = RequestInputs;
        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({url, method, body, header: headers, parameters: params})
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            CreateRequest();


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
    return { loadingreateParamRequest, errorreateParamRequest, successreateParamRequest, createParamRequest }
}

export default useCreateParamRequest