import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  pool: mysql.Pool;

  async onModuleInit() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'mysql-38047cf7-aef-7818-d.sinacloud.com',
      port: +(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'yourpasswordhere',
      database: process.env.DB_NAME || 'defaultdb',
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0,
    });

    // optional: test connection
    const conn = await this.pool.getConnection();
    conn.release();
    console.log('MySQL pool created');
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  getPool() {
    return this.pool;
  }
}
