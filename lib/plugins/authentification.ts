import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import _ from 'lodash';
import axios, { AxiosError, AxiosResponse } from 'axios';
import to from 'await-to-js';

export interface AuthenticationOptions {
  authenticationServer?: string;
  paths?: {
    token?: string;
    authorize?: string;
  }
}

export interface Authentication {
  authorize: () => (request: FastifyRequest) => Promise<void>;
}

export default fp<AuthenticationOptions>(async (fastify, opts) => {
  const options: AuthenticationOptions = _.defaults(opts, {
    authenticationServer: process.env.AUTH_SERVER_URL || 'http://localhost:3000',
    paths: {
      token: process.env.AUTH_SERVER_PATH_TOKEN || '/token',
      authorize: process.env.AUTH_SERVER_PATH_AUTHORIZE || '/authorize',
    },
  });

  fastify.log.debug('Fastify authentication with options: %O', options);

  const authorize = () => async (request: FastifyRequest) => {
    fastify.log.debug('Authorizing request');

    const {
      authorization,
    } = request.headers;

    if (!authorization) {
      throw fastify.httpErrors.unauthorized();
    }

    const [err, response] = await to<AxiosResponse, AxiosError>(axios.post(`${options.authenticationServer}${options.paths.authorize}`, null, {
      headers: {
        authorization: `${authorization}`,
        'content-type': 'application/json',
      },
    }));

    if (err) {
      if (err.response?.status === 401) {
        throw fastify.httpErrors.unauthorized();
      } else {
        fastify.log.error(err);
        throw fastify.httpErrors.internalServerError();
      }
    }

    request.user = response.data;
  };

  fastify.decorate('authentication', {
    authorize,
  });
}, { name: 'sdk-authentication' });
