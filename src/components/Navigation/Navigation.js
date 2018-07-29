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
import s from './Navigation.less';
import Link from '../Link';

class Navigation extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false
    };
  }

  componentDidMount() {
    this.checkLogged();
  }

  async checkLogged() {
    const res = await fetch('/api/checkauth', {
      method: 'GET',
      credentials: 'include'
    });
    const json = await res.json();
    if (json && json.status === 'Login successful!') {
      this.setState({ loggedIn: true });
    }
  }

  logout() {
    return fetch('/logout', {
      method: 'GET',
      credentials: 'include'
    }).then(() => this.setState({ loggedIn: false }));
  }

  render() {
    this.logout = this.logout.bind(this);
    return (
      <div>
        <div hidden={this.state.loggedIn} className={cx(s.r, s.menu)}>
          <div className={cx(s['menu-header'])}>
            <Link className={cx(s['menu-item-label'])} to="/login">
              Log in
            </Link>
          </div>
        </div>
        <div hidden={this.state.loggedIn} className={cx(s.r, s.menu)}>
          <div className={cx(s['menu-header'])}>
            <Link className={cx(s['menu-item-label'])} to="/register">
              Sign up
            </Link>
          </div>
        </div>
        <div hidden={!this.state.loggedIn} className={cx(s.r, s.menu)}>
          <div className={cx(s['menu-header'])}>
            <div onClick={this.logout} className={cx(s['menu-item-label'])}>
              Log out
            </div>
          </div>
        </div>
        <div className={cx(s.r)}>
          <div className={cx(s.r, s.menu)}>
            <div className={cx(s['menu-header'])}>
              <Link className={cx(s['menu-item-label'])} to="/contact">
                Contact
              </Link>
            </div>
          </div>
          <div className={cx(s.r, s.menu)}>
            <div className={cx(s['menu-header'])}>
              <Link className={cx(s['menu-item-label'])} to="/about">
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
