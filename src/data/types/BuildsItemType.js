/* eslint-disable no-use-before-define,no-nested-ternary */
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntegerType,
  GraphQLNonNull as NonNull,
  GraphQLScalarType
} from 'graphql';

import { Kind } from 'graphql/language';

const ObjectScalarType = new GraphQLScalarType({
  name: 'Object',
  description: 'Arbitrary object',
  parseValue: value =>
    typeof value === 'object'
      ? value
      : typeof value === 'string'
        ? JSON.parse(value)
        : null,
  serialize: value =>
    typeof value === 'object'
      ? value
      : typeof value === 'string'
        ? JSON.parse(value)
        : null,
  parseLiteral: ast => {
    switch (ast.kind) {
      case Kind.STRING:
        return JSON.parse(ast.value);
      case Kind.OBJECT:
        throw new Error(`Not sure what to do with OBJECT for ObjectScalarType`);
      default:
        return null;
    }
  }
});

const BuildsItemType = new ObjectType({
  name: 'BuildsItem',
  fields: {
    title: { type: new NonNull(StringType) },
    coriolisShip: { type: ObjectScalarType },
    description: { type: new NonNull(StringType) },
    author: { type: StringType },
    Modules: { type: ObjectScalarType },
    createdAt: { type: new NonNull(StringType) },
    id: { type: new NonNull(StringType) },
    likes: { type: new NonNull(IntegerType) },
    shortid: { type: new NonNull(StringType) }
  }
});

export default BuildsItemType;
