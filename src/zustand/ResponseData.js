import {create} from "zustand";

const useResponseDataStore = create((set) => ({
    code: null,
    body: "",
    header: [],
    setCode: (code) => set({ code: code }),
    setBody: (body) => set({ body: body }),
    setHeader: (header) => set({ header: header }),
}));

export default useResponseDataStore;