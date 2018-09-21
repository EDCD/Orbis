import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from './redux/actions';
import SocialCard from '../home/ShipCard';
import ReactLoading from 'react-loading';
import ReactPaginate from 'react-paginate';
import Layout from '../common/Layout';
import {getCookie} from '../../common/utils';
import {autoBind} from 'react-extras';

export class ProfilePage extends Component {
	static propTypes = {
		match: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			loggedIn: Boolean(getCookie('accessToken')),
			data: [],
			loading: false,
			offset: 0,
			perPage: 10,
			loaded: false
		};
		autoBind(this);
	}

	componentDidMount() {
		this.loadBuilds();
	}

	loadBuilds() {
		this.setState({loaded: false}, () => {
			this.props.actions
				.getProfile({
					username: this.props.match.params.username,
					pageSize: this.state.perPage,
					offset: this.state.offset
				})
				.then(data => {
					console.log(data);
					this.setState(
						{
							data: data.rows,
							pageCount: Math.ceil(data.count / this.state.perPage),
							loaded: true
						});
				}
				);
		});
	}

	handlePageClick(data) {
		this.setState({loading: true}, () => {
			const selected = data.selected;
			const offset = Math.ceil(selected * this.state.perPage);
			this.setState({offset}, () => {
				this.loadBuilds();
			});
		});
	}

	render() {
		return (
			<Layout>
				<h1>Profile for {this.props.match.params.username}</h1>
				<div className="builds-container">
					{this.state.data.length > 0 ||
					this.state.loaded ||
					!this.state.loading ? (
							this.state.data.map(e => {
								e.imageURL =
								e.proxiedImage ||
								`https://orbis.zone/imgproxy/{OPTIONS}/https://orbis.zone/${
									e.Ship
								}.jpg`;
								e.content = e.description;
								return (
									<div key={e.id} className="build-item">
										<SocialCard
											key={e.id}
											content={e}
											loggedIn={this.state.loggedIn}
											likes={e.likes}
											coriolisLink={e.url}
											likeIsClicked={false}
											repostIsClicked={false}
										/>
									</div>
								);
							})
						) : (
							<ReactLoading type="cylon" color="#FF8C0D" height={50} width={50}/>
						)}
				</div>
				<ReactPaginate
					previousLabel="Previous"
					nextLabel="Next"
					breakLabel="..."
					breakClassName="break"
					pageCount={this.state.pageCount}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					initialPage={0}
					containerClassName="pagination"
					subContainerClassName="pages pagination"
					activeClassName="active danger"
					onPageChange={this.handlePageClick}
				/>
			</Layout>
		);
	}
}

/* istanbul ignore next */
function mapStateToProps(state) {
	return {
		profile: state.profile
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
)(ProfilePage);
