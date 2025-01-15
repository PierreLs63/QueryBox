import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';
import useCurrentState from '../../zustand/useCurrentState';
import useResponseDataStore from '../../zustand/useResponseDataStore';

const useSendResponse = () => {
    const [loadingSendResponse, setLoadingSendResponse] = useState(false);
    const [errorSendResponse, setErrorSendResponse] = useState(null);
    const CurrentState = useCurrentState();
    const ResponseData = useResponseDataStore();


    const SendResponse = async () => {
        setLoadingSendResponse(true);
        setErrorSendResponse(null);

        if (CurrentState.paramRequestId === null) {
            throw new Error('Invalid request ID');
        }

        const api = `${baseURL}/response/${CurrentState.paramRequestId}`;
        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ResponseData)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
        }
        catch (error) {
            setErrorSendResponse(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingSendResponse(false);
        }
    }
    return {loadingSendResponse, errorSendResponse, SendResponse}
}

export default useGetResponse