'use strict';
/**
 * Lightweight web framework for your serverless applications
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as createSignedUrl } from '@aws-sdk/s3-request-presigner';
import { streamToBuffer } from './utils.js';

export let client = new S3Client();
export const setConfig = (config) => (client = new S3Client(config));

export const getObject = (params) => {
  return {
    promise: async () => {
      const res = await client.send(new GetObjectCommand(params));

      if (!res.Body) return res;

      return {
        ...res,
        Body: await streamToBuffer(res.Body),
      };
    },
  };
};

export const getSignedUrl = async (
  type,
  { Expires, ...params },
  callback = () => {}
) => {
  let command;
  switch (type) {
    case 'getObject':
      command = new GetObjectCommand(params);
      break;
    default:
      throw new Error('Invalid command type');
  }
  return createSignedUrl(client, command, { expiresIn: Expires })
    .then((url) => {
      callback(null, url);
      return url;
    })
    .catch((err) => {
      callback(err);
    });
};
