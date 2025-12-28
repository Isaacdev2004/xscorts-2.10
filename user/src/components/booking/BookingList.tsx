/* eslint-disable jsx-a11y/click-events-have-key-events */
import { formatDate, formatDateNoTime } from '@lib/date';
import {
  Col, Descriptions, message, Modal, Select, Spin
} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CalendarOutlined, ArrowRightOutlined, MessageOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { scheduleService } from '@services/schedule.service';
import { getResponseError } from '@lib/utils';
import router from 'next/router';

const { Item } = Descriptions;
interface Props {
  data: any[];
  // eslint-disable-next-line react/require-default-props
  title?: string;
}
export default function BookingList({
  data,
  title = 'Upcoming Booking'
}: Props) {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const handleItemClick = async (id: string) => {
    try {
      setIsVisible(true);
      setIsLoading(true);
      const resp = await scheduleService.performerFindOneBooking(id);
      setCurrentBooking(resp.data);
    } catch (error) {
      const err = await Promise.resolve(error);
      message.error(getResponseError(err));
    } finally {
      setIsLoading(false);
    }
  };
  const acceptBooking = async (id) => {
    if (!window.confirm('Confirm this booking?')) {
      return;
    }
    try {
      setIsLoading(true);
      await scheduleService.AcceptedBooking(id);
      handleItemClick(currentBooking._id);
      message.success('Booking is accepted');
    } catch (e) {
      message.error('An error occurred, please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  const rejectBooking = async (id) => {
    if (!window.confirm('Reject this reservation?')) {
      return;
    }
    try {
      setIsLoading(true);
      await scheduleService.rejectBooking(id);
      handleItemClick(currentBooking._id);
      message.success('Booking is rejected');
    } catch (e) {
      message.error('An error occurred, please try again!');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Col span={24} md={12} style={{ margin: '0 -5px' }}>
        <div className="booking-container">
          <div className="booking-title">
            <div>
              <CalendarOutlined />
              <span>{title}</span>
            </div>
            <div className="booking-title-right">{`${data.length} Bookings`}</div>
          </div>
          <div id="scrollableDiv">
            <InfiniteScroll
              dataLength={data.length}
              loader={<Spin />}
              next={() => {}}
              hasMore={false}
              height="100%"
              style={{
                overflow: 'hidden',
                width: '100%'
              }}
              scrollableTarget="scrollableDiv"
              className="scrollContent"
            >
              {data.length > 0
                && data?.map((item) => (
                  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                  <div
                    className="booking-item"
                    key={item._id}
                    onClick={() => handleItemClick(item._id)}
                  >
                    <div className="booking-item-content">
                      <div className="booking-item-avatar">
                        <img
                          src={item.sourceInfo.avatar || '/no-avatar.png'}
                          alt={`${item.sourceInfo.name}'s avatar`}
                        />
                      </div>
                      <div className="user-info">
                        <p>{item.sourceInfo.name || 'unknown'}</p>
                        <p>{`Booking on ${formatDateNoTime(item?.createdAt)}`}</p>
                      </div>
                    </div>
                    <div className="booking-item-action">
                      <ArrowRightOutlined color="white" />
                    </div>
                  </div>
                ))}
            </InfiniteScroll>
          </div>
        </div>
      </Col>
      <Modal
        title="Detail Booking"
        visible={isVisible}
        width={700}
        onOk={() => {
          router.push({
            pathname: '/messages',
            query: {
              toSource: 'user',
              toId: currentBooking.sourceInfo?._id || ''
            }
          });
          setIsVisible(false);
        }}
        onCancel={() => {
          setIsVisible(false);
        }}
        destroyOnClose
        okText={(
          <>
            Chat to user
            <MessageOutlined className="modal-chat-icon" />
          </>
)}
        cancelButtonProps={{ hidden: true }}
      >
        {loading ? (
          <Spin />
        ) : (
          <div className="main-container">
            <Descriptions title="Booking Info">
              <Item label="Start At">
                {currentBooking?.startAt
                  && formatDate(currentBooking.startAt, 'DD/MM/YYYY HH:mm')}
              </Item>
              <Item label="Duration">
                {currentBooking?.duration}
                {' '}
                minutes
              </Item>
              <Item label="Status">
                <Select
                  value={currentBooking?.status}
                  onSelect={(val) => {
                    if (val === 'accepted') acceptBooking(currentBooking._id);
                    if (val === 'rejected') rejectBooking(currentBooking._id);
                  }}
                >
                  <Select.Option value="accepted">Accepted</Select.Option>
                  <Select.Option value="rejected">Rejected</Select.Option>
                  <Select.Option value="created" disabled>
                    Created
                  </Select.Option>
                  <Select.Option value="pending" disabled>
                    Pending
                  </Select.Option>
                  <Select.Option value="paid" disabled>
                    Paid
                  </Select.Option>
                </Select>
              </Item>
              <Item label="Message">{currentBooking?.message}</Item>
            </Descriptions>
            <Descriptions title="Schedule Info">
              {currentBooking?.scheduleInfo?._id ? (
                <>
                  <Item label="Title">
                    {currentBooking?.scheduleInfo?.name}
                  </Item>
                  {/* <Item label="Price">{booking?.scheduleInfo?.price}</Item> */}
                  <Item label="Status">
                    {currentBooking?.scheduleInfo?.status}
                  </Item>
                  <Item label="Start At">
                    {currentBooking?.scheduleInfo?.startAt
                      && formatDate(
                        currentBooking?.scheduleInfo?.startAt,
                        'DD/MM/YYYY HH:mm'
                      )}
                  </Item>
                  <Item label="End At">
                    {currentBooking?.scheduleInfo?.endAt
                      && formatDate(
                        currentBooking?.scheduleInfo?.endAt,
                        'DD/MM/YYYY HH:mm'
                      )}
                  </Item>
                  <Item label="Description">
                    {currentBooking?.scheduleInfo?.description}
                  </Item>
                </>
              ) : (
                <p>Not Found</p>
              )}
            </Descriptions>
            <Descriptions title="User Info">
              <Item label="Username">
                {currentBooking?.sourceInfo?.name?.length > 0
                  ? currentBooking.sourceInfo.name
                  : currentBooking?.sourceInfo?.username}
              </Item>
              {/* <Item label="Email">{booking?.sourceInfo?.email}</Item> */}
            </Descriptions>
          </div>
        )}
      </Modal>
    </>
  );
}
