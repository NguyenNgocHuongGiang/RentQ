import { Flex, Spin } from 'antd';

export default function Loading() {
    return (
        <Flex style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', 
            backgroundColor: 'white'
        }}>
            <Spin size="large" />
        </Flex>
    );
}
