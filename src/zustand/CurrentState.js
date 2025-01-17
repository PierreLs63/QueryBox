import {create} from "zustand";

const useCurrentState = create((set) => ({

    workspaceId: "6788c60e69ae6e442b530273",

    collectionId: null,
    requestId: null,
    paramRequestId: null,
    responseId: null,
    setWorkspaceId: (workspaceId) => {set({ workspaceId: workspaceId }), console.log("Workspace ID set to : ", workspaceId)},
    setCollectionId: (collectionId) => {set({ collectionId: collectionId }), console.log("Collection ID set to : ", collectionId)},
    setRequestId: (requestId) => {set({ requestId: requestId }), console.log("Request ID set to : ", requestId)},
    setParamRequestId: (paramRequestId) => {set({ paramRequestId: paramRequestId }), console.log("Param Request ID set to : ", paramRequestId)},
    setResponseId: (responseId) => {set({ responseId: responseId }), console.log("Response ID set to : ", responseId)},
    clearWorkspaceId: () => set({ workspaceId: null }),
    clearCollectionId: () => set({ collectionId: null }),
    clearRequestId: () => set({ requestId: null }),
    clearParamRequestId: () => set({ paramRequestId: null }),
    clearResponseId: () => set({ responseId: null })

}));

export default useCurrentState;