import { useState } from 'react';
import toast from 'react-hot-toast';
import useResponseDataStore from '../../zustand/ResponseData';
import useRequestInputStore from '../../zustand/RequestInput';

const useCreateRequest = () => {
    const [loadingCreateRequest, setLoadingCreateRequest] = useState(false);
    const [errorCreateRequest, setErrorCreateRequest] = useState(null);
    const [successCreateRequest, setSuccessCreateRequest] = useState(null);
    
    const RequestInputs = useRequestInputStore();
    const ResponseData = useResponseDataStore();

    const CreateRequest = async () => {
        setLoadingCreateRequest(true);
        setErrorCreateRequest(null);
        setSuccessCreateRequest(null);

        // Vérifier les types des paramètres
        if (typeof RequestInputs.url !== 'string') {
            setErrorCreateRequest('Invalid URL');
            setLoadingCreateRequest(false);
            return;
        }
        if (typeof RequestInputs.method !== 'string') {
            setErrorCreateRequest('Invalid method');
            setLoadingCreateRequest(false);
            return;
        }
        if (typeof RequestInputs.body !== 'string' && RequestInputs.body !== null) {
            setErrorCreateRequest('Invalid body');
            setLoadingCreateRequest(false);
            return;
        }
        if (!Array.isArray(RequestInputs.headers)) {
            setErrorCreateRequest('Invalid header');
            setLoadingCreateRequest(false);
            return;
        }
        if (!Array.isArray(RequestInputs.params)) {
            setErrorCreateRequest('Invalid parameters');
            setLoadingCreateRequest(false);
            return;
        }

        // Préparer les en-têtes pour la requête
        const headers = {};
        RequestInputs.headers.forEach(h => {
            headers[h.key] = h.value;
        });

        // Préparer les paramètres pour la requête
        const queryParams = new URLSearchParams();
        RequestInputs.params.forEach(p => {
            queryParams.append(p.key, p.value);
        });

        // Construire l'URL avec les paramètres
        const requestUrl = `${RequestInputs.url}?${queryParams.toString()}`;

        try {
            // Envoyer la requête au serveur avec fetch
            const response = await fetch(requestUrl, {
                method: RequestInputs.method,
                headers,
                body: RequestInputs.method !== 'GET' ? RequestInputs.body : undefined // Le corps de la requête n'est pas utilisé pour les requêtes GET
            });

            if (!response.ok) {
                throw new Error("Error while fetching the request");
            }

            // Préparer les en-têtes de la réponse
            const responseHeaders = [];
            response.headers.forEach((value, key) => {
                responseHeaders.push({ key, value });
            });
            ResponseData.setCode(response.status);
            ResponseData.setHeader(responseHeaders);
            ResponseData.setBody(await response.text());
            setSuccessCreateRequest("Request sent successfully");
        } catch (error) {
            setErrorCreateRequest(error.message);
            toast.error(error.message);
        } finally {
            setLoadingCreateRequest(false);
        }
    };

    return { loadingCreateRequest, errorCreateRequest, successCreateRequest, CreateRequest };
};

export default useCreateRequest;