import { useState } from 'react';
import toast from 'react-hot-toast';

import { baseURL } from '../../../public/utils/variables';


const useRemoveUser = () => {
    const [loadingRemoveUser, setLoadingRemoveUser] = useState(false);
    const [errorRemoveUser, setErrorRemoveUser] = useState(null);
    const [successRemoveUser, setSuccessRemoveUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const removeUser = async (userId) => {
        setUserId(userId);
        setLoadingRemoveUser(true);
        setErrorRemoveUser(null);
        setSuccessRemoveUser(null);
        const api = `${baseURL}/user/${userId}/remove`;
        try {
            const response = await fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userBId : userId })
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
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
