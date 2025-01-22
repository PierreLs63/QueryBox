import { Breadcrumb } from 'antd';
import { HomeOutlined, DesktopOutlined, FileOutlined, FileTextOutlined } from '@ant-design/icons';
import useCurrentState from '../zustand/CurrentState';

const BreadCrumb = () => {
    const { workspaceId, collectionName, requestName, workspaceName } = useCurrentState();
    const breadcrumbItems = [
        {
            icon: <HomeOutlined />,
            text: 'Home'
            },
        {
            icon: <DesktopOutlined />,
            text: workspaceName
            },
        {
            icon: <FileOutlined />,
            text: collectionName
            },
        {
            icon: <FileTextOutlined />,
            text: requestName
            }
    ]
    return (
        <div>
            {workspaceId !== null && (
                <Breadcrumb>
                    {breadcrumbItems.map((item, index) => (
                        <Breadcrumb.Item key={index} href="#">
                            {item.icon}
                            <span>{item.text}</span>
                        </Breadcrumb.Item>
                    ))}
                </Breadcrumb>
            )}
        </div>
    )
}

export default BreadCrumb;