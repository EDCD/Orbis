import React, {Component} from 'react';
import {Header, Footer} from './index';
import PropTypes from 'prop-types';

export default class Layout extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false
		};
	}

	componentWillMount() {
		this.checkLogged();
	}

	async checkLogged() {
		const res = await fetch('/api/checkauth', {
			method: 'GET',
			credentials: 'include'
		});
		const json = await res.json();
		if (json && json.status === 'Login successful!') {
			this.setState({loggedIn: true});
		}
	}

	render() {
		return (
			<div>
				<Header/>
				{this.props.children}
				<Footer/>
			</div>
		);
	}
}
