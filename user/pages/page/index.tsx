import { PureComponent } from 'react';
import { Layout } from 'antd';
import { ReadOutlined } from '@ant-design/icons';
import { postService } from '@services/post.service';
import Router from 'next/router';
import { IPostResponse } from '@interfaces/post';
import SeoMetaHead from '@components/common/seo-meta-head';

interface IProps {
  post: IPostResponse;
}
class PostDetail extends PureComponent<IProps> {
  static authenticate: boolean = true;

  static noredirect: boolean = true;

  static async getInitialProps({ ctx }: any) {
    const { query } = ctx;
    try {
      const post = await (await postService.findById(query.id)).data;
      return { post };
    } catch (e) {
      return Router.replace('/404');
    }
  }

  render() {
    const { post } = this.props;
    return (
      <Layout>
        <SeoMetaHead
          item={{
            title: post.title
          }}
          keywords={post.metaKeywords}
          description={post.metaDescription}
          metaTitle={post.metaTitle}
          canonicalUrl={post.canonicalUrl}
        />
        <div className="main-container">
          <div className="page-container">
            <div className="page-heading">
              <span className="box">
                <ReadOutlined />
                {' '}
                {post?.title || ''}
              </span>
            </div>
            <div
              className="page-content"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

export default PostDetail;
