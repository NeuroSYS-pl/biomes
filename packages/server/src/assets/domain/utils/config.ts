import { Injectable } from '@nestjs/common';

@Injectable()
export class AssetConfig {
  readonly uploadTimeout = 15 * 60 * 1000;
}
