import {
  Col, Row, Spin, message
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  CalendarOutlined,
  EyeOutlined,
  WechatOutlined
} from '@ant-design/icons';
import { performerService } from '@services/performer.service';
import './index.less';
import Link from 'next/link';

interface IStat {
  title:string;
  icon: any;
  stat:number;
  link?:string;
}
const initBlocks:IStat[] = [
  {
    title: 'Total bookings',
    icon: <CalendarOutlined />,
    stat: 0,
    link: '#!'
  },
  {
    title: 'Profile views',
    icon: <EyeOutlined />,
    stat: 0,
    link: '#!'
  },
  {
    title: 'Chats initiates',
    icon: <WechatOutlined />,
    stat: 0,
    link: '#!'
  }
];
export default function StatBlock() {
  const [stats, setStats] = useState(initBlocks);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    try {
      setLoading(true);
      const resp = await performerService.getCurrentMonthStatistics();
      setStats([
        {
          title: 'Total bookings',
          icon: <CalendarOutlined />,
          stat: resp.data.monthBooking
        },
        {
          title: 'Profile views',
          icon: <EyeOutlined />,
          stat: resp.data.monthView
        },
        {
          title: 'Chats initiates',
          icon: <WechatOutlined />,
          stat: resp.data.monthText,
          link: '/messages'
        }
      ]);
    } catch (error) {
      message.error('An error occurred, please try again!');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <h3 className="stat-title">Current Month Statistic</h3>
      <Row gutter={{
        xs: 0, lg: 32
      }}
      >
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin />
          </div>
        ) : (
          stats.map((item) => (
            <Col span={8} key={item.title}>
              <div className="stat-container">
                <div className="stat-header">{item.stat}</div>
                <div className="stat-content">
                  <p>{item.title}</p>
                  <Link href={item?.link || '#!'}><span className="stat-content-icon">{item.icon}</span></Link>
                </div>
              </div>
            </Col>
          ))
        )}
      </Row>
    </>
  );
}
