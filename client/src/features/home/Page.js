import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import SocialCard from './ShipCard';
import Header from '../common/Header';
import Footer from '../common/Footer';
export class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      builds: []
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
    const resp = await fetch('/api/builds', {
    method: 'POST'
  });
  const builds = await resp.json();
  this.setState({builds})
  }

  componentWillMount() {
    this.checkLogged();
    this.getData();
  }

  render() {
    return (
      <div>
        <Header loggedIn={this.state.loggedIn} />
        <div>
          <h1>Latest builds</h1>
          {this.state.builds.map(e => {
            e.image = 'http://via.placeholder.com/500x400';
            e.content = e.description;
            return (
              <SocialCard
                key={e.id}
                content={e}
                loggedIn={this.state.loggedIn}
                likes={e.likes}
                likeIsClicked={false}
                repostIsClicked={false}
              />
            );
          })}
        </div>
        <Footer />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
