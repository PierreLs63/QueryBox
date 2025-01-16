import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';
import useRequestInputStore from '../../zustand/RequestInput';
import useCreateRequest from './useCreateRequest';
import useCurrentState from '../../zustand/CurrentState';

const useCreateParamRequest = () => {
    const [loadingreateParamRequest, setLoadingreateParamRequest] = useState(false);
    const [errorreateParamRequest, setErrorreateParamRequest] = useState(null);
    const [successreateParamRequest, setSuccessreateParamRequest] = useState(null);
    const RequestInputs = useRequestInputStore();
    const CurrentState = useCurrentState();
    const {CreateRequest} = useCreateRequest();

    const createParamRequest = async () => {
        setLoadingreateParamRequest(true);
        setErrorreateParamRequest(null);
        setSuccessreateParamRequest(null);
        const api = `${baseURL}/request/${CurrentState.requestId}/paramRequest`;
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
            if (data.error && !response.ok) {
                throw new Error(data.error);
            }

            if(data.message !== undefined && !response.ok) {
                throw new Error(data.message);
            }
            CurrentState.setParamRequestId(data.paramRequest._id);
            CreateRequest(data.paramRequest._id);

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