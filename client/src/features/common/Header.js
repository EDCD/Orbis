import React, {Component} from 'react';
import Navigation from './Navigation';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import logoUrl from './Orbis.png';
import * as Svg from './Svg';

export default class Header extends Component {
	static propTypes = {
		loggedIn: PropTypes.bool.isRequired
	};


	render() {
		return (
			<header className="header-container">
				<Link className="l" to="/">
					<Svg.OrbisIcon src={logoUrl} className="secondary xl" width="38px" height="38px" alt="Orbis.zone"/>
				</Link>
				<div className="l menu">
					<div className="menu-header">
						<Link className="menu-item-label" to="/">
							Orbis.zone
						</Link>
					</div>
				</div>
				<Navigation loggedIn={this.props.loggedIn}/>
			</header>
		);
	}
}
