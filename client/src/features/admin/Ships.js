import React, {Component} from 'react';
import {SkyLightStateless} from 'react-skylight';
import {Checkbox, Form, Text} from 'informed';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';

const modalStyles = {
	backgroundColor: '#1e1e1e',
	color: '#ffffff',
	height: '60vh'
};

export default class Ships extends Component {
	static propTypes = {
		ships: PropTypes.arrayOf(PropTypes.any).isRequired,
		handleShipPageClick: PropTypes.func.isRequired,
		pageCount: PropTypes.number.isRequired,
		setShipFormApi: PropTypes.func.isRequired,
		updateShip: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			modalVisible: ''
		};
	}

	render() {
		return (
			<div className="admin-flex">
				{this.props.ships.map(ship => (
					<div key={ship.id} className="admin-ship">
						<p onClick={() => this.setState({modalVisible: ship.id})}>
							{ship.title}
						</p>
						<SkyLightStateless
							dialogStyles={modalStyles}
							isVisible={this.state.modalVisible === ship.id}
							hideOnOverlayClicked={() => this.setState({modalVisible: ''})}
							onCloseClicked={() => this.setState({modalVisible: ''})}
							title={ship.username}
						>
							<div>
								<Form initialValues={ship} getApi={this.props.setShipFormApi}>
									<label>Title: </label>
									<br/>
									<Text field="title"/>
									<br/>
									<label>Description: </label>
									<br/>
									<Text field="description"/>
									<br/>
									<br/>
									<label>ID: </label>
									<br/>
									<Text readOnly field="id"/>
									<br/>
									<br/>
									<label>Image: </label>
									<br/>
									<Text field="imageURL"/>
									<br/>
									<br/>
									<label>Delete? </label>
									<Checkbox field="delete"/>
								</Form>
								<button type="button" onClick={this.props.updateShip}>Update Ship</button>
							</div>
						</SkyLightStateless>
					</div>
				))}
				<ReactPaginate
					previousLabel="Previous"
					nextLabel="Next"
					breakLabel="..."
					breakClassName="break"
					pageCount={this.props.pageCount}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					initialPage={0}
					onPageChange={this.props.handleShipPageClick}
					containerClassName="pagination"
					subContainerClassName="pages pagination"
					activeClassName="active danger"
				/>
			</div>
		);
	}
}
