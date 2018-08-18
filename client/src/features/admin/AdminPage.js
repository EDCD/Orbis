import React, {Component} from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import {Form, Text, Checkbox, Select, Option, asField} from 'informed';
import {connect} from 'react-redux';
import * as actions from './redux/actions';
import {getCookie, setCookie} from '../../common/utils';
import Layout from '../common/Layout';
import {SkyLightStateless} from 'react-skylight';

const modalStyles = {
	backgroundColor: '#1e1e1e',
	color: '#ffffff',
	height: '60vh'
};

const DatePicker = asField(({fieldState, fieldApi, ...props}) => {
	const {value} = fieldState;
	const {setValue, setTouched} = fieldApi;
	const {onChange, onBlur, forwardedRef, ...rest} = props;
	return (
		<React.Fragment>
			<DayPickerInput
				{...rest}
				ref={forwardedRef}
				value={!value && value !== 0 ? '' : value}
				onDayChange={e => {
					setValue(e);
					if (onChange) {
						onChange(e);
					}
				}}
				onBlur={e => {
					setTouched();
					if (onBlur) {
						onBlur(e);
					}
				}}
				style={fieldState.error ? {border: 'solid 1px red'} : null}
			/>
			{fieldState.error ? (
				<small style={{color: 'red'}}>{fieldState.error}</small>
			) : null}
		</React.Fragment>
	);
});

