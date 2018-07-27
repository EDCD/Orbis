/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List, GraphQLNonNull, GraphQLString } from 'graphql';
import { Ship } from '../models';
import BuildsItemType from '../types/BuildsItemType';

const builds = {
  type: new List(BuildsItemType),
  args: {
    filter: {
      type: GraphQLString
    },
    order: {
      type: GraphQLString
    }
  },
  resolve(source, args) {
    if (args.filter) {
    }
    let field;
    let order;
    if (args.order) {
      [field, order] = args.order.split(' ');
      console.log(field);
      console.log(order);
    }
    return Ship.findAll({
      order: [[field || 'updatedAt', order || 'DESC']]
    }).then(ships => ships);
  }
};

export default builds;
