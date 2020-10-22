# Currency input React w/ Hooks

This libraries propose to introduce a hooks capable of formate currencies and calculate directly in the input (add, subtract, division and multiplication).

> This component libraries use `TypeScript`, `Hooks`.

## Install

```bash
  npm install input-currency-react  # or yarn add input-currency-react
```

## How to use Components

### Only Currency Input

#### Demo:
<a>
  <img src="https://res.cloudinary.com/elderlk/image/upload/v1603408384/react-currency-input/react-currency-input_ese6od.gif" alt="animated square" />
</a>

#### Ex. Code:

```tsx
  import React from react;
  import { 
    CurrencyInput, 
    Currencies, 
    Locales 
  } from 'react-currency-input';

  const handleOnChange = (inputElement, maskedValue, value) => {};

  <CurrencyInput 
    value="000" // Initial value
    options={{ 
      precision: 2,
      style: "currency",
      allowNegative: "true",
      alwaysNegative: "false",
      locale: Locales["English (United States)"], // Format Type
      i18nCurrency: Currencies["US Dollar"] // Symbol
    }}
    autoFocus={true}
    onChangeEvent={handleOnChange}
  />
```
### Currency Input Can Math

#### Demo:

<a>
  <img src="https://res.cloudinary.com/elderlk/image/upload/v1603407710/react-currency-input/react-currency-input-math_sh64fv.gif" alt="animated square" />
</a>

#### Ex. Code:

```tsx
  import { 
    CurrencyCalculatorInput, 
    Currencies, 
    Locales 
  } from 'react-currency-input';

  const handleOnChange = (inputElement, maskedValue, value) => {};

  <CurrencyCalculatorInput 
    value="000" // Initial value
    options={{ 
      precision: 3,
      style: "decimal",
      locale: LocalesLocales["Portuguese (Brazil)"], 
      i18nCurrency: Currencies["Brazilian Real"]
    }}
    autoFocus={true}
    onChangeEvent={handleOnChange}
  />
```

## How to use Hooks

```tsx
  import { 
    CurrencyInputProps, 
    useCurrencyFormat, 
  } from 'react-currency-input';

  const MyCustomCurrencyInput:React.FC<CurrencyInputProps> = (props) => {
    const { value, options, onChangeEvent, ...otherProps } = props;
    const [
        formattedValue, 
        handleOnChange,
        handleOnKeyDown, 
        handleOnClick 
    ] = useCurrencyFormat(value, 
    {...options, 
    onChangeCallBack: onChangeEvent }); // or useCurrencyFormatCalculator

      return (
          <input 
              type="text" 
              style={{ textAlign:"right" }}
              onChange={ handleOnChange }
              onKeyDown={ handleOnKeyDown }
              onClick={ handleOnClick }
              value={ formattedValue }
              {...otherProps} />
      )
  }
```

## Options

### Options input

Option            | Default Value | Description
----------------- | ------------- | -----------------------------------------------------------------------------
value             | 0             | The initial value
onChangeEvent     | n/a           | Callback function to handle value change
autoFocus         | false         | Autofocus
options           | default hooks | hooks props


### Options hooks

Props             | Default Value | Description
----------------- | ------------- | -----------------------------------------------------------------------------
precision         | 2             | Fraction Digits 
style             | currency      | currency or decimal(**Remove symbol**)
locale            | pt-BR         | Country Code Reference(**Currency symbol**) 
i18nCurrency      | BRL           | String i18n(**Format Type**)
allowNegative *   | true          | Allow negative numbers in the input
alwaysNegative *  | false         | Prefix negative  

**Note:** *not present in useCurrencyFormatCalculator

***Note:**  This library use [toLocaleString()](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) to format the value.
