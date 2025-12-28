import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export class ViewPerformerMonthlyStatsModel extends Document {
  performerId: string | ObjectId;

  year: number;

  jan: number;

  feb: number;

  mar: number;

  apr: number;

  may: number;

  jun: number;

  jul: number;

  aug: number;

  sep: number;

  oct: number;

  nov: number;

  dev: number;
}
