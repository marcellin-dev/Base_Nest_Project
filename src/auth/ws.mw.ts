import { Socket } from 'socket.io';
import { WsJwtGuard } from './ws-jwt/ws-jwt.guard';

export type SocketIOMiddleWare = {
  (socket: Socket, next: (err?: Error) => void): void;
};

export const SocketAuthMiddleware = (): SocketIOMiddleWare => {
  return (client, next) => {
    try {
      WsJwtGuard.validateToken(client);
      next();
    } catch (e) {
      next(e);
    }
  };
};
