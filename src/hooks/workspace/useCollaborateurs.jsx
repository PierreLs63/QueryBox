import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useCollaborateurs = () => {
    const [loadingCollaborateurs, setLoadingCollaborateurs] = useState(false);
    const [errorCollaborateurs, setErrorCollaborateurs] = useState(null);
    const [successCollaborateurs, setSuccessCollaborateurs] = useState(null);
    const [collaborateurs, setCollaborateurs] = useState(null);

    const getCollaborateurs = async (workspaceId) => {
        setLoadingCollaborateurs(true);
        setErrorCollaborateurs(null);
        setSuccessCollaborateurs(null);
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
            setErrorCollaborateurs(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingCollaborateurs(false);
        }
    }
    return { loadingCollaborateurs, errorCollaborateurs, successCollaborateurs, getCollaborateurs, collaborateurs }
}


export default useCollaborateurs