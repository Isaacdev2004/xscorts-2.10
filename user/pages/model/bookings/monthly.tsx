/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unused-state */
import { PureComponent } from 'react';
import {
  Col, Layout, Row
} from 'antd';
import { IUIConfig, IUser } from 'src/interfaces';
import StatBlock from '@components/booking/StatBlock';
import PerformerBookings from '@components/booking/PerformerBookings';
import Link from 'next/link';
import SeoMetaHead from '@components/common/seo-meta-head';

interface IProps {
  ui: IUIConfig;
  user: IUser;
}

class ModelMonthlyBookings extends PureComponent<IProps> {
  static authenticate = true;

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  render() {
    return (
      <>
        <Layout>
          <SeoMetaHead item={{ title: 'My Monthly Bookings' }} />
          <div className="main-container">
            <div className="page-heading">
              <Link href="/model/bookings">SEE ALL BOOKINGS</Link>
            </div>
            <Row>
              <Col span={24}>
                <StatBlock />
                <PerformerBookings />
              </Col>
            </Row>
          </div>
        </Layout>
      </>
    );
  }
}

export default ModelMonthlyBookings;
