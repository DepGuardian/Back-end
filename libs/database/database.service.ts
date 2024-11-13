import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Connection } from 'mongoose';

@Injectable()
export class DatabaseConnectionService {
  private readonly logger = new Logger(DatabaseConnectionService.name);
  private readonly connections: Map<string, Connection> = new Map();
  private readonly generalConnection: Connection;

  constructor(private configService: ConfigService) {
    // Inicializar la conexión general
    const uri = this.configService.get<string>('MONGODB_URI');
    this.generalConnection = mongoose.createConnection(uri, {
      dbName: 'general',
    });
  }

  private async doesTenantExist(tenantId: string): Promise<boolean> {
    try {
      // Usar el comando listDatabases para verificar si la base de datos existe
      const admin = this.generalConnection.db.admin();
      const result = await admin.listDatabases();
      const dbName = `tenant_${tenantId}`;

      return result.databases.some((db) => db.name === dbName);
    } catch (error) {
      this.logger.error(`Error checking tenant existence: ${error.message}`);
      throw error;
    }
  }

  async getConnection(tenantId: string): Promise<Connection> {
    // Verificar si ya existe una conexión activa
    if (this.connections.has(tenantId)) {
      const connection = this.connections.get(tenantId);
      if (connection.readyState === 1) {
        // Connected
        return connection;
      }
      this.connections.delete(tenantId);
    }

    try {
      // Verificar si el tenant existe antes de crear la conexión
      const tenantExists = await this.doesTenantExist(tenantId);

      if (!tenantExists) {
        throw new NotFoundException(
          `Tenant database ${tenantId} does not exist`,
        );
      }

      const uri = this.configService.get<string>('MONGODB_URI');
      const connection = await mongoose.createConnection(uri, {
        dbName: `tenant_${tenantId}`,
        autoCreate: true, // Desactivar la creación automática
      });

      // Configurar los event listeners
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
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to connect to tenant database ${tenantId}:`,
        error,
      );
      throw new Error(`Failed to connect to tenant database: ${error.message}`);
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
    await this.generalConnection.close();
    for (const [tenantId] of this.connections) {
      await this.closeConnection(tenantId);
    }
  }

  // Método para crear un nuevo tenant (uso administrativo)
  async createTenant(tenantId: string): Promise<void> {
    try {
      const tenantExists = await this.doesTenantExist(tenantId);

      if (tenantExists) {
        throw new Error(`Tenant ${tenantId} already exists`);
      }

      const uri = this.configService.get<string>('MONGODB_URI');
      const tempConnection = await mongoose.createConnection(uri, {
        dbName: `tenant_${tenantId}`,
        autoCreate: true,
      });

      // Crear las colecciones necesarias aquí
      // await tempConnection.createCollection('users');
      // await tempConnection.createCollection('other_collection');

      await tempConnection.close();
    } catch (error) {
      this.logger.error(`Failed to create tenant ${tenantId}:`, error);
      throw error;
    }
  }
}
