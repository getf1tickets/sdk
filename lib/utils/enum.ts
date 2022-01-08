import { stringIsNumber } from '@/utils/string';

// eslint-disable-next-line import/prefer-default-export
export const enumToArray = (en, values = false) => {
  const keys = Object.keys(en)
    .filter((x) => !stringIsNumber(x));
  return values ? keys.map((key) => en[key]) : keys;
};
