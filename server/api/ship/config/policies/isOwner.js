"use strict";

/**
 * `isOwner` policy.
 */

module.exports = async (ctx, next) => {
  const { role, id } = ctx.state.user;
  // console.log("id", id);
  // console.log("role", role);
  const fieldId = ctx.params.id;
  // console.log("fieldId", fieldId);
  if (typeof fieldId !== "undefined") {
    return strapi
      .query("ship")
      .findOne({ id: fieldId, owner: id })
      .then(async result => {
        console.log(result);
        if (result.owner.id !== id) {
          return ctx.unauthorized(
            "You are not allowed to perform this action."
          );
        }
        if (!result) {
          return ctx.unauthorized(
            "You are not allowed to perform this action."
          );
        }
        await next();
      });
  }
  await next();
};
