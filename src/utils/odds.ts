import { ODDS_FORMAT, Predictions } from '../api';

function fixFloatError(n: number) {
  return parseFloat(n.toPrecision(12));
}

function getMaxNumerator(f: number)
{
  var f2;
  var ixe = f.toString().indexOf("E");
  if (ixe === -1) ixe = f.toString().indexOf("e");
  if (ixe === -1) f2 = f.toString();
  else f2 = f.toString().substring(0, ixe);

  var digits = null;
  var ix = f2.toString().indexOf(".");
  if (ix === -1) digits = f2;
  else if (ix===0) digits = f2.substring(1, f2.length);
  else if (ix < f2.length) digits = f2.substring(0, ix) + f2.substring(ix + 1, f2.length);

  var L = digits;

  var numDigits = L!.toString().length;
  var L2 = f;
  var numIntDigits = L2.toString().length;
  if (L2 === 0) numIntDigits = 0;
  var numDigitsPastDecimal = numDigits - numIntDigits;

  var i;
  // @ts-ignore
  for (i=numDigitsPastDecimal; i>0 && L%2===0; i--) L/=2;
  // @ts-ignore
  for (i=numDigitsPastDecimal; i>0 && L%5===0; i--) L/=5;

  return L;
}

function approximateFraction(d: number, precision: number) {
  var numerators = [0, 1];
  var denominators = [1, 0];

  var maxNumerator = getMaxNumerator(d);
  var d2 = d;
  var calcD, prevCalcD = NaN;

  var acceptableError = Math.pow(10, -precision) / 2;

  for (var i = 2; i < 1000; i++)  {
    var L2 = Math.floor(d2);
    numerators[i] = L2 * numerators[i-1] + numerators[i-2];
    // @ts-ignore
    if (Math.abs(numerators[i]) > maxNumerator) return;

    denominators[i] = L2 * denominators[i-1] + denominators[i-2];

    calcD = numerators[i] / denominators[i];

    if (Math.abs(calcD - d) < acceptableError ||
      calcD === prevCalcD) {
      return numerators[i].toString() + "/" + denominators[i].toString();
    }

    d2 = 1/(d2-L2);
  }
}

export const oddsFormats = {
  // European/Decimal format
  eu: function(decimal: number) {
    return decimal.toFixed(2);
  },
  // American format
  us: function (decimal: number) {
    const value = Math.round(fixFloatError(decimal >= 2 ? (decimal - 1) * 100.0 : -100 / (decimal - 1)));
    if (value > 0) {
      return `+${value}`;
    }
    return value.toString();
  },
  // Hong Kong format
  hk: function(decimal: number) {
    return fixFloatError(decimal - 1).toFixed(2);
  },
  // UK/Fractional format
  uk: function(decimal: number) {
    return approximateFraction(decimal - 1, 2) || '';
  },
  // Malay format
  ma: function(decimal: number) {
    return fixFloatError(decimal <= 2.0 ? decimal - 1 : -1 / (decimal - 1)).toFixed(2);
  },
  // Indonesian format
  in: function(decimal: number) {
    return fixFloatError(decimal < 2.0 ? -1 / (decimal - 1) : decimal - 1).toFixed(2);
  },
}

export function formatOdd(dp3: number, format: ODDS_FORMAT): string {
  let odd: string;
  switch (format) {
    case ODDS_FORMAT.EU:
      odd = oddsFormats.eu(dp3);
      break;
    case ODDS_FORMAT.US:
      odd = oddsFormats.us(dp3);
      break;
    case ODDS_FORMAT.HK:
      odd = oddsFormats.hk(dp3);
      break;
    case ODDS_FORMAT.UK:
      odd = oddsFormats.uk(dp3);
      break;
    case ODDS_FORMAT.MA:
      odd = oddsFormats.ma(dp3);
      break;
    case ODDS_FORMAT.IN:
      odd = oddsFormats.in(dp3);
      break;
    default:
      odd = dp3.toString();
  }

  return odd;
}

export function oddPrediction(label: string, predictions: Partial<Predictions>): number | undefined {
  switch (label) {
    case '1':
      return predictions.home ?? 0;
    case 'X':
      return predictions.draw ?? 0;
    case '2':
      return predictions.away ?? 0;
    case 'Yes':
      return predictions.btts ?? 0;
    case 'No':
      return 100 - (predictions.btts ?? 0);
    default:
      return undefined;
  }
}
