import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class ScoringService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createScore(
    candidate_id: number,
    user_id: number,
    score: number,
    comments?: string,
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      `INSERT INTO scoring
      (candidate_id, user_id, score, comments)
      VALUES (?, ?, ?, ?)`,
      [candidate_id, user_id, score, comments || null],
    );

    return {
      id: result.insertId,
      candidate_id,
      user_id,
      score,
      comments,
    };
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT
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
       JOIN users u ON s.user_id = u.id`,
    );

    return rows;
  }

  async getByCandidate(candidateId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT
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
       WHERE s.candidate_id = ?`,
      [candidateId],
    );

    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT *
       FROM scoring
       WHERE id = ?`,
      [id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Score not found');
    }

    return rows[0];
  }

  async updateScore(
    id: number,
    partial: {
      score?: number;
      comments?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.score !== undefined) {
      fields.push('score = ?');
      values.push(partial.score);
    }

    if (partial.comments !== undefined) {
      fields.push('comments = ?');
      values.push(partial.comments);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const sql = `
      UPDATE scoring
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteScore(id: number) {
    const [res] = await this.pool().execute(
      'DELETE FROM scoring WHERE id = ?',
      [id],
    );

    return (res as OkPacket).affectedRows > 0;
  }
}