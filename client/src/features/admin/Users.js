import React, {Component} from 'react';
import {SkyLightStateless} from 'react-skylight';
import {Checkbox, Form, Option, Select, Text} from 'informed';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';

const modalStyles = {
	backgroundColor: '#1e1e1e',
	color: '#ffffff',
	height: '60vh'
};

export default class Users extends Component {
	static propTypes = {
		users: PropTypes.arrayOf(PropTypes.any).isRequired,
		handleUserPageClick: PropTypes.func.isRequired,
		pageCount: PropTypes.number.isRequired,
		updateUser: PropTypes.func.isRequired,
		setUserFormApi: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			modalVisible: ''
		};
	}

	render() {
		return (
			<div>
				<div className="admin-users">
					{this.props.users.map(user => (
						<div key={user.id} className="admin-user" onClick={() => this.setState({modalVisible: user.id})}>
							<span>
								{user.username}
							</span>
							<SkyLightStateless
								dialogStyles={modalStyles}
								isVisible={this.state.modalVisible === user.id}
								hideOnOverlayClicked={() => this.setState({modalVisible: ''})}
								onCloseClicked={() => this.setState({modalVisible: ''})}
								title={user.username}
							>
								<Form initialValues={user} getApi={this.props.setUserFormApi}>
									<label>Username: </label>
									<br/>
									<Text field="username"/>
									<br/>
									<label>Badges: </label>
									<br/>
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
									<label>ID: </label>
									<br/>
									<Text readOnly field="id"/>
									<br/>
									<label>Keycloak ID: </label>
									<br/>
									<Text readOnly field="keycloakId"/>
									<br/>
									<label>Email: </label>
									<br/>
									<Text field="email"/>
									<br/>
									<label>Admin: </label>
									<Checkbox field="admin" defaultValue={user.admin}/>
								</Form>
								<button type="submit" onClick={this.props.updateUser}>
									Update User
								</button>
							</SkyLightStateless>
						</div>
					))}
				</div>
				<ReactPaginate
					previousLabel="Previous"
					nextLabel="Next"
					breakLabel="..."
					breakClassName="break"
					pageCount={this.props.pageCount}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					initialPage={0}
					onPageChange={this.props.handleUserPageClick}
					containerClassName="pagination"
					subContainerClassName="pages pagination"
					activeClassName="active danger"
				/>
			</div>
		);
	}
}
