const API_KEY = "72dc61cb5bfb5ec7390604bd";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

const getSupportedCodes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/codes`)
        const data = await response.json();
        const codes = data["supported_codes"];
        return codes;
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return [];
    }
}

const getConversionRate = async (baseCode, targetCode) => {
    try {
        const response = await fetch(`${BASE_URL}/pair/${baseCode}/${targetCode}`)
        const data = await response.json();
        const rate = data["conversion_rate"];
        return rate;
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return null;
    }
}

const baseUnit = document.querySelector("#base-unit");
const targetRate = document.querySelector(".target-rate");

const inputBaseAmount = document.querySelector("#base-amount");
const selectBaseCode = document.querySelector("#base-code");
const inputTargetAmount = document.querySelector("#target-amount");
const selectTargetCode = document.querySelector("#target-code");

const errorMsg = document.querySelector(".error-message");

let supportedCodes = [];
let conversionRate = 0;

const updateExchangeRate = async () => {
    const baseCode = selectBaseCode.value;
    const targetCode = selectTargetCode.value;

    conversionRate = await getConversionRate(baseCode, targetCode);
    if (!conversionRate) {
        errorMsg.textContent = "Cannot get the conversion rate";
        return;
    }
    baseUnit.textContent = `1 ${baseCode} equals`;
    targetRate.textContent = `${conversionRate} ${targetCode}`;

}

const initialize = async () => {
    // Get supported code from the API
    supportedCodes = await getSupportedCodes();
    if (!supportedCodes.length) {
        errorMsg.textContent = "No Supported Codes"
        return;
    }

    // Put Options into the select box
    supportedCodes.forEach((code) => {
        const baseOption = document.createElement("option");
        baseOption.value = code[0];
        baseOption.textContent = code[1];
        selectBaseCode.appendChild(baseOption);


        const targetOption = document.createElement("option");
        targetOption.value = code[0];
        targetOption.textContent = code[1];
        selectTargetCode.appendChild(targetOption);
    })
    // Set VND to USD as default
    selectBaseCode.value = "VND";
    selectTargetCode.value = "USD"
    // Update exchange rate
    await updateExchangeRate();
}
selectBaseCode.addEventListener("change", updateExchangeRate);
selectTargetCode.addEventListener("change", updateExchangeRate);
inputBaseAmount.addEventListener("input", () => {
    inputTargetAmount.value = inputBaseAmount.value * conversionRate;
});
inputTargetAmount.addEventListener("input", () => {
    inputBaseAmount.value = inputTargetAmount.value / conversionRate;
});
initialize();