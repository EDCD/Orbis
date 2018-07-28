/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.less';
import Link from '../Link';
import Navigation from '../Navigation';
import logoUrl from './Orbis.png';

class Header extends React.Component {
  render() {
    return (
      <header>
        <Link className={s.l} to="/">
          <img src={logoUrl} width="38px" height="38px" alt="React" />
        </Link>
        <div className={cx(s.l, s.menu)}>
          <div className={cx(s['menu-header'])}>
            <Link className={cx(s['menu-item-label'])} to="/">
              Orbis.zone
            </Link>
          </div>
        </div>
        <Navigation />
      </header>
    );
  }
}

export default withStyles(s)(Header);
