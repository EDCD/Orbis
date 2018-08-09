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
				<div className="contact-root">
					<div>
						<Svg.Discord className="discord-icon"/>
						<span>
							willyb321#2816
						</span>
						<span className="spacer">·</span>
						<span>
							<a href="https://discord.gg/3rhXKSw">EDCD Discord</a>
						</span>
					</div>
					<div>
						<Svg.GitHub className="discord-icon"/>
						<a href="https://github.com/EDCD/Orbis">
							Orbis Github Repository
						</a>
					</div>
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
