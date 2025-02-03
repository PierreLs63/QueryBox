//je veux créer un hook pour créer une collection dans un workspace donné avec comme paramètres le workspaceId
import { useState } from 'react'
import toast from 'react-hot-toast';

import {baseURL} from '../../utils/variables';

const useCreateCollection = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const createCollection = async (workspaceId) => {
        setLoading(true);
        try {
            const response = await fetch(`${baseURL}/workspace/${workspaceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.message && !response.ok) {
                throw new Error(data.message);
            }
            setSuccess(data.message);
            toast.success(data.message, {style: {wordBreak: 'break-word'}});;
            return {success: true, collection: data.collection, message: data.message};

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
    return { loading, error, success, createCollection}
}

export default useCreateCollection