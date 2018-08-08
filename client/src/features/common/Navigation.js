import React, {Component} from 'react';
import cx from 'classnames';
import {Link} from 'react-router-dom';

export default class Navigation extends Component {
	constructor() {
		super();
		this.state = {
			loggedIn: false
		};
	}

	componentDidMount() {
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

	logout() {
		return fetch('/api/logout', {
			method: 'GET',
			credentials: 'include'
		}).then(() => this.setState({loggedIn: false}));
	}

	render() {
		this.logout = this.logout.bind(this);
		return (
			<div>
				<div hidden={this.state.loggedIn} className={cx('r', 'menu')}>
					<div className={cx(['menu-header'])}>
						<Link className={cx(['menu-item-label'])} to="/login">
							Log in
						</Link>
					</div>
				</div>
				<div hidden={this.state.loggedIn} className={cx('r', 'menu')}>
					<div className={cx(['menu-header'])}>
						<Link className={cx(['menu-item-label'])} to="/register">
							Sign up
						</Link>
					</div>
				</div>
				<div hidden={!this.state.loggedIn} className={cx('r', 'menu')}>
					<div className={cx(['menu-header'])}>
						<a href="/api/logout">
							<div className={cx(['menu-item-label'])}>
								Log out
							</div>
						</a>
					</div>
				</div>
				<div className={cx('r')}>
					<div className={cx('r', 'menu')}>
						<div className={cx(['menu-header'])}>
							<Link className={cx(['menu-item-label'])} to="/contact">
								Contact
							</Link>
						</div>
					</div>
					<div className={cx('r', 'menu')}>
						<div className={cx(['menu-header'])}>
							<Link className={cx(['menu-item-label'])} to="/about">
								About
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
