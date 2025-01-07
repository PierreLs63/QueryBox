import { useState } from 'react'
import toast from 'react-hot-toast';
import dotenv from 'dotenv';
import { baseURL } from '../../../public/utils/variables';

dotenv.config();

const useCollaborateurs = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
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
    return { loading, error, success, getCollaborateurs, collaborateurs, workspaceId }
}


export default useCollaborateurs