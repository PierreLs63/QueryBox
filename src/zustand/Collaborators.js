import {create} from "zustand";

const useCollaboratorsDataStore = create((set) => ({
    collaboratorsWorkspace: [],
    collaboratorsCollection: [],
    setCollaboratorsWorkspace: (collaboratorsWorkspace) => {set({ collaboratorsWorkspace: collaboratorsWorkspace }), console.log("Collaborators Workspace set to : ", collaboratorsWorkspace)},
    setCollaboratorsCollection: (collaboratorsCollection) => {set({ collaboratorsCollection: collaboratorsCollection }), console.log("Collaborators Collection set to : ", collaboratorsCollection)}
}));

export default useCollaboratorsDataStore