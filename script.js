class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
            case '-':
                computation = prev - current;
                break;
            case '×':
            case '*':
                computation = prev * current;
                break;
            case '÷':
            case '/':
                if (current === 0) {
                    alert('Division by zero is not allowed.');
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    toggleSign() {
        if (this.currentOperand === '0' || this.currentOperand === '') return;
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.slice(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
    }

    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = this.formatNumber(current / 100);
        this.shouldResetScreen = true;
    }

    formatNumber(number) {
        const stringNumber = number.toString();
        if (stringNumber.includes('e')) return stringNumber;

        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.innerText =
                `${this.formatNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = this.previousOperand;
        }
    }
}

// DOM Elements
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-action]');
const equalsButton = document.querySelector('[data-action="equals"]');
const clearButton = document.querySelector('[data-action="clear"]');
const toggleSignButton = document.querySelector('[data-action="toggle-sign"]');
const percentageButton = document.querySelector('[data-action="percentage"]');
const decimalButton = document.querySelector('[data-action="decimal"]');

// Initialize calculator
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Event Listeners for number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        const number = button.getAttribute('data-number');
        calculator.appendNumber(number);
        calculator.updateDisplay();
    });
});

// Event Listeners for operation buttons
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        handleAction(action);
    });
});

function handleAction(action) {
    switch (action) {
        case 'add':
            calculator.chooseOperation('+');
            break;
        case 'subtract':
            calculator.chooseOperation('−');
            break;
        case 'multiply':
            calculator.chooseOperation('×');
            break;
        case 'divide':
            calculator.chooseOperation('÷');
            break;
        case 'equals':
            calculator.compute();
            break;
        case 'clear':
            calculator.clear();
            break;
        case 'toggle-sign':
            calculator.toggleSign();
            break;
        case 'percentage':
            calculator.percentage();
            break;
        case 'decimal':
            calculator.appendNumber('.');
            break;
    }
    calculator.updateDisplay();
}

// Keyboard Support
document.addEventListener('keydown', event => {
    const key = event.key;

    // Numbers
    if (/^[0-9]$/.test(key)) {
        calculator.appendNumber(key);
        calculator.updateDisplay();
        return;
    }

    // Decimal point
    if (key === '.' || key === ',') {
        calculator.appendNumber('.');
        calculator.updateDisplay();
        return;
    }

    // Operations
    if (key === '+') {
        calculator.chooseOperation('+');
        calculator.updateDisplay();
        return;
    }
    if (key === '-') {
        calculator.chooseOperation('−');
        calculator.updateDisplay();
        return;
    }
    if (key === '*' || key === 'x') {
        calculator.chooseOperation('×');
        calculator.updateDisplay();
        return;
    }
    if (key === '/') {
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
        return;
    }

    // Equals / Enter
    if (key === 'Enter' || key === '=') {
        calculator.compute();
        calculator.updateDisplay();
        return;
    }

    // Clear / Escape
    if (key === 'Escape' || key === 'Delete') {
        calculator.clear();
        calculator.updateDisplay();
        return;
    }

    // Backspace
    if (key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
        return;
    }

    // Percentage
    if (key === '%') {
        calculator.percentage();
        calculator.updateDisplay();
        return;
    }

    // Toggle sign
    if (key === 's' || key === 'S') {
        calculator.toggleSign();
        calculator.updateDisplay();
        return;
    }
});

// Initialize display
calculator.updateDisplay();

// Add click animation feedback
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mousedown', () => {
        button.classList.add('active');
    });
    button.addEventListener('mouseup', () => {
        button.classList.remove('active');
    });
    button.addEventListener('mouseleave', () => {
        button.classList.remove('active');
    });
});

// Prevent context menu on calculator
document.querySelector('.calculator').addEventListener('contextmenu', e => {
    e.preventDefault();
});

console.log('Calculator loaded successfully!');