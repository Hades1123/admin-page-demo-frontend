import { SmileOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Col, Dropdown, Row, Space } from "antd"
import type { MenuProps } from "antd/lib";
import { Link, Outlet } from "react-router-dom"

const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <Link to={'/login'}>Login</Link>
        ),
    },
    {
        key: '2',
        danger: true,
        label: 'Logout',
    },
];

export const AdminLayout = () => {
    return (
        <>
            <Row>
                <Col span={4} className="bg-[#262b40] min-h-screen p-4">
                    <ul>
                        <Link to={'dashboard'}><li className="p-2 font-medium text-white hover:cursor-pointer hover:bg-[#4c5165] hover:rounded-md">Dashboard </li></Link>
                        <Link to={'users'}><li className="p-2 font-medium text-white hover:cursor-pointer hover:bg-[#4c5165] hover:rounded-md">Users </li></Link>
                        <Link to={'#!'}><li className="p-2 font-medium text-white hover:cursor-pointer hover:bg-[#4c5165] hover:rounded-md">Product</li></Link>
                    </ul>
                </Col>
                <Col span={20} >
                    <header className="flex justify-between p-4">
                        <h1>this is input search</h1>
                        <div className="flex gap-4 items-center">
                            <Dropdown menu={{ items }}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <Avatar size={30} icon={<UserOutlined />} className="hover:cursor-pointer hover:border-2 hover:border-red-500" />
                                        <span>Hello admin</span>
                                    </Space>
                                </a>
                            </Dropdown>
                        </div>
                    </header>
                    <main>
                        <Outlet />
                    </main>
                </Col>
            </Row>
        </>
    )
}