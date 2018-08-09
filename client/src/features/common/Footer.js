import React from 'react';
import {Link} from 'react-router-dom';

export default class Footer extends React.Component {
	render() {
		return (
			<div className="footer-root">
				<div className="container">
					<span className="text">© EDCD {new Date().getFullYear()}</span>
					<span className="spacer">·</span>
					<Link className="link" to="/">
						Home
					</Link>
					<span className="spacer">·</span>
					<Link className="link" to="/privacy">
						Privacy
					</Link>
					<span className="spacer">·</span>
					<a className="link" href="https://github.com/EDCD/orbis/issues/new">
						Report an issue
					</a>
					<span className="spacer">·</span>
					<a className="link" href="https://edassets.org/#/">
						Logo by EDAssets
					</a>
					<span className="spacer">·</span>
					<a className="link" href="https://www.edsm.net/">
						Default ship images by EDSM
					</a>
					<span className="spacer">·</span>
					<a className="link" href="https://fontawesome.com/license">
						Other icons by FontAwesome
					</a>
				</div>
			</div>
		);
	}
}
