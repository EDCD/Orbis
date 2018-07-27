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
import s from './Build.less';

class Build extends React.Component {
  static propTypes = {
    build: PropTypes.any.isRequired
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            Build: {this.props.build[0].title} by {this.props.build[0].author}
          </h1>
          {this.props.build.map(item => (
            <article key={item.id} className={s.build}>
              <div>
                <div>
                  <p>Armour: {Math.round(item.coriolisShip.armour)}</p>
                  <p>Shield: {Math.round(item.coriolisShip.shield)}</p>
                  <p>Top Speed: {Math.round(item.coriolisShip.topBoost)}</p>
                  <p>
                    Hull Thermal Res:{' '}
                    {Math.round(item.coriolisShip.hullThermRes * 100)}%
                  </p>
                  <p>
                    Hull Explosive Res:{' '}
                    {Math.round(item.coriolisShip.hullExplRes * 100)}%
                  </p>
                  <p>
                    Hull Kinetic Res:{' '}
                    {Math.round(item.coriolisShip.shieldKinRes * 100)}%
                  </p>
                  <p>
                    Shield Thermal Res:{' '}
                    {Math.round(item.coriolisShip.shieldThermRes * 100)}%
                  </p>
                  <p>
                    Shield Explosive Res:{' '}
                    {Math.round(item.coriolisShip.shieldExplRes * 100)}%
                  </p>
                  <p>
                    Shield Kinetic Res:{' '}
                    {Math.round(item.coriolisShip.shieldKinRes * 100)}%
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Build);
