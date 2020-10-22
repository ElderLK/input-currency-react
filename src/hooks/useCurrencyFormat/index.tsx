import { useState, useEffect, useCallback } from "react";
import { removeLeadingZeroes, removeNonNumerics, removeNonNumericsExceptDash, stringToCurrency } from '../../utils';

type returnCurrencyFormat = [ 
    string, 
    (e: React.ChangeEvent<HTMLInputElement>) => void, 
    (e: React.KeyboardEvent<HTMLInputElement>) => void,
    (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
];

export interface CurrencyFormatProps {
  precision?: number;
  style?: "currency" | "decimal";
  locale?: string;
  i18nCurrency?: string;
  allowNegative?: boolean;
  alwaysNegative?: boolean;
  onChangeCallBack?(inputElement: EventTarget & HTMLInputElement, maskedValue: string, value: string): void;
}

const DefaultFormatProps = {
  precision: 2,
  style: "currency",
  locale: "pt-BR",
  i18nCurrency: "BRL",
  allowNegative: true,
  alwaysNegative: false,
  onChangeCallBack: () => {}
}

function useCurrencyFormat(initialValue:string = "000", options?: CurrencyFormatProps): returnCurrencyFormat {
    const [currency, setCurrency] = useState<string>('');
    const { 
      precision, 
      style, 
      locale, 
      i18nCurrency, 
      allowNegative, 
      alwaysNegative,
      onChangeCallBack 
    } = Object.assign(DefaultFormatProps, options);

    // initialize
    useEffect(() => {
        const operator = initialValue.charAt(0) === "-" || alwaysNegative ? "-" : "";
        setCurrency(`${operator}${formatCurrency(removeNonNumerics(initialValue))}`);
    }, [initialValue]);

    const callbackChange = useCallback((inputElement: EventTarget & HTMLInputElement, maskedValue: string) => {
      onChangeCallBack(inputElement, maskedValue, stringToCurrency(maskedValue, precision))
    }, [precision])

    // removeNonNumerics any entered value
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        let value = e.currentTarget.value;
        const lastEntry = value.substring(value.length - 1);
        
        if(!alwaysNegative && allowNegative) {
          if(lastEntry === "-") {
            value = `-${value.replaceAll('-', '')}`;
          } else if(lastEntry === "+") {
            value = `${value.replaceAll('-', '')}`;
          } 
        }
        const newValue = formatCurrency(removeNonNumericsExceptDash(value)); 
        callbackChange(e.currentTarget, newValue)
        setCurrency(newValue);
    }, []);

    // handle click
    const onClick = useCallback((e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {

      // cursor to right
      e.currentTarget.setSelectionRange(currency.length, currency.length);
    }, [currency])
    
    // handle detection of delete
    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void  => {
      if (["Backspace", "Delete"].includes(e.key)) {
            e.preventDefault();
            const sanitized = removeLeadingZeroes(removeNonNumerics(currency));
            let newValue = '';
            if(sanitized.length > 1) {
              const operation = currency.charAt(0) === '-' ? '-' : '';
              const value = `${operation}${sanitized.substring(0, sanitized.length - 1)}`;
              newValue = formatCurrency(value);
            } else {
              const zeros = formatCurrency(Array.from({length: precision + 1}, (_) => '0').join(''));
              newValue = `${alwaysNegative ? '-' : ''}${zeros}`;
            }
            callbackChange(e.currentTarget, newValue);
            setCurrency(formatCurrency(newValue));
        }
    
      // keep cursor in the right
      e.currentTarget.setSelectionRange(currency.length, currency.length);
    }, [currency]);

  // format string to currency
  const formatCurrency = useCallback((rawVal: string) => {
    return Number(stringToCurrency(rawVal, precision)).toLocaleString(locale, {
      style,
      currency: i18nCurrency,
      minimumIntegerDigits: 1,
      minimumFractionDigits: precision
    });
  }, [ currency, precision ]);

  return [currency, onChange, onKeyDown, onClick];
}  

export default useCurrencyFormat;
