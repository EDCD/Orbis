import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class VoteCounter extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired
  };

  render() {
    return <span id={this.props.text}>{this.props.number}</span>;
  }
}