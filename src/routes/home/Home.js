/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.less';
import ShipTable from '../../components/ShipTable/ShipTable';
import SocialCard from '../../components/ShipCard';

class Home extends React.Component {
  static propTypes = {
    builds: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        content: PropTypes.string
      })
    ).isRequired
  };

  render() {
    return (
      <div>
        <div>
          <h1>Latest builds</h1>
          {this.props.builds.map(e => {
            e.image = 'http://via.placeholder.com/500x400';
            e.content = 'some bollocks';
            return (
              <SocialCard
                key={e.id}
                content={e}
                likes={0}
                reposts={0}
                likeIsClicked={false}
                repostIsClicked={false}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
