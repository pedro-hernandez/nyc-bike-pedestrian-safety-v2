// App component smoke test
// https://facebook.github.io/create-react-app/docs/running-tests

import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { isMainThread } from 'worker_threads';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
});

// shallow rendering examples
// https://facebook.github.io/create-react-app/docs/running-tests

it('renders without crashing', () => {
    shallow(<App />);
});