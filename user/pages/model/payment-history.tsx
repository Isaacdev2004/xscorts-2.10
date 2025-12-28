import { PureComponent } from 'react';
import { Layout, message } from 'antd';
import { orderService } from 'src/services';
import { ITransaction } from 'src/interfaces';
import { SearchFilter } from '@components/common/search-filter';
import PaymentTableList from '@components/payment/table-list';
import { getResponseError } from '@lib/utils';
import SeoMetaHead from '@components/common/seo-meta-head';

interface IProps {

}
interface IStates {
  loading: boolean;
  paymentList: ITransaction[];
  pagination: {
    total: number;
    pageSize: number;
    current: number;
  };
  sortBy: string;
  sort: string;
  filter: {};
}

class PaymentHistoryPage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  state = {
    loading: true,
    paymentList: [],
    pagination: {
      total: 0,
      pageSize: 10,
      current: 1
    },
    sortBy: 'updatedAt',
    sort: 'desc',
    filter: {}
  };

  componentDidMount() {
    this.userSearchTransactions();
  }

  handleTableChange = async (pagination, filters, sorter) => {
    const { pagination: paginationVal } = this.state;
    await this.setState({
      pagination: { ...paginationVal, current: pagination.current },
      sortBy: sorter.field || 'updatedAt',
      // eslint-disable-next-line no-nested-ternary
      sort: sorter.order
        ? sorter.order === 'descend'
          ? 'desc'
          : 'asc'
        : 'desc'
    });
    this.userSearchTransactions();
  };

  async handleFilter(values) {
    const { filter } = this.state;
    await this.setState({ filter: { ...filter, ...values } });
    this.userSearchTransactions();
  }

  async userSearchTransactions() {
    try {
      const {
        filter, sort, sortBy, pagination
      } = this.state;
      await this.setState({ loading: true });
      const resp = await orderService.search({
        ...filter,
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      this.setState({
        loading: false,
        paymentList: resp.data.data,
        pagination: {
          ...pagination,
          total: resp.data.total
        }
      });
    } catch (error) {
      const err = await error;
      message.error(getResponseError(err));
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, paymentList, pagination } = this.state;
    const type = [
      {
        key: '',
        text: 'All type'
      },
      {
        key: 'subscription_package',
        text: 'Membership Plan'
      }
    ];
    return (
      <Layout>
        <SeoMetaHead item={{ title: 'Payment History' }} />
        <div className="main-container">
          <div className="contentInner">
            <div className="page-heading">
              Payment History
            </div>
            <SearchFilter
              type={type}
              onSubmit={this.handleFilter.bind(this)}
              dateRange
              searchWithKeyword={false}
              statuses={[
                { key: '', text: 'All statuses' },
                { key: 'accepted', text: 'Accepted' },
                { key: 'rejected', text: 'Rejected' },
                { key: 'created', text: 'Created' },
                { key: 'pending', text: 'Pending' },
                { key: 'paid', text: 'Paid' },
                { key: 'refunded', text: 'Refunded' }
              ]}
            />
            <PaymentTableList
              dataSource={paymentList}
              pagination={{ ...pagination, showSizeChanger: false }}
              onChange={this.handleTableChange.bind(this)}
              rowKey="_id"
              loading={loading}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

export default PaymentHistoryPage;
