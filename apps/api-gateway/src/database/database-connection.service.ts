import { Injectable } from '@nestjs/common';
import { Connection, createConnection, ConnectOptions } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConnectionService {
  private readonly connections: Map<string, Connection> = new Map();

  constructor(private readonly configService: ConfigService) {}

  async getConnection(tenantId: string): Promise<Connection> {
    try {
      // Si ya existe una conexión, la retornamos
      if (this.connections.has(tenantId)) {
        return this.connections.get(tenantId);
      }

      // Obtenemos la configuración base de MongoDB
      const mongoHost = this.configService.get<string>('MONGODB_HOST', 'mongodb');
      const mongoPort = this.configService.get<string>('MONGODB_PORT', '27017');
      
      // Construimos el URI específico para el tenant
      const uri = `mongodb://${mongoHost}:${mongoPort}/${tenantId}`;
      console.log(`Attempting to connect to database: ${uri}`);

      // Definimos las opciones de conexión correctamente tipadas
      const options: ConnectOptions = {
        autoCreate: true,
        autoIndex: true,
      };

      // Creamos la conexión con las opciones correctas
      const connection = createConnection(uri, options);
      
      // Esperamos a que la conexión esté lista
      connection.on('connected', () => {
        console.log(`Successfully connected to database for tenant: ${tenantId}`);
      });

      connection.on('error', (error) => {
        console.error(`MongoDB connection error for tenant ${tenantId}:`, error);
      });

      // Guardamos la conexión en el mapa
      this.connections.set(tenantId, connection);

      return connection;
    } catch (error) {
      console.error(`Failed to connect to database for tenant ${tenantId}:`, error);
      throw new Error(`Database connection failed for tenant ${tenantId}: ${error.message}`);
    }
  }

  async closeConnections(): Promise<void> {
    const closePromises = Array.from(this.connections.entries()).map(async ([tenantId, connection]) => {
      try {
        await connection.close();
        console.log(`Closed connection for tenant: ${tenantId}`);
      } catch (error) {
        console.error(`Error closing connection for tenant ${tenantId}:`, error);
      }
    });

    await Promise.all(closePromises);
    this.connections.clear();
  }
}

// Opcional: Tipos adicionales para mayor seguridad
interface DatabaseConfig {
  host: string;
  port: string;
  username?: string;
  password?: string;
}