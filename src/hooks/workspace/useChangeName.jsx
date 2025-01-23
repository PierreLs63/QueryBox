import { useState } from 'react'
import toast from 'react-hot-toast';
import {baseURL} from '../../utils/variables';
import useCurrentState from '../../zustand/CurrentState';

const useChangeWorkspaceName = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const CurrentState = useCurrentState();

    const changeName = async (workspaceId, newName) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        const api = `${baseURL}/workspace/${workspaceId}/name`;
        try {
            const response = await fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: newName})
            });
            const data = await response.json();

            if (data.message && !response.ok) {
                throw new Error(data.message);
            }
            setSuccess(data.message);
            toast.success(data.message, {style: {wordBreak: 'break-word'}});
            if(workspaceId === CurrentState.workspaceId) {
                CurrentState.setWorkspaceName(newName);
            }
            return {success: true, message: data.message};
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
    return { loading, error, success, changeName }
}

export default useChangeWorkspaceName