/* eslint-disable react/no-danger */
import React, { PureComponent } from 'react';
import {
  Layout, Button, Row, Col
} from 'antd';
import { connect } from 'react-redux';
import { PerformersGrid } from '@components/performer';
import { Banner } from '@components/common';
import { getBanners } from '@redux/banner/actions';
import { performerService, postService } from '@services/index';
import { IUIConfig } from '@interfaces/index';
import './index.less';
import storeHolder from '@lib/storeHolder';
import SearchFilter from '@components/filter/search-filter';
import SeoMetaHead from '@components/common/seo-meta-head';
import QuickLinksSidebar from '@components/common/quick-links-sidebar';
import TrendingVideos from '@components/common/trending-videos';

interface IProps {
  ui: IUIConfig;
  banners: any;
  getBanners: Function;
  home: any;
  settings: any;
}

class HomePage extends PureComponent<IProps> {
  static authenticate: boolean = true;

  static noredirect: boolean = true;

  static async getInitialProps() {
    // postService.findById();
    const store = storeHolder.getStore();
    const { settings } = store.getState() as any;
    if (!settings.homeContentPageId) {
      return {
        settings
      };
    }

    const resp = await postService.findById(settings.homeContentPageId);
    return {
      home: {
        content: resp.data?.content,
        title: resp.data?.title,
        image: resp.data?.image
      },
      settings
    };
  }

  state = {
    fetching: true,
    performers: [],
    openFilter: false
  };

  componentDidMount() {
    const { getBanners: getBannersHandler } = this.props;
    getBannersHandler({ limit: 15, position: 'homeTop,homeBottom' });
    this.getInitialData();
  }

  async getInitialData() {
    try {
      await this.setState({ fetching: true });
      const performers = await performerService.search({
        limit: 200,
        sort: 'lastOnline'
      });
      this.setState({
        performers: performers.data.data,
        fetching: false
      });
    } catch {
      this.setState({ fetching: false });
    }
  }

  render() {
    const { banners = [], settings } = this.props;
    const { performers, fetching, openFilter } = this.state;
    const topBanners = banners?.data.filter((b) => b.position === 'homeTop');
    const bottomBanners = banners?.data.filter((b) => b.position === 'homeBottom');
    return (
      <>
        <SeoMetaHead
          item={{
            title: 'Home',
            keywords: settings?.metaKeywords,
            description: settings?.metaDescription
          }}
        />
        <Layout className="home-page-layout">
          <div className="home-page">
            <div className="main-container">
              {topBanners && topBanners.length > 0 && (
                <div className="banner">
                  <Banner banners={topBanners} autoplay arrows={false} dots />
                </div>
              )}
              
              <div className="home-content-header">
                <div className="header-left">
                  <h2 className="section-title">Alle advertenties</h2>
                </div>
                <div className="header-right">
                  <h2 className="section-title">Trending video's</h2>
                </div>
              </div>

              <Row gutter={[16, 16]} className="home-content-row">
                {/* Left Sidebar - Quick Links */}
                <Col xs={24} sm={24} md={6} lg={5} xl={4} className="home-sidebar-left">
                  <QuickLinksSidebar />
                </Col>

                {/* Middle - Performers Grid */}
                <Col xs={24} sm={24} md={12} lg={14} xl={16} className="home-content-main">
                  <div className="filter-switch">
                    <Button
                      className="btn btn-outline-primary"
                      onClick={() => this.setState({
                        openFilter: !openFilter
                      })}
                    >
                      Filter
                    </Button>
                  </div>
                  {openFilter && <SearchFilter />}
                  <PerformersGrid performers={performers} loading={fetching} />
                </Col>

                {/* Right Sidebar - Trending Videos */}
                <Col xs={24} sm={24} md={6} lg={5} xl={4} className="home-sidebar-right">
                  <TrendingVideos limit={5} />
                </Col>
              </Row>

              {bottomBanners && bottomBanners.length > 0 && (
                <div className="banner">
                  <Banner banners={bottomBanners} autoplay arrows={false} dots />
                </div>
              )}
            </div>
          </div>
        </Layout>
      </>
    );
  }
}

const mapStates = (state: any) => ({
  banners: state.banner.listBanners.data
});

const mapDispatch = { getBanners };
export default connect(mapStates, mapDispatch)(HomePage);
