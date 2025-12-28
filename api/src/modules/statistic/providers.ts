import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import { ViewPerformerMonthlyStatsSchema } from './schemas/view-performer-monthly-stats.schema';

export const VIEW_PERFORMER_MONTHLY_STATS_MODEL_PROVIDER = 'VIEW_PERFORMER_MONTHLY_STATS_MODEL_PROVIDER';

export const performerStatsProviders = [
  {
    provide: VIEW_PERFORMER_MONTHLY_STATS_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('ViewPerformerMonthlyStats', ViewPerformerMonthlyStatsSchema),
    inject: [MONGO_DB_PROVIDER]
  }
];
