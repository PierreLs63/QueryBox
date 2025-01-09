import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';

const useChangeName = () => {
    const [loadingChangeName, setLoadingChangeName] = useState(false);
    const [errorChangeName, setErrorChangeName] = useState(null);
    const [successChangeName, setSuccessChangeName] = useState(null);
    const changeName = async (collectionId, newName) => {
        setLoadingChangeName(true);
        setErrorChangeName(null);
        setSuccessChangeName(null);
        const api = `${baseURL}/collection/${collectionId}/name`;
        try {
            const response = await fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: newName})
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setSuccessChangeName(data.message);
        }
        catch (error) {
            setErrorChangeName(error.message);
            toast.error(error.message);
        }
        finally {
            setLoadingChangeName(false);
        }
    }
    return { loadingChangeName, errorChangeName, successChangeName, changeName }
}

export default useChangeName