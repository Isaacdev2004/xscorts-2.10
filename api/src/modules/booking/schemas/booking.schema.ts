import { Schema } from 'mongoose';
import { BOOKING_STATUS } from '../constants';

export const BookingSchema = new Schema({
  fromSourceId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  duration: {
    type: Number,
    default: 0
  },
  message: String,
  startAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  endAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  status: {
    type: String,
    default: BOOKING_STATUS.CREATED,
    index: true
  },
  scheduleId: { type: Schema.Types.ObjectId, index: true },
  targetId: { type: Schema.Types.ObjectId, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

BookingSchema.index({
  targetId: 1,
  createdAt: 1
});

BookingSchema.index({
  fromSourceId: 1,
  targetId: 1,
  status: 1
});
