import { PureComponent } from 'react';
import { message, Calendar, Tooltip } from 'antd';
import moment from 'moment';
import { scheduleService } from '@services/index';
import classNames from 'classnames';
import { ScheduleEventModal } from './schedule-event-modal';
import './schedule.less';

interface P { }

interface S {
  availableSlots: any;
  total: number;
  modalVisible: boolean;
  selectedDate: moment.Moment;
  visisbleDate: moment.Moment;
  submitting: boolean;
  success: boolean;
  mode: 'month' | 'year';
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export class MySchedules extends PureComponent<P, S> {
  constructor(props: P) {
    super(props);
    this.state = {
      availableSlots: [],
      total: null,
      success: false,
      modalVisible: false,
      selectedDate: moment(),
      visisbleDate: moment(),
      submitting: false,
      mode: 'month',
      startHour: moment().hour(),
      startMinute: moment().minute(),
      endHour: moment().hour(),
      endMinute: moment().minute()
    };
  }

  componentDidMount() {
    this.getAvailableSlots();
  }

  componentDidUpdate(_, prevState: S) {
    const { visisbleDate } = this.state;
    if (visisbleDate !== prevState.visisbleDate) {
      this.getAvailableSlots();
    }
  }

  onCalenderPanelChange(_, mode: 'month' | 'year') {
    this.setState({ mode });
    this.getAvailableSlots();
  }

  handleStartMinuteChange = (value) => {
    this.setState({ startMinute: value });
  }

  handleEndMinuteChange = (value) => {
    this.setState({ endMinute: value });
  }

  async onDeleteSlot(slotId: string) {
    const { availableSlots } = this.state;

    const slot = availableSlots.find((s) => s._id === slotId);
    if (!window.confirm('Are you sure you would like to remove this slot?')) return;
    if (slot.isBooked) {
      message.error(
        'This slot is already booked, could not delete at this time'
      );
      return;
    }
    try {
      this.setState({ submitting: true });
      await scheduleService.deleteSchedule(slotId);
      this.getAvailableSlots();
    } catch (e) {
      const err = await e;
      message.error(err.message || 'Error occurred, please try again later');
    } finally {
      this.setState({ submitting: false });
    }
  }

  async onSelectDate(date: moment.Moment) {
    const { mode } = this.state;
    if (mode === 'year') {
      return;
    }

    const currentDate = moment();
    if (moment(date).isBefore(currentDate, 'date')) {
      message.error('Please just schedule slot in the future time');
      return;
    }

    this.setState({ modalVisible: true, selectedDate: date });
  }

  async getAvailableSlots() {
    try {
      const { visisbleDate } = this.state;
      const resp = await (
        await scheduleService.performerGetSchedules({
          startAt: moment(moment(visisbleDate).subtract(1, 'month')).startOf('month').toISOString(),
          endAt: moment(moment(visisbleDate).add(1, 'month')).endOf('month').toISOString()
        })
      ).data;
      this.setState({ availableSlots: resp.data, total: resp.total });
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(error.message || 'Error occurred, please try again later');
    } finally {
      this.setState({ success: true });
    }
  }

  // eslint-disable-next-line react/sort-comp
  handleCloseModal() {
    this.setState({
      modalVisible: false
    });
  }

  async createNewSlot(data) {
    try {
      this.setState({ submitting: true });
      const { selectedDate, availableSlots } = this.state;
      // Lấy danh sách các khe hẹn cho ngày được chọn
      const selectedDateSlots = availableSlots
        .filter((s) => s._id !== data.editingSlot)
        .filter((slot) => moment(slot.startAt).isSame(selectedDate, 'day'));

      // Kiểm tra xem có khe hẹn nào trong khoảng thời gian đã chọn không
      const isSlotOverlap = selectedDateSlots.some((slot) => moment(data.startAt).isBetween(slot.startAt, slot.endAt, null, '[]')
        || moment(data.endAt).isBetween(slot.startAt, slot.endAt, null, '[]')
        || moment(slot.startAt).isBetween(data.startAt, data.endAt, null, '[]')
        || moment(slot.endAt).isBetween(data.startAt, data.endAt, null, '[]'));

      if (isSlotOverlap) {
        message.error('The slot duration overlaps with an existing one. Please review the schedule and try again.');
        return;
      }

      // Nếu không có khe hẹn nào chồng chéo, tiếp tục tạo mới hoặc cập nhật lịch
      if (data.editingSlot) {
        await scheduleService.updateSchedule(data.editingSlot, data);
      } else {
        await scheduleService.createSchedule(data);
      }

      message.success('Success');
      this.getAvailableSlots();
      this.setState({ modalVisible: false });
    } catch (e) {
      const err = await e;
      message.error(err.message || 'Error occurred, please try again later');
    } finally {
      this.setState({ submitting: false });
    }
  }

  dateSlotsRender(value) {
    const listData = this.renderSlots(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li
            key={item._id}
            className={
              item.type === 'success'
                ? 'event-status success'
                : 'event-status error'
            }
          >
            <Tooltip title={`${item.description || item.name}`}>
              {item.content}
            </Tooltip>
          </li>
        ))}
      </ul>
    );
  }

  disabledDate(date) {
    return moment(date).endOf('day').isBefore(moment());
  }

  renderSlots(value) {
    const { availableSlots } = this.state;
    const listData = availableSlots.map((slot) => {
      if (value.isSame(moment(slot.startAt), 'date')) {
        return {
          ...slot,
          type:
            !slot.isBooked && moment().isBefore(moment(slot.startAt))
              ? 'success'
              : 'error',
          content: `${moment(slot.startAt).format('HH:mm')} - ${moment(
            slot.endAt
          ).format('HH:mm')}`
        };
      }
      return slot;
    });
    return listData || [];
  }

  render() {
    const {
      modalVisible,
      selectedDate,
      visisbleDate,
      availableSlots,
      submitting,
      total,
      success
    } = this.state;
    return (
      <>
        <div style={{ marginBottom: '25px' }}>
          <div className="text-center" style={{ padding: '15px' }}>
            Booking Schedule Slot in
            {' '}
            {moment(visisbleDate).format('MMMM YYYY')}
            {' '}
            Select a date to begin.
            <br />
            {success && total === 0 && 'Select date to create new slot'}
          </div>
          <Calendar
            className="performer-calendar"
            dateFullCellRender={(date) => (
              <div
                className={classNames('ant-picker-cell-inner', 'ant-picker-calendar-date', {
                  'ant-picker-calendar-date-today': moment().isSame(date, 'date')
                })}
                onClick={() => {
                  !moment().isSame(date, 'date') && this.onSelectDate(date);
                }}
                aria-hidden="true"
              >
                <div className="ant-picker-calendar-date-value">
                  {moment(date).get('date')}
                </div>
                <div className="ant-picker-calendar-date-content">
                  {this.dateSlotsRender(date)}
                </div>
              </div>
            )}
            onChange={(date) => {
              this.setState({ visisbleDate: date });
            }}
            // value={visisbleDate}
            onPanelChange={this.onCalenderPanelChange.bind(this)}
            disabledDate={this.disabledDate.bind(this)}
            validRange={([moment().startOf('years'), moment().add(5, 'years').endOf('years')]) as any}
          />

          {selectedDate && (
            <ScheduleEventModal
              visible={modalVisible}
              onCancel={this.handleCloseModal.bind(this)}
              selectedDate={selectedDate}
              availableSlots={availableSlots}
              onSubmit={this.createNewSlot.bind(this)}
              submitting={submitting}
              onDeleteSlot={this.onDeleteSlot.bind(this)}
              wrapClassName="schedule-modal-wrapper"
            />
          )}
        </div>
      </>
    );
  }
}
