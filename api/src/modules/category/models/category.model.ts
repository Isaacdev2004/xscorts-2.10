import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export class CategoryModel extends Document {
  group: string;

  name: string;

  slug: string;

  description: string;

  status: string;

  ordering: number;

  metaTitle:string;

  metaKeywords:string;

  metaDescription:string;

  createdBy: ObjectId;

  updatedBy: ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
