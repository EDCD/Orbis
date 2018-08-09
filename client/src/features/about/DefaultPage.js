import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from './redux/actions';
import Layout from '../common/Layout';
import * as Svg from '../common/Svg';

export class DefaultPage extends Component {
	render() {
		return (
			<Layout>
				<h1>Contact</h1>
				<div className="about-root">
					WIP
				</div>
			</Layout>
		);
	}
}

/* istanbul ignore next */
function mapStateToProps(state) {
	return {
		contact: state.contact
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
)(DefaultPage);
