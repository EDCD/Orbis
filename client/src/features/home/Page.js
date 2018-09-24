import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ReactLoading from 'react-loading';
import ReactPaginate from 'react-paginate';
import Layout, {UserConsumer} from '../common/Layout';
import * as actions from './redux/actions';
import SocialCard from './ShipCard';
import Search from './Search';
import {deleteCookie, getCookie, setCookie} from '../../common/utils';
import {autoBind} from 'react-extras';
import request from 'superagent';

let params;

export class Page extends React.Component {
	constructor(props) {
		super(props);
		const search = props.location.search; // Could be '?foo=bar'
		params = new URLSearchParams(search);
		this.state = {
			loggedIn: Boolean(getCookie('accessToken')),
			builds: [],
			data: [],
			loading: false,
			offset: params.get('page') * 10 || 0,
			perPage: 10,
			pageLoaded: false,
			loaded: false,
			search: {
				key: params.get('key') || 'title',
				value: params.get('val') || '',
				sort: {
					field: params.get('field') || 'createdAt',
					order: params.get('order') || 'DESC'
				}
			}
		};
		autoBind(this);
	}

	async checkLogged() {
		const res = await request
			.get('/api/checkauth')
			.withCredentials();
		const json = res.body;
		if (json && json.status === 'Login successful!') {
			this.setState({loggedIn: true, user: json.user});
			setCookie('accessToken', json.accessToken);
			setCookie('admin', json.admin);
			setCookie('username', json.user.username);
		} else {
			setCookie('admin', json.admin);
			deleteCookie('accessToken');
			deleteCookie('admin');
			deleteCookie('username');
			this.setState({loggedIn: false});
		}
	}

	componentDidMount() {
		this.checkLogged();
		this.setState({pageLoaded: false}, () => {
			this.props.actions
				.getBuilds({
					pageSize: this.state.perPage,
					offset: this.state.offset,
					search: this.state.search,
					field: this.state.search.sort.field,
					order: this.state.search.sort.order
				})
				.then(data => {
					return this.setState({
						data: data.rows,
						pageCount: Math.ceil(data.count / this.state.perPage),
						pageLoaded: true
					});
				});
		});
	}

	loadBuilds(search) {
		this.setState({loaded: false, search}, () => {
			this.props.actions
				.getBuilds({
					pageSize: this.state.perPage,
					offset: this.state.offset,
					search: this.state.search,
					field: this.state.search.sort.field,
					order: this.state.search.sort.order
				})
				.then(data => {
					return this.setState(
						{
							data: data.rows,
							pageCount: Math.ceil(data.count / this.state.perPage),
							loaded: true,
							loading: false
						},
						() => {
							this.props.history.push(
								`/?page=${Math.ceil(
									this.state.offset / this.state.perPage
								)}&key=${this.state.search.key}&val=${
									this.state.search.value
								}&field=${this.state.search.sort.field}&order=${
									this.state.search.sort.order
								}`,
								this.state
							);
						}
					);
				});
		});
	}

	handlePageClick(data) {
		this.setState({loading: true, loaded: false}, () => {
			const selected = data.selected;
			const offset = Math.ceil(selected * this.state.perPage);
			this.setState({offset}, () => {
				this.loadBuilds(this.state.search);
				this.props.history.push(
					`/?page=${data.selected}&key=${this.state.search.key}&val=${
						this.state.search.value
					}&field=${this.state.search.sort.field}&order=${
						this.state.search.sort.order
					}`,
					this.state
				);
			});
		});
	}

	getCoriolisLink(index) {
		return [
			// 'https://beta.coriolis.io/outfit/',
			// this.state.data[index].coriolisShip.id,
			// '?code=',
			// 'A',
			// this.state.data[index].coriolisShip.serialized.standard,
			// this.state.data[index].coriolisShip.serialized.hardpoints,
			// this.state.data[index].coriolisShip.serialized.internal,
			// '.',
			// this.state.data[index].coriolisShip.serialized.enabled,
			// '.',
			// this.state.data[index].coriolisShip.serialized.priorities,
			// '.',
			// this.state.data[index].coriolisShip.serialized.modifications
		].join('');
	}

	render() {
		return (
			<Layout>
				<h1>Latest builds</h1>
				<Search state={this.state.search} loadBuilds={this.loadBuilds}/>
				<div className="builds-container">
					{this.state.data.length > 0 &&
					(this.state.loaded ||
					!this.state.loading) ? (
							this.state.data.map((e, index) => {
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
											coriolisLink={e.url || this.getCoriolisLink(index)}
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
					initialPage={parseInt(params.get('page'), 10) || 0}
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
		home: state.home
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
)(Page);
