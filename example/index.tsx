import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CurrencyInput, CurrencyFormatProps,
  CurrencyCalculatorInput, CurrencyFormatCalculatorProps,
  Currencies, Locales } from '../.';

const config: CurrencyFormatProps = {
  precision: 3,
  allowNegative: true,
  i18nCurrency: Currencies["US Dollar"],
  locale: Locales.English
}

const configCalculator: CurrencyFormatCalculatorProps = {
  precision: 2
}

const App = () => {
  return (
    <div>
      <h2>Currency Input</h2>
      <CurrencyInput 
        value="000" 
        autoFocus={true}
        options={config}/>
      <h2>Currency Input w/ math</h2>
      <CurrencyCalculatorInput 
        value="000" 
        options={configCalculator}/>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
