import React, {Component} from 'react';
import cx from 'classnames';
import {Link} from 'react-router-dom';
import * as Svg from '../common/Svg';
import {setCookie, getCookie, deleteCookie} from '../../common/utils';

export default class Navigation extends Component {
	constructor() {
		super();
		this.state = {
			loggedIn: Boolean(getCookie('accessToken')),
			user: {
				username: getCookie('username') || undefined
			}
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
			this.setState({loggedIn: true, user: json.user});
			setCookie('accessToken', json.accessToken);
			setCookie('admin', json.admin);
			setCookie('username', json.user.username);
		} else {
			setCookie('admin', json.admin);
			this.setState({loggedIn: false});
		}
	}

	logout() {
		return fetch('/api/logout', {
			method: 'GET',
			credentials: 'include'
		}).then(() => this.setState({loggedIn: false}));
	}

	render() {
		return (
			<div className="navigation-container">
				<div hidden={this.state.loggedIn} className={cx('r', 'menu')}>
					<div className={cx(['menu-header'])}>
						<span>
							<Link to="/login">
								<Svg.Login className="xl warning"/>
							</Link>
							<Link className={cx(['menu-item-label'])} to="/login">
							Log in
							</Link>
						</span>
					</div>
				</div>
				<div hidden={this.state.loggedIn} className={cx('r', 'menu')}>
					<div className={cx(['menu-header'])}>
						<span>
							<Link to="/register">
								<Svg.Logout className="xl secondary"/>
							</Link>
							<Link className={cx(['menu-item-label'])} to="/register">
							Sign up
							</Link>
						</span>
					</div>
				</div>
				<div hidden={!this.state.loggedIn} className={cx('r', 'menu')}>
					<div className={cx(['menu-header'])}>
						<span>
							<a href="/api/logout">
								<Svg.Logout className="xl warning"/>
							</a>
							<a className={cx(['menu-item-label'])} href="/api/logout">
							Log out
							</a>
						</span>
					</div>
				</div>
				<div hidden={!this.state.user} className={cx('r', 'menu')}>
					<div className={cx(['menu-header'])}>
						<span>
							<Link className={cx(['menu-item-label'])} to={`/profile/${this.state.user.username}`}>
							My profile
							</Link>
						</span>
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
