import * as mongoose from 'mongoose';

export const ViewPerformerMonthlyStatsSchema = new mongoose.Schema({
  performerId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  // store monthly view count number
  jan: {
    type: Number,
    default: 0
  },
  feb: {
    type: Number,
    default: 0
  },
  mar: {
    type: Number,
    default: 0
  },
  apr: {
    type: Number,
    default: 0
  },
  may: {
    type: Number,
    default: 0
  },
  jun: {
    type: Number,
    default: 0
  },
  jul: {
    type: Number,
    default: 0
  },
  aug: {
    type: Number,
    default: 0
  },
  sep: {
    type: Number,
    default: 0
  },
  oct: {
    type: Number,
    default: 0
  },
  nov: {
    type: Number,
    default: 0
  },
  dec: {
    type: Number,
    default: 0
  },
  year: Number
}, {
  collection: 'view_performer_monthly_stats'
});

ViewPerformerMonthlyStatsSchema.index({
  performerId: 1,
  year: 1
}, {
  unique: true
});
