import { Document } from 'mongoose';

export class SeoModel extends Document {
  title: string;

  description: string;

  path: string;

  metaKeywords: string;

  metaDescription: string;

  metaTitle: string;

  canonicalUrl: string;

  createdAt: Date;

  updatedAt: Date;
}
