//je veux créer un hook pour créer une collection dans un workspace donné avec comme paramètres le workspaceId
import { useState } from 'react'
import toast from 'react-hot-toast';
import {baseURL} from '../../utils/variables';
import { v4 as uuidv4 } from 'uuid';

const useGetLastParamRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const GetLastParamRequest = async (requestId) => {
        setLoading(true);
        try {
            const response = await fetch(`${baseURL}/request/${requestId}/lastParamRequest`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.message && !response.ok) {
                throw new Error(data.message);
            }

            if (data.paramRequest) {
                data.paramRequest.parameters = data.paramRequest.parameters.map(item => ({
                    ...item,
                    key: uuidv4(),
                }));
            }

            setSuccess(data.message);
            return {success: true, paramRequest: data.paramRequest};

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
    return { loading, error, success, GetLastParamRequest}
}

export default useGetLastParamRequest;