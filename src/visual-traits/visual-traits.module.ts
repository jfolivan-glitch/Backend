import { Module } from '@nestjs/common';
import { VisualTraitsService } from './visual-traits.service';
import { VisualTraitsController } from './visual-traits.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [VisualTraitsController],
  providers: [VisualTraitsService],
  exports: [VisualTraitsService],
})
export class VisualTraitsModule {}