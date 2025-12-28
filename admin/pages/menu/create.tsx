import Head from 'next/head';
import { PureComponent } from 'react';
import Page from '@components/common/layout/page';
import { message } from 'antd';
import { menuService } from '@services/menu.service';
import { FormMenu } from '@components/menu/form-menu';
import { BreadcrumbComponent } from '@components/common';
import Router from 'next/router';

class MenuCreate extends PureComponent {
  state = {
    submitting: false
  };

  async submit(data: any) {
    try {
      await this.setState({ submitting: true });
      const submitData = {
        ...data
      };
      await menuService.create(submitData);
      message.success('Created successfully');
      // TODO - redirect
      Router.push('/menu');
    } catch (e) {
      // TODO - check and show error here
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'Something went wrong, please try again!');
      this.setState({ submitting: false });
    }
  }

  render() {
    const { submitting } = this.state;
    return (
      <>
        <Head>
          <title>New menu</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Menus', href: '/menu' }, { title: 'New menu' }]} />
        <Page>
          <FormMenu onFinish={this.submit.bind(this)} submitting={submitting} />
        </Page>
      </>
    );
  }
}

export default MenuCreate;
