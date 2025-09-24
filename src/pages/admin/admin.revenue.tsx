import React, { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { Button, Card, Col, DatePicker, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DownloadOutlined, LineChartOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

type RevenueRecord = {
  date: string;
  channel: 'Website' | 'Mobile App' | 'Marketplace';
  revenue: number;
  orders: number;
  refunds: number;
};

type Granularity = 'month' | 'quarter' | 'week';

type AggregatedRow = {
  key: string;
  period: string;
  revenue: number;
  orders: number;
  refunds: number;
  avgOrderValue: number;
  refundRate: number;
  sortValue: number;
};

type ChannelRow = {
  channel: RevenueRecord['channel'];
  revenue: number;
  orders: number;
  refunds: number;
  avgOrderValue: number;
};

const revenueRecords: RevenueRecord[] = [
  { date: '2024-10-01', channel: 'Website', revenue: 18500, orders: 310, refunds: 6 },
  { date: '2024-10-01', channel: 'Mobile App', revenue: 12800, orders: 260, refunds: 5 },
  { date: '2024-10-01', channel: 'Marketplace', revenue: 10100, orders: 220, refunds: 4 },
  { date: '2024-11-01', channel: 'Website', revenue: 19600, orders: 328, refunds: 6 },
  { date: '2024-11-01', channel: 'Mobile App', revenue: 13350, orders: 272, refunds: 4 },
  { date: '2024-11-01', channel: 'Marketplace', revenue: 10680, orders: 228, refunds: 4 },
  { date: '2024-12-01', channel: 'Website', revenue: 21400, orders: 356, refunds: 7 },
  { date: '2024-12-01', channel: 'Mobile App', revenue: 14520, orders: 290, refunds: 5 },
  { date: '2024-12-01', channel: 'Marketplace', revenue: 11840, orders: 244, refunds: 5 },
  { date: '2025-01-01', channel: 'Website', revenue: 22350, orders: 368, refunds: 7 },
  { date: '2025-01-01', channel: 'Mobile App', revenue: 15200, orders: 304, refunds: 5 },
  { date: '2025-01-01', channel: 'Marketplace', revenue: 12400, orders: 256, refunds: 5 },
  { date: '2025-02-01', channel: 'Website', revenue: 23100, orders: 378, refunds: 6 },
  { date: '2025-02-01', channel: 'Mobile App', revenue: 15840, orders: 312, refunds: 5 },
  { date: '2025-02-01', channel: 'Marketplace', revenue: 12980, orders: 264, refunds: 5 },
  { date: '2025-03-01', channel: 'Website', revenue: 24560, orders: 396, refunds: 7 },
  { date: '2025-03-01', channel: 'Mobile App', revenue: 16650, orders: 324, refunds: 5 },
  { date: '2025-03-01', channel: 'Marketplace', revenue: 13720, orders: 276, refunds: 5 },
  { date: '2025-04-01', channel: 'Website', revenue: 25880, orders: 412, refunds: 7 },
  { date: '2025-04-01', channel: 'Mobile App', revenue: 17420, orders: 334, refunds: 5 },
  { date: '2025-04-01', channel: 'Marketplace', revenue: 14450, orders: 286, refunds: 5 },
  { date: '2025-05-01', channel: 'Website', revenue: 27100, orders: 428, refunds: 8 },
  { date: '2025-05-01', channel: 'Mobile App', revenue: 18240, orders: 346, refunds: 5 },
  { date: '2025-05-01', channel: 'Marketplace', revenue: 15160, orders: 298, refunds: 5 },
  { date: '2025-06-01', channel: 'Website', revenue: 28540, orders: 444, refunds: 8 },
  { date: '2025-06-01', channel: 'Mobile App', revenue: 19120, orders: 358, refunds: 5 },
  { date: '2025-06-01', channel: 'Marketplace', revenue: 15880, orders: 310, refunds: 5 },
  { date: '2025-07-01', channel: 'Website', revenue: 29880, orders: 462, refunds: 8 },
  { date: '2025-07-01', channel: 'Mobile App', revenue: 20080, orders: 372, refunds: 6 },
  { date: '2025-07-01', channel: 'Marketplace', revenue: 16640, orders: 322, refunds: 5 },
  { date: '2025-08-01', channel: 'Website', revenue: 31220, orders: 478, refunds: 8 },
  { date: '2025-08-01', channel: 'Mobile App', revenue: 20960, orders: 384, refunds: 6 },
  { date: '2025-08-01', channel: 'Marketplace', revenue: 17420, orders: 334, refunds: 5 },
  { date: '2025-09-01', channel: 'Website', revenue: 32600, orders: 494, refunds: 8 },
  { date: '2025-09-01', channel: 'Mobile App', revenue: 21840, orders: 396, refunds: 6 },
  { date: '2025-09-01', channel: 'Marketplace', revenue: 18240, orders: 346, refunds: 5 },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const getDefaultRange = (): [Dayjs, Dayjs] | null => {
  if (!revenueRecords.length) {
    return null;
  }
  const sorted = [...revenueRecords].sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
  return [dayjs(sorted[0].date), dayjs(sorted[sorted.length - 1].date)];
};

const periodMeta = (value: Dayjs, granularity: Granularity) => {
  if (granularity === 'week') {
    const start = value.startOf('week');
    return {
      label: `Week ${String(value.isoWeek()).padStart(2, '0')} ${value.isoWeekYear()}`,
      sortValue: start.valueOf(),
    };
  }
  if (granularity === 'quarter') {
    return {
      label: `Q${value.quarter()} ${value.year()}`,
      sortValue: value.startOf('quarter').valueOf(),
    };
  }
  return {
    label: value.format('MMM YYYY'),
    sortValue: value.startOf('month').valueOf(),
  };
};

export const RevenuePage: React.FC = () => {
  const [granularity, setGranularity] = useState<Granularity>('month');
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(() => getDefaultRange());
  const defaultRange = useMemo(() => getDefaultRange(), []);

  const filteredRecords = useMemo(() => {
    if (!range) return revenueRecords;
    const [start, end] = range;
    return revenueRecords.filter((record) => {
      const date = dayjs(record.date);
      return (!start || !date.isBefore(start, 'day')) && (!end || !date.isAfter(end, 'day'));
    });
  }, [range]);

  const aggregatedRows = useMemo<AggregatedRow[]>(() => {
    const map = new Map<string, AggregatedRow>();

    filteredRecords.forEach((record) => {
      const baseDate = dayjs(record.date);
      const { label, sortValue } = periodMeta(baseDate, granularity);
      const existing = map.get(label);
      if (existing) {
        existing.revenue += record.revenue;
        existing.orders += record.orders;
        existing.refunds += record.refunds;
      } else {
        map.set(label, {
          key: label,
          period: label,
          revenue: record.revenue,
          orders: record.orders,
          refunds: record.refunds,
          avgOrderValue: 0,
          refundRate: 0,
          sortValue,
        });
      }
    });

    return Array.from(map.values())
      .sort((a, b) => a.sortValue - b.sortValue)
      .map((item) => {
        const avgOrderValue = item.orders ? item.revenue / item.orders : 0;
        const refundRate = item.orders ? item.refunds / item.orders : 0;
        return {
          ...item,
          avgOrderValue,
          refundRate,
        };
      });
  }, [filteredRecords, granularity]);

  const channelSummary = useMemo<ChannelRow[]>(() => {
    const map = new Map<RevenueRecord['channel'], ChannelRow>();
    filteredRecords.forEach((record) => {
      const entry = map.get(record.channel);
      if (entry) {
        entry.revenue += record.revenue;
        entry.orders += record.orders;
        entry.refunds += record.refunds;
      } else {
        map.set(record.channel, {
          channel: record.channel,
          revenue: record.revenue,
          orders: record.orders,
          refunds: record.refunds,
          avgOrderValue: 0,
        });
      }
    });
    return Array.from(map.values())
      .map((item) => ({
        ...item,
        avgOrderValue: item.orders ? item.revenue / item.orders : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredRecords]);

  const totalRevenue = aggregatedRows.reduce((acc, row) => acc + row.revenue, 0);
  const totalOrders = aggregatedRows.reduce((acc, row) => acc + row.orders, 0);
  const totalRefunds = aggregatedRows.reduce((acc, row) => acc + row.refunds, 0);
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
  const refundRate = totalOrders ? totalRefunds / totalOrders : 0;

  const lastRow = aggregatedRows[aggregatedRows.length - 1];
  const previousRow = aggregatedRows[aggregatedRows.length - 2];
  const revenueTrend = previousRow && lastRow ? (lastRow.revenue - previousRow.revenue) / previousRow.revenue : 0;
  const ordersTrend = previousRow && lastRow ? (lastRow.orders - previousRow.orders) / previousRow.orders : 0;

  const xAxisData = aggregatedRows.map((row) => row.period);
  const revenueSeries = aggregatedRows.map((row) => Number(row.revenue.toFixed(2)));
  const ordersSeries = aggregatedRows.map((row) => Number(row.orders.toFixed(2)));
  const avgOrderSeries = aggregatedRows.map((row) => Number(row.avgOrderValue.toFixed(2)));

  //@ts-ignore
  const chartOptions: EChartsOption = useMemo(() => ({
    backgroundColor: 'transparent',
    legend: {
      data: ['Revenue', 'Orers', 'Avg Order Value'],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params: any) => {
        const lines = Array.isArray(params) ? params : [params];
        const header = `<strong>${lines[0]?.axisValue}</strong>`;
        const body = lines
          .map((item: any) => {
            const { seriesName, value, marker } = item;
            if (seriesName === 'Revenue' || seriesName === 'Avg Order Value') {
              return `${marker} ${seriesName}: ${currencyFormatter.format(Number(value))}`;
            }
            return `${marker} ${seriesName}: ${Number(value).toLocaleString('en-US')}`;
          })
          .join('<br />');
        return `${header}<br />${body}`;
      },
    },
    grid: { left: 64, right: 64, top: 48, bottom: 60 },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisTick: { alignWithLabel: true },
      axisLabel: { rotate: granularity === 'week' ? 45 : 0 },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Revenue / AOV',
        axisLabel: {
          formatter: (value: number) => compactCurrencyFormatter.format(Number(value)),
        },
        splitLine: { lineStyle: { type: 'dashed' } },
      },
      {
        type: 'value',
        name: 'Orders',
        axisLabel: {
          formatter: (value: number) => Math.round(Number(value)).toString(),
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'Revenue',
        type: 'bar',
        data: revenueSeries,
        itemStyle: { color: '#1677ff' },
        emphasis: { focus: 'series' },
        tooltip: { valueFormatter: (value: number) => currencyFormatter.format(Number(value)) },
      },
      {
        name: 'Orders',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbolSize: 8,
        lineStyle: { width: 3, color: '#52c41a' },
        itemStyle: { color: '#52c41a' },
        data: ordersSeries,
        tooltip: { valueFormatter: (value: number) => Number(value).toLocaleString('en-US') },
      },
      {
        name: 'Avg Order Value',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        lineStyle: { width: 2, type: 'dashed', color: '#faad14' },
        itemStyle: { color: '#faad14' },
        data: avgOrderSeries,
        tooltip: { valueFormatter: (value: number) => currencyFormatter.format(Number(value)) },
      },
    ],
  }), [xAxisData, revenueSeries, ordersSeries, avgOrderSeries, granularity]);

  const periodColumns: ColumnsType<AggregatedRow> = [
    { title: 'Period', dataIndex: 'period', key: 'period' },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right',
      render: (value: number) => currencyFormatter.format(value),
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
      align: 'right',
      render: (value: number) => value.toLocaleString('en-US'),
    },
    {
      title: 'Avg Order Value',
      dataIndex: 'avgOrderValue',
      key: 'avgOrderValue',
      align: 'right',
      render: (value: number) => currencyFormatter.format(Math.round(value)),
    },
    {
      title: 'Refunds',
      dataIndex: 'refunds',
      key: 'refunds',
      align: 'right',
      render: (value: number) => value.toLocaleString('en-US'),
    },
    {
      title: 'Refund Rate',
      dataIndex: 'refundRate',
      key: 'refundRate',
      align: 'right',
      render: (value: number) => percentFormatter.format(value),
    },
  ];

  const channelColumns: ColumnsType<ChannelRow> = [
    {
      title: 'Channel',
      dataIndex: 'channel',
      key: 'channel',
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right',
      render: (value: number) => currencyFormatter.format(value),
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
      align: 'right',
      render: (value: number) => value.toLocaleString('en-US'),
    },
    {
      title: 'Avg Order Value',
      dataIndex: 'avgOrderValue',
      key: 'avgOrderValue',
      align: 'right',
      render: (value: number) => currencyFormatter.format(Math.round(value)),
    },
  ];

  const handleExport = () => {
    if (!aggregatedRows.length) return;
    const header = 'Period,Revenue,Orders,Average Order Value,Refunds,Refund Rate';
    const rows = aggregatedRows
      .map((row) => [
        row.period,
        row.revenue,
        row.orders,
        row.avgOrderValue.toFixed(2),
        row.refunds,
        `${(row.refundRate * 100).toFixed(2)}%`,
      ].join(','))
      .join('\n');
    const csv = `${header}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `revenue-report-${granularity}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetFilters = () => {
    setGranularity('month');
    setRange(defaultRange);
  };

  const topChannel = channelSummary[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <Title level={3} className="!mb-0">Revenue Intelligence</Title>
          <Text type="secondary">Revenue trends across time ranges and sales channels</Text>
        </div>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>Reset filters</Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport} disabled={!aggregatedRows.length}>Export CSV</Button>
        </Space>
      </div>

      <Card className="shadow-sm" bodyStyle={{ padding: '20px 24px' }}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Space wrap>
            <RangePicker
              value={range ?? null}
              onChange={(values) => setRange(values as [Dayjs, Dayjs] | null)}
              allowClear
            />
            <Select<Granularity>
              value={granularity}
              onChange={setGranularity}
              options={[
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'quarter', label: 'Quarter' },
              ]}
              style={{ width: 140 }}
            />
          </Space>
          {topChannel && (
            <Tag icon={<LineChartOutlined />} color="blue" className="w-max">
              Top channel: {topChannel.channel}
            </Tag>
          )}
        </div>
        <div className="mt-5">
          <ReactECharts option={chartOptions} style={{ height: 360 }} notMerge lazyUpdate />
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="shadow-sm" title="Total revenue">
            <Statistic
              value={totalRevenue}
              formatter={(value) => currencyFormatter.format(Number(value))}
            />
            <div className="mt-3 flex items-center gap-2">
              <Tag color={revenueTrend >= 0 ? 'green' : 'red'}>
                {revenueTrend >= 0 ? '+' : ''}{(revenueTrend * 100).toFixed(1)}%
              </Tag>
              <Text type="secondary">vs previous period</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="shadow-sm" title="Average order value">
            <Statistic
              value={avgOrderValue}
              precision={0}
              formatter={(value) => currencyFormatter.format(Number(value))}
            />
            <div className="mt-3 flex items-center gap-2">
              <Tag color={ordersTrend >= 0 ? 'blue' : 'orange'}>
                {ordersTrend >= 0 ? '+' : ''}{(ordersTrend * 100).toFixed(1)}% orders
              </Tag>
              <Text type="secondary">Order trend</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="shadow-sm" title="Refund rate">
            <Statistic
              value={refundRate * 100}
              precision={2}
              suffix="%"
            />
            <div className="mt-3 flex items-center gap-2">
              <Text type="secondary">Total refunds: {totalRefunds.toLocaleString('en-US')}</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className="shadow-sm" title="Revenue by period">
            <Table<AggregatedRow>
              dataSource={aggregatedRows}
              columns={periodColumns}
              size="middle"
              pagination={{ pageSize: 6 }}
              rowKey="key"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="shadow-sm" title="Channel performance">
            <Table<ChannelRow>
              dataSource={channelSummary}
              columns={channelColumns}
              size="small"
              pagination={false}
              rowKey="channel"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
