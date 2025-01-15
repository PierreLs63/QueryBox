import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';
import useCurrentState from '../../zustand/CurrentState';

const useCollaborateurs = () => {
    const [loadingCollaborateurs, setLoadingCollaborateurs] = useState(false);
    const [errorCollaborateurs, setErrorCollaborateurs] = useState(null);
    const [successCollaborateurs, setSuccessCollaborateurs] = useState(null);
    const [collaborateurs, setCollaborateurs] = useState(null);
    const CurrentState = useCurrentState();

    const getCollaborateurs = async () => {
        setLoadingCollaborateurs(true);
        setErrorCollaborateurs(null);
        setSuccessCollaborateurs(null);
        if (CurrentState.workspaceId === null) {
            throw new Error('Invalid workspace ID');
        }
        
        const api = `${baseURL}/workspace/${CurrentState.workspaceId}/users`;
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
            if(data.message !== undefined) {
                toast.error(data.message);
                setErrorCollaborateurs(data.message);
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