import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../../public/utils/variables';

const useUpdatePrivileges = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [collectionId, setCollectionId] = useState(null);
    const updatePrivileges = async (collectionId, userToUpdateId, newPrivilege) => {
        setCollectionId(collectionId);
        setLoading(true);
        setError(null);
        setSuccess(null);
        const api = `${baseURL}/collection/${collectionId}/updatePrivileges`;
        try {
            const response = await fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userToUpdateId, newPrivilege})
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
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
    return { loading, error, success, updatePrivileges, collectionId }
}

export default useUpdatePrivileges