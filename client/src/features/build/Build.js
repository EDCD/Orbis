import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Layout from '../common/Layout';
import * as actions from './redux/actions';
import ReactLoading from 'react-loading';
import IdealImage from 'react-ideal-image';
import {Modules} from 'coriolis-data/dist/index';
import {getLanguage} from '../../i18n/Language';
import {autoBind} from 'react-extras';

const {translate, formats, units} = getLanguage();

const whiteListProps = ['health', 'power', 'mass', ''];

/**
 * Finds the module with the specific group and ID
 * @param  {String} grp           Module group (pp - power plant, pl - pulse laser etc)
 * @param  {String} id            The module ID
 * @return {Object}               The module or null
 */
export function findModule(grp, id) {
	// See if it's a standard module
	if (Modules.standard[grp]) {
		let standardmod = Modules.standard[grp].find(e => e.id === id);
		if (standardmod !== null) {
			return standardmod;
		}
	}

	// See if it's an internal module
	if (Modules.internal[grp]) {
		let internalmod = Modules.internal[grp].find(e => e.id === id);
		if (internalmod !== null) {
			return internalmod;
		}
	}

	// See if it's a hardpoint module
	if (Modules.hardpoints[grp]) {
		let hardpointmod = Modules.hardpoints[grp].find(e => e.id === id);
		if (hardpointmod !== null) {
			return hardpointmod;
		}
	}

	return null;
}

export class Build extends Component {
	constructor(props) {
		super(props);
		this.state = {
			build: [],
			loggedIn: false,
			coriolisLink: ''
		};
		autoBind(this);
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

	getCoriolisLink() {
		return [
			'https://beta.coriolis.io/outfit/',
			this.state.build[0].coriolisShip.id,
			'?code=',
			'A',
			this.state.build[0].coriolisShip.serialized.standard,
			this.state.build[0].coriolisShip.serialized.hardpoints,
			this.state.build[0].coriolisShip.serialized.internal,
			'.',
			this.state.build[0].coriolisShip.serialized.enabled,
			'.',
			this.state.build[0].coriolisShip.serialized.priorities,
			'.',
			this.state.build[0].coriolisShip.serialized.modifications
		].join('');
	}

	async getData() {
		const resp = await fetch(`/api/builds/${this.props.match.params.id}`);
		const data = await resp.json();
		this.setState({build: [data]});
		if (!data) {
			throw new Error('Failed to load the builds feed.');
		}
	}

	componentDidMount() {
		this.checkLogged();
		this.props.actions.getBuild({id: this.props.match.params.id})
			.then(data => {
				return this.setState({build: [data]}, () => {
					this.setState({coriolisLink: this.state.build[0].url || this.getCoriolisLink()});
				});
			});
	}

	render() {
		return (
			<Layout>
				{this.state.build[0] ? (
					<div className="">
						<div className="build-header">
							<h1>
								Build: {this.state.build[0].title} by {this.state.build[0].author.username}
							</h1>
							<p>{this.state.build[0].description}</p>
							<IdealImage className="build-image"
								placeholder={{lqip: this.state.build[0].proxiedImage.replace('{OPTIONS}', '20x')}}
								shouldAutoDownload={() => true}
								height={250} width={400} srcSet={[
									{width: 200, src: this.state.build[0].proxiedImage.replace('{OPTIONS}', '200x125')},
									{width: 400, src: this.state.build[0].proxiedImage.replace('{OPTIONS}', '400x250')}
								]}/>
						</div>
						{this.state.build[0] && this.state.build[0].allowedToEdit ? (
							<Link to={`/build/${this.props.match.params.id}/edit`}>
								Edit Build Info
							</Link>
						) : ''}

						<br/>
						<a target="_blank" rel="noopener noreferrer" href={this.state.coriolisLink}>
							Edit Build on Coriolis
						</a>
						{this.state.build && this.state.build.length > 0 ? this.state.build.map(item => (
							<div key={item.id} className="build">
								<div className="build-details">
									<p>Armour: {Math.round(item.coriolisShip.armour)}</p>
									<p>Shield: {Math.round(item.coriolisShip.shield)} {units.MJ}</p>
									<p>Top Speed: {Math.round(item.coriolisShip.topBoost)} {units['m/s']}</p>
									<p>
										Hull Thermal Res:{' '}
										{Math.round(item.coriolisShip.hullThermRes * 100)}%
									</p>
									<p>
										Hull Explosive Res:{' '}
										{Math.round(item.coriolisShip.hullExplRes * 100)}%
									</p>
									<p>
										Hull Kinetic Res:{' '}
										{Math.round(item.coriolisShip.shieldKinRes * 100)}%
									</p>
									<p>
										Shield Thermal Res:{' '}
										{Math.round(item.coriolisShip.shieldThermRes * 100)}%
									</p>
									<p>
										Shield Explosive Res:{' '}
										{Math.round(item.coriolisShip.shieldExplRes * 100)}%
									</p>
									<p>
										Shield Kinetic Res:{' '}
										{Math.round(item.coriolisShip.shieldKinRes * 100)}%
									</p>
								</div>
								{item.coriolisShip.costList.map(module => {
									if (!module || !module.m || module.type === 'SHIP') {
										return null;
									}
									let mod = Object.assign({}, findModule(module.m.grp, module.m.id), module);
									console.log(mod);
									return (
										module && module.m ?
											<div className="module-container">
												<p>Module: {mod.class}{mod.rating} {mod.m.name || translate(mod.grp)}</p>
												<p>Enabled: {mod.enabled === 1 ? 'Yes' : 'No'}</p>
												{mod.power ? <p>Power usage: {mod.power}{units.MW}</p> : ''}
												{mod.mass ? <p>Mass: {mod.mass}{units.T}</p> : ''}
												{mod.priority ? <p>Priority: {mod.priority}</p> : ''}
												<p>Engineering: {mod.m.blueprint && mod.m.blueprint.name && mod.m.blueprint.grade ? `${mod.m.blueprint.name} @ grade ${mod.m.blueprint.grade}` : 'No engineering'}</p>
											</div> :
											''
									);
								}
								)}
							</div>
						)) : <ReactLoading type="cylon" color="#FF8C0D" height={50} width={50}/>}
					</div>
				) : <ReactLoading type="cylon" color="#FF8C0D" height={50} width={50}/>}
			</Layout>
		);
	}
}

/* istanbul ignore next */
function mapStateToProps(state) {
	return {
		build: state.build
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
)(Build);
