/* eslint-disable react/no-danger */
import React, { PureComponent } from 'react';
import {
  Layout, Row, Col, message
} from 'antd';
import { favoriteService } from '@services/favorite-service';
import { PerformersGrid } from '@components/user/performer-grid';
import SeoMetaHead from '@components/common/seo-meta-head';
import './index.less';

class FavoritePage extends PureComponent {
  static authenticate: boolean = true;

  static noredirect: boolean = true;

  state = {
    fetching: true,
    favoriteList: []
  };

  componentDidMount() {
    this.favoriteList();
  }

  async favoriteList() {
    try {
      await this.setState({ fetching: true });
      const resp = await favoriteService.search({
        limit: 1000,
        sort: 'desc',
        sortBy: 'score'
      });
      this.setState({
        favoriteList: resp.data.data
      });
    } catch {
      message.error('Error an occurred, please try again later');
    } finally {
      this.setState({ fetching: false });
    }
  }

  render() {
    const { favoriteList, fetching } = this.state;
    return (
      <Layout>
        <SeoMetaHead item={{ title: 'My favorite' }} />
        <Row gutter={24}>
          <Col lg={24} md={24} sm={24} xs={24}>
            <div className="related">
              <h3 className="page-heading">MY FAVORITES</h3>
              <PerformersGrid performers={favoriteList} loading={fetching} />
            </div>
          </Col>
        </Row>
      </Layout>
    );
  }
}

export default FavoritePage;
