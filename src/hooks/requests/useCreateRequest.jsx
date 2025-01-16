import { useState } from 'react';
import toast from 'react-hot-toast';
import useResponseDataStore from '../../zustand/ResponseData';
import useRequestInputStore from '../../zustand/RequestInput';
import useSendResponse from '../response/useSendResponse';

const useCreateRequest = () => {
    const [loadingCreateRequest, setLoadingCreateRequest] = useState(false);
    const [errorCreateRequest, setErrorCreateRequest] = useState(null);
    const [successCreateRequest, setSuccessCreateRequest] = useState(null);
    const { SendResponse } = useSendResponse();
    
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
            headers[h.keyData] = h.value;
        });

        // Préparer les paramètres pour la requête
        const queryParams = new URLSearchParams();
        RequestInputs.params.forEach(p => {
            queryParams.append(p.keyData, p.value);
        });

        // Construire l'URL avec les paramètres
        const requestUrl = `${RequestInputs.url}?${queryParams.toString()}`;
        try {
            // Envoyer la requête au serveur avec fetch
            const response = await fetch(requestUrl, {
                method: RequestInputs.method,
                headers,
                body: RequestInputs.method !== 'GET' && RequestInputs.method !== 'HEAD' ? RequestInputs.body : undefined // Le corps de la requête n'est pas utilisé pour les requêtes GET
            })

            const data = await response.text();

            console.log(data);
            // Préparer les en-têtes de la réponse
            const responseHeaders = [];
            response.headers.forEach((value, key) => {
                responseHeaders.push({ key, value });
            });
            ResponseData.setCode(response.status);
            ResponseData.setHeader(responseHeaders);
            ResponseData.setBody(data);
            SendResponse(response.status, responseHeaders, data);
            setSuccessCreateRequest("Request sent successfully");
        } catch (error) {
            console.error("Une erreur s'est produite lors de la requête fetch :", error);
            const errorCode = 500;
            const errorBody = "Le serveur ne répond pas";
            // Remplir les données d'erreur si nécessaire
            ResponseData.setCode(errorCode); // Exemple de code d'erreur par défaut
            ResponseData.setHeader([]);
            ResponseData.setBody(errorBody);
            SendResponse(errorCode, [], errorBody);
        } finally {
            setLoadingCreateRequest(false);

        }
    };

    return { loadingCreateRequest, errorCreateRequest, successCreateRequest, CreateRequest };
};

export default useCreateRequest;