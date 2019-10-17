import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import apiClient from '../../../apiClient';

import withAuthentication from '../withAuthentication';

const mockStore = configureMockStore([thunk]);
const store = mockStore({
  userAccount: {
    loaded: true,
  },
});

apiClient.ensurePublicOrAuthenticationAndCookies = (_, callback) => {
  callback();
};

describe('<withAuthentication />', () => {
  it('does not render anything on initial paint', () => {
    process.env.IDP_SLUG = 'saml-default';
    const MyComponent = () => <div />;
    const AuthenticatedComponent = withAuthentication(MyComponent);
    const wrapper = mount((
      <Provider store={store}>
        <AuthenticatedComponent location={{ pathname: '/' }} />
      </Provider>
    ));
    expect(wrapper.html()).toBe('');
  });
});
