import { useState, useEffect, useCallback } from 'react';
import {
  basicCalculator,
  extractNumberFromMathematicExpression,
  isMathematicOperation,
  removeLeadingZeroes,
  removeNonNumerics,
  removeNonMathematicOperation,
  isMathematicOperator,
  removeNonNumericsExceptDash,
  stringToCurrency,
  removeEmpty,
  replaceAllCalc,
  replaceAllNoCalc,
} from '../../utils';

type returnCurrencyCalculatorFormat = [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  (e: React.KeyboardEvent<HTMLInputElement>) => void,
  (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
];

type styles = 'currency' | 'decimal';

export interface CurrencyFormatCalculatorProps {
  precision?: number;
  style?: styles;
  locale?: string;
  i18nCurrency?: string;
  onChangeCallBack?(
    inputElement: EventTarget & HTMLInputElement,
    maskedValue: string,
    value: string
  ): void;
}

const DefaultFormatProps = {
  precision: 2,
  style: 'currency',
  locale: 'pt-BR',
  i18nCurrency: 'BRL',
  onChangeCallBack: () => {},
};

function useCurrencyFormatCalculator(
  initialValue: string = '000',
  options?: CurrencyFormatCalculatorProps
): returnCurrencyCalculatorFormat {
  const [currency, setCurrency] = useState<string>('');

  const {
    precision,
    style,
    locale,
    i18nCurrency,
    onChangeCallBack,
  } = Object.assign(
    DefaultFormatProps,
    removeEmpty<CurrencyFormatCalculatorProps>(options)
  );

  // format string to currency
  const formatCurrency = useCallback(
    (rawVal: string, styleCurrency: styles = 'decimal') => {
      return Number(stringToCurrency(rawVal, precision)).toLocaleString(
        locale,
        {
          style: styleCurrency,
          currency: i18nCurrency,
          minimumIntegerDigits: 1,
          minimumFractionDigits: precision,
        }
      );
    },
    [precision, i18nCurrency, locale]
  );

  // initialize
  useEffect(() => {
    setCurrency(
      formatCurrency(
        removeLeadingZeroes(removeNonNumericsExceptDash(initialValue)),
        style
      )
    );
  }, [initialValue, style, formatCurrency]);

  const callbackChange = useCallback(
    (inputElement: EventTarget & HTMLInputElement, maskedValue: string) => {
      onChangeCallBack(
        inputElement,
        maskedValue,
        stringToCurrency(maskedValue, precision)
      );
    },
    [precision, onChangeCallBack]
  );

  // removeNonNumerics any entered value
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      e.preventDefault();

      let value = replaceAllCalc(e.currentTarget.value);

      let newValue = value;

      const lastChar = value.slice(-1);
      if (['-', '+', '/', '*', '='].includes(lastChar)) {
        if (isMathematicOperation(value.replace(/\s/g, ''))) {
          const values = extractNumberFromMathematicExpression(
            value.slice(0, -1)
          );
          if (values) {
            const total = basicCalculator(
              values.operation,
              values.firstValue,
              values.lastValue,
              precision
            );
            if (lastChar === '=') {
              newValue = formatCurrency(total, style);
            } else {
              newValue = `${formatCurrency(total)} ${lastChar} `;
            }
          }
        } else {
          const onlyOperation = removeNonMathematicOperation(value);
          if (lastChar === '=') {
            newValue = formatCurrency(
              removeNonNumericsExceptDash(onlyOperation),
              style
            );
          } else {
            const dash = onlyOperation.charAt(0) === '-' ? '-' : '';
            const lastTwoCharacter = onlyOperation.replace(/\s/g, '').slice(-2);
            const charToRemove = isMathematicOperator(lastTwoCharacter[0])
              ? lastTwoCharacter[0]
              : '';
            let valueWithoutOperator = onlyOperation
              .split(charToRemove)
              .join('')
              .trim();
            valueWithoutOperator =
              valueWithoutOperator.charAt(0) === '-'
                ? valueWithoutOperator.substring(1)
                : valueWithoutOperator;
            newValue = `${dash}${valueWithoutOperator
              .split(lastChar)
              .join('')
              .trim()} ${lastChar} `;
          }
        }
      } else {
        const values = extractNumberFromMathematicExpression(value);
        if (values) {
          let lastValue = removeNonMathematicOperation(values.lastValue);
          if (['-', '+'].includes(values.operation)) {
            lastValue = formatCurrency(removeNonNumerics(values.lastValue));
          }
          newValue = `${values.firstValue} ${values.operation} ${lastValue}`;
        } else {
          newValue = formatCurrency(removeNonNumericsExceptDash(value), style);
        }
      }

      newValue = replaceAllNoCalc(newValue);
      callbackChange(e.currentTarget, newValue);
      setCurrency(newValue);
    },
    [precision, style, callbackChange, formatCurrency]
  );

  // handle click
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
      const value = e.currentTarget.value;

      // cursor to right
      e.currentTarget.setSelectionRange(value.length, value.length);
    },
    []
  );

  // handle detection of delete
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      const value = replaceAllCalc(e.currentTarget.value);

      if (['Delete', 'Backspace'].includes(e.key)) {
        e.preventDefault();
        let newValue = value;
        if (value.length > 1) {
          const valueWithoutSignal = value.replace(/\s/g, '').substring(1);
          const operator = ['-', '+', '/', '*'].find(op =>
            valueWithoutSignal.includes(op)
          );
          const newCurrencyValue = value.substring(0, value.length - 1);
          if (operator) {
            const values = extractNumberFromMathematicExpression(
              value.slice(0, -1)
            );
            if (values) {
              const zeros = Array.from({ length: precision }, _ => '0').join(
                ''
              );
              if (removeNonNumerics(values.lastValue) === zeros) {
                newValue = `${values.firstValue} ${values.operation}`;
              } else if (values.lastValue === '') {
                newValue = formatCurrency(values.firstValue, style);
              } else {
                let lastValue = removeNonMathematicOperation(values.lastValue);
                if (['-', '+'].includes(values.operation)) {
                  lastValue = formatCurrency(values.lastValue);
                }
                newValue = `${values.firstValue} ${values.operation} ${lastValue}`;
              }
            } else {
              newValue = newCurrencyValue.trim();
            }
          } else {
            const zeros = Array.from({ length: precision }, _ => '0').join('');
            const removeDash =
              removeNonNumericsExceptDash(newCurrencyValue) === `-${zeros}`
                ? removeNonNumerics(newCurrencyValue)
                : removeNonNumericsExceptDash(newCurrencyValue);
            newValue = formatCurrency(removeDash, style);
          }
        } else {
          const zerosFormatted = formatCurrency(
            Array.from({ length: precision + 1 }, _ => '0').join(''),
            style
          );
          newValue = zerosFormatted;
        }

        newValue = replaceAllNoCalc(newValue);
        callbackChange(e.currentTarget, newValue);
        setCurrency(newValue);
      }

      // keep cursor in the right
      e.currentTarget.setSelectionRange(value.length, value.length);
    },
    [precision, style, callbackChange, formatCurrency]
  );

  return [currency, onChange, onKeyDown, onClick];
}

export default useCurrencyFormatCalculator;
