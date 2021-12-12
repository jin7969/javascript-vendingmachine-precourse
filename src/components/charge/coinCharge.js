import { $ } from '../../utils/querySelector.js';
import { COIN_UNITS, ERROR_MESSAGE, STANDARD, STORAGE_NAME } from '../../utils/constants.js';
import { isDivideByTen } from '../../utils/validation.js';
import { showConvertedCoins, coinChargeTemplate } from './coinChargeTemplate.js';
import { getChargeStorage, setChargeStorage } from '../storage/coin.js';
import { showCurrentAmount } from '../../view/view.js';

let currentAmount = STANDARD.CURRENT_MONEY;
let convertedCoins = { 500: 0, 100: 0, 50: 0, 10: 0 };
const vendingMachineChargeAmountId = '#vending-machine-charge-amount';

const convertAmountIntoCoins = (amount) => {
  let remainAmount = amount;
  while (remainAmount > 0) {
    // eslint-disable-next-line no-loop-func
    const coinUnit = COIN_UNITS.filter((coin) => coin <= remainAmount);
    // eslint-disable-next-line no-undef
    const pickedCoin = MissionUtils.Random.pickNumberInList(coinUnit);
    convertedCoins[pickedCoin] += 1;
    remainAmount -= pickedCoin;
  }
};

// eslint-disable-next-line consistent-return
const handleCoinChargeSubmit = (event) => {
  event.preventDefault();
  const chargedCoin = Number($('#vending-machine-charge-input').value);

  if (isDivideByTen(chargedCoin)) {
    return alert(ERROR_MESSAGE.NOT_DIVIDE_BY_TEN);
  }

  currentAmount += chargedCoin;
  showCurrentAmount(vendingMachineChargeAmountId, currentAmount);
  setChargeStorage(STORAGE_NAME.AMOUNT, currentAmount);
  convertAmountIntoCoins(chargedCoin);
  showConvertedCoins(convertedCoins);
  setChargeStorage(STORAGE_NAME.COIN, convertedCoins);
};

export const showCoinCharge = () => {
  $('#app-container').innerHTML = coinChargeTemplate;
  const storedCharge = getChargeStorage(STORAGE_NAME.COIN);
  const storedAmount = getChargeStorage(STORAGE_NAME.AMOUNT);

  if (storedCharge) {
    currentAmount = storedAmount;
    convertedCoins = storedCharge;
    showConvertedCoins(storedCharge);
    showCurrentAmount(vendingMachineChargeAmountId, storedAmount);
  }

  $('form').addEventListener('submit', handleCoinChargeSubmit);
};
