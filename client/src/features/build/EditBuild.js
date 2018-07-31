import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../common/Layout';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Form, Text, TextArea } from 'informed';

export class EditBuild extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      build: [{
        author: {},
        coriolisShip: {}
      }],
      loggedIn: false
    };
    this.submit = this.submit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setFormApi = this.setFormApi.bind(this);
  }

  setFormApi(formApi) {
    this.formApi = formApi;
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

  handleClick() {
    console.info(this.formApi.getState());
  }

  async submit() {
    const form = this.formApi.getState();
    let updates = {};
    for (const val in form.values) {
      if (!form.values.hasOwnProperty(val)) {
        continue;
      }
      updates[val] = form.values[val];
    }

    console.log(form);
    console.log(updates);
    return this.props.actions.updateBuild({updates, shipId: this.state.build[0].id})
  }

  componentWillMount() {
    this.checkLogged();
    console.log(this.props);
    this.props.actions.getBuild({ id: this.props.match.params.id })
      .then(data => this.setState({ build: [data] }));
  }

  render() {
    return (
      <Layout>
        <div>
          <div>
            <h1>
              Build: {this.state.build[0].title} by {this.state.build[0].author.username}
            </h1>
          </div>
          {this.state.build.map(item => (
            <div>
              <Form className={'formContainer'} getApi={this.setFormApi} onSubmit={this.submit}>
                <div className={'formGroup flexSmall wrapper'}>
                  <label className={'label'} htmlFor="imageURL">
                    Image URL:
                    <Text
                      className={'input'}
                      id="imageURL"
                      type="text"
                      field="imageURL"
                    />
                  </label>
                </div>
                <div className={'formGroup'}>
                  <label className={'label'} htmlFor="desc">
                    Description:
                    <TextArea
                      className={'input'}
                      id="desc"
                      type="text"
                      field="description"
                    />
                  </label>
                </div>
                <div className={'formGroup'}>
                  <button
                    className={'button'}
                    onClick={this.handleClick}
                    type="submit"
                  >
                    Update build
                  </button>
                </div>
              </Form>
            </div>
          ))}
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
)(EditBuild);
