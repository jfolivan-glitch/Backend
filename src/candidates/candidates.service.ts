import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class CandidatesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createCandidate(
    name: string,
    position: string,
    party: string,
    description?: string,
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      `INSERT INTO candidates 
      (name, position, party, description) 
      VALUES (?, ?, ?, ?)`,
      [name, position, party, description || null],
    );

    return {
      id: result.insertId,
      name,
      position,
      party,
      description,
    };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT id, name, position, party, description, created_at
       FROM candidates
       WHERE id = ?`,
      [id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Candidate not found');
    }

    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT id, name, position, party, description, created_at
       FROM candidates`,
    );

    return rows;
  }

  async updateCandidate(
    id: number,
    partial: {
      name?: string;
      position?: string;
      party?: string;
      description?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.name) {
      fields.push('name = ?');
      values.push(partial.name);
    }

    if (partial.position) {
      fields.push('position = ?');
      values.push(partial.position);
    }

    if (partial.party) {
      fields.push('party = ?');
      values.push(partial.party);
    }

    if (partial.description !== undefined) {
      fields.push('description = ?');
      values.push(partial.description);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const sql = `
      UPDATE candidates
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteCandidate(id: number) {
    const [res] = await this.pool().execute(
      'DELETE FROM candidates WHERE id = ?',
      [id],
    );

    return (res as OkPacket).affectedRows > 0;
  }
}