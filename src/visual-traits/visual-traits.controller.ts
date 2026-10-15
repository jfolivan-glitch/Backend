import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { VisualTraitsService } from './visual-traits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('visual-traits')
export class VisualTraitsController {
  constructor(private visualTraitsService: VisualTraitsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.visualTraitsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('candidate/:candidateId')
  async getByCandidate(@Param('candidateId') candidateId: string) {
    return this.visualTraitsService.getByCandidate(+candidateId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.visualTraitsService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body()
    body: {
      candidate_id: number;
      trait_name: string;
      trait_value: string;
    },
  ) {
    return this.visualTraitsService.createTrait(
      body.candidate_id,
      body.trait_name,
      body.trait_value,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.visualTraitsService.updateTrait(+id, body);
  }
@Post()
async create(
  @Body()
  body: {
    candidate_id: number;
    trait_name: string;
    trait_value: string;
  },
) {
  return this.visualTraitsService.createTrait(
    body.candidate_id,
    body.trait_name,
    body.trait_value,
  );
}
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.visualTraitsService.deleteTrait(+id);
  }
}