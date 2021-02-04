import React, { InputHTMLAttributes, ReactChild } from 'react';
import useCurrencyFormat, {
  CurrencyFormatProps,
} from '../../hooks/useCurrencyFormat';

type omitFields = 'type' | 'onClick' | 'onKeyDown' | 'onChange';

export interface CurrencyInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, omitFields> {
  /** can pass custom text or image */
  children?: ReactChild;
  onChangeEvent?(
    inputElement: EventTarget & HTMLInputElement,
    maskedValue: string,
    value: string
  ): void;
  value: string;
  autoFocus?: boolean;
  /** 
        precision?: number;
        style?: "currency" | "decimal";
        locale?: string;
        i18nCurrency?: string;
        allowNegative?: boolean;
        alwaysNegative?: boolean;
    */
  options?: CurrencyFormatProps;
}

export const CurrencyInput = React.memo(React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>((props, ref) => {
  const { children, value, options, onChangeEvent, ...otherProps } = props;

  const [
    formattedValue,
    handleOnChange,
    handleOnKeyDown,
    handleOnClick,
  ] = useCurrencyFormat(value, { ...options, onChangeCallBack: onChangeEvent });

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
