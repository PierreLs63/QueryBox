import { Input } from 'antd';
import { useState } from 'react';
import useRequestInputStore from '../zustand/RequestInput';

const { TextArea } = Input;

const RequestBody = () => {

    const RequestInputs = useRequestInputStore();
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
                placeholder="Enter body content here" value={RequestInputs.body} onChange={handleAdd}/>
        </>
    )
}

export default RequestBody