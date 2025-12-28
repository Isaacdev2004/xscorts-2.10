import { ObjectId } from 'mongodb';
import { pick } from 'lodash';

export class SeoDto {
  _id: ObjectId;

  title: string;

  path: string;

  metaKeywords: string;

  metaDescription: string;

  metaTitle: string;

  canonicalUrl: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(data: Partial<SeoDto>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'title',
        'path',
        'metaKeywords',
        'metaDescription',
        'metaTitle',
        'canonicalUrl',
        'createdAt',
        'updatedAt'
      ])
    );
  }

  public static fromModel(model): SeoDto {
    if (!model) return null;
    return new SeoDto(typeof model.toObject === 'function' ? model.toObject() : model);
  }

  public toPublicResponse() {
    return {
      path: this.path,
      metaKeywords: this.metaKeywords,
      metaDescription: this.metaDescription,
      metaTitle: this.metaTitle,
      canonicalUrl: this.canonicalUrl
    };
  }
}
