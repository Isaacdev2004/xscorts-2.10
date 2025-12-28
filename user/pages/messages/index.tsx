import { PureComponent } from 'react';
import { Layout } from 'antd';
import { IUIConfig } from 'src/interfaces/';
import Messenger from '@components/messages/Messenger';
import SeoMetaHead from '@components/common/seo-meta-head';

interface IProps {
  getList: Function;
  performerState: any;
  ui: IUIConfig;
  query: Record<string, string>
}

class Messages extends PureComponent<IProps> {
  static authenticate: boolean = true;

  static getInitialProps({ ctx }) {
    return {
      query: ctx.query
    };
  }

  render() {
    const { query = {} } = this.props;

    return (
      <Layout.Content>
        <SeoMetaHead item={{ title: 'Messenger' }} />
        <div className="main-container">
          <Messenger toSource={query.toSource} toId={query.toId} />
        </div>
      </Layout.Content>
    );
  }
}

export default Messages;
