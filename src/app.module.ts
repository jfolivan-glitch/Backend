import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CandidatesModule } from './candidates/candidates.module';
import { ScoringModule } from './scoring/scoring.module';
import { VisualTraitsModule } from './visual-traits/visual-traits.module';
import { DatabaseModule } from './database/database.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    CandidatesModule,
    ScoringModule,
    VisualTraitsModule,
    DashboardModule,
  ],
})
export class AppModule {}