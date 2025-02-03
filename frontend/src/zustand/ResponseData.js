import {create} from "zustand";

const useResponseDataStore = create((set) => ({
    code: null,
    body: "",
    header: [],
    setCode: (code) => {set({ code: code }), console.log("Code response set to : ", code)},
    setBody: (body) => {set({ body: body }), console.log("Body response set to : ", body)},
    setHeader: (header) => {set({ header: header }), console.log("Header response set to : ", header)}
}));

export default useResponseDataStore;