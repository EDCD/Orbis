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
import s from './Tooltip.less';
import TranslatedComponent from '../TranslatedComponent';

class Tooltip extends TranslatedComponent {
  static propTypes = {
    rect: PropTypes.object.isRequired,
    options: PropTypes.object
  };

  static defaultProps = {
    options: {}
  };

  /**
   * Constructor
   * @param  {Object} props   React Component properties
   */
  constructor(props) {
    super(props);
    this.adjustDimensions = this.adjustDimensions.bind(this);
    this.state = this._initialDimensions(props);
  }

  /**
   * Get position and reset width/height
   * @param  {Object} props React Component properties
   * @return {Object}       Dimenions / state
   */
  _initialDimensions(props) {
    const { options, rect } = props;
    const orientation = options.orientation || 'n';
    let top;
    let left;

    switch (orientation) {
      case 's':
        top = Math.round(rect.top + rect.height);
        left = Math.round(rect.left + rect.width / 2);
        break;
      case 'n':
        top = Math.round(rect.top);
        left = Math.round(rect.left + rect.width / 2);
        break;
      case 'e':
        top = Math.round(rect.top + rect.height / 2);
        left = Math.round(rect.left + rect.width);
        break;
      case 'w':
        top = Math.round(rect.top + rect.height / 2);
        left = Math.round(rect.left);
    }

    return { top, left, arrLeft: left, width: null, height: null, orientation };
  }

  /**
   * Adjusts the position and size of the tooltip if its content
   * appear outside of the windows left or right border
   * @param  {DomElement} elem Tooltip contents container
   */
  adjustDimensions() {
    if (this.elem) {
      const o = this.state.orientation;
      const rect = this.elem.getBoundingClientRect();

      // Round widthand height to nearest even number to avoid translate3d text blur
      // caused by fractional pixels
      const width = Math.ceil(rect.width / 2) * 2;

      this.setState({
        width,
        height: Math.round(rect.height / 2) * 2
      });

      if (o == 'n' || o == 's') {
        const docWidth = document.documentElement.clientWidth;

        if (rect.left < 0) {
          this.setState({ left: Math.round(width / 4) * 2 });
        } else if (rect.left + width > docWidth) {
          this.setState({ left: docWidth - Math.round(width / 4) * 2 });
        }
      }
    }
  }

  /**
   *Potentially adjust component dimensions after mount
   */
  componentDidMount() {
    this.adjustDimensions();
  }

  /**
   * Reset width and height on propChange
   * @param  {Object} nextProps   Incoming/Next properties
   */
  componentWillReceiveProps(nextProps) {
    this.setState(this._initialDimensions(nextProps));
  }

  /**
   * Potentially adjust component dimensions on re-render
   */
  componentDidUpdate() {
    this.adjustDimensions();
  }

  /**
   * Renders the component
   * @return {React.Component} Tooltip
   */
  render() {
    if (!this.props.children) {
      // If no content is provided
      return null;
    }
    const { top, left, arrLeft, width, height, orientation } = this.state;

    return (
      <div style={{ fontSize: `${this.context.sizeRatio}em` }}>
        <div
          className={cx(`arr`, orientation)}
          style={{ top, left: arrLeft }}
        />
        <div
          className={cx(`tio`, orientation)}
          style={{ top, left, width, height }}
          ref={elem => (this.elem = elem)}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Tooltip);
