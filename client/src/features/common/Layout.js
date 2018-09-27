import React, {Component} from 'react';
import {Header, Footer} from './index';
import PropTypes from 'prop-types';
import {autoBind} from 'react-extras';
import request from 'superagent';
import {deleteCookie, setCookie} from '../../common/utils';

export default class Layout extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			announcements: [],
			loggedIn: false
		};
		autoBind(this);
	}

	componentDidMount() {
		this.getAnnouncements();
		this.checkLogged();
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

	async getAnnouncements() {
		const res = await fetch('/api/announcement', {
			method: 'GET',
			credentials: 'include'
		});
		const json = await res.json();
		if (json) {
			this.setState({announcements: json});
		}
	}

	renderAnnouncements() {
		if (this.state.announcements.length === 0) {
			return (
				<div className="announce">
					<p>No announcements</p>
				</div>
			);
		}
		return this.state.announcements.map(announce => (
			<div key={announce.id} className="announce">
				<p>{announce.message}</p>
			</div>
		));
	}

	render() {
		return (
			<div className="layout-container">
				<Header loggedIn={this.state.loggedIn}/>
				<h1>Announcements</h1>
				<div className="announce-container">
					{this.renderAnnouncements()}
				</div>
				<hr/>
				{this.props.children}
				<Footer/>
			</div>
		);
	}
}
