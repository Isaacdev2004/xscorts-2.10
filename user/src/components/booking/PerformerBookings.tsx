import { getResponseError } from '@lib/utils';
import { scheduleService } from '@services/schedule.service';
import {
  Row, Spin, message
} from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import BookingList from './BookingList';

export default function PerformerBookings() {
  const [latestBookings, setLatestBookings] = useState([]);
  const [upComingBookings, setUpComingBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getData = async () => {
    try {
      setIsLoading(true);
      const latest = await scheduleService.performerFindBooking({
        limit: 0,
        offset: 0,
        sort: 'desc',
        sortBy: 'createdAt',
        startAt: (moment().add(-1, 'months')).toISOString(),
        endAt: (moment().add(-30, 'minutes')).toISOString()
      });
      setLatestBookings(latest.data.data);
      const upcoming = await scheduleService.performerFindBooking({
        limit: 0,
        offset: 0,
        sort: 'asc',
        sortBy: 'createdAt',
        startAt: moment().toISOString(),
        endAt: (moment().add(1, 'months')).toISOString()
      });
      setUpComingBookings(upcoming.data.data);
    } catch (error) {
      const err = await Promise.resolve(error);
      message.error(getResponseError(err));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <Row justify="space-between">
        {isLoading ? (
          <Spin />
        ) : (
          <>
            <BookingList data={latestBookings} title="Latest Bookings" />
            <BookingList data={upComingBookings} title="Upcoming Bookings" />
            {/* <BookingList data={upComingBookings} title="Upcoming Booking" /> */}
          </>
        )}
      </Row>
    </>
  );
}
