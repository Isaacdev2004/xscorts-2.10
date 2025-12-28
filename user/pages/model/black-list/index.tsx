import UsersBlockList from '@components/user/users-block-list';
import {
  Form, Input, Layout, message
} from 'antd';
import { useEffect, useState } from 'react';

import { blockUserService } from '@services/block-user.service';
import SeoMetaHead from '@components/common/seo-meta-head';

function BlacklistPage() {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const limit = 10;
  const [totalBlockedUsers, setTotalBlockedUsers] = useState(0);
  const [userBlockedList, setUserBlockedList] = useState([]);
  const [pagination, setPagination] = useState({} as any);
  const [searchKey, setSearchKey] = useState('');

  const handleUnblockUser = async (userId?: any) => {
    try {
      setSubmitting(true);
      blockUserService.unblockUser(userId);
      message.success('Unblock user successfully');
      setUserBlockedList(userBlockedList.filter((u) => u.targetId !== userId));
    } catch (error) {
      message.error('Error occurred, please try again!');
    }
    setSubmitting(false);
  };

  const getBlockList = async (page = 1) => {
    // call api
    // handling
    setLoading(true);
    const resp = await blockUserService.search({
      limit,
      offset: (page - 1) * limit
    });
    setUserBlockedList(resp.data.data);
    setLoading(false);
  };

  const handlePageChange = (data) => {
    setPagination(data.current);
    getBlockList(data.current);
  };
  const onSearch = async () => {
    // handling
    // delete metadata
    const resp = await blockUserService.search({ q: searchKey });
    setUserBlockedList(resp?.data.data);
  };
  const getSearchKey = (value) => {
    setSearchKey(value);
    onSearch();
  };

  useEffect(() => {
    getBlockList();
  }, []);
  return (
    <Layout>
      <SeoMetaHead item={{ title: 'Blacklist' }} />
      <div className="contentInner">
        <div className="page-heading">Blacklist</div>
        <div className="form-search" style={{ margin: '-5px' }}>

          <Form style={{ display: 'flex' }}>
            <Form.Item
              style={{ height: 40, width: '50%' }}
              name="username"
              // rules={[{ required: true, message: 'Please input  username!' }]}
            >
              <Input onChange={(evt) => { getSearchKey(evt.target.value); }} onPressEnter={onSearch} style={{ color: '#fff', backgroundColor: '#333' }} placeholder="Enter username" />
            </Form.Item>
          </Form>
        </div>
        <UsersBlockList
          items={userBlockedList}
          searching={loading}
          total={totalBlockedUsers}
          onPaginationChange={(data) => handlePageChange(data)}
          pageSize={limit}
          submitting={submitting}
          unblockUser={(userId) => handleUnblockUser(userId)}
        />
      </div>

    </Layout>
  );
}

BlacklistPage.onlyPerformer = true;

BlacklistPage.authenticate = true;

BlacklistPage.getInitialProps = async () => {
  // const [countries] = await Promise.all([
  // utilsService.countriesList()
  // ]);
  // return {
  //   countries: countries?.data || []
  // };
};

export default BlacklistPage;
