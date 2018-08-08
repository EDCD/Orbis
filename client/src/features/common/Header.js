import React, {Component} from 'react';
import Navigation from './Navigation';
import {Link} from 'react-router-dom';
import logoUrl from './Orbis.png';

export default class Header extends Component {
	static propTypes = {};

	render() {
		return (
			<header>
				<Link className={'l'} to="/">
					<img src={logoUrl} width="38px" height="38px" alt="React"/>
				</Link>
				<div className={'l menu'}>
					<div className={'menu-header'}>
						<Link className={'menu-item-label'} to="/">
							Orbis.zone
						</Link>
					</div>
				</div>
				<Navigation/>
			</header>
		);
	}
}
