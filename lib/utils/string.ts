const crypto = require('crypto');

export const stringIsNumber = (value) => !Number.isNaN(Number(value));

export const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
