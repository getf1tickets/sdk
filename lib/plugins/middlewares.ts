import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import fp from 'fastify-plugin';
import _ from 'lodash';
import to from 'await-to-js';
import { validate as validateUuid } from 'uuid';
import { User } from '@/models/user';

export interface Middlewares {
  useUser: (options?: UserMiddlewareOptions) => (
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction,
  ) => Promise<void>
}

export interface UserMiddlewareOptions {
  useAuth?: boolean;
  paramKey?: string;
  decorateRequest?: boolean;
}

export default fp(async (fastify) => {
  const useUser = (opts: UserMiddlewareOptions = {}) => {
    const options = _.defaults(
      opts,
      {
        useAuth: true,
        paramKey: 'id',
        decorateRequest: true,
      },
    );

    return async (request: FastifyRequest) => {
      if (!options.paramKey || !request.params[options.paramKey]) {
        throw fastify.httpErrors.badRequest(`Missing parameter: ${options.paramKey} from query`);
      }

      const requestedUserId = request.params[options.paramKey];

      if (requestedUserId !== '@me') {
        if (!validateUuid(requestedUserId)) {
          throw fastify.httpErrors.badRequest(`Incorrect parameter: ${options.paramKey} from query`);
        }
      }

      if (options.useAuth) {
        if (!request.authEntity || !request.authEntity.id) {
          throw fastify.httpErrors.unauthorized();
        }

        if (requestedUserId !== '@me') {
          if (requestedUserId !== request.authEntity.id) {
            throw fastify.httpErrors.unauthorized();
          }
        }
      }

      if (options.decorateRequest) {
        const [err, user] = await to<User>(User.findOne({
          where: {
            id: requestedUserId !== '@me' ? requestedUserId : request.authEntity.id,
          },
        }));

        if (err) {
          fastify.log.error(err);
          throw fastify.httpErrors.internalServerError();
        }

        if (!user) {
          throw fastify.httpErrors.internalServerError();
        }

        request.user = user;
      }
    };
  };

  fastify.decorate('middlewares', {
    useUser,
  });
}, { name: 'sdk-middlewares' });
