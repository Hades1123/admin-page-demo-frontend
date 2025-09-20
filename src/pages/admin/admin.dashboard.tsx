import React from 'react';
import type { StatisticProps } from 'antd';
import { Col, Row, Statistic } from 'antd';
import CountUp from 'react-countup';

const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator="," />
);

export const DashboardPage = () => (
    <>
        <div className='flex gap-10 ml-10'>
            <Statistic title="Active Users" value={112893} formatter={formatter} className='p-4 border-2 border-gray-100 rounded-md' />
            <Statistic title="Account Balance (VND)" value={112893} precision={2} formatter={formatter} className='p-4 border-2 border-gray-100 rounded-md' />
        </div>
    </>
);
