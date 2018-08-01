import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import UiButton from './UiButton';
import VoteCounter from './VoteCounter';
import request from 'superagent';

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
      shipId: this.props.id,
      vote: e.target.id === 'upvote' ? 1 : -1
    };
    const data = await request
      .post(`/api/likes`)
      .send(vote)
    this.setState({ likes: data.body.count });
  }

  render() {
    this.toggle = this.toggle.bind(this);
    this.updateLikes = this.updateLikes.bind(this);
    return (
      <div>
        <span>
          <a href={this.props.coriolisLink} target="_blank" rel='noopener' title="Edit build on coriolis">
            <svg className="icon icon xl"
                 viewBox="0 0 32 32"><g
              transform="translate(1,1)">
            <path stroke="#0a8bd6" transform="rotate(45 15 15)"
                  d="m4,4 l 11,-4 l 11,4 l 4,11 l -4,11 l -11,4 l -11,-4 l -4,-11 l 4,-11 l 22,0 l 0,22 l -22,0 z"
                  strokeWidth="1" fill="#000000"/>
            <rect height="3" width="10" y="13.5"
                  x="10" strokeWidth="1"
                  stroke="#0a8bd6"/>
          </g>
          </svg>
          </a>
        </span>
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
        <VoteCounter text="votes" number={this.state.likes}/>
      </div>
    );
  }
}
