import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';
import useCurrentState from '../../zustand/CurrentState';
import useResponseDataStore from '../../zustand/ResponseData';

const useSendResponse = () => {
    const [loadingSendResponse, setLoadingSendResponse] = useState(false);
    const [errorSendResponse, setErrorSendResponse] = useState(null);
    const CurrentState = useCurrentState();
    const ResponseData = useResponseDataStore();


    const SendResponse = async (paramRequestId, status, headers, body) => {
        setLoadingSendResponse(true);
        setErrorSendResponse(null);

        if (paramRequestId === null) {
            throw new Error('Invalid request ID');
        }

        const api = `${baseURL}/response/${paramRequestId}`;
        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({code: status, header: headers, body: body})
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

export default useSendResponse