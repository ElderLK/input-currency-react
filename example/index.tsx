import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CurrencyInput} from '../.';

const App = () => {
  return (
    <div>
      <CurrencyInput />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
