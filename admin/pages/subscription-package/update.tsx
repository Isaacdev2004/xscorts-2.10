import { message } from 'antd';
import Page from '@components/common/layout/page';
import Loader from '@components/common/base/loader';
import Head from 'next/head';
import { PureComponent } from 'react';
import { subscriptionPackageService } from 'src/services';
import { ISubscriptionPackage, ISubscriptionPackageUpdate } from 'src/interfaces';
import Router from 'next/router';
import { getResponseError } from '@lib/utils';
import { FormSubscriptionPackage } from 'src/components/subscription-package/form';
import { BreadcrumbComponent } from '@components/common';

interface IProps {
  id: string;
}
interface IStates {
  submitting: boolean;
  loading: boolean;
  subscriptionPackage: Partial<ISubscriptionPackage>;
}

class SucscriptionPackageUpdatePage extends PureComponent<IProps, IStates> {
  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  constructor(props) {
    super(props);
    this.state = { submitting: false, loading: true, subscriptionPackage: {} };
  }

  componentDidMount() {
    const { id } = this.props;
    if (!id) {
      message.error('Package not found!');
      Router.push('/subscription-package');
      return;
    }
    this.getData();
  }

  async handleUpdate(data: ISubscriptionPackageUpdate) {
    try {
      const { id } = this.props;
      await this.setState({ submitting: true });
      await subscriptionPackageService.update(id, data);
      message.success('Updated successfully');
      Router.push('/subscription-package');
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err));
      this.setState({ submitting: false });
    }
  }

  async getData() {
    try {
      const { id } = this.props;
      const resp = await subscriptionPackageService.findOne(id);
      this.setState({ loading: false, subscriptionPackage: resp.data });
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err));
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, subscriptionPackage, submitting } = this.state;
    return (
      <>
        <Head>
          <title>Update Subscription Package</title>
        </Head>
        <div style={{ marginBottom: '16px' }}>
          <BreadcrumbComponent breadcrumbs={[{ title: 'Subscription Packages', href: '/subscription-package' }, { title: 'Update subscription package' }]} />
        </div>
        <Page>
          {loading ? <Loader />
            : <FormSubscriptionPackage onFinish={this.handleUpdate.bind(this)} submitting={submitting} subscriptionPackage={subscriptionPackage} />}
        </Page>
      </>
    );
  }
}
export default SucscriptionPackageUpdatePage;
