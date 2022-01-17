import amqp from 'amqplib';
import { FastifyInstance } from 'fastify';

export type UUID = string;

export interface AuthEntity {
  id: UUID;
  email: string;
}

export interface AMQP {
  channel: amqp.Channel;
  publish: (destination: string, type: string, data?: object) => Promise<void>;
  createQueue: (routingKey: string, handler: QueueHandler) => Promise<void>;
}

export type QueueHandler = (fastify: FastifyInstance, type: string, data: object) => Promise<any>;
