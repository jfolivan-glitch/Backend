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
import { ScoringService } from './scoring.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('scoring')
export class ScoringController {
  constructor(private scoringService: ScoringService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.scoringService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('candidate/:candidateId')
  async getByCandidate(@Param('candidateId') candidateId: string) {
    return this.scoringService.getByCandidate(+candidateId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.scoringService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body()
    body: {
      candidate_id: number;
      user_id: number;
      score: number;
      comments?: string;
    },
  ) {
    return this.scoringService.createScore(
      body.candidate_id,
      body.user_id,
      body.score,
      body.comments,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.scoringService.updateScore(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.scoringService.deleteScore(+id);
  }
}