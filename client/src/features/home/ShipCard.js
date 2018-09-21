import React, {Component} from 'react';
import UiCard from './UiCard';
import PropTypes from 'prop-types';
import ButtonBox from './ButtonBox';
import request from 'superagent';

export default class ShipCard extends Component {
	static propTypes = {
		content: PropTypes.any.isRequired,
		likeIsClicked: PropTypes.bool.isRequired,
		loggedIn: PropTypes.bool.isRequired,
		coriolisLink: PropTypes.string.isRequired,
		likes: PropTypes.number.isRequired
	};

	render() {
		return (
			<div className="social-card">
				<UiCard content={this.props.content}/>
				<div className="line"/>
				<div style={{textAlign: 'right'}}>
					<ButtonBox
						likeIsClicked={this.props.likeIsClicked}
						loggedIn={this.props.loggedIn}
						id={this.props.content.id}
						coriolisLink={this.props.coriolisLink}
						likes={this.props.likes}
					/>
				</div>
			</div>
		);
	}
}
