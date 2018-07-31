import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Layout from '../common/Layout';

export class DefaultPage extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  async checkLogged() {
      const res = await fetch('/api/checkauth', {
        method: 'GET',
        credentials: 'include'
      });
      const json = await res.json();
      if (json && json.status === 'Login successful!') {
        this.setState({ loggedIn: true });
      }
    }

  componentWillMount() {
    this.checkLogged();
  }

  render() {
    return (
      <Layout>
      <div className={'root'}>
        <div className={'container'}>
          <h1>{this.props.title}</h1>
          <p className={'lead'}>Log in with your username or email address.</p>
          <form method="post" action="/api/login">
            <div className={'formGroup'}>
              <label className={'label'} htmlFor="usernameOrEmail">
                Email address or username:
                <input
                  className={'input'}
                  id="usernameOrEmail"
                  type="text"
                  name="email"
                />
              </label>
            </div>
            <div className={'formGroup'}>
              <label className={'label'} htmlFor="password">
                Password:
                <input
                  className={'input'}
                  id="password"
                  type="password"
                  name="password"
                />
              </label>
            </div>
            <div className={'formGroup'}>
              <button className={'button'} type="submit">
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
      </Layout>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    login: state.login,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultPage);
