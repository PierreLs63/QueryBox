import { Card } from 'antd';
import useResponseDataStore from '../zustand/ResponseData'

const ResponseBody = () => {
  const ResponseData = useResponseDataStore();

  return(
    <Card style={{height: '100%', width: '100%', resize: 'none'}}>
    <p>{ResponseData.body}</p>
    </Card>
  )
};
export default ResponseBody;