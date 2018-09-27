import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import IdealImage from 'react-ideal-image';

export default class UiCard extends Component {
	static propTypes = {
		content: PropTypes.any.isRequired
	};

	render() {
		const {imageURL, tag, title, content, username} = this.props.content;
		return (
			<div className="ui-card">
				<div className="ui-card-img">
					<IdealImage placeholder={{lqip: imageURL.replace('{OPTIONS}', '20x')}}
						height={500} width={800} srcSet={[
							{width: 400, src: imageURL.replace('{OPTIONS}', '400x250')}
						]}/>
				</div>
				<div className="ui-card-content">
					<h5>{tag}</h5>
					<Link className="noDec" to={`/build/${this.props.content.shortid}`}>
						<h3>{title}</h3>
					</Link>
					<p>{content}</p>
					<p>- {username}</p>
				</div>
			</div>
		);
	}
}
