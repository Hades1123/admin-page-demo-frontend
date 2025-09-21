import React, { useMemo } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined, DollarOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Progress, Row, Statistic, Table, Tag, Typography } from 'antd';
import CountUp from 'react-countup';

const { Title, Text } = Typography;

// Lightweight inline sparkline/line chart (no extra dependencies)
const MiniLineChart: React.FC<{ data: number[]; color?: string }> = ({ data, color = '#1677ff' }) => {
  const { pathD } = useMemo(() => {
    if (!data || data.length === 0) return { pathD: '' };
    const localMin = Math.min(...data);
    const localMax = Math.max(...data);
    const height = 30;
    const width = 100;
    const pad = 2;
    const range = localMax - localMin || 1; // avoid divide by zero
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * (width - pad * 2) + pad;
      const y = height - ((v - localMin) / range) * (height - pad * 2) - pad;
      return `${x},${y}`;
    });
    const d = `M ${points.join(' L ')}`;
    return { pathD: d };
  }, [data]);

  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-14">
      <path d={pathD} fill="none" stroke={color} strokeWidth={2} />
    </svg>
  );
};

const currency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const numberFormatter = (value: number) => <CountUp end={value} separator="," />;

export const DashboardPage: React.FC = () => {
  // Demo data — replace with API calls as needed
  const kpis = [
    {
      title: 'Revenue',
      value: 128400,
      icon: <DollarOutlined />,
      trend: +12.4,
      color: '#1677ff',
    },
    {
      title: 'Orders',
      value: 2450,
      icon: <ShoppingCartOutlined />,
      trend: +3.1,
      color: '#52c41a',
    },
    {
      title: 'Customers',
      value: 980,
      icon: <UserOutlined />,
      trend: +1.8,
      color: '#faad14',
    },
    {
      title: 'Refunds',
      value: 34,
      icon: <ArrowDownOutlined />,
      trend: -0.6,
      color: '#f5222d',
    },
  ];

  const salesData = [420, 480, 500, 460, 520, 610, 700, 680, 720, 760, 820, 880];

  const ordersColumns = [
    { title: 'Order #', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (v: number) => currency(v),
      align: 'right' as const,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        const map: Record<string, any> = {
          Paid: 'green',
          Pending: 'gold',
          Refunded: 'red',
        };
        return <Tag color={map[s] || 'default'}>{s}</Tag>;
      },
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  const ordersData = [
    { key: 1, id: 'INV-1045', customer: 'Jane Cooper', total: 289, status: 'Paid', date: '2025-09-14' },
    { key: 2, id: 'INV-1046', customer: 'Cody Fisher', total: 159, status: 'Pending', date: '2025-09-13' },
    { key: 3, id: 'INV-1047', customer: 'Devon Lane', total: 540, status: 'Paid', date: '2025-09-13' },
    { key: 4, id: 'INV-1048', customer: 'Eleanor Pena', total: 120, status: 'Refunded', date: '2025-09-12' },
  ];

  const products = [
    { name: 'Wireless Headphones', sales: 840, revenue: 126000 },
    { name: 'Smart Watch', sales: 620, revenue: 93000 },
    { name: 'Gaming Mouse', sales: 540, revenue: 45000 },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <Title level={3} className="!mb-0">E-commerce Dashboard</Title>
          <Text type="secondary">Key metrics and recent activity</Text>
        </div>
        <div className="hidden md:flex gap-2">
          <Button>Export</Button>
          <Button type="primary">Add Product</Button>
        </div>
      </div>

      {/* KPI cards */}
      <Row gutter={[16, 16]}>
        {kpis.map((kpi) => (
          <Col xs={24} sm={12} md={12} lg={6} key={kpi.title}>
            <Card hoverable className="shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <Text type="secondary">{kpi.title}</Text>
                  <div className="text-2xl font-semibold">
                    {kpi.title === 'Revenue' ? currency(kpi.value) : <CountUp end={kpi.value} separator="," />}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    {kpi.trend >= 0 ? (
                      <Text type="success"><ArrowUpOutlined /> {kpi.trend}%</Text>
                    ) : (
                      <Text type="danger"><ArrowDownOutlined /> {Math.abs(kpi.trend)}%</Text>
                    )}
                    <Text type="secondary">vs last week</Text>
                  </div>
                </div>
                <Avatar size={44} style={{ backgroundColor: kpi.color, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} icon={kpi.icon} />
              </div>
              <div className="mt-4">
                <Progress percent={Math.min(100, Math.max(10, Math.round((kpi.value % 100))))} size="small" showInfo={false} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts + Lists */}
      <Row gutter={[16, 16]} className="mt-2">
        <Col xs={24} lg={16}>
          <Card title="Sales Overview" extra={<Text type="secondary">Last 12 weeks</Text>} className="shadow-sm" hoverable>
            <MiniLineChart data={salesData} />
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              <Statistic title="This Week" value={8800} prefix={<DollarOutlined />} formatter={(v) => <>{currency(Number(v))}</>} />
              <Statistic title="Avg. Order" value={52} prefix={<DollarOutlined />} formatter={(v) => <>{currency(Number(v))}</>} />
              <Statistic title="Conversion" value={2.8} suffix="%" formatter={(v) => <CountUp end={Number(v)} decimals={1} /> as any} />
              <Statistic title="New Customers" value={124} formatter={(v) => numberFormatter(Number(v)) as any} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top Products" className="shadow-sm" hoverable>
            <div className="space-y-4">
              {products.map((p) => (
                <div className="flex items-center justify-between" key={p.name}>
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <Text type="secondary">{p.sales} sold</Text>
                  </div>
                  <div className="text-right font-semibold">{currency(p.revenue)}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent orders */}
      <Row gutter={[16, 16]} className="mt-2">
        <Col span={24}>
          <Card title="Recent Orders" className="shadow-sm" hoverable>
            <Table
              size="middle"
              columns={ordersColumns as any}
              dataSource={ordersData}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
