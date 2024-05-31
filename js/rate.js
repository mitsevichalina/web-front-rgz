document.addEventListener('DOMContentLoaded', () => {
    let calcSideFrom = document.querySelectorAll('.calc_switcher[data-id="from"] .calc_switcher_item')
    let calcSideTo = document.querySelectorAll('.calc_switcher[data-id="to"] .calc_switcher_item')
    let calcReverse = document.querySelector('.calc_reverse')
    let inputBoxRate = document.querySelector('.calc_input_box[data-id="from"] .calc_input_box_rate')
    let outputBoxRate = document.querySelector('.calc_input_box[data-id="to"] .calc_input_box_rate')

    let inputRateFrom = document.querySelector('#fromRate')
    let inputRateTo = document.querySelector('#toRate')

    async function updateRates() {
        let activeFrom = document.querySelector('.calc_switcher[data-id="from"] .calc_switcher_item.active')
        let activeTo = document.querySelector('.calc_switcher[data-id="to"] .calc_switcher_item.active')

        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        const data = await response.json()
        const listValues = data.Valute

        let fromCurrency = activeFrom.textContent
        let toCurrency = activeTo.textContent

        if (fromCurrency === toCurrency) {
            inputBoxRate.textContent = `1 ${fromCurrency} = 1 ${toCurrency}`
            outputBoxRate.textContent = `1 ${toCurrency} = 1 ${fromCurrency}`
            inputRateTo.value = inputRateFrom.value
            return;
        }

        let fromRate, fromNominal, toRate, toNominal

        if (fromCurrency === "RUB") {
            fromRate = 1
            fromNominal = 1
        } else {
            fromRate = listValues[fromCurrency].Value
            fromNominal = listValues[fromCurrency].Nominal
        }

        if (toCurrency === "RUB") {
            toRate = 1
            toNominal = 1
        } else {
            toRate = listValues[toCurrency].Value
            toNominal = listValues[toCurrency].Nominal
        }

        let conversionRateFromTo = ((fromRate / fromNominal) / (toRate / toNominal)).toFixed(4)
        let conversionRateToFrom = ((toRate / toNominal) / (fromRate / fromNominal)).toFixed(4)

        inputBoxRate.textContent = `1 ${fromCurrency} = ${conversionRateFromTo} ${toCurrency}`
        outputBoxRate.textContent = `1 ${toCurrency} = ${conversionRateToFrom} ${fromCurrency}`

        let inputAmount = parseFloat(inputRateFrom.value)
        if (!isNaN(inputAmount)) {
            inputRateTo.value = (inputAmount * conversionRateFromTo).toFixed(4)
        }
    }

    function switchActiveClass(itemList, target) {
        itemList.forEach(item => {
            item.classList.remove('active')
        });

        target.classList.add('active')
        updateRates()
    }

    calcSideFrom.forEach((item) => {
        item.addEventListener('click', () => {
            switchActiveClass(calcSideFrom, item)
        })
    })

    calcSideTo.forEach((item) => {
        item.addEventListener('click', () => {
            switchActiveClass(calcSideTo, item)
        })
    })

    calcReverse.addEventListener('click', () => {
        let activeFrom = document.querySelector('.calc_switcher[data-id="from"] .calc_switcher_item.active');
        let activeTo = document.querySelector('.calc_switcher[data-id="to"] .calc_switcher_item.active');

        activeFrom.classList.remove('active')
        activeTo.classList.remove('active')
        
        calcSideFrom.forEach((item) => {
            if (item.textContent == activeTo.textContent) {
                item.classList.add('active')
            }
        })

        calcSideTo.forEach((item) => {
            if (item.textContent == activeFrom.textContent) {
                item.classList.add('active')
            }
        })

        updateRates()
    });

    inputRateFrom.addEventListener('input', () => {
        let inputAmount = parseFloat(inputRateFrom.value);
        let conversionRate = parseFloat(inputBoxRate.textContent.split('=')[1].split(' ')[1]);
        if (!isNaN(inputAmount) && !isNaN(conversionRate)) {
            inputRateTo.value = (inputAmount * conversionRate).toFixed(4);
        }
    });

    inputRateTo.addEventListener('input', () => {
        let outputAmount = parseFloat(inputRateTo.value);
        let conversionRate = parseFloat(outputBoxRate.textContent.split('=')[1].split(' ')[1]);
        if (!isNaN(outputAmount) && !isNaN(conversionRate)) {
            inputRateFrom.value = (outputAmount * conversionRate).toFixed(4);
        }
    });

    updateRates()
});