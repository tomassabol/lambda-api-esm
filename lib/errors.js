'use strict';
/**
 * Lightweight web framework for your serverless applications
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

/*
  Custom error types
 */

export class RouteError extends Error {
  constructor(message, path) {
    super(message);
    this.name = 'RouteError';
    this.path = path;
  }
}

export class MethodError extends Error {
  constructor(message, method, path) {
    super(message);
    this.name = 'MethodError';
    this.method = method;
    this.path = path;
  }
}

export class ConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class ResponseError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ResponseError';
    this.code = code;
  }
}

export class ApiError extends Error {
  constructor(message, code, detail) {
    super(message);
    this.name = 'ApiError';
    this.code = typeof code === 'number' ? code : 500;
    if (detail !== undefined) {
      this.detail = detail;
    }
  }
}

export class FileError extends Error {
  constructor(message, err) {
    super(message);
    this.name = 'FileError';
    for (let e in err) this[e] = err[e];
  }
}
