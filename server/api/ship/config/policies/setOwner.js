"use strict";

/**
 * `setOwner` policy.
 */

module.exports = async (ctx, next) => {
  const { id } = ctx.state.user;
  const { body } = ctx.request;

  body.owner = id.toString();

  await next();
};
