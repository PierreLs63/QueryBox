import { Input } from 'antd';
import { useState } from 'react';
import useRequestInputStore from '../zustand/RequestInput';
import useCurrentState from '../zustand/CurrentState';

const { TextArea } = Input;


const RequestBody = () => {

    const RequestInputs = useRequestInputStore();
    const CurrentState = useCurrentState();

    
    const handleAdd = (e) => {
        RequestInputs.setBody(e.target.value);
    }

    return(
        <>
            <TextArea 
                rows={4} 
                style={{
                    width: '100%',
                    height: '100%',
                    resize: 'none',
                  }}
                placeholder="Enter body content here" value={RequestInputs.body} onChange={handleAdd} disabled={RequestInputs.method === "GET" || RequestInputs.method === "HEAD" || CurrentState.responseId !== null}/>
        </>
    )
}

export default RequestBody