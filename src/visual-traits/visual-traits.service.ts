import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class VisualTraitsService {
  constructor(private db: DatabaseService) {}

  async createTrait(
    candidate_id: number,
    trait_name: string,
    trait_value: string,
  ) {
    const pool = this.db.getPool();

    const [result] = await pool.query(
      `INSERT INTO visual_traits
       (candidate_id, trait_name, trait_value)
       VALUES (?, ?, ?)`,
      [candidate_id, trait_name, trait_value],
    );

    return {
      message: 'Visual trait created successfully',
      id: (result as any).insertId,
    };
  }

  async findAll() {
    const pool = this.db.getPool();

    const [rows] = await pool.query(`
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

    return rows;
  }

  async findByCandidate(candidateId: number) {
    const pool = this.db.getPool();

    const [rows] = await pool.query(
      `
      SELECT
        vt.id,
        vt.candidate_id,
        c.name AS candidate_name,
        vt.trait_name,
        vt.trait_value,
        vt.created_at
      FROM visual_traits vt
      JOIN candidates c ON vt.candidate_id = c.id
      WHERE vt.candidate_id = ?
      `,
      [candidateId],
    );

    return rows;
  }

  async findOne(id: number) {
    const pool = this.db.getPool();

    const [rows] = await pool.query(
      `
      SELECT
        vt.id,
        vt.candidate_id,
        c.name AS candidate_name,
        vt.trait_name,
        vt.trait_value,
        vt.created_at
      FROM visual_traits vt
      JOIN candidates c ON vt.candidate_id = c.id
      WHERE vt.id = ?
      `,
      [id],
    );

    return (rows as any[])[0];
  }

  async updateTrait(
    id: number,
    trait_name: string,
    trait_value: string,
  ) {
    const pool = this.db.getPool();

    await pool.query(
      `
      UPDATE visual_traits
      SET trait_name = ?, trait_value = ?
      WHERE id = ?
      `,
      [trait_name, trait_value, id],
    );

    return {
      message: 'Visual trait updated successfully',
    };
  }

  async deleteTrait(id: number) {
    const pool = this.db.getPool();

    await pool.query(
      `DELETE FROM visual_traits WHERE id = ?`,
      [id],
    );

    return {
      message: 'Visual trait deleted successfully',
    };
  }
}