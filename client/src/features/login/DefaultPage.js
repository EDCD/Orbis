import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from './redux/actions';
import Layout from '../common/Layout';
import request from 'superagent';
import {deleteCookie, setCookie} from '../../common/utils';

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
		const res = await request
			.get('/api/checkauth')
			.withCredentials();
		const json = res.body;
		if (json && json.status === 'Login successful!') {
			this.setState({loggedIn: true, user: json.user});
			setCookie('accessToken', json.accessToken);
			setCookie('admin', json.admin);
			setCookie('username', json.user.username);
		} else {
			setCookie('admin', json.admin);
			deleteCookie('accessToken');
			deleteCookie('admin');
			deleteCookie('username');
			this.setState({loggedIn: false});
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
