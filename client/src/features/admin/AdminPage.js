import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import {Form, Text, Checkbox, Select, Option} from 'informed';
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

export class AdminPage extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			admin: getCookie('admin') || false,
			users: []
		};
		this.checkAdmin = this.checkAdmin.bind(this);
		this.getUsers = this.getUsers.bind(this);
		this.setFormApi = this.setFormApi.bind(this);
		this.updateUser = this.updateUser.bind(this);
	}

	componentDidMount() {
		this.checkAdmin();
		this.getUsers();
	}

	async checkAdmin() {
		const res = await fetch('/api/checkauth/admin', {
			method: 'GET',
			credentials: 'include'
		});
		const json = await res.json();
		if (json && json.status === 'Login successful!') {
			this.setState({admin: true});
			setCookie('admin', true);
		} else {
			setCookie('admin', false);
			this.setState({admin: false});
		}
	}

	async updateUser() {
		const state = this.formApi.getState();
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

	setFormApi(formApi) {
		this.formApi = formApi;
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
							<Form initialValues={user} getApi={this.setFormApi}>
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

	render() {
		this.renderUsers = this.renderUsers.bind(this);
		return (
			<Layout>
				<div className="admin-admin-page">
					{this.state.admin === true ? (
						<div>
							<h1>Users</h1>
							<div className="admin-users">
								{this.renderUsers()}
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
