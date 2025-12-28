import { performerService } from '@services/performer.service';
import { userService } from '@services/user.service';
import {
  Col, Row, Select, message
} from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

const categoryOptions = [
  { label: 'All', key: 'all', value: '' },
  { label: 'Advertising', key: 'advertising', value: 'advertising' },
  { label: 'Abusive', key: 'abusive', value: 'abusive' },
  { label: 'Intoxicated', key: 'intoxicated', value: 'intoxicated' },
  { label: 'Offline Payments', key: 'offline_payments', value: 'offline_payments' },
  { label: 'Other', key: 'other', value: 'other' }
];
export default function AbuseReportFilters({ onSubmit }:{onSubmit:Function}) {
  const [currentFilters, setCurrentFilters] = useState({});
  const [performers, setPerformers] = useState([]);
  const [users, setUsers] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleGetPerformers = useCallback(
    debounce(async (value) => {
      try {
        setSearching(true);
        const res = await performerService.search({
          q: value,
          status: 'active'
        });

        setPerformers(res.data.data);
      } catch (error) {
        message.error('An error occurred, please try again!');
      } finally {
        setSearching(false);
      }
    }, 300),
    []
  );
  const handleGetUsers = useCallback(
    debounce(async (value) => {
      try {
        setSearching(true);
        const res = await userService.search({
          q: value,
          status: 'active'
        });
        setUsers(res.data.data);
      } catch (error) {
        message.error('An error occurred, please try again!');
      } finally {
        setSearching(false);
      }
    }, 300), []
  );
  useEffect(() => {
    onSubmit(currentFilters);
  }, [currentFilters]);
  return (
    <Row gutter={24}>
      <Col lg={8} xs={12}>
        <Select
          showSearch
          style={{ width: '100%' }}
          defaultActiveFirstOption={false}
          showArrow
          filterOption={false}
          onSearch={(value) => handleGetUsers(value)}
          onChange={(val) => setCurrentFilters((prev) => ({ ...prev, sourceId: val }))}
          notFoundContent={null}
          allowClear
          loading={searching}
          placeholder="Type to search reporter"

        >
          {users.map((u) => (
            <Select.Option key={u._id} value={u._id}>
              <span>
                <strong>{u.name || u.username || `${u.firstName} ${u.lastName}`}</strong>
              </span>
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col lg={8} xs={12}>
        <Select
          showSearch
          style={{ width: '100%' }}
          defaultActiveFirstOption={false}
          showArrow
          filterOption={false}
          onSearch={(value) => handleGetPerformers(value)}
          onChange={(val) => setCurrentFilters((prev) => ({ ...prev, targetId: val }))}
          notFoundContent={null}
          allowClear
          loading={searching}
          placeholder="Type to search model name"
        >
          {performers.map((u) => (
            <Select.Option key={u._id} value={u.userId}>
              <span>
                <strong>{u.name || u.username || `${u.firstName} ${u.lastName}`}</strong>
              </span>
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col lg={8} xs={12}>
        <Select
          onChange={(val) => {
            setCurrentFilters((prev) => ({ ...prev, category: val }));
          }}
          style={{ width: '100%' }}
          placeholder="Select violation category"
          // defaultActiveFirstOption
        >
          {categoryOptions.map((s) => (
            <Select.Option key={s.key} value={s.value}>
              {s.label || s.key}
            </Select.Option>
          ))}
        </Select>
      </Col>

    </Row>
  );
}
