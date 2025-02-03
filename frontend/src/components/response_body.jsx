import useResponseDataStore from '../zustand/ResponseData';
import CodeBlock from './CodeBlock';


const ResponseBody = () => {

  const ResponseData = useResponseDataStore();
  return (
  <div
    style={{
      height: '100%',
      maxWidth: '100%',
      wordWrap: 'break-word',
      resize: 'none',
      overflow: 'hidden',
      backgroundColor: '#f5f5f5',
    }}
  >
    <pre
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflow: 'auto',
          height: '100%',
          paddingLeft: '1em',
          backgroundColor: 'inherit',
          margin: 0
        }}
      >
        {(() => {
          try {
            return <CodeBlock value={JSON.stringify(JSON.parse(ResponseData.body), null, 2)} />;
          } catch {
            return <CodeBlock value={ResponseData.body} />;
          }
        })()}
    </pre>
  </div>);
};
export default ResponseBody;