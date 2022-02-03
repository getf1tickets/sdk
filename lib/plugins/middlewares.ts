import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import fp from 'fastify-plugin';
import _ from 'lodash';
import to from 'await-to-js';
import { validate as validateUuid } from 'uuid';
import { User, UserAddress } from '@/models/user';
import { Product, ProductImage, ProductTag } from '@/models/product';
import { UserInfo } from '@/models/user/info';

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
  shouldBeAdmin?: boolean;
  decorateRequest?: boolean;
  includeAddresses?: boolean;
  includeInfo?: boolean;
  useToken?: boolean;
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
        shouldBeAdmin: false,
        decorateRequest: true,
        includeInfo: true,
        includeAddresses: false,
        useToken: false,
      },
    );

    return async (request: FastifyRequest) => {
      let requestedUserId;

      if (!options.useToken) {
        if (!options.paramKey || !request.params[options.paramKey]) {
          throw fastify.httpErrors.badRequest(`Missing parameter: ${options.paramKey} from query`);
        }

        requestedUserId = request.params[options.paramKey];

        if (requestedUserId !== '@me') {
          if (!validateUuid(requestedUserId)) {
            throw fastify.httpErrors.badRequest(`Incorrect parameter: ${options.paramKey} from query`);
          }
        }
      } else {
        requestedUserId = '@me';
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
            (options.includeInfo && {
              model: UserInfo,
              as: 'info',
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

        if (options.shouldBeAdmin && !user.isAdmin) {
          throw fastify.httpErrors.unauthorized();
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
          order: [
            [{ model: ProductImage, as: 'images' }, 'createdAt', 'asc'],
          ],
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
