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
      resize: 'none',
    }}
  >
    <pre>{JSON.stringify(JSON.parse(ResponseData.body), null, 2)}</pre>
  </Card>);
};
export default ResponseBody;