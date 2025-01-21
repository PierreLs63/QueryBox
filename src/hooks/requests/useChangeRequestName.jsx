import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useChangeRequestName = () => {
    const [loadingChangeName, setLoadingChangeName] = useState(false);
    const [errorChangeName, setErrorChangeName] = useState(null);
    const [successChangeName, setSuccessChangeName] = useState(null);
    const [requestId, setRequestId] = useState(null);
    const [newRequestName, setNewRequestName] = useState(null);

    const changeName = async (requestId, newRequestName) => {
        setLoadingChangeName(true);
        setRequestId(requestId);
        setNewRequestName(newRequestName);
        const api = `${baseURL}/request/${requestId}/name`;
        try {
            const response = await fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: newRequestName})
            });
            const data = await response.json();
            if (data.message && !response.ok) {
                throw new Error(data.message);
            }
            setSuccessChangeName(data.message);
            toast.success(data.message);
            return {success: true};
        }
        catch (error) {
            setErrorChangeName(error.message);
            toast.error(error.message);
            return {success: false};
        }
        finally {
            setLoadingChangeName(false);
        }
    }
    return { loadingChangeName, errorChangeName, successChangeName, changeName, requestId, newRequestName }
}

export default useChangeRequestName