/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import { GraphQLString, GraphQLNonNull } from 'graphql';

import { Ship } from '../models';
import BuildsItemType from '../types/BuildsItemType';

const build = {
  type: BuildsItemType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve(source, args) {
    return Ship.find({ where: { id: args.id } }).then(ships =>
      JSON.parse(JSON.stringify(ships))
    );
  }
};

export default build;
