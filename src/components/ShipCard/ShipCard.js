/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import cx from 'classnames';
import s from './ShipCard.less';

import Link from '../Link';

class UiButton extends Component {
  static propTypes = {
    isClicked: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    number: PropTypes.number.isRequired
  };

  render() {
    const classes = cx(s['ui-button'], { clicked: this.props.isClicked });
    return (
      <button
        className={classes}
        id={this.props.text}
        onClick={this.props.onClick}
      >
        <span>{this.props.icon} </span>
      </button>
    );
  }
}

class VoteCounter extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired
  };

  render() {
    return <span id={this.props.text}>{this.props.number}</span>;
  }
}

class ButtonBox extends React.Component {
  static propTypes = {
    likeIsClicked: PropTypes.bool.isRequired,
    likes: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      likeIsClicked: props.likeIsClicked,
      shake: false,
      likes: this.props.likes
    };
  }

  toggle(index) {
    const state = {};
    state[index] = !this.state[index];
    this.setState(state, () => {
      this.updateLikes(index);
    });
  }

  async updateLikes(e) {
    const vote = {
      type: e.target.id === 'upvote' ? 1 : -1,
      shipId: this.props.id
    };
    const data = await fetch(
      `/api/likes/updatevote/${vote.type}/${vote.shipId}`,
      {
        method: 'POST',
        body: JSON.stringify(vote),
        credentials: 'include'
      }
    );
    const json = await data.json();
    this.setState({ likes: json.count });
  }

  render() {
    this.toggle = this.toggle.bind(this);
    this.updateLikes = this.updateLikes.bind(this);
    return (
      <div>
        <UiButton
          icon="↑"
          text="upvote"
          id="upvote"
          number={this.state.likes}
          onClick={this.updateLikes}
          isClicked={this.state.likeIsClicked}
        />
        <UiButton
          icon="↓"
          text="downvote"
          id="downvote"
          number={this.state.likes}
          onClick={this.updateLikes}
          isClicked={this.state.likeIsClicked}
        />
        <VoteCounter text="votes" number={this.state.likes} />
      </div>
    );
  }
}

class UiCard extends Component {
  render() {
    const { image, tag, title, content, author } = this.props.content;
    return (
      <div className={s['ui-card']}>
        <div className={s['ui-card-img']}>
          <Link className={s.noDec} to={`/build/${this.props.content.shortid}`}>
            <img alt="" src={image} />
          </Link>
        </div>
        <div className={s['ui-card-content']}>
          <h5>{tag}</h5>
          <Link className={s.noDec} to={`/build/${this.props.content.shortid}`}>
            <h3>{title}</h3>
          </Link>
          <p>{content}</p>
          <p>- {author.username}</p>
        </div>
      </div>
    );
  }
}

export class SocialCard extends React.Component {
  render() {
    return (
      <div className={s['social-card']}>
        <UiCard content={this.props.content} />
        <div className={s.line} />
        <div style={{ textAlign: 'right' }}>
          <ButtonBox
            likeIsClicked={this.props.likeIsClicked}
            id={this.props.content.id}
            likes={this.props.likes}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(SocialCard);
