/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Form, Text } from 'informed';

import s from './Register.less';
import Link from '../../Components/Link';

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

class Register extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      failed: false,
      error: '',
      alreadyExists: false
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
    const res = await fetch('/register', {
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
      this.setState({ failed: false, message: 'Registered successfully' });
    } else {
      this.setState({ failed: true, message: text.error, alreadyExists: text.error === 'User already exists.'});
    }
  }

  render() {
    this.submit = this.submit.bind(this);
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <Form getApi={this.setFormApi} onSubmit={this.submit}>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="email">
                Email address:
                <Text
                  className={s.input}
                  id="email"
                  type="text"
                  field="email"
                  autoFocus // eslint-disable-line jsx-a11y/no-autofocus
                />
              </label>
            </div>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="username">
                Username:
                <Text
                  className={s.input}
                  id="username"
                  type="text"
                  field="username"
                />
              </label>
            </div>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="password">
                Password:
                <Text
                  className={s.input}
                  id="password"
                  type="password"
                  field="password"
                />
              </label>
            </div>
            <div className={s.formGroup}>
              <button
                className={s.button}
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

export default withStyles(s)(Register);
