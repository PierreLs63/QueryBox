import { Card } from 'antd';
import useResponseDataStore from '../zustand/ResponseData';

const ResponseBody = () => {

  const ResponseData = useResponseDataStore();
  return (
  <Card
    style={{
      height: '100%',
      maxWidth: '100%',
      wordWrap: 'break-word',
      resize: 'none'
    }}
  >
    <p>{ResponseData.body}</p>
  </Card>);
};
export default ResponseBody;