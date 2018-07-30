import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import {Link} from 'react-router-dom';
import { Form, Text } from 'informed';

const Label = props => {
  const { htmlFor, ...otherProps } = props;

  return <label htmlFor={htmlFor} {...otherProps} />;
};

Label.propTypes = {
  htmlFor: PropTypes.string
};

Label.defaultProps = {
  htmlFor: ''
};

export class DefaultPage extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      alreadyExists: false,
      message: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.setFormApi = this.setFormApi.bind(this);
  }

  setFormApi(formApi) {
    this.formApi = formApi;
  }

  handleClick() {
    console.info(this.formApi.getState());
  }

  async submit() {
    const form = this.formApi.getState();
    const postData = {
      email: form.values.email,
      username: form.values.username,
      password: form.values.password
    };
    console.info(postData);
    const res = await fetch('/api/users/register', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(postData),
      mode: 'cors',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const text = await res.json();
    console.info(text);
    if (text.success === true) {
      this.setState({ message: 'Registered successfully' });
    } else {
      this.setState({
        message: text.error,
        alreadyExists: text.error === 'User already exists.'
      });
    }
  }

  render() {
    this.submit = this.submit.bind(this);
    return (
      <div className={'root'}>
        <div className={'container'}>
          <h1>{this.props.title}</h1>
          <Form getApi={this.setFormApi} onSubmit={this.submit}>
            <div className={'formGroup'}>
              <label className={'label'} htmlFor="email">
                Email address:
                <Text
                  className={'input'}
                  id="email"
                  type="text"
                  field="email"
                  autoFocus // eslint-disable-line jsx-a11y/no-autofocus
                />
              </label>
            </div>
            <div className={'formGroup'}>
              <label className={'label'} htmlFor="username">
                Username:
                <Text
                  className={'input'}
                  id="username"
                  type="text"
                  field="username"
                />
              </label>
            </div>
            <div className={'formGroup'}>
              <label className={'label'} htmlFor="password">
                Password:
                <Text
                  className={'input'}
                  id="password"
                  type="password"
                  field="password"
                />
              </label>
            </div>
            <div className={'formGroup'}>
              <button
                className={'button'}
                onClick={this.handleClick}
                type="submit"
              >
                Register
              </button>
            </div>
          </Form>
          <p hidden={!this.state.message}>{this.state.message}</p>
          <Link hidden={!this.state.alreadyExists} to="/login">
            Did you mean to login?
          </Link>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    register: state.register,
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