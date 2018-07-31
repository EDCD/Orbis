import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class UiCard extends Component {
  static propTypes = {
    content: PropTypes.any.isRequired
  };
  render() {
    const { imageURL, tag, title, content, author } = this.props.content;
    return (
      <div className={'ui-card'}>
        <div className={'ui-card-img'}>
          <Link className={'noDec'} to={`/build/${this.props.content.shortid}`}>
            <img alt="" src={imageURL} />
          </Link>
        </div>
        <div className={'ui-card-content'}>
          <h5>{tag}</h5>
          <Link className={'noDec'} to={`/build/${this.props.content.shortid}`}>
            <h3>{title}</h3>
          </Link>
          <p>{content}</p>
          <p>- {author.username}</p>
        </div>
      </div>
    );
  }
}
