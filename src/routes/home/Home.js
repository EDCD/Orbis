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
      <div className={s.page}>
        <div className={s.container}>
          <h1>Latest builds</h1>
          {this.props.builds.map(item => (
            <div key={item.id} className={s.newsItem}>
              <h1 className={s.newsTitle}>
                <a href={`/build/${item.id}`}>{item.title}</a>
              </h1>
              <h3>{item.description}</h3>
              <hr />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
