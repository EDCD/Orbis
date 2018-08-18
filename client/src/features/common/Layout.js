import React, {Component} from 'react';
import {Header, Footer} from './index';
import PropTypes from 'prop-types';
import {deleteCookie, setCookie} from '../../common/utils';

export default class Layout extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			announcements: []
		};
		this.getAnnouncements = this.getAnnouncements.bind(this);
		this.renderAnnouncements = this.renderAnnouncements.bind(this);
	}

	componentDidMount() {
		this.getAnnouncements();
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
		return this.state.announcements.map(announce => (
			<div className="announce">
				<span>{announce.message}</span>
			</div>
		));
	}

	render() {
		return (
			<div className="layout-container">
				<Header/>
				{this.renderAnnouncements()}
				{this.props.children}
				<Footer/>
			</div>
		);
	}
}
