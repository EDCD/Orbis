import React, {Component} from 'react';
import Layout from '../common/Layout';
import {DebounceInput} from 'react-debounce-input';
import SocialCard from './ShipCard';
import ReactLoading from 'react-loading';
import ReactPaginate from 'react-paginate';

export default class Search extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			search: {key: '', value: '', sort: {field: 'createdAt', order: 'ASC'}}
		};
		this.searchChangeHandler = this.searchChangeHandler.bind(this);
		this.sortFieldChangeHandler = this.sortFieldChangeHandler.bind(this);
		this.sortOrderChangeHandler = this.sortOrderChangeHandler.bind(this);
	}

	searchChangeHandler(e) {
		const key = this.state.search.key;
		const sort = this.state.search.sort;
		this.setState({
			search: {
				value: e.target.value, key, sort
			}
		}, () => {
			this.loadBuilds();
		});
	}

	sortFieldChangeHandler(e) {
		const key = this.state.search.key;
		const value = this.state.search.value;
		const order = this.state.search.sort.order;
		this.setState({
			search: {
				value, key, sort: {
					order, field: e.target.value
				}
			}
		}, () => {
			this.loadBuilds();
		});
	}

	sortOrderChangeHandler(e) {
		const key = this.state.search.key;
		const value = this.state.search.value;
		const field = this.state.search.sort.field;
		this.setState({
			search: {
				value, key, sort: {
					order: e.target.value, field
				}
			}
		}, () => {
			this.loadBuilds();
		});
	}

	render() {
		this.searchChangeHandler = this.searchChangeHandler.bind(this);
		this.sortFieldChangeHandler = this.sortFieldChangeHandler.bind(this);
		this.sortOrderChangeHandler = this.sortOrderChangeHandler.bind(this);
		return (
			<div className="search-container">
				<div id="search-by">
					<label>Search:</label>
					<br/>
					<select>
						<option>title</option>
					</select>
				</div>
				<div id="search-for">
					<label>Search for:</label>
					<DebounceInput
						minLength={2}
						debounceTimeout={300}
						onChange={this.searchChangeHandler}/>
				</div>
				<div id="sort-field">
					<label>Sort by: </label>
					<select onChange={this.sortFieldChangeHandler}>
						<option>createdAt</option>
						<option>updatedAt</option>
						<option>votes</option>
						<option>title</option>
						<option>description</option>
					</select>
				</div>
				<div id="sort-order">
					<label>Sort order:</label>
					<select onChange={this.sortOrderChangeHandler}>
						<option>ASC</option>
						<option>DESC</option>
					</select>
				</div>
			</div>
		);
	}
}
