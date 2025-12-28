import { IoAdapter } from '@nestjs/platform-socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import redisConfig from 'src/config/redis';

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    // Load redis config directly
    const redisAdapter = redisIoAdapter({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password
    });

    const server = super.createIOServer(port, options);
    server.adapter(redisAdapter);
    return server;
  }
}
