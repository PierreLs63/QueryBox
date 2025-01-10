import { Card } from 'antd';

const ResponseBody = ( {text} ) => (
  <Card
    style={{
      height: '100%',
      width: '100%',
    }}
  >
    <p>{text}</p>
  </Card>
);
export default ResponseBody;