import fp from 'fastify-plugin';
import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';

export default fp(async (fastify) => {
  const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allErrors: true,
  });

  ajvFormats(ajv);
  ajvErrors(ajv, { singleError: true });

  fastify.setValidatorCompiler((opt) => ajv.compile(opt.schema) as any);
}, { name: 'sdk-avj' });
