import { Card } from 'antd';

const ResponseBody = ( {text} ) => (
  <Card
    style={{
      height: '90%',
      width: '100%',
    }}
  >
    <p>{text}</p>
  </Card>
);
export default ResponseBody;