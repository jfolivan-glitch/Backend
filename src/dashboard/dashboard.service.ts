import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DashboardService {
  constructor(private db: DatabaseService) {}

  async getAllData() {
    const pool = this.db.getPool();

    const [users] = await pool.query(`
      SELECT
        id,
        username,
        role,
        created_at
      FROM users
    `);

    const [candidates] = await pool.query(`
      SELECT
        id,
        name,
        position,
        party,
        description,
        created_at
      FROM candidates
    `);

    const [visualTraits] = await pool.query(`
      SELECT
        vt.id,
        vt.candidate_id,
        c.name AS candidate_name,
        vt.trait_name,
        vt.trait_value,
        vt.created_at
      FROM visual_traits vt
      JOIN candidates c ON vt.candidate_id = c.id
    `);

    const [scoring] = await pool.query(`
      SELECT
        s.id,
        s.candidate_id,
        c.name AS candidate_name,
        s.user_id,
        u.username,
        s.score,
        s.comments,
        s.created_at
      FROM scoring s
      JOIN candidates c ON s.candidate_id = c.id
      JOIN users u ON s.user_id = u.id
    `);

    return {
      users,
      candidates,
      visual_traits: visualTraits,
      scoring,
    };
  }
}