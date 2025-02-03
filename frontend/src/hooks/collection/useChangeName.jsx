import { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../utils/variables';
import useCurrentState from '../../zustand/CurrentState';

const useChangeCollectionName = () => {
    const [loadingChangeName, setLoadingChangeName] = useState(false);
    const [errorChangeName, setErrorChangeName] = useState(null);
    const [successChangeName, setSuccessChangeName] = useState(null);
    const CurrentState = useCurrentState();

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
            if (data.message && !response.ok) {
                throw new Error(data.message);
            }
            setSuccessChangeName(data.message);
            toast.success(data.message, {style: {wordBreak: 'break-word'}});;
            if(collectionId === CurrentState.collectionId) {
                CurrentState.setCollectionName(newName);
            }
            return {success: true};
        }
        catch (error) {
            setErrorChangeName(error.message);
            toast.error(error.message);
            return {success: false};
        }
        finally {
            setLoadingChangeName(false);
        }
    }
    return { loadingChangeName, errorChangeName, successChangeName, changeName }
}

export default useChangeCollectionName