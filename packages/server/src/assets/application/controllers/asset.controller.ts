import * as nest from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenAuthGuard } from '../../../common/auth/auth.guard';
import { CreateFragmentInput } from '../interfaces/create-fragment.input';
import * as Commands from '../commands';

@nest.Controller('/api/asset')
export class AssetController {
  constructor(private readonly commandBus: CommandBus) {}

  @nest.Post('/upload')
  @nest.UseGuards(TokenAuthGuard)
  @nest.UsePipes(
    new nest.ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  )
  @nest.UseInterceptors(FileInterceptor('file'))
  async uploadFragment(
    @nest.Body() data: CreateFragmentInput,
    @nest.UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.commandBus.execute(
      new Commands.CreateFragmentCommand(data, file),
    );
  }
}
