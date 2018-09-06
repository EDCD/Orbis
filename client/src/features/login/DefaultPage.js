import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from './redux/actions';
import Layout from '../common/Layout';

export class DefaultPage extends Component {
	static propTypes = {
		title: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false
		};
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

	componentDidMount() {
		this.checkLogged();
	}

	render() {
		return (
			<Layout>
				<div className="login-root">
					<div className="container">
						<h1>{this.props.title}</h1>
						<a href="/api/auth" className="button">
							Log in
						</a>
					</div>
				</div>
			</Layout>
		);
	}
}

/* istanbul ignore next */
function mapStateToProps(state) {
	return {
		login: state.login
	};
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({...actions}, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DefaultPage);
