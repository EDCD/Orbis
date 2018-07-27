/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List } from 'graphql';
import { Ship } from '../models';
import BuildsItemType from '../types/BuildsItemType';

const builds = {
  type: new List(BuildsItemType),
  resolve() {
    return Ship.findAll({ order: [['updatedAt', 'DESC']] }).then(
      ships => ships
    );
  }
};

export default builds;
