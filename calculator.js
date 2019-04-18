const { renderElement, app, range, each, div, button, span } = ElTag;

const state = {
    display: '0'
};

const actions = {
    addSymbol: symbol => this.setState({ display: this.state.display + symbol }),
    addNumber: number => {
        if (this.state.display === '0') {
            this.setState({ display: number });
        } else {
            actions.addSymbol(number);
        }
    },
    evaluate: () => this.setState({ display: eval(this.state.display) }),
    clearDisplay: () => this.setState({ display: '0' }),
    backspace: () => {
        let length = this.state.display.length;
        if (length > 1) {
            this.setState({ display: this.state.display.substring(0, length - 1) });
        } else {
            actions.clearDisplay();
        }
    }
};

const operators = [
    { symbol: '+', id: 'add' },
    { symbol: '-', id: 'subtract' },
    { symbol: '*', id: 'multiply' },
    { symbol: '/', id: 'divide' },
    { symbol: '.', id: 'dot' }
];

const view = [
    div({ id: 'calculator' }, [
        span({
            id: 'display',
            render: () => this.state.display
        }),
        ...range(0, 10, index => button({
            state: { number: index.toString() },
            id: 'number' + index,
            onclick: () => actions.addNumber(this.state.number)
        }, index)),
        ...each(operators, item => button({
            state: { symbol: item.symbol },
            id: item.id,
            onclick: () => actions.addSymbol(this.state.symbol)
        }, item.symbol)),
        button({
            id: 'equals',
            onclick: () => actions.evaluate()
        }, '='),
        button({
            id: 'backspace',
            onclick: () => actions.backspace()
        }, '\u232b'),
        button({
            id: 'clear',
            onclick: () => actions.clearDisplay()
        }, 'C'),
    ])
];

const calculator = app({ state: state, actions: actions }, view);
renderElement(document.body, calculator);