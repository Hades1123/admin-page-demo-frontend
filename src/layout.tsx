import { Col, Row } from "antd"
import { AdminPage } from "./pages/admin"
import reactIcon from '@/assets/react.png'


export const Layout = () => {
    // header 
    return (
        <>
            <div className="p-8">
                <header className="flex justify-between mb-16">
                    <div className="flex gap-2">
                        <img src={reactIcon} alt="Logo" />
                        <span className="font-bold">React Company</span>
                    </div>
                    <div className="flex gap-4">
                        <img src={reactIcon} alt="avatar" />
                        <span>Xin chao Hades</span>
                    </div>
                </header>

                <main>
                    <Row gutter={[20, 20]}>
                        <Col span={6} className="rounded-lg border-2 border-gray-100">
                            <ul>
                                <li className="font-medium hover:cursor-pointer p-4 hover:bg-gray-200">Dashboard </li>
                                <li className="font-medium hover:cursor-pointer p-4 hover:bg-gray-200">Users </li>
                                <li className="font-medium hover:cursor-pointer p-4 hover:bg-gray-200">Products </li>
                            </ul>
                        </Col>
                        <Col span={18}>
                            <AdminPage />
                        </Col>
                    </Row>
                </main>
            </div>
        </>
    )
}