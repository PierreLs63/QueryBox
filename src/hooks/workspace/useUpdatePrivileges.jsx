import { useState } from 'react'
import toast from 'react-hot-toast';
import {baseURL} from '../../utils/variables';

const useUpdatePrivileges = () => {
    const [loadingUpdatePrivileges, setLoadingUpdatePrivileges] = useState(false);
    const [errorUpdatePrivileges, setErrorUpdatePrivileges] = useState(null);
    const [successUpdatePrivileges, setSuccessUpdatePrivileges] = useState(null);
    const updatePrivileges = async (workspaceId, userToUpdateId, newPrivilege) => {
        setLoadingUpdatePrivileges(true);
        setErrorUpdatePrivileges(null);
        setSuccessUpdatePrivileges(null);
        const api = `${baseURL}/workspace/${workspaceId}/updatePrivileges`;
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
            if(data.message !== undefined) {
                toast.error(data.message);
                setErrorUpdatePrivileges(data.message);
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
    return { loadingUpdatePrivileges, errorUpdatePrivileges, successUpdatePrivileges, updatePrivileges }
}

export default useUpdatePrivileges