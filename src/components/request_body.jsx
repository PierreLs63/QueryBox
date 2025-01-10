import { Input } from 'antd';

const { TextArea } = Input;

const RequestBody = () => {
    return(
        <>
            <TextArea 
                rows={4} 
                style={{
                    width: '100%',
                    height: '100%',
                    resize: 'none',
                  }}
                placeholder="Enter body content here"/>
        </>
    )
}

export default RequestBody