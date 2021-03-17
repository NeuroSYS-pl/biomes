import { Injectable, Logger } from '@nestjs/common';
import { createReadStream, WriteStream, existsSync, promises as fs } from 'fs';
import { createHash } from 'crypto';

@Injectable()
export class AssetFileSystem {
  readonly logger = new Logger(AssetFileSystem.name);

  async appendToStream(stream: WriteStream, filepath: string): Promise<void> {
    await new Promise((resolve, reject) => {
      createReadStream(filepath, { flags: 'r' })
        .once('error', reject)
        .once('end', resolve)
        .pipe(stream, { end: false });
    });
    this.logger.verbose(
      `Appended "${filepath}" to the stream "${stream.path}"`,
    );
  }

  async deleteFile(filepath: string): Promise<void> {
    if (existsSync(filepath)) {
      await fs.unlink(filepath);
      this.logger.verbose(`Deleted file: ${filepath}`);
    }
  }

  async calculateHash(filepath: string): Promise<string> {
    const hash = createHash('sha256');
    await new Promise((resolve, reject) => {
      createReadStream(filepath, { flags: 'r' })
        .once('error', reject)
        .once('end', resolve)
        .pipe(hash);
    });
    const result = hash.digest('hex');
    this.logger.verbose(`Calculated sha256 for "${filepath}": ${result}`);
    return result;
  }

  async calculateAssetSize(filepath: string): Promise<number> {
    if (existsSync(filepath)) {
      const stat = await fs.stat(filepath);
      return stat.size;
    }
    return 0;
  }
}
