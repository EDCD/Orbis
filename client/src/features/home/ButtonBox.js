import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import UiButton from './UiButton';
import VoteCounter from './VoteCounter';

export default class ButtonBox extends Component {
  static propTypes = {
    likeIsClicked: PropTypes.bool.isRequired,
    likes: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    loggedIn: PropTypes.bool.isRequired
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
          loggedIn={this.props.loggedIn}
          number={this.state.likes}
          onClick={this.updateLikes}
          isClicked={this.state.likeIsClicked}
        />
        <UiButton
          icon="↓"
          text="downvote"
          id="downvote"
          loggedIn={this.props.loggedIn}
          number={this.state.likes}
          onClick={this.updateLikes}
          isClicked={this.state.likeIsClicked}
        />
        <VoteCounter text="votes" number={this.state.likes} />
      </div>
    );
  }
}