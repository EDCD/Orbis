import React, {Component} from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

export default class UiButton extends Component {
	static propTypes = {
		isClicked: PropTypes.bool.isRequired,
		text: PropTypes.string.isRequired,
		icon: PropTypes.string.isRequired,
		loggedIn: PropTypes.bool.isRequired,
		onClick: PropTypes.func.isRequired
	};

	render() {
		const classes = cx('ui-button', {clicked: this.props.isClicked});
		return (
			<button
				disabled={!this.props.loggedIn}
				className={classes}
				id={this.props.text}
				type="button"
				onClick={this.props.onClick}
			>
				{this.props.icon}
			</button>
		);
	}
}
