import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Connection } from 'mongoose';

@Injectable()
export class DatabaseConnectionService {
  private readonly logger = new Logger(DatabaseConnectionService.name);
  private readonly connections: Map<string, Connection> = new Map();

  constructor(private configService: ConfigService) {}

  async getConnection(tenantId: string): Promise<Connection> {
    if (this.connections.has(tenantId)) {
      const connection = this.connections.get(tenantId);
      if (connection.readyState === 1) { // Connected
        return connection;
      }
      // Si la conexión está cerrada, la eliminamos del map
      this.connections.delete(tenantId);
    }

    try {
      const uri = this.configService.get<string>('MONGODB_URI');
      const connection = await mongoose.createConnection(uri, {
        dbName: `tenant_${tenantId}`,
        autoCreate: true,
      });

      connection.on('connected', () => {
        this.logger.log(`Connected to tenant database: ${tenantId}`);
      });

      connection.on('error', (error) => {
        this.logger.error(`Connection error for tenant ${tenantId}:`, error);
      });

      connection.on('disconnected', () => {
        this.logger.warn(`Disconnected from tenant database: ${tenantId}`);
        this.connections.delete(tenantId);
      });

      this.connections.set(tenantId, connection);
      return connection;
    } catch (error) {
      this.logger.error(`Failed to connect to tenant database ${tenantId}:`, error);
      throw error;
    }
  }

  async closeConnection(tenantId: string): Promise<void> {
    const connection = this.connections.get(tenantId);
    if (connection) {
      await connection.close();
      this.connections.delete(tenantId);
    }
  }

  async closeAllConnections(): Promise<void> {
    for (const [tenantId, connection] of this.connections) {
      await this.closeConnection(tenantId);
    }
  }
}