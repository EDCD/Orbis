import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Layout from '../common/Layout';
import * as actions from './redux/actions';
import ReactLoading from 'react-loading';
import IdealImage from 'react-ideal-image';

export class Build extends Component {
	constructor(props) {
		super(props);
		this.state = {
			build: [],
			loggedIn: false,
			coriolisLink: ''
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

	componentWillMount() {
		this.checkLogged();
		this.props.actions.getBuild({id: this.props.match.params.id})
			.then(data => {
				console.log(data)
				return this.setState({build: [data]}, () => {
					this.setState({coriolisLink: this.state.build[0].coriolisShip.url || this.getCoriolisLink()});
				});
			});
	}

	render() {
		this.getCoriolisLink = this.getCoriolisLink.bind(this);
		return (
			<Layout>
				<div>
					<div className="container">
						{this.state.build[0] ? (
							<div>
								<h1>
                  Build: {this.state.build[0].title} by {this.state.build[0].author.username}
								</h1>
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
									<article key={item.id} className="build">
										<IdealImage placeholder={{lqip: item.proxiedImage.replace('{OPTIONS}', '20x')}} shouldAutoDownload={() => true}
											height={250} width={400} srcSet={[
												{width: 200, src: item.proxiedImage.replace('{OPTIONS}', '200x125')},
												{width: 400, src: item.proxiedImage.replace('{OPTIONS}', '400x250')}
											]}/>
										<div>
											<div>
												<p>Armour: {Math.round(item.coriolisShip.armour)}</p>
												<p>Shield: {Math.round(item.coriolisShip.shield)}</p>
												<p>Top Speed: {Math.round(item.coriolisShip.topBoost)}</p>
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
										</div>
									</article>
								)) : <ReactLoading type="cylon" color="#FF8C0D" height={50} width={50}/>}
							</div>
						) : <ReactLoading type="cylon" color="#FF8C0D" height={50} width={50}/>}
					</div>
				</div>
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
