import * as mongoose from 'mongoose';

export const MONGO_DB_PROVIDER = 'MONGO_DB_PROVIDER';

export const mongoDBProviders = [
  {
    provide: MONGO_DB_PROVIDER,
    useFactory: (): Promise<typeof mongoose> => {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost/xscorts';
      return mongoose.connect(mongoUri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
  }
];
