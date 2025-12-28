import { Schema } from 'mongoose';

export const SeoSchema = new Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  path: {
    type: String,
    index: true,
    unique: true
  },
  metaKeywords: String,
  metaDescription: String,
  metaTitle: String,
  canonicalUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'seo'
});