export class AdminPage extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		let admin = false;
		try {
			admin = JSON.parse(getCookie('admin'));
		} catch (err) {
			if (err.message !== 'Unexpected end of JSON input') {
				console.error(err);
			}
		}
		this.state = {
			admin: admin || false,
			users: [],
			ships: [],
			announcements: []
		};
		this.checkAdmin = this.checkAdmin.bind(this);
		this.getUsers = this.getUsers.bind(this);
		this.setUserFormApi = this.setUserFormApi.bind(this);
		this.setShipFormApi = this.setShipFormApi.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.addAnnouncement = this.addAnnouncement.bind(this);
		this.updateShip = this.updateShip.bind(this);
		this.updateAnnouncement = this.updateAnnouncement.bind(this);
		this.renderShips = this.renderShips.bind(this);
		this.renderAddAnnouncement = this.renderAddAnnouncement.bind(this);
		this.setAnnounceFormApi = this.setAnnounceFormApi.bind(this);
	}

	componentDidMount() {
		this.checkAdmin();
		this.getUsers();
		this.getShips();
		this.getAnnouncements();
	}

	async checkAdmin() {
		const res = await fetch('/api/checkauth/admin', {
			method: 'GET',
			redirect: 'manual',
			credentials: 'include'
		});
		try {
			const json = await res.json();
			if (json && json.status === 'Login successful!') {
				this.setState({admin: true});
				setCookie('admin', true);
			} else {
				this.setState({admin: false});
				setCookie('admin', false);
			}
		} catch (e) {
			this.setState({admin: false});
			setCookie('admin', false);
		}
	}

	async updateUser() {
		const state = this.userFormApi.getState();
		const {values} = state;

		const res = await fetch('/api/admin/user/update', {
			method: 'POST',
			body: JSON.stringify(values),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});
		const json = await res.json();
		if (json) {
			console.log(json);
		}
	}

	async getUsers() {
		const res = await fetch('/api/admin/users', {
			method: 'GET',
			credentials: 'include'
		});
		const json = await res.json();
		if (json) {
			this.setState({users: json});
		}
	}

	async getShips() {
		const res = await fetch('/api/admin/ships', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				order: 'ASC',
				field: 'updatedAt',
				search: {
					key: 'title',
					value: ''
				}
			}),
			credentials: 'include'
		});
		const json = await res.json();
		if (json) {
			this.setState({ships: json.rows});
		}
	}

	async addAnnouncement() {
		const state = this.announceFormApi.getState();
		const {values} = state;
		console.log(values);

		const res = await fetch('/api/admin/announcement/add', {
			method: 'POST',
			body: JSON.stringify(values),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});
		const json = await res.json();
		if (json) {
			console.log(json);
		}
	}

	async getAnnouncements() {
		const res = await fetch('/api/admin/announcements', {
			method: 'GET',
			credentials: 'include'
		});
		const json = await res.json();
		if (json) {
			this.setState({announcements: json});
		}
	}

	async updateShip() {
		const state = this.shipFormApi.getState();
		const {values} = state;
		console.log(values);
		const res = await fetch('/api/admin/ship/update', {
			method: 'POST',
			body: JSON.stringify(values),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});
		const json = await res.json();
		if (json) {
			console.log(json);
		}
		this.getShips();
	}

	async updateAnnouncement() {
		const state = this.announceFormApi.getState();
		const {values} = state;
		console.log(values);
		const res = await fetch('/api/admin/announcement/delete', {
			method: 'POST',
			body: JSON.stringify(values),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});
		const json = await res.json();
		if (json) {
			console.log(json);
		}
		this.getShips();
	}

	setUserFormApi(formApi) {
		this.userFormApi = formApi;
	}

	setAnnounceFormApi(formApi) {
		this.announceFormApi = formApi;
	}

	setShipFormApi(formApi) {
		this.shipFormApi = formApi;
	}

	renderAddAnnouncement() {
		return (
			<div>
				<Form getApi={this.setAnnounceFormApi}>
					<label>Announcement text: </label><br/>
					<Text field="message"/>
					<br/>
					<label>Announcement expiry: </label><br/>
					<DatePicker
						field="expiresAt"
					/>
					<button onClick={this.addAnnouncement}>Add announcement</button>
				</Form>
			</div>
		);
	}

	renderAnnouncements() {
		return this.state.announcements.map(announcement => (
			<div key={announcement.id} className="admin-announcement">
				<p onClick={() => this.setState({modalVisible: announcement.id})}>{announcement.message}</p>
				<SkyLightStateless dialogStyles={modalStyles} isVisible={this.state.modalVisible === announcement.id}
					hideOnOverlayClicked={() => this.setState({modalVisible: ''})}
					onCloseClicked={() => this.setState({modalVisible: ''})} title={announcement.message}
				>
					<div>
						<Form initialValues={announcement} getApi={this.setAnnounceFormApi}>
							<label>ID: </label><br/>
							<Text readOnly field="id"/>
							<br/>
							<label>Message: </label><br/>
							<Text readOnly field="message"/>
						</Form>
						<button onClick={this.updateAnnouncement}>Delete Announcement</button>
					</div>
				</SkyLightStateless>
			</div>

		)
		);
	}

	renderUsers() {
		return (
			this.state.users.map(user => (
				<div key={user.id} className="admin-user">
					<p onClick={() => this.setState({modalVisible: user.id})}>{user.username}</p>
					<SkyLightStateless dialogStyles={modalStyles} isVisible={this.state.modalVisible === user.id}
						hideOnOverlayClicked={() => this.setState({modalVisible: ''})}
						onCloseClicked={() => this.setState({modalVisible: ''})} title={user.username}
					>
						<div>
							<Form initialValues={user} getApi={this.setUserFormApi}>
								<label>Username: </label><br/>
								<Text field="username"/>
								<br/>
								<label>Badges: </label><br/>
								<Select field="badges" id="select-status">
									<Option value="" disabled>
											Select One...
									</Option>
									<Option value="Master">Master</Option>
									<Option value="Dangerous">Dangerous</Option>
									<Option value="Deadly">Deadly</Option>
									<Option value="Elite">Elite</Option>
								</Select>
								<br/>
								<label>ID: </label><br/>
								<Text readOnly field="id"/>
								<br/>
								<label>Keycloak ID: </label><br/>
								<Text readOnly field="keycloakId"/>
								<br/>
								<label>Email: </label><br/>
								<Text field="email"/>
								<br/>
								<label>Admin: </label>
								<Checkbox field="admin" defaultValue={user.admin}/>
							</Form>
							<button onClick={this.updateUser}>Update User</button>
						</div>
					</SkyLightStateless>
				</div>
			)
			)
		);
	}

	renderShips() {
		return (
			this.state.ships.map(ship => (
				<div key={ship.id} className="admin-ship">
					<p onClick={() => this.setState({modalVisible: ship.id})}>{ship.title}</p>
					<SkyLightStateless dialogStyles={modalStyles} isVisible={this.state.modalVisible === ship.id}
						hideOnOverlayClicked={() => this.setState({modalVisible: ''})}
						onCloseClicked={() => this.setState({modalVisible: ''})} title={ship.username}
					>
						<div>
							<Form initialValues={ship} getApi={this.setShipFormApi}>
								<label>Title: </label><br/>
								<Text field="title"/>
								<br/>
								<label>Description: </label><br/>
								<Text field="description"/>
								<br/>
								<br/>
								<label>ID: </label><br/>
								<Text readOnly field="id"/>
								<br/>
								<br/>
								<label>Delete? </label>
								<Checkbox field="delete"/>
							</Form>
							<button onClick={this.updateShip}>Update Ship</button>
						</div>
					</SkyLightStateless>
				</div>
			)
			)
		);
	}

	render() {
		this.renderUsers = this.renderUsers.bind(this);
		this.renderAnnouncements = this.renderAnnouncements.bind(this);
		return (
			<Layout>
				<div className="admin-admin-page">
					{this.state.admin === true ? (
						<div>
							<div>
								<div>
									<h1>Announcements</h1>
									<div className="admin-announcements">
										{this.renderAddAnnouncement()}
									</div>
									<div className="admin-announcements">
										{this.renderAnnouncements()}
									</div>
								</div>
								<h1>Users</h1>
								<div className="admin-users">
									{this.renderUsers()}
								</div>
							</div>
							<div>
								<h1>Ships</h1>
								<div className="admin-ships">
									{this.renderShips()}
								</div>
							</div>
						</div>
					) :
						<div>
							<p>Access denied.</p>
							<Link to="/">Go home?</Link>
						</div>
					}
				</div>
			</Layout>
		);
	}
}

/* istanbul ignore next */
function mapStateToProps(state) {
	return {
		admin: state.admin
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
)(AdminPage);
