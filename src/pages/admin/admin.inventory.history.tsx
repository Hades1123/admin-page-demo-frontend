import React, { useMemo, useState } from 'react';
import { Button, Card, Input, Space, Table, Typography, DatePicker } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd/lib';

const { Title, Text } = Typography;

type InventoryHistoryRecord = {
	id: string;
	name: string;
	time: string;
	quantity: number;
};

const INVENTORY_HISTORY: InventoryHistoryRecord[] = [
	{ id: 'GRN-23001', name: 'Arabica Beans 1kg', time: '2024-04-02T09:15:00Z', quantity: 150 },
	{ id: 'GRN-23002', name: 'Robusta Beans 500g', time: '2024-04-02T12:30:00Z', quantity: 240 },
	{ id: 'GRN-23003', name: 'Glass Bottles 250ml', time: '2024-04-03T08:45:00Z', quantity: 480 },
	{ id: 'GRN-23004', name: 'Organic Milk 1L', time: '2024-04-04T10:10:00Z', quantity: 320 },
	{ id: 'GRN-23005', name: 'Brown Sugar 5kg', time: '2024-04-04T16:25:00Z', quantity: 60 },
	{ id: 'GRN-23006', name: 'Packing Box Medium', time: '2024-04-05T07:55:00Z', quantity: 200 },
	{ id: 'GRN-23007', name: 'Arabica Beans 1kg', time: '2024-04-06T09:40:00Z', quantity: 90 },
	{ id: 'GRN-23008', name: 'Bottle Caps', time: '2024-04-06T13:20:00Z', quantity: 500 },
	{ id: 'GRN-23009', name: 'Vanilla Syrup 750ml', time: '2024-04-07T11:05:00Z', quantity: 110 },
	{ id: 'GRN-23010', name: 'Cocoa Powder 1kg', time: '2024-04-07T14:50:00Z', quantity: 75 },
];

const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
});

export const InventoryHistory: React.FC = () => {
	const [searchValue, setSearchValue] = useState('');
	const { RangePicker } = DatePicker;

	const customFormat: DatePickerProps['format'] = (value) =>
		`${value.format("DD/MM/YYYY")}`;

	const columns: ColumnsType<InventoryHistoryRecord> = useMemo(
		() => [
			{
				title: 'ID',
				dataIndex: 'id',
				sorter: (a, b) => a.id.localeCompare(b.id),
				sortDirections: ['ascend', 'descend'],
			},
			{
				title: 'Name',
				dataIndex: 'name',
				sorter: (a, b) => a.name.localeCompare(b.name),
				sortDirections: ['ascend', 'descend'],
			},
			{
				title: 'Time',
				dataIndex: 'time',
				render: (value: string) => timeFormatter.format(new Date(value)),
				sorter: (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
				sortDirections: ['ascend', 'descend'],
			},
			{
				title: 'Quantity',
				dataIndex: 'quantity',
				align: 'right',
				sorter: (a, b) => a.quantity - b.quantity,
				sortDirections: ['ascend', 'descend'],
			},
		],
		[],
	);

	const filteredData = useMemo(() => {
		const keyword = searchValue.trim().toLowerCase();

		if (!keyword) {
			return INVENTORY_HISTORY;
		}

		return INVENTORY_HISTORY.filter((record) => record.name.toLowerCase().includes(keyword));
	}, [searchValue]);

	const handleTableChange: TableProps<InventoryHistoryRecord>['onChange'] = (
		_pagination,
		_filters,
		_sorter,
	) => {
		// This callback keeps the signature available for future side-effects.
	};

	// const handleResetFilters = () => {
	// 	setSearchValue('');
	// };

	return (
		<div className="p-4 md:p-6">
			<div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
				<div>
					<Title level={3} className="!mb-1">
						Lich su nhap hang
					</Title>
					<Text type="secondary">Theo doi cac lo hang da nhap kho va so luong tuong ung.</Text>
				</div>
			</div>

			<Card className="shadow-sm" hoverable>
				<Space direction="horizontal" size={[16, 16]} wrap className="mb-4 w-full">
					<label htmlFor="">Name:</label>
					<Input
						allowClear
						style={{ maxWidth: 280 }}
						value={searchValue}
						onChange={(event) => setSearchValue(event.target.value)}
						prefix={<SearchOutlined />}
						placeholder="Tim theo ten hang"
					/>
					<label htmlFor="">Time:</label>
					<RangePicker format={customFormat} />
					{/* <Button icon={<ReloadOutlined />} onClick={handleResetFilters} disabled={!searchValue.trim()}>
						Dat lai
					</Button> */}
				</Space>
				<Table
					rowKey="id"
					columns={columns}
					dataSource={filteredData}
					onChange={handleTableChange}
					pagination={{ pageSize: 6, showSizeChanger: false }}
					scroll={{ x: true }}
				/>
			</Card>
		</div>
	);
};
