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
      overflow: 'auto',
    }}
  >
    <pre
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflow: 'auto',
          maxHeight: '100%',
          backgroundColor: 'inherit',
        }}
      >
      {(() => {
        try {
          return JSON.stringify(JSON.parse(ResponseData.body), null, 2);
        } catch (e) {
          return ResponseData.body;
        }
      })()}
    </pre>
  </Card>);
};
export default ResponseBody;