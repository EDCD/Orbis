import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import Layout from '../common/Layout';
import {Link} from 'react-router-dom';

export class Build extends Component {
  constructor(props) {
    super(props);
    this.state = {
      build: [{
        author: {},
        coriolisShip: {}
      }],
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

  async getData() {
    const resp = await fetch(`/api/builds/${this.props.match.params.id}`);
    const data = await resp.json();
    this.setState({ build: [data] });
    if (!data) throw new Error('Failed to load the builds feed.');
  }

  componentWillMount() {
    this.checkLogged();
    this.props.actions.getBuild({id: this.props.match.params.id})
      .then(data => this.setState({ build: [data] }));
  }

  render() {
    return (
      <Layout>
        <div>
          <div className={'container'}>
            <h1>
              Build: {this.state.build[0].title} by {this.state.build[0].author.username}
            </h1>
            <div>
              <Link to={`/build/${this.props.match.params.id}/edit`}>
                Edit Build
              </Link>
            </div>
            {this.state.build.map(item => (
              <article key={item.id} className={'build'}>
                <div>
                  <div>
                    <p>Armour: {Math.round(item.coriolisShip.armour)}</p>
                    <p>Shield: {Math.round(item.coriolisShip.shield)}</p>
                    <p>Top Speed: {Math.round(item.coriolisShip.topBoost)}</p>
                    <p>
                      Hull Thermal Res:{' '}
                      {Math.round(item.coriolisShip.hullThermRes * 100)}%
                    </p>
                    <p>
                      Hull Explosive Res:{' '}
                      {Math.round(item.coriolisShip.hullExplRes * 100)}%
                    </p>
                    <p>
                      Hull Kinetic Res:{' '}
                      {Math.round(item.coriolisShip.shieldKinRes * 100)}%
                    </p>
                    <p>
                      Shield Thermal Res:{' '}
                      {Math.round(item.coriolisShip.shieldThermRes * 100)}%
                    </p>
                    <p>
                      Shield Explosive Res:{' '}
                      {Math.round(item.coriolisShip.shieldExplRes * 100)}%
                    </p>
                    <p>
                      Shield Kinetic Res:{' '}
                      {Math.round(item.coriolisShip.shieldKinRes * 100)}%
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Build);
