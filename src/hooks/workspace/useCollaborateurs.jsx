import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../../public/utils/variables';

const useCollaborateurs = () => {
    const [loadingCollaborateurs, setLoadingCollaborateurs] = useState(false);
    const [errorCollaborateurs, setErrorCollaborateurs] = useState(null);
    const [successCollaborateurs, setSuccessCollaborateurs] = useState(null);
    const [collaborateurs, setCollaborateurs] = useState(null);
    const [workspaceId, setWorkspaceId] = useState(null);

    const getCollaborateurs = async (workspaceId) => {
        setWorkspaceId(workspaceId);
        setLoading(true);
        setError(null);
        setSuccess(null);
        const api = `${baseURL}/workspace/${workspaceId}/users`;
        try {
            const response = await fetch(api, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setCollaborateurs(data);
        }
        catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }
    return { loadingCollaborateurs, errorCollaborateurs, successCollaborateurs, getCollaborateurs, collaborateurs, workspaceId }
}


export default useCollaborateurs