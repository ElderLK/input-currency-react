import React from 'react';
import { Meta, Story } from '@storybook/react';
import Locales from '../src/constants/Locales';
import Currencies from '../src/constants/Currencies';
import { CurrencyInput, CurrencyInputProps } from '../src/components/CurrencyInput';
import { CurrencyCalculatorInput, CurrencyCalculatorInputProps } from '../src/components/CurrencyCalculatorInput';

const meta: Meta = {
  title: 'Currency Input',
  component: CurrencyInput,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
    layout: "centered"
  },
};

export default meta;

const Template: Story<CurrencyInputProps> = args => <CurrencyInput {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = { value: '-400', 
  onChangeEvent(inputElement, maskedValue, value){
    // console.log('inputElement', inputElement)
    // console.log('maskedValue', maskedValue)
    // console.log('value', value)
    console.log('Call onChange');
  } 
};

const Template2: Story<CurrencyCalculatorInputProps> = args => <CurrencyCalculatorInput {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const withCalculator = Template2.bind({});

withCalculator.args = { value: '200',
  options: { 
    i18nCurrency: Currencies["Brazilian Real"],
    locale: Locales["Portuguese (Brazil)"]
  },
  onChangeEvent(inputElement, maskedValue, value){
    // console.log('inputElement withCalculator', inputElement)
    // console.log('maskedValue withCalculator', maskedValue)
    // console.log('value withCalculator', value)
    console.log('Call onChange');
  } 
};
