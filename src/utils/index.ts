import { Operations } from '../constants/Operations';

type GenericObject = { [key: string]: any };

// remove everything except numerics
export function removeNonNumerics(raw: string) {
  return raw ? raw.replace(/[^0-9]/g, '') : '';
}

/*eslint-disable */
// remove everything except numerics and dash
export function removeNonNumericsExceptDash(raw: string) {
  return raw ? raw.replace(/[^\d-]/g, '') : '';
}

// remove leading zeroes
export function removeLeadingZeroes(val: string) {
  return val ? val.replace(/^0+/, '') : '';
}

// string has operator
export function removeNonMathematicOperation(val: string) {
  return val ? val.replace(/[^0-9\+\-\*\/\.\,]/g, '') : val;
}

// string has operator
export function isMathematicOperation(val: string) {
  return (
    val.match(/^[-+]?(\d+[.,]?)+\d*[-+/*]+(\d+[.,]?)+\d*[-+/*=]+$/g) !== null
  );
}
/*eslint-enable */

// string has operator
export function isMathematicOperator(val: string) {
  return val.match(/[-+/*]/g) !== null;
}

export function stringToCurrency(numberNum: string, precision: number): string {
  let operator = numberNum.charAt(0) === '-' ? '-' : '';
  const onlyNumber = removeNonNumerics(numberNum);
  let decimalParcel = onlyNumber.substring(onlyNumber.length - precision);

  if (decimalParcel.length < precision) {
    const zeros = Array.from(
      { length: precision - decimalParcel.length },
      _ => '0'
    ).join('');
    decimalParcel = `${zeros}${decimalParcel}`;
  }
  const integerParcel =
    onlyNumber.substring(0, onlyNumber.length - precision) || '0';
  return `${operator}${integerParcel}.${decimalParcel}`;
}

const math_it_up: {
  [key: string]: (numOne: string, numTwo: string) => number;
} = {
  '+': function(x: string, y: string): number {
    return parseFloat(x) + parseFloat(y);
  },
  '-': function(x: string, y: string): number {
    return parseFloat(x) - parseFloat(y);
  },
  x: function(x: string, y: string): number {
    return parseFloat(x) * parseFloat(y);
  },
  '*': function(x: string, y: string): number {
    return parseFloat(x) * parseFloat(y);
  },
  '/': function(x: string, y: string): number {
    return y === '0' ? 0.0 : parseFloat(x) / parseFloat(y);
  },
  '÷': function(x: string, y: string): number {
    return y === '0' ? 0.0 : parseFloat(x) / parseFloat(y);
  },
};

export const NumberToString = (
  numberNum: number,
  precision: number
): string => {
  const round = Math.pow(10, precision);
  const splitNum = String(
    (Math.round((numberNum) * round) / round).toFixed(
      precision
    )
  ).split('.');

  let sinal: string = '';
  let numberInter: any = splitNum[0];
  if (['+', '-'].includes(splitNum[0][0])) {
    sinal = splitNum[0][0];
    numberInter = splitNum[0].substr(1);
  }

  numberInter = numberInter.split(/(?=(?:...)*$)/).join('.');
  if (splitNum.length > 1) return `${sinal}${numberInter}.${splitNum[1]}`;

  return `${sinal}${numberInter}`;
};

export function StringFormatUSD(numberString: string, precision: number) {
  const onlyNumberOne = removeNonNumericsExceptDash(numberString);
  if (precision > 0) {
    const fractionalNumOne = onlyNumberOne.slice(precision * -1);
    const integerDigitsNumOne = onlyNumberOne.slice(0, precision * -1);
    return `${integerDigitsNumOne}.${fractionalNumOne}`;
  }
  return onlyNumberOne;
}

export function basicCalculator(
  operation: Operations,
  numberOne: string,
  numberTwo: string,
  precision: number
): string {
  let numOne = StringFormatUSD(numberOne, precision);
  let numTwo = numberTwo;
  if (operation === '+' || operation === '-') {
    numTwo = StringFormatUSD(numberTwo, precision);
  } else if (numberTwo.includes('.') && numberTwo.includes(',')) {
    const [lastdot, lastcomma] = [
      numberTwo.lastIndexOf('.'),
      numberTwo.lastIndexOf(','),
    ];
    if (lastdot > lastcomma) {
      numberTwo = numberTwo.split(',').join('');
      numberTwo = `${numberTwo
        .substring(0, lastdot)
        .split('.')
        .join('')}${numberTwo.substring(lastdot)}`;
    } else {
      numberTwo = numberTwo.split('.').join('');
      numberTwo = `${numberTwo
        .substring(0, lastcomma)
        .split(',')
        .join('')}${numberTwo.substring(lastcomma)}`;
    }
  }

  let total = Number(math_it_up[operation](numOne, numTwo));

  return NumberToString(total, precision);
}

export function extractNumberFromMathematicExpression(value: string) {
  const dash = value.charAt(0) === '-' ? '-' : '';
  const valueWithoutSignal = dash
    ? value.replace(/\s/g, '').substring(1)
    : value.replace(/\s/g, '');
  const lastOperator = ['-', '+', '/', '*'].find(op =>
    valueWithoutSignal.includes(op)
  );
  if (lastOperator) {
    const values = valueWithoutSignal.split(lastOperator);
    const firstValue = `${dash}${values[0]}`;
    const lastValue = values[values.length - 1];
    return {
      firstValue,
      lastValue,
      operation: lastOperator as Operations,
    };
  }
  return null;
}

export function removeEmpty<T extends GenericObject>(obj: T | undefined) {
  if (obj === undefined) return undefined;
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key]);
    else if (obj[key] === undefined) delete obj[key];
  });
  return obj;
}

export function replaceAllCalc(value: string) {
  if (value.includes('x')) {
    value = value.split('x').join('*');
  }

  if (value.includes('÷')) {
    value = value.split('÷').join('/');
  }

  return value;
}

export function replaceAllNoCalc(value: string) {
  if (value.includes('*')) {
    value = value.split('*').join('x');
  }

  if (value.includes('/')) {
    value = value.split('/').join('÷');
  }

  return value;
}

export function deepClone(obj: any): any {
	// Se não for array ou objeto, retorna null
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}

	let cloned : any, i;

	// Handle: Date
	if (obj instanceof Date) {
		cloned = new Date(obj.getTime());
		return cloned;
	}

	// Handle: array
	if (obj instanceof Array) {
		let l;
		cloned = [];
		for (i = 0, l = obj.length; i < l; i++) {
			cloned[i] = deepClone(obj[i]);
		}

		return cloned;
	}

	// Handle: object
	cloned = {};
	for (i in obj) if (obj.hasOwnProperty(i)) {
		cloned[i] = deepClone(obj[i]);
	}

	return cloned;
}
