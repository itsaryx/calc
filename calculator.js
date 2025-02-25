const romanToDecimal = (roman) => {
    const romanValues = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    };

    roman = roman.toUpperCase();
    let total = 0;
    let prevValue = 0;

    for (let i = roman.length - 1; i >= 0; i--) {
        const currentValue = romanValues[roman[i]];
        
        if (currentValue >= prevValue) {
            total += currentValue;
        } else {
            total -= currentValue;
        }
        
        prevValue = currentValue;
    }

    return total;
};

const decimalToRoman = (num) => {
    if (num <= 0) return 'N';
    
    const romanNumerals = [
        { value: 1000, numeral: 'M' },
        { value: 900, numeral: 'CM' },
        { value: 500, numeral: 'D' },
        { value: 400, numeral: 'CD' },
        { value: 100, numeral: 'C' },
        { value: 90, numeral: 'XC' },
        { value: 50, numeral: 'L' },
        { value: 40, numeral: 'XL' },
        { value: 10, numeral: 'X' },
        { value: 9, numeral: 'IX' },
        { value: 5, numeral: 'V' },
        { value: 4, numeral: 'IV' },
        { value: 1, numeral: 'I' }
    ];

    let result = '';
    
    for (let item of romanNumerals) {
        while (num >= item.value) {
            result += item.numeral;
            num -= item.value;
        }
    }

    return result;
};

let firstInput = '';
let secondInput = '';
let currentOperation = null;

function appendToInput(value) {
    const currentInput = document.getElementById('current-input');
    const validRomanChars = ['I', 'V', 'X', 'L', 'C', 'D', 'M'];
    
    if (currentInput.textContent.length >= 15) {
        currentInput.textContent = 'Too Long';
        setTimeout(() => {
            currentInput.textContent = '';
        }, 1000);
        return;
    }

    if (validRomanChars.includes(value.toUpperCase())) {
        playKeySound();
        currentInput.textContent += value.toUpperCase();
    }
}

function clearInput() {
    document.getElementById('current-input').textContent = '';
    document.getElementById('previous-calculation').textContent = '';
    firstInput = '';
    secondInput = '';
    currentOperation = null;
}

function setOperation(operation) {
    const currentInput = document.getElementById('current-input');
    firstInput = currentInput.textContent;
    currentOperation = operation;
    currentInput.textContent = '';
}

function calculate() {
    const currentInput = document.getElementById('current-input');
    const previousCalculation = document.getElementById('previous-calculation');
    
    secondInput = currentInput.textContent;

    if (!firstInput || !secondInput || !currentOperation) return;

    try {
        const num1 = romanToDecimal(firstInput);
        const num2 = romanToDecimal(secondInput);
        let result;

        switch(currentOperation) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
        }

        if (result < 0) {
            currentInput.textContent = 'Invalid';
            return;
        }

        const romanResult = decimalToRoman(result);
        
        previousCalculation.textContent = `${firstInput} ${currentOperation} ${secondInput} =`;
        currentInput.textContent = romanResult;
        
        firstInput = romanResult;
        secondInput = '';
        currentOperation = null;
    } catch (error) {
        currentInput.textContent = 'Invalid';
    }
}

function playKeySound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
    } catch (error) {
        console.log('Audio feedback not available');
    }
}

function handleKeyboardInput(event) {
    const key = event.key.toUpperCase();
    const validRomanChars = ['I', 'V', 'X', 'L', 'C', 'D', 'M'];
    const operationKeys = {'+': '+', '-': '-', '*': 'x'};

    if (validRomanChars.includes(key)) {
        appendToInput(key);
    }
    
    if (operationKeys[key] || key === '*') {
        setOperation(key === '*' ? '*' : key);
    }

    if (key === 'ENTER' || key === '=') {
        calculate();
    }

    if (key === 'BACKSPACE' || key === 'DELETE') {
        clearInput();
    }
}

document.addEventListener('keydown', handleKeyboardInput);
