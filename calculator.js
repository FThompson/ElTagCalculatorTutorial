const { renderElement, app, range, each, div, button, span } = ElTag;

const state = {
    display: '0'
};

const actions = {
    evaluate: () => this.setState({ display: eval(this.state.display) }),
    clearDisplay: () => this.setState({ display: '0' }),
    addSymbol: symbol => this.setState({ display: this.state.display + symbol }),
    addNumber: number => {
        if (this.state.display === '0') {
            this.setState({ display: number });
        } else {
            this.actions.addSymbol(number);
        }
    },
    backspace: () => {
        let length = this.state.display.length;
        if (length > 1) {
            this.setState({ display: this.state.display.substring(0, length - 1) });
        } else {
            this.actions.clearDisplay();
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
        button({
            id: 'equals',
            onclick: () => this.parent.actions.evaluate()
        }, '='),
        button({
            id: 'clear',
            onclick: () => this.parent.actions.clearDisplay()
        }, 'C'),
        button({
            id: 'backspace',
            onclick: () => this.parent.actions.backspace()
        }, '\u232b'),
        ...range(0, 10, index => button({
            state: { number: index.toString() },
            id: 'number' + index,
            onclick: () => this.parent.actions.addNumber(this.state.number)
        }, index)),
        ...each(operators, item => button({
            state: { symbol: item.symbol },
            id: item.id,
            onclick: () => this.parent.actions.addSymbol(this.state.symbol)
        }, item.symbol))
    ])
];

const calculator = app({ state: state, actions: actions }, view);
renderElement(document.body, calculator);