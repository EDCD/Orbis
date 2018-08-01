import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import SocialCard from './ShipCard';
import Layout from '../common/Layout';
import Loader from 'react-loader';
import ReactPaginate from 'react-paginate';

export class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      builds: [],
      data: [],
      offset: 0,
      perPage: 10,
      pageLoaded: false,
      loaded: false
    };
    this.loadBuilds = this.loadBuilds.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
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

  componentDidMount() {
    this.checkLogged();
    this.setState({ pageLoaded: false }, () => {
      this.props.actions.getBuilds({ pageSize: this.state.perPage, offset: this.state.offset })
        .then(data => {
          return this.setState({
            data: data.rows,
            pageCount: Math.ceil(data.count / this.state.perPage),
            pageLoaded: true
          });
        });
    });
  }

  loadBuilds() {
    this.setState({ loaded: false }, () => {
      this.props.actions.getBuilds({ pageSize: this.state.perPage, offset: this.state.offset })
        .then(data => {
          return this.setState({
            data: data.rows,
            pageCount: Math.ceil(data.count / this.state.perPage),
            loaded: true
          });
        });
    });
  }

  handlePageClick(data) {
    console.log(data);
    let selected = data.selected;
    let offset = Math.ceil(selected * this.state.perPage);
    this.setState({ offset: offset }, () => {
      this.loadBuilds();
    });
  };

  getCoriolisLink(index) {
    return [
      'https://beta.coriolis.io/outfit/',
      this.state.data[index].coriolisShip.id,
      '?code=',
      'A',
      this.state.data[index].coriolisShip.serialized.standard,
      this.state.data[index].coriolisShip.serialized.hardpoints,
      this.state.data[index].coriolisShip.serialized.internal,
      '.',
      this.state.data[index].coriolisShip.serialized.enabled,
      '.',
      this.state.data[index].coriolisShip.serialized.priorities,
      '.',
      this.state.data[index].coriolisShip.serialized.modifications
    ].join('');
  }

  render() {
    this.getCoriolisLink = this.getCoriolisLink.bind(this);
    return (
      <Layout>
        <div>
          <h1>Latest builds</h1>
          <Loader loaded={this.state.pageLoaded}>
            <div className={'builds-container'}>
            {this.state.data.map((e,index) => {
              e.imageURL = e.proxiedImage || `https://orbis.zone/imgproxy/{OPTIONS}/https://orbis.zone/${e.coriolisShip.id}.jpg`;
              e.content = e.description;
              return (
                <div className={'build-item'}>
                <SocialCard
                  key={e.id}
                  content={e}
                  loggedIn={this.state.loggedIn}
                  likes={e.likes}
                  coriolisLink={e.coriolisShip.url || this.getCoriolisLink(index)}
                  likeIsClicked={false}
                  repostIsClicked={false}
                />
                </div>
              );
            })}
            </div>
            <ReactPaginate previousLabel={'Previous'}
                           nextLabel={'Next'}
                           breakLabel={'...'}
                           breakClassName={'break'}
                           pageCount={this.state.pageCount}
                           marginPagesDisplayed={2}
                           pageRangeDisplayed={5}
                           onPageChange={this.handlePageClick}
                           containerClassName={'pagination'}
                           subContainerClassName={'pages pagination'}
                           activeClassName={'active danger'}/>
          </Loader>
        </div>
      </Layout>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
