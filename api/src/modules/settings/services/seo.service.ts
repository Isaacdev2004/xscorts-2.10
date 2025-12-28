import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PageableData, SearchRequest } from 'src/kernel';
import { SEO_PROVIDER } from '../providers';
import { SeoDto } from '../dtos';
import {
  SeoCreatePayload, SeoUpdatePayload
} from '../payloads';
import { SeoModel } from '../models/seo.model';

@Injectable()
export class SeoService {
  constructor(
    @Inject(SEO_PROVIDER)
    private readonly Seo: Model<SeoModel>
  ) { }

  public async findById(id: string | ObjectId): Promise<SeoDto> {
    const model = await this.Seo.findById(id);
    if (!model) return null;
    return new SeoDto(model.toObject());
  }

  public async create(payload: SeoCreatePayload): Promise<SeoDto> {
    const data = {
      ...payload,
      updatedAt: new Date(),
      createdAt: new Date()
    };
    const model = await this.Seo.create(data);
    return SeoDto.fromModel(model);
  }

  public async update(
    id: string | ObjectId,
    payload: SeoUpdatePayload
  ): Promise<SeoDto> {
    const model = await this.findById(id);
    if (!model) {
      throw new NotFoundException();
    }

    const data = {
      ...payload,
      updatedAt: new Date()
    } as any;
    return this.Seo.updateOne({ _id: id }, data) as any;
  }

  public async delete(id: string | ObjectId | SeoModel): Promise<boolean> {
    const model = id instanceof SeoModel ? id : await this.findById(id);
    if (!model) {
      throw new NotFoundException('Seo not found');
    }
    await this.Seo.deleteOne({ _id: id });
    return true;
  }

  // TODO - define category DTO
  public async search(
    req: SearchRequest
  ): Promise<PageableData<SeoDto>> {
    const query = {} as any;
    if (req.q) {
      const regex = { $regex: new RegExp(req.q.toLowerCase(), 'i') };
      query.$or = [
        {
          title: regex

        },
        {
          path: regex
        },
        {
          description: regex
        }
      ];
    }
    let sort = { createdAt: -1 } as any;
    if (req.sort && req.sortBy) {
      sort = {
        [req.sortBy]: req.sort
      };
    }
    const [data, total] = await Promise.all([
      this.Seo
        .find(query)
        .sort(sort)
        .limit(req.limit ? parseInt(req.limit as string, 10) : 10)
        .skip(parseInt(req.offset as string, 10)),
      this.Seo.countDocuments(query)
    ]);

    return {
      data: data.map((item) => new SeoDto(item)), // TODO - define mdoel
      total
    };
  }

  public async findByPath(path: string): Promise<Partial<SeoDto>> {
    const model = await this.Seo.findOne({ path });
    if (!model) return null;
    const dto = SeoDto.fromModel(model);
    return dto.toPublicResponse();
  }
}
