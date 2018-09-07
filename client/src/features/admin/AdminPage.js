import React, {Component} from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import {asField, Checkbox, Form, Option, Select, Text} from 'informed';
import {connect} from 'react-redux';
import * as actions from './redux/actions';
import {getCookie, setCookie} from '../../common/utils';
import Layout from '../common/Layout';
import {SkyLightStateless} from 'react-skylight';
import request from 'superagent';
import Users from './Users';
import Ships from './Ships';
import {autoBind, Choose} from 'react-extras';

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
				style={fieldState.error ? {border: 'solid 1px red'} : null}
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
			perPage: 20,
			shipPageCount: 0,
			shipOffset: 0,
			userOffset: 0,
			userPageCount: 0,
			announcements: []
		};
		autoBind(this);
	}

	componentDidMount() {
		this.checkAdmin();
		this.getUsers();
		this.getShips();
		this.getAnnouncements();
	}

	async checkAdmin() {
		const res = await request
			.get('/api/checkauth/admin')
			.redirects(0)
			.withCredentials();
		try {
			const json = res.body;
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
		const res = await request
			.post('/api/admin/user/update')
			.send(values)
			.withCredentials();

		const json = res.body;
		if (json) {
			this.getUsers(this.state.userOffset);
		}
	}

	async getUsers() {
		const res = await request
			.post('/api/admin/users')
			.send({
				order: 'ASC',
				pageSize: this.state.perPage,
				offset: this.state.userOffset,
				field: 'updatedAt',
				search: {
					key: 'title',
					value: ''
				}
			})
			.withCredentials();

		const json = res.body;
		if (json) {
			this.setState({
				users: json.rows,
				userPageCount: Math.ceil(json.count / this.state.perPage)
			});
		}
	}

	async getShips() {
		const res = await request
			.post('/api/admin/ships')
			.send({
				order: 'ASC',
				pageSize: this.state.perPage,
				offset: this.state.shipOffset,
				field: 'updatedAt',
				search: {
					key: 'title',
					value: ''
				}
			})
			.withCredentials();

		const json = res.body;
		if (json) {
			this.setState({
				ships: json.rows,
				shipPageCount: Math.ceil(json.count / this.state.perPage)
			});
		}
	}

	async addAnnouncement() {
		const state = this.newAnnounceFormApi.getState();
		const {values} = state;
		console.log(values);
		const res = await request
			.post('/api/admin/announcement/add')
			.send(values)
			.withCredentials();

		const json = res.body;
		if (json) {
			console.log(json);
		}
		this.getAnnouncements();
	}

	async getAnnouncements() {
		const res = await request
			.get('/api/admin/announcements')
			.withCredentials();
		const json = res.body;
		if (json) {
			this.setState({announcements: json});
		}
	}

	async updateShip() {
		const state = this.shipFormApi.getState();
		const {values} = state;
		const res = await request
			.post('/api/admin/ship/update')
			.send(values)
			.withCredentials();

		const json = res.body;

		if (json) {
			console.log(json);
		}
		this.getShips(this.state.shipOffset);
	}

	async updateAnnouncement() {
		const state = this.announceFormApi.getState();
		const {values} = state;
		console.log(values);
		const res = await request
			.post('/api/admin/announcement/delete')
			.send(values)
			.withCredentials();

		const json = res.body;

		if (json) {
			console.log(json);
		}
		this.getAnnouncements();
	}

	setUserFormApi(formApi) {
		this.userFormApi = formApi;
	}

	setAnnounceFormApi(formApi) {
		this.announceFormApi = formApi;
	}

	setNewAnnounceFormApi(formApi) {
		this.newAnnounceFormApi = formApi;
	}

	setShipFormApi(formApi) {
		this.shipFormApi = formApi;
	}

	renderAddAnnouncement() {
		return (
			<div>
				<Form getApi={this.setNewAnnounceFormApi}>
					<label>Announcement text: </label>
					<br/>
					<Text field="message"/>
					<br/>
					<label>Announcement expiry: </label>
					<br/>
					<DatePicker field="expiresAt"/>
					<button type="button" onClick={this.addAnnouncement}>Add announcement</button>
				</Form>
			</div>
		);
	}

	renderAnnouncements() {
		return this.state.announcements.map(announcement => (
			<div key={announcement.id} className="admin-announcement">
				<p onClick={() => this.setState({modalVisible: announcement.id})}>
					{announcement.message}
				</p>
				<SkyLightStateless
					dialogStyles={modalStyles}
					isVisible={this.state.modalVisible === announcement.id}
					hideOnOverlayClicked={() => this.setState({modalVisible: ''})}
					title={announcement.message}
					onCloseClicked={() => this.setState({modalVisible: ''})}
				>
					<div>
						<Form initialValues={announcement} getApi={this.setAnnounceFormApi}>
							<label>ID: </label>
							<br/>
							<Text readOnly field="id"/>
							<br/>
							<label>Message: </label>
							<br/>
							<Text readOnly field="message"/>
						</Form>
						<button type="button" onClick={this.updateAnnouncement}>
							Delete Announcement
						</button>
					</div>
				</SkyLightStateless>
			</div>
		));
	}

	handleShipPageClick(data) {
		const selected = data.selected;
		const offset = Math.ceil(selected * this.state.perPage);
		this.setState({shipOffset: offset}, () => {
			this.getShips(this.state.shipOffset);
		});
	}

	handleUserPageClick(data) {
		const selected = data.selected;
		const offset = Math.ceil(selected * this.state.perPage);
		this.setState({userOffset: offset}, () => {
			this.getUsers(this.state.userOffset);
		});
	}

	render() {
		return (
			<Layout>
				<div className="admin-admin-page">
					<Choose.When condition={!this.state.admin}>
						<div>
							<p>Access denied.</p>
							<Link to="/">Go home?</Link>
						</div>
					</Choose.When>
					<Choose.When condition={this.state.admin}>
						<div className="admin-flex">
							<div className="admin-flex">
								<h1>Announcements</h1>
								{this.renderAddAnnouncement()}
								<div className="admin-announcements">
									{this.renderAnnouncements()}
								</div>
								<br/>
							</div>
							<div className="admin-flex">
								<h1>Users</h1>
								<div className="admin-users">
									<Users users={this.state.users} pageCount={this.state.userPageCount}
										handleUserPageClick={this.handleUserPageClick} updateUser={this.updateUser}
										setUserFormApi={this.setUserFormApi}/>
								</div>
							</div>
							<div className="admin-flex">
								<h1>Ships</h1>
								<div className="admin-ships">
									<Ships ships={this.state.ships} pageCount={this.state.shipPageCount}
										handleShipPageClick={this.handleShipPageClick} updateShip={this.updateShip}
										setShipFormApi={this.setShipFormApi}/>
								</div>
							</div>
						</div>
					</Choose.When>
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
