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

  render() {
    return (
      <Layout>
        <div>
          <h1>Latest builds</h1>
          <Loader loaded={this.state.pageLoaded}>
            <div className={'builds-container'}>
            {this.state.data.map(e => {
              e.imageURL = e.proxiedImage || 'http://via.placeholder.com/500x400';
              e.content = e.description;
              return (
                <div className={'build-item'}>
                <SocialCard
                  key={e.id}
                  content={e}
                  loggedIn={this.state.loggedIn}
                  likes={e.likes}
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
