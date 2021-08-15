import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AssetStatus } from '@biomes/prisma';
import { PrismaService } from '../../common/prisma';
import { UUID } from '../../core';
import { AssetDTO, FragmentDTO, IAssetRepository } from '../domain/interfaces';
import { AssetAggregate, FragmentAggregate } from '../domain/aggregates';
import { AssetSelector, FragmentSelector } from '../domain/interfaces/query';
import { AssetMapping, FragmentMapping } from './mapping';
import { AssetQueryBuilder, FragmentQueryBuilder } from './query-builder';
import { AssetFileSystem } from './asset.fs';

@Injectable()
export class AssetRepository implements IAssetRepository {
  private readonly logger = new Logger(AssetRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fs: AssetFileSystem,
    private readonly assetMapping: AssetMapping,
    private readonly assetQuery: AssetQueryBuilder,
    private readonly fragmentMapping: FragmentMapping,
    private readonly fragmentQuery: FragmentQueryBuilder,
  ) {}

  async getOne(query: AssetSelector): Promise<AssetDTO> {
    const asset = await this.prisma.client.assets.findUnique({
      where: this.assetQuery.unique(query),
      include: { fragments: { select: { uuid: true } } },
    });

    if (!asset) {
      throw new NotFoundException();
    } else {
      return this.assetMapping.mapEntityToDTO(asset);
    }
  }

  async getOneFragment(query: FragmentSelector): Promise<FragmentDTO> {
    const fragment = await this.prisma.client.fragments.findUnique({
      where: this.fragmentQuery.unique(query),
    });

    if (!fragment) {
      throw new NotFoundException();
    } else {
      return this.fragmentMapping.mapEntityToDTO(fragment);
    }
  }

  async getAssetFragments(assetUUID: UUID): Promise<FragmentDTO[]> {
    const fragments = await this.prisma.client.fragments.findMany({
      where: { assetsByUuid: assetUUID },
    });

    return fragments.map(f => this.fragmentMapping.mapEntityToDTO(f));
  }

  async getAssetSize(query: AssetSelector): Promise<number> {
    const asset = await this.prisma.client.assets.findUnique({
      where: this.assetQuery.unique(query),
    });

    if (asset && asset.binary && asset.status === AssetStatus.ready) {
      const size = this.fs.calculateAssetSize(asset.binary);
      return size;
    }

    return 0;
  }

  async getInvalid(): Promise<AssetDTO[]> {
    const assets = await this.prisma.client.assets.findMany({
      where: { status: 'invalid' },
      include: {
        fragments: { select: { uuid: true } },
      },
    });
    return assets.map(asset => this.assetMapping.mapEntityToDTO(asset));
  }

  async getNotValid(): Promise<AssetDTO[]> {
    const assets = await this.prisma.client.assets.findMany({
      where: {
        status: { in: ['uploading', 'processing', 'invalid'] },
      },
      include: {
        fragments: { select: { uuid: true } },
      },
    });
    return assets.map(asset => this.assetMapping.mapEntityToDTO(asset));
  }

  async getOrphanedFragments(): Promise<FragmentDTO[]> {
    const fragments = await this.prisma.client.fragments.findMany({
      where: { assetsByUuid: null },
    });
    return fragments.map(f => this.fragmentMapping.mapEntityToDTO(f));
  }

  async createAsset(aggregate: AssetAggregate): Promise<AssetDTO> {
    const data = this.assetMapping.mapAggregateToCreateEntity(aggregate);
    const asset = await this.prisma.client.assets.create({
      data,
      include: {
        fragments: { select: { uuid: true } },
      },
    });
    return this.assetMapping.mapEntityToDTO(asset);
  }

  async updateAsset(aggregate: AssetAggregate): Promise<AssetDTO> {
    const prev = await this.prisma.client.assets.findUnique({
      where: { uuid: aggregate.id() },
    });

    const data = this.assetMapping.mapAggregateToUpdateEntity(aggregate);
    const asset = await this.prisma.client.assets.update({
      data,
      where: { uuid: aggregate.id() },
      include: {
        fragments: { select: { uuid: true } },
      },
    });

    if (data.binary !== prev.binary) {
      await this.fs.deleteFile(prev.binary);
    }

    return this.assetMapping.mapEntityToDTO(asset);
  }

  async deleteAsset(aggregate: AssetAggregate): Promise<void> {
    await this.prisma.client.assets.delete({
      where: { uuid: aggregate.id() },
    });

    if (aggregate.model.binary) {
      await this.fs.deleteFile(aggregate.model.binary);
    }
  }

  async deleteAssetFragments(aggregate: AssetAggregate): Promise<void> {
    const fragments = await this.prisma.client.fragments.findMany({
      where: { assetsByUuid: aggregate.id() },
    });

    const { count } = await this.prisma.client.fragments.deleteMany({
      where: { assetsByUuid: aggregate.id() },
    });

    if (count === fragments.length) {
      const filesToDelete = fragments
        .map(f => f.binary)
        .filter(binary => binary != null);
      await Promise.all(filesToDelete.map(file => this.fs.deleteFile(file)));
    } else {
      this.logger.error(
        `Deleted ${count} of ${fragments.length} Fragments.` +
          ' The related files WILL NOT be deleted!',
      );
    }
  }

  async createFragment(aggregate: FragmentAggregate): Promise<FragmentDTO> {
    const data = this.fragmentMapping.mapAggregateToEntity(aggregate);
    const fragment = await this.prisma.client.fragments.create({ data });
    return this.fragmentMapping.mapEntityToDTO(fragment);
  }

  async deleteFragment(aggregate: FragmentAggregate): Promise<void> {
    await this.prisma.client.fragments.delete({
      where: { uuid: aggregate.id() },
    });
    await this.fs.deleteFile(aggregate.model.binary);
  }
}
