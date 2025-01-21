import { create } from 'zustand'

const useRequestInputStore = create((set) => ({
    method: 'GET',
    url: '',
    params: [],
    headers: [
        { key:'0', keyData: 'Host', value: 'value_host', description: 'Description for Host' },
        { key: '1', keyData: 'User_Agent', value: 'value_userAgent', description: 'Description for User_Agent' },
        { key: '2' , keyData: 'Accept', value: 'value_accept', description: 'Description for Accept' },
        { key:'3', keyData: 'Accept_Encoding', value: 'value_acceptEncoding', description: 'Description for Accept_Encoding' },
        { key:'4', keyData: 'Connection', value: 'value_connection', description: 'Description for Connection' },
      ],
    body: "",
    setParams: (params) => {set({ params: params }); console.log("Params set to : ", params)},
    setHeaders: (headers) => {set({ headers: headers }), console.log("Headers set to : ", headers)},
    setBody: (body) => { set({ body: body }); console.log("Body set to : ", body) },
    setMethod: (method) => { set({ method: method }); console.log("Method set to : ", method) },
    setUrl: (url) => { set({ url: url }); console.log("Url set to : ", url) },
    clearParams: () => set({ params: [] }),
    clearHeaders: () => set({ headers: [] }),
    clearBody: () => set({ body: "" }),
    resetToDefault: () => {
      set({
          method: 'GET',
          url: '',
          params: [],
          headers: [
              { key: '0', keyData: 'Host', value: 'value_host', description: 'Description for Host' },
              { key: '1', keyData: 'User_Agent', value: 'value_userAgent', description: 'Description for User_Agent' },
              { key: '2', keyData: 'Accept', value: 'value_accept', description: 'Description for Accept' },
              { key: '3', keyData: 'Accept_Encoding', value: 'value_acceptEncoding', description: 'Description for Accept_Encoding' },
              { key: '4', keyData: 'Connection', value: 'value_connection', description: 'Description for Connection' },
          ],
          body: "",
      });
      console.log("State reset to default values");
  },
}))

export default useRequestInputStore