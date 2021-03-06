import React, { InputHTMLAttributes, ReactChild } from 'react';
import useCurrencyFormatCalculator, {
  CurrencyFormatCalculatorProps,
} from '../../hooks/useCurrencyFormatCalculator';

type omitFields = 'type' | 'onClick' | 'onKeyDown' | 'onChange';

export interface CurrencyCalculatorInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, omitFields> {
  /** can pass custom text or image */
  children?: ReactChild;
  value: string;
  /** 
        precision?: number;
        style?: styles;
        locale?: string;
        i18nCurrency?: string;
    */
  options?: CurrencyFormatCalculatorProps;
  autoFocus?: boolean;
  onChangeEvent?(
    inputElement: EventTarget & HTMLInputElement,
    maskedValue: string,
    value: string
  ): void;
}

export const CurrencyCalculatorInput = React.memo(React.forwardRef<
  HTMLInputElement,
  CurrencyCalculatorInputProps
>((props, ref) => {
  const { children, value, options, onChangeEvent, ...otherProps } = props;

  const [
    formattedValue,
    handleOnChange,
    handleOnKeyDown,
    handleOnClick,
  ] = useCurrencyFormatCalculator(value, {
    ...options,
    onChangeCallBack: onChangeEvent,
  });

  return (
    <input
      style={{ textAlign: 'right' }}
      {...otherProps}
      type="text"
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
      onClick={handleOnClick}
      value={formattedValue}
      ref={ref}
    />
  );
}));
