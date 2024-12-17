//je veux créer un hook qui permet de mettre à jour les privilèges d'un utilisateur dans un workspace donné avec comme paramètres le workspaceId et le userToUpdateId, newPrivilege

import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../../public/utils/variables';

const useUpdatePrivileges = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [workspaceId, setWorkspaceId] = useState(null);
    const updatePrivileges = async (workspaceId, userToUpdateId, newPrivilege) => {
        setWorkspaceId(workspaceId);
        setLoading(true);
        setError(null);
        setSuccess(null);
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
    return { loading, error, success, updatePrivileges, workspaceId }
}

export default useUpdatePrivileges