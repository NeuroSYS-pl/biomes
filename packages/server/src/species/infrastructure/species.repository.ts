import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SpeciesDTO, ISpeciesRepository } from '../domain/interfaces';
import { SpeciesSelector, SpeciesFilter } from '../domain/interfaces/query';
import { SpeciesAggregate } from '../domain/aggregates';
import { SpeciesMapping } from './species.mapping';
import { SpeciesQueryBuilder } from './species.query-builder';

@Injectable()
export class SpeciesRepository implements ISpeciesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapping: SpeciesMapping,
    private readonly queryBuilder: SpeciesQueryBuilder,
  ) {}

  async getOne(query: SpeciesSelector): Promise<SpeciesDTO> {
    const species = await this.prisma.client.species.findUnique({
      where: this.queryBuilder.unique(query),
      include: { habitats: true, characteristics: true },
    });

    if (!species) {
      throw new NotFoundException();
    }

    return this.mapping.mapEntityToDTO(species);
  }

  async getMany(query: SpeciesFilter): Promise<SpeciesDTO[]> {
    const species = await this.prisma.client.species.findMany({
      where: this.queryBuilder.filter(query),
      include: { habitats: true, characteristics: true },
    });
    return species.map(s => this.mapping.mapEntityToDTO(s));
  }

  async getAll(): Promise<SpeciesDTO[]> {
    const species = await this.prisma.client.species.findMany({
      include: { habitats: true, characteristics: true },
    });
    return species.map(s => this.mapping.mapEntityToDTO(s));
  }

  async getInvalid(): Promise<SpeciesDTO[]> {
    const species = await this.prisma.client.species.findMany({
      where: {
        asset: {
          status: 'invalid',
          created: { lt: new Date(Date.now() - 30 * 1000) },
        },
      },
      include: { habitats: true, characteristics: true },
    });
    return species.map(s => this.mapping.mapEntityToDTO(s));
  }

  async getNotValid(): Promise<SpeciesDTO[]> {
    const species = await this.prisma.client.species.findMany({
      where: {
        asset: {
          status: { in: ['uploading', 'processing', 'invalid'] },
          created: { lt: new Date(Date.now() - 30 * 1000) },
        },
      },
      include: { habitats: true, characteristics: true },
    });
    return species.map(s => this.mapping.mapEntityToDTO(s));
  }

  async create(model: SpeciesAggregate): Promise<SpeciesDTO> {
    const data = this.mapping.mapModelToCreateEntity(model);
    const entity = await this.prisma.client.species.create({
      data,
      include: { habitats: true, characteristics: true },
    });

    return this.mapping.mapEntityToDTO(entity);
  }

  async update(aggregate: SpeciesAggregate): Promise<SpeciesDTO> {
    const previousEntity = await this.prisma.client.species.findUnique({
      where: { uuid: aggregate.id() },
      include: { habitats: true, characteristics: true },
    });

    const data = this.mapping.mapModelToUpdateEntity(aggregate, previousEntity);
    const nextEntity = await this.prisma.client.species.update({
      data,
      where: { uuid: aggregate.id() },
      include: { habitats: true, characteristics: true },
    });
    return this.mapping.mapEntityToDTO(nextEntity);
  }

  async delete(aggregate: SpeciesAggregate): Promise<void> {
    await this.prisma.client.$transaction([
      this.prisma.client.habitats.deleteMany({
        where: { speciesByUuid: aggregate.id() },
      }),
      this.prisma.client.species.delete({
        where: { uuid: aggregate.id() },
        include: { habitats: true },
      }),
    ]);
  }

  async deleteMany(aggregates: ReadonlyArray<SpeciesAggregate>): Promise<void> {
    await this.prisma.client.species.deleteMany({
      where: {
        uuid: { in: aggregates.map(agg => agg.id()) },
      },
    });
  }
}
