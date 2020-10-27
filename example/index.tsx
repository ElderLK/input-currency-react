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
  precision: 2,
  // style: "decimal"
}


const App = () => {

  const inputRef = React.useRef<HTMLInputElement>();
  const [ value, setValue ] = React.useState<string>('000');

  React.useEffect(() => {
    if(inputRef.current){
      inputRef.current.focus();
    
      let nativeInputValueSetter = Object!.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")!.set;
      nativeInputValueSetter!.call(inputRef.current, '12333322');
      let ev2 = new Event('input', { bubbles: true});
      inputRef.current.dispatchEvent(ev2);
    }
  }, [inputRef])

  function handleClick(event: React.MouseEvent<any, MouseEvent>){
    event.preventDefault();
    const { value: newValue, operator }  = event.currentTarget.dataset;
    if(inputRef.current && Object) {
      const input = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
      if(input){
        let nativeInputValueSetter = input.set;
        if(newValue) {
          if(newValue === "C") {
            nativeInputValueSetter!.call(inputRef.current, ``);
          } else {
            nativeInputValueSetter!.call(inputRef.current, `${value}${newValue}`);
          }
        } else {
          if(operator === "L"){
            const event = new KeyboardEvent("keydown", {
              bubbles : true,
              key : 'Delete',
            });
            inputRef.current.dispatchEvent(event);
          } else {
            nativeInputValueSetter!.call(inputRef.current, `${value}${operator}`);
          }
        }
        if(operator !== "L") {
          const event = new Event('input', { bubbles: true});
          inputRef.current.dispatchEvent(event);
        }
      }
    }
  }

  function handleChange(event: any, maskedValue: any, _3: any) {
    setValue(maskedValue);
  }

  console.log('===> value', value)

  return (
    <div>
      <h2>Currency Input</h2>
      <CurrencyInput 
        value="000" 
        // autoFocus={true}
        options={config}/>
      <h2>Currency Input w/ math</h2>
      <CurrencyCalculatorInput 
        ref={inputRef}
        value="000" 
        onChangeEvent={handleChange}
        options={configCalculator}/>
      <div>
          <table>
            <tbody>
                <tr>
                    <td data-value="7" onClick={handleClick}><span>7</span></td>
                    <td data-value="8" onClick={handleClick}><span>8</span></td>
                    <td data-value="9" onClick={handleClick}><span>9</span></td>
                    <td className="operators-column" rowSpan={3}>
                        <div className="operators">
                            <span data-operator="/" onClick={handleClick}>÷</span>
                            <span data-operator="*" onClick={handleClick}>x</span>
                            <span data-operator="+" onClick={handleClick}>+</span>
                            <span data-operator="-" onClick={handleClick}>-</span>
                        </div>
                    </td>
                    <td data-operator="L" onClick={handleClick}>
                        <span>{`<-`}</span>
                    </td>
                </tr>
                <tr>
                    <td data-value="4" onClick={handleClick}><span>4</span></td>
                    <td data-value="5" onClick={handleClick}><span>5</span></td>
                    <td data-value="6" onClick={handleClick}><span>6</span></td>
                    <td className="custom" rowSpan={3} data-operator="=" onClick={handleClick}>
                        <span className="equal"> = </span>
                    </td>
                </tr>
                <tr>
                    <td data-value="1" onClick={handleClick}><span>1</span></td>
                    <td data-value="2" onClick={handleClick}><span>2</span></td>
                    <td data-value="3" onClick={handleClick}><span>3</span></td>
                </tr>
                <tr>
                    <td data-value=",00" onClick={handleClick}><span>,00</span></td>
                    <td data-value=",0" onClick={handleClick}><span>0</span></td>
                    <td data-value="C" onClick={handleClick} className="custom"><span className="clear">CE</span></td>
                    <td className="custom" onClick={() => {}}><span className="done">OK</span></td>
                </tr>
            </tbody>
        </table>
      </div>
  </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
