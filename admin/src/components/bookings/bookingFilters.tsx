import { performerService } from '@services/performer.service';
import { userService } from '@services/user.service';
import {
  Col, DatePicker, Row, Select, message
} from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

const { RangePicker } = DatePicker;
const bookingStatusOptions = [
  { label: 'All', key: 'all', value: '' },
  { label: 'Accepted', key: 'accepted', value: 'accepted' },
  { label: 'Created', key: 'created', value: 'created' },
  { label: 'Pending', key: 'pending', value: 'pending' }
  // { label: 'Paid', key: 'paid', value: 'paid' }
];
export default function BookingFilter({ onSubmit }: { onSubmit: Function }) {
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
    }, 300),
    []
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
          onChange={(val) => setCurrentFilters((prev) => ({ ...prev, fromSourceId: val }))}
          notFoundContent={null}
          allowClear
          loading={searching}
          placeholder="Type to search booker"
        >
          {users.map((u) => (
            <Select.Option key={u._id} value={u._id}>
              <span>
                <strong>
                  {u.name}
                  /
                  {u.username}
                </strong>
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
          placeholder="Type to search Escort"
        >
          {performers.map((u) => (
            <Select.Option key={u._id} value={u.userId}>
              <span>
                <strong>
                  {u.name}
                  /
                  {u.username}
                </strong>
              </span>
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col lg={8} xs={12}>
        <Select
          onChange={(val) => {
            setCurrentFilters((prev) => ({ ...prev, status: val }));
          }}
          style={{ width: '100%' }}
          placeholder="Select booking status"
          // defaultActiveFirstOption
        >
          {bookingStatusOptions.map((s) => (
            <Select.Option key={s.key} value={s.value}>
              {s.label || s.key}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col lg={8} xs={12}>
        <RangePicker
          onChange={(dates: [any, any], dateStrings: [string, string]) => setCurrentFilters((prev) => ({ ...prev, startAt: dateStrings[0], endAt: dateStrings[1] }))}
        />
      </Col>
    </Row>
  );
}
