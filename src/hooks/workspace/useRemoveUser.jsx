import { useState } from 'react';
import toast from 'react-hot-toast';
import {baseURL} from '../../utils/variables';
import useCurrentState from '../../zustand/CurrentState';
import useCollaborateurs from './useCollaborateurs';


const useRemoveUser = () => {
    const [loadingRemoveUser, setLoadingRemoveUser] = useState(false);
    const [errorRemoveUser, setErrorRemoveUser] = useState(null);
    const [successRemoveUser, setSuccessRemoveUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const CurrentState = useCurrentState();
    const getCollaborateurs = useCollaborateurs();
    const removeUser = async (username) => {
        setLoadingRemoveUser(true);
        setErrorRemoveUser(null);
        setSuccessRemoveUser(null);
        const api = `${baseURL}/workspace/${CurrentState.workspaceId}/removeUser`;
        try {
            const response = await fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            if(data.message !== undefined && !response.ok) {
                toast.error(data.message);
                setErrorRemoveUser(data.message);
            }

            if (data.message !== undefined && response.ok) {
                toast.success(data.message);
                getCollaborateurs.getCollaborateurs();
            }
            
            setSuccessRemoveUser(data.message);
        }
        catch (error) {
            setErrorRemoveUser(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingRemoveUser(false);
        }
    }
    return { loadingRemoveUser, errorRemoveUser, successRemoveUser, removeUser, userId }
}

export default useRemoveUser
