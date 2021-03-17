import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { IBiomeRepository, BiomeDTO, BiomeAggregate, Query } from '../domain';
import { BiomeMapping } from './biome.mapping';
import { BiomeQueryBuilder } from './biome.query-builder';

@Injectable()
export class BiomeRepository implements IBiomeRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapping: BiomeMapping,
    private readonly queryBuilder: BiomeQueryBuilder,
  ) {}

  async getOne(query: Query.BiomeSelector): Promise<BiomeDTO> {
    const biome = await this.prisma.client.biomes.findFirst({
      where: this.queryBuilder.first(query),
      include: { habitats: true },
    });

    if (!biome) {
      throw new NotFoundException();
    }

    return this.mapping.mapEntityToDTO(biome);
  }

  async getMany(query: Query.BiomeFilter): Promise<BiomeDTO[]> {
    const biomes = await this.prisma.client.biomes.findMany({
      where: this.queryBuilder.many(query),
      include: { habitats: true },
    });
    return biomes.map(this.mapping.mapEntityToDTO);
  }

  async getAll(): Promise<BiomeDTO[]> {
    const biomes = await this.prisma.client.biomes.findMany({
      include: { habitats: true },
    });
    return biomes.map(this.mapping.mapEntityToDTO);
  }

  async hasBiome(query: Query.BiomeFilter): Promise<boolean> {
    const biomes = await this.prisma.client.biomes.count({
      where: this.queryBuilder.many(query),
    });
    return biomes > 0;
  }

  async create(aggregate: BiomeAggregate): Promise<BiomeDTO> {
    const data = this.mapping.mapAggregateToCreateEntity(aggregate);
    const response = await this.prisma.client.biomes.create({
      data,
      include: { habitats: true },
    });
    return this.mapping.mapEntityToDTO(response);
  }

  async update(aggregate: BiomeAggregate): Promise<BiomeDTO> {
    const data = this.mapping.mapAggregateToUpdateEntity(aggregate);
    const response = await this.prisma.client.biomes.update({
      data,
      where: { uuid: aggregate.id() },
      include: { habitats: true },
    });
    return this.mapping.mapEntityToDTO(response);
  }

  async delete(aggregate: BiomeAggregate): Promise<void> {
    await this.prisma.client.biomes.delete({
      where: { uuid: aggregate.id() },
    });
  }
}
