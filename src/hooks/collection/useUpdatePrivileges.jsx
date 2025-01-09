import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useUpdatePrivileges = () => {
    const [loadingUpdatePrivileges, setLoadingUpdatePrivileges] = useState(false);
    const [errorUpdatePrivileges, setErrorUpdatePrivileges] = useState(null);
    const [successUpdatePrivileges, setSuccessUpdatePrivileges] = useState(null);
    const [collectionId, setCollectionId] = useState(null);
    const updatePrivileges = async (collectionId, userToUpdateId, newPrivilege) => {
        setCollectionId(collectionId);
        setLoadingUpdatePrivileges(true);
        setErrorUpdatePrivileges(null);
        setSuccessUpdatePrivileges(null);
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
            setSuccessUpdatePrivileges(data.message);
        }
        catch (error) {
            setErrorUpdatePrivileges(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingUpdatePrivileges(false);
        }
    }
    return { loadingUpdatePrivileges, errorUpdatePrivileges, successUpdatePrivileges, updatePrivileges, collectionId }
}

export default useUpdatePrivileges