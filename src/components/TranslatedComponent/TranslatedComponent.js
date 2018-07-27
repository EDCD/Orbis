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
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { shallowEqual } from '../../utils/UtilityFunctions';
import s from './TranslatedComponent.less';
import Link from '../Link';

class TranslatedComponent extends React.Component {
  static contextTypes = {
    language: PropTypes.object.isRequired,
    sizeRatio: PropTypes.number.isRequired,
    openMenu: PropTypes.func.isRequired,
    closeMenu: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    tooltip: PropTypes.func.isRequired,
    termtip: PropTypes.func.isRequired,
    onWindowResize: PropTypes.func.isRequired
  };

  /**
   * Created an instance of a Translated Component. This is an abstract class.
   * @param  {object} props Properties
   */
  constructor(props) {
    super(props);
    this.didContextChange = this.didContextChange.bind(this);
    Object.getOwnPropertyNames(this.constructor.prototype).forEach(prop => {
      if (prop.charAt(0) == '_' && typeof this[prop] === 'function') {
        this[prop] = this[prop].bind(this);
      }
    });
  }

  /**
   * Determine if the context change incldues a language or size change
   * @param  {object} nextContext The incoming / next context
   * @return {boolean} true if the language has changed
   */
  didContextChange(nextContext) {
    return (
      nextContext.language !== this.context.language ||
      nextContext.sizeRatio != this.context.sizeRatio
    );
  }

  /**
   * Translated components are 'pure' components that only render when
   * props, state, or context changes. This method performs a shallow comparison to
   * determine change.
   *
   * @param  {object} nextProps   Next/Incoming Properties
   * @param  {objec} nextState    Next/Incoming State
   * @param  {objec} nextContext  Next/Incoming Context
   * @return {boolean}            True if props, state, or context has changed
   */
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState) ||
      this.didContextChange(nextContext)
    );
  }
}

export default withStyles(s)(TranslatedComponent);
