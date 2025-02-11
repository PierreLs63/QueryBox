import {create} from "zustand";
const useCurrentState = create((set, get) => ({
    triggerUpdateWorkspaces: false,
    workspaceId: null,
    workspaceName: null,
    collectionId: null,
    collectionName: null,
    requestId: null,
    requestName: null,
    paramRequestId: null,
    historyId: null,
    responseId: null,
    sendRequest: false,
    setTriggerUpdateWorkspaces: () => {
        const current = get().triggerUpdateWorkspaces;
        set({ triggerUpdateWorkspaces: !current });
        console.log("Update Workspaces set to : ", !current);
    },
    setWorkspaceId: (workspaceId) => {set({ workspaceId: workspaceId }), console.log("Workspace ID set to : ", workspaceId)},
    setWorkspaceName: (workspaceName) => {set({ workspaceName: workspaceName }), console.log("Workspace Name set to : ", workspaceName)},
    setCollectionId: (collectionId) => {set({ collectionId: collectionId }), console.log("Collection ID set to : ", collectionId)},
    setCollectionName: (collectionName) => {set({ collectionName: collectionName }), console.log("Collection Name set to : ", collectionName)},
    setRequestId: (requestId) => {set({ requestId: requestId }), console.log("Request ID set to : ", requestId)},
    setRequestName: (requestName) => {set({ requestName: requestName }), console.log("Request Name set to : ", requestName)},
    setParamRequestId: (paramRequestId) => {set({ paramRequestId: paramRequestId }), console.log("Param Request ID set to : ", paramRequestId)},
    setHistoryId: (historyId) => {set({ historyId: historyId }), console.log("History ID set to : ", historyId)},
    setResponseId: (responseId) => {set({ responseId: responseId }), console.log("Response ID set to : ", responseId)},
    setSendRequest: (sendRequest) => {set({ sendRequest: sendRequest }), console.log("SendRequest set to : ", sendRequest)},
    clearWorkspaceId: () => set({ workspaceId: null }),
    clearWorkspaceName: () => set({ workspaceName: null }),
    clearCollectionId: () => set({ collectionId: null }),
    clearCollectionName: () => set({ collectionName: null }),
    clearRequestId: () => set({ requestId: null }),
    clearHistoryId: () => set({ historyId: null }),
    clearRequestName: () => set({ requestName: null }),
    clearParamRequestId: () => set({ paramRequestId: null }),
    clearResponseId: () => set({ responseId: null }),
    clearAll: () => { set({ workspaceId: null, collectionId: null, requestId: null, paramRequestId: null, responseId: null }), console.log("CurrentState : All cleared") }
}));
export default useCurrentState;