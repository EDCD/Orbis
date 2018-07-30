import React from 'react';
import {Link} from 'react-router-dom';

export default class Footer extends React.Component {
  render() {
    return (
      <div className={'root'}>
        <div className={'container'}>
          <span className={'text'}>© EDCD {new Date().getFullYear()}</span>
          <span className={'spacer'}>·</span>
          <Link className={'link'} to="/">
            Home
          </Link>
          <span className={'spacer'}>·</span>
          <Link className={'link'} to="/admin">
            Admin
          </Link>
          <span className={'spacer'}>·</span>
          <Link className={'link'} to="/privacy">
            Privacy
          </Link>
          <span className={'spacer'}>·</span>
          <a className={'link'} href="https://github.com/EDCD/orbis/issues/new">
            Report an issue
          </a>
        </div>
      </div>
    );
  }
}
