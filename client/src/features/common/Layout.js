import React, {Component} from 'react';
import {Header, Footer} from './index';
import PropTypes from 'prop-types';

export default class Layout extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired
	};

	render() {
		return (
			<div className="layout-container">
				<Header/>
				{this.props.children}
				<Footer/>
			</div>
		);
	}
}
