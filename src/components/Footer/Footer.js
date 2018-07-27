/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.less';
import Link from '../Link';

class Footer extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <span className={s.text}>© EDCD {new Date().getFullYear()}</span>
          <span className={s.spacer}>·</span>
          <Link className={s.link} to="/">
            Home
          </Link>
          <span className={s.spacer}>·</span>
          <Link className={s.link} to="/admin">
            Admin
          </Link>
          <span className={s.spacer}>·</span>
          <Link className={s.link} to="/privacy">
            Privacy
          </Link>
          <span className={s.spacer}>·</span>
          <a className={s.link} href="https://github.com/EDCD/orbis/issues/new">
            Report an issue
          </a>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Footer);
