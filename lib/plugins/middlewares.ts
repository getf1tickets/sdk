import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import fp from 'fastify-plugin';
import _ from 'lodash';
import to from 'await-to-js';
import { validate as validateUuid } from 'uuid';
import { User, UserAddress } from '@/models/user';
import { Product, ProductImage, ProductTag } from '@/models/product';

export interface Middlewares {
  useUser: (options?: UserMiddlewareOptions) => (
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction,
  ) => Promise<void>,
  useProduct: (options?: ProductMiddlewareOptions) => (
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction,
  ) => Promise<void>,
}

export interface UserMiddlewareOptions {
  useAuth?: boolean;
  paramKey?: string;
  decorateRequest?: boolean;
  includeAddresses?: boolean;
}

export interface ProductMiddlewareOptions {
  paramKey?: string;
  decorateRequest?: boolean;
  includeImages?: boolean;
  includeTags?: boolean;
}

export default fp(async (fastify) => {
  const useUser = (opts: UserMiddlewareOptions = {}) => {
    const options = _.defaults(
      opts,
      {
        useAuth: true,
        paramKey: 'id',
        decorateRequest: true,
        includeAddresses: false,
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
          include: [
            (options.includeAddresses && {
              model: UserAddress,
              as: 'addresses',
            }),
          ].filter(Boolean),
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

  const useProduct = (opts: ProductMiddlewareOptions = {}) => {
    const options = _.defaults(
      opts,
      {
        paramKey: 'id',
        decorateRequest: true,
        includeImages: false,
        includeTags: false,
      },
    );

    return async (request: FastifyRequest) => {
      if (!options.paramKey || !request.params[options.paramKey]) {
        throw fastify.httpErrors.badRequest(`Missing parameter: ${options.paramKey} from query`);
      }

      const requestedProductId = request.params[options.paramKey];

      if (!validateUuid(requestedProductId)) {
        throw fastify.httpErrors.badRequest(`Incorrect parameter: ${options.paramKey} from query`);
      }

      if (options.decorateRequest) {
        const [err, product] = await to<Product>(Product.findOne({
          where: {
            id: requestedProductId,
          },
          include: [
            (options.includeImages && {
              model: ProductImage,
              as: 'images',
            }),
            (options.includeTags && {
              model: ProductTag,
              as: 'tags',
            }),
          ].filter(Boolean),
        }));

        if (err) {
          fastify.log.error(err);
          throw fastify.httpErrors.internalServerError();
        }

        if (!product) {
          throw fastify.httpErrors.notFound('Incorrect product: not found');
        }

        request.product = product;
      }
    };
  };

  fastify.decorate('middlewares', {
    useUser,
    useProduct,
  });
}, { name: 'sdk-middlewares' });
