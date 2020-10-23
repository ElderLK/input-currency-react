import React from 'react';
import * as ReactDOM from 'react-dom';
import { Default as CurrencyInput } from '../stories/CurrencyInput.stories';

describe('Renders Tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CurrencyInput />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
