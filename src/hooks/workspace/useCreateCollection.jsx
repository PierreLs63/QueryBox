//je veux créer un hook pour créer une collection dans un workspace donné avec comme paramètres le workspaceId
import { useState } from 'react'
import toast from 'react-hot-toast';

import {baseURL} from '../../utils/variables';

const useCreateCollection = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [workspaceId, setWorkspaceId] = useState(null);

    const createCollection = async (workspaceId) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch(`${baseURL}/workspaces/${workspaceId}/collections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setWorkspaceId(workspaceId);
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
    return { loading, error, success, createCollection, workspaceId }
}

export default useCreateCollection