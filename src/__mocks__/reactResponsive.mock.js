import React from 'react';
import { MediaQueryProps } from 'react-responsive';

// We have to rename the below variables to start with `mock` so
// that `jest.mock` doesn't complain.
const mockWindow = window;
const mockReact = React;
const mockMediaQueryProps = MediaQueryProps;

// Because some components render a different UI depending on screen size
// using `react-responsive`, we must mock the window size in our
// tests. To change the window size for a specific test, include
// `global.innerWidth = <width>`.
jest.mock('react-responsive', () => {
  const MediaQuery = require.requireActual('react-responsive').default;

  const MockMediaQuery = (props = mockMediaQueryProps) => {
    const defaultWidth = mockWindow.innerWidth;
    const defaultHeight = mockWindow.innerHeight;
    const values = Object.assign({}, { width: defaultWidth, height: defaultHeight }, props.values);
    const newProps = Object.assign({}, props, { values });

    return mockReact.createElement(MediaQuery, newProps);
  };

  return MockMediaQuery;
});
