import React, {Component} from 'react';
import {Header, Footer} from './index';
import PropTypes from 'prop-types';
import {deleteCookie, setCookie} from '../../common/utils';
import {autoBind} from 'react-extras';

export default class Layout extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			announcements: []
		};
		autoBind(this);
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
				<Header/>
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
