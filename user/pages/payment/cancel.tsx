import { PureComponent } from 'react';
import { Layout, Result, Button } from 'antd';
import { connect } from 'react-redux';
import { IUser, IUIConfig } from 'src/interfaces';
import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Router from 'next/router';
import SeoMetaHead from '@components/common/seo-meta-head';

interface IProps {
  user: IUser;
  ui: IUIConfig;
}

class PaymentCancel extends PureComponent<IProps> {
  static authenticate: boolean = true;

  static noredirect: boolean = true;

  render() {
    const { user } = this.props;
    return (
      <Layout>
        <SeoMetaHead item={{ title: 'Payment fail' }} />
        <div className="main-container">
          <Result
            status="error"
            title="Payment Fail"
            subTitle={`Hi ${user?.name || user?.username || `${user?.firstName} ${user?.lastName}` || 'there'}, your payment has been fail. Please contact us for more information.`}
            extra={[
              <Button className="secondary" key="console" onClick={() => Router.push('/home')}>
                <HomeOutlined />
                BACK HOME
              </Button>,
              <Button key="buy" className="primary" onClick={() => Router.push('/contact')}>
                <ShoppingCartOutlined />
                CONTACT US
              </Button>
            ]}
          />
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  user: state.user.current
});

export default connect(mapStates)(PaymentCancel);
