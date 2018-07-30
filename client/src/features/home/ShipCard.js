import React, { Component } from 'react';
import UiCard from './UiCard'
import ButtonBox from './ButtonBox'
export default class ShipCard extends Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  render() {
    return (
      <div className={'social-card'}>
        <UiCard content={this.props.content} />
        <div className={'line'} />
        <div style={{ textAlign: 'right' }}>
          <ButtonBox
            likeIsClicked={this.props.likeIsClicked}
            loggedIn={this.props.loggedIn}
            id={this.props.content.id}
            likes={this.props.likes}
          />
        </div>
      </div>
    );
  }
}
