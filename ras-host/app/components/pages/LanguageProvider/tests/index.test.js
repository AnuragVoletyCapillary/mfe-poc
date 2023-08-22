import React from 'react'; // eslint-disable-line no-unused-vars
import { shallow, mount } from 'enzyme';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router-dom';

import ConnectedLanguageProvider, { LanguageProvider } from '../index';
import configureStore from '../../../../configureStore';

import { translationMessages } from '../../../../i18n';

jest.mock('antd/es/locale-provider/en_US', () => ({}));
jest.mock('antd/es/locale-provider/zh_CN', () => ({}));

const messages = defineMessages({
  someMessage: {
    id: 'some.id',
    defaultMessage: 'This is some default message',
    en: 'This is some en message',
  },
});

describe('<LanguageProvider />', () => {
  it('should render its children', () => {
    const children = <h1>Test</h1>;
    const language = {};
    const renderedComponent = shallow(
      <LanguageProvider
        messages={messages}
        locale="en"
        language={language}
        actions={{
          getLocizeMessage: jest.fn(),
        }}
      >
        {children}
      </LanguageProvider>,
    );
    expect(renderedComponent.contains(children)).toBe(true);
  });
});

describe('<ConnectedLanguageProvider />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the default language messages', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <ConnectedLanguageProvider messages={translationMessages}>
          <FormattedMessage {...messages.someMessage} />
        </ConnectedLanguageProvider>
      </Provider>,
    );
    expect(
      renderedComponent.contains(
        <FormattedMessage {...messages.someMessage} />,
      ),
    ).toBe(true);
  });
});
