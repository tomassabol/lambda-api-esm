'use strict';

/**
 * Lazy-load optional S3 peer dependency modules.
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

let s3ModulePromise;

export const loadS3 = () => {
  if (!s3ModulePromise) {
    s3ModulePromise = import('./s3-service.js');
  }
  return s3ModulePromise;
};
