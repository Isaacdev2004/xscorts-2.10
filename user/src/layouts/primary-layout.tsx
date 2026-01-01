import React, { PureComponent } from 'react';
import dynamic from 'next/dynamic';
import { Layout, BackTop } from 'antd';
import { connect } from 'react-redux';
import { Router as RouterEvent } from 'next/router';
import { IUIConfig } from 'src/interfaces/ui-config';
import { cookieService } from '@services/index';
import './primary-layout.less';
import NotificationAlert from '@components/subscription/notification-alert';
import AgeVerificationModal from '@components/common/age-verification-modal';

const Header = dynamic(() => import('@components/common/layout/header'));
const Footer = dynamic(() => import('@components/common/layout/footer'));
const Loader = dynamic(() => import('@components/common/base/loader'));

interface DefaultProps extends IUIConfig {
  children: any;
  config: IUIConfig;
}
interface IState{
  routerChange:boolean;
  showAgeVerification: boolean;
}

export async function getStaticProps() {
  return {
    props: {}
  };
}

class PrimaryLayout extends PureComponent<DefaultProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      routerChange: false,
      showAgeVerification: false
    };
  }

  componentDidMount() {
    if (process.browser) {
      this.handleStateChange();
      this.checkAgeVerification();

      window.addEventListener('scroll', () => {
        const doc = document.documentElement;
        const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

        if (top > 100) {
          const { body } = document;
          body.classList.add('header-sticky');
        } else {
          const { body } = document;
          body.classList.remove('header-sticky');
        }
      });
    }
  }

  checkAgeVerification = () => {
    // Check if user has confirmed age, privacy, terms, and cookies
    const confirmAdult = cookieService.checkCookie('confirm_adult');
    const confirmPrivacy = cookieService.checkCookie('confirm_privacy');
    const confirmTerms = cookieService.checkCookie('confirm_terms');
    const confirmCookies = cookieService.checkCookie('confirm_cookies');
    
    // Show modal if any confirmation is missing
    if (!confirmAdult || !confirmPrivacy || !confirmTerms || !confirmCookies) {
      this.setState({ showAgeVerification: true });
    }
  };

  handleAgeVerificationConfirm = () => {
    this.setState({ showAgeVerification: false });
  };

  handleStateChange() {
    RouterEvent.events.on('routeChangeStart', async () => this.setState({ routerChange: true }));
    RouterEvent.events.on('routeChangeComplete', async () => this.setState({ routerChange: false }));
  }

  render() {
    const {
      children
    } = this.props;
    const {
      routerChange
    } = this.state;

    const { showAgeVerification } = this.state;

    return (
      <Layout>
        <div
          className="container"
          id="primaryLayout"
        >
          <Header />
          <NotificationAlert />
          <Layout.Content
            className="content main-content"
          >
            {routerChange && <Loader />}
            {children}
          </Layout.Content>
          <BackTop className="backTop" />
          <Footer />
          <AgeVerificationModal
            visible={showAgeVerification}
            onConfirm={this.handleAgeVerificationConfirm}
          />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state: any) => ({
  ...state.ui
});
const mapDispatchToProps = { };

export default connect(mapStateToProps, mapDispatchToProps)(PrimaryLayout);
