import React, {Component} from 'react';
import Layout from '../common/Layout';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from './redux/actions';
import {Form, Text, TextArea} from 'informed';
import request from 'superagent';
import {autoBind} from 'react-extras';

export class EditBuild extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false
		};
		autoBind(this);
	}

	setFormApi(formApi) {
		this.formApi = formApi;
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

	handleClick() {
	}

	handleDelete() {
		return request
			.delete(`/api/builds/${this.state.build[0].id}`)
			.withCredentials()
			.then(res => {
				if (res.body && res.body.success === true) {
					this.props.history.push('/');
				}
			});
	}

	async submit() {
		const form = this.formApi.getState();
		let updates = {};
		for (const val in form.values) {
			if (!form.values.hasOwnProperty(val)) {
				continue;
			}
			updates[val] = form.values[val];
		}
		return this.props.actions.updateBuild({updates, shipId: this.state.build[0].id})
			.then(() => {
				this.setState({message: 'Build updated.'});
			});
	}

	componentDidMount() {
		this.checkLogged();
		console.log(this.props);
		this.props.actions.getBuild({id: this.props.match.params.id})
			.then(data => this.setState({build: [data]}));
	}

	render() {
		return (
			<Layout>
				<div>
					<div>
						<h1>
							{this.state.build ? <span>
                Build: {this.state.build[0].title} by {this.state.build[0].author.username}
                           </span> : 'Loading'}
						</h1>
					</div>
					{this.state.build ? this.state.build.map(item => (
						<div>
							<Form initialValues={{imageURL: item.imageURL, description: item.description, title: item.title}}
								className="formContainer" getApi={this.setFormApi} onSubmit={this.submit}
							>
								<div className="formGroup flexSmall wrapper">
									<label className="label" htmlFor="imageURL">
										Image URL:
										<Text
											className="input"
											id="imageURL"
											value={item.imageURL}
											type="text"
											field="imageURL"
										/>
									</label>
								</div>
								<div className="formGroup">
									<label className="label" htmlFor="title">
										Title:
										<TextArea
											className="input"
											id="title"
											type="text"
											field="title"
										/>
									</label>
								</div>
								<div className="formGroup">
									<label className="label" htmlFor="desc">
										Description:
										<TextArea
											className="input"
											id="desc"
											type="text"
											field="description"
										/>
									</label>
								</div>
								<div className="formGroup">
									<p style={{textAlign: 'center'}} hidden={!this.state.message}>{this.state.message}</p>
									<button
										className="button"
										onClick={this.handleClick}
										type="submit"
									>
										Update build
									</button>
									<br/>
									<button
										className="button"
										onClick={this.handleDelete}
									>
										Delete Build
									</button>

								</div>
							</Form>
						</div>
					)) : 'Loading'}
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
)(EditBuild);
