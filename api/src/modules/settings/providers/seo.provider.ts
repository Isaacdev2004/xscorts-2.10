import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import { SeoSchema } from '../schemas';

export const SEO_PROVIDER = 'SEO_PROVIDER';

export const seoProviders = [
  {
    provide: SEO_PROVIDER,
    useFactory: (connection: Connection) => connection.model('Seo', SeoSchema),
    inject: [MONGO_DB_PROVIDER]
  }
];
