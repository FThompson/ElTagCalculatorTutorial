# ElTag Getting Started Tutorial

ElTag is an HTML tag component framework that generates responsive HTML from state, action, and view components in JavaScript.

In this tutorial, you will create a simple calculator app using ElTag.

![ElTag Calculator App](calculator.png)

To get started, create a file named `calculator.js` and download this project's HTML and CSS files:
* [index.html](https://github.com/FThompson/ElTagCalculatorTutorial/blob/master/index.html)
* [calculator.css](https://github.com/FThompson/ElTagCalculatorTutorial/blob/master/calculator.css)

## Install the Library

ElTag is available through the jsDelivr CDN or as a [direct download](https://github.com/TSedlar/eltag/blob/master/eltag.js). Use the @latest tag to request the newest release.

```html
<script src='https://cdn.jsdelivr.net/gh/TSedlar/eltag@latest/eltag.min.js'>
```

The `eltag.js` script exposes the `ElTag` object containing the core framework and HTML tag functions. Unpack the variables needed for this tutorial.

```javascript
const { renderElement, app, range, each, div, button, span } = ElTag;
```

## Create the Application Skeleton

An ElTag app has state, actions, and a view.

Create the state object. The `display` variable will contain the calculator's expression or solution.

```javascript
const state = {
    display: '0'
};
```

Create the actions object. This object will be populated with action functions that are available to the app's components.

```javascript
const actions = {

};
```

Create the view array. This array will contain the element tree to be generated when rendering the application.

```javascript
const view = [

];
```

You now have everything you need to initialize a functional but empty ElTag application.

```javascript
const calculator = app({ state: state, actions: actions }, view);
renderElement(document.body, calculator);
```

The `app` function takes a properties object containing the app's state, actions, and any other information you need the app to have access to. The `renderElement` function renders an ElTag app into the given element, `document.body`.

## Create the View

ElTag offers a function for each HTML element tag, such as `div` or `button`. These tag functions have two optional parameters: an attributes object and an inner content variable, which can be either a string or an array of subcomponents. Element attributes can include any HTML attributes and ElTag attributes:
* All HTML attributes, such as `id` and `class`.
* The style attribute, in the form of an object like `style: { backgroundColor: 'red' }`.
* All HTML events, such as `onclick`.
* ElTag attributes, such as `render`.

Create the main div that will hold the calculator's display and button components. The linked stylesheet knows this div as `#calculator` and organizes its components according to a grid layout.

```javascript
const view = [
    div({ id: 'calculator' }, [

    ])
];
```

The calculator's single state variable is its display, showing the current expression or solution. Create a span within the main div and give it an id, `"display"`, and a `render` attribute pointing to a function that returns the display state variable.

```javascript
const view = [
    div({ id: 'calculator' }, [
        span({
            id: 'display',
            render: () => this.state.display
        })
    ])
];
```

The `render` attribute is a special ElTag attribute that is called when rendering an element. The result of the `render` call is placed in the element, allowing you to create dynamic elements that reflect the application state.

## Define the Application's Actions

Next, define the calculator's actions. These actions will be available to the view components' event handlers like `onclick`.

Your application should typically give users visual feedback when they perform an action. You can initiate a re-render of the view using the `this.setState` function, which takes a state object and combines it with the existing app state. The `this` keyword here refers to the ElTag application.

Add an `evaluate` action that replaces the display's expression with the evaluation of that expression.

```javascript
const actions = {
    evaluate: () => this.setState({ display: eval(this.state.display) })
};
```

Notice that you can access the current state with `this.state`. You can also use `this` to access the actions object and any other properties you passed to the app.

Add actions that clear the display, add a symbol to the display, add a number to the display, and delete the last character in the display.

```javascript
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
```

## Complete the View

The application now knows what actions are available to it, so you can create the remaining view components that perform actions when clicked.

Create and add an equals button that evaluates the calculator's expression. The first argument to the tag function is the element's `id` and `onclick` function, and the second argument is the element's inner text, `"="`.

```javascript
const view = [
    div({ id: 'calculator' }, [
        span({
            id: 'display',
            render: () => this.state.display
        }),
        button({
            id: 'equals',
            onclick: () => this.parent.actions.evaluate()
        }, '=')
    ])
];
```

You can use `this.parent` to access the app's actions and states from within an element. In this context, `this` refers to the current element and can be used to access this element's HTML attributes or state, if defined. Each component's state is independent of the parent app state.

Add buttons that clear and backspace the display.

```javascript
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
        }, '\u232b')
    ])
];
```

Add the number buttons to the calculator. Rather than write out each number button, you can use ElTag's `range` function, which takes an inclusive start, exclusive end, and callback function for what to do with each index. Create the buttons in the callback function, and use the spread operator `...` to expand the result of `range` into the main div's component array.

```javascript
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
        }, index))
    ])
];
```

Notice that the `index` cannot be directly used in the buttons' `onclick` attributes. You must instead place the `index` into the component's local state object and access it through `this.state`. This step is required for local variables because the app uses a different calling context when later invoking the `onclick` function.

The final buttons are the decimal point and operator buttons. These buttons will each call the `addSymbol` action, so you can create them using another convenient ElTag function, `each`. This function works like `Array.map` and takes an array and a callback function to perform on each element in the array.

Create the symbol button array containing each button's symbol and CSS id.

```javascript
const operators = [
    { symbol: '+', id: 'add' },
    { symbol: '-', id: 'subtract' },
    { symbol: '*', id: 'multiply' },
    { symbol: '/', id: 'divide' },
    { symbol: '.', id: 'dot' }
];
```

Use `each` and the spread operator `...` to create and add the symbol buttons to the view.

```javascript
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
```

Congratulations! You have completed the ElTag calculator app. Test the calculator if you have not yet done so and check that everything works as expected.

You can view the working calculator online [here](https://codepen.io/finnthompson/pen/wZmKYb).

ElTag offers some functions not mentioned in this guide:
* The `condition` element attribute, called before rendering an element. The element will be rendered if the `condition` resolves to `true`.
* The `oninit` element attribute, called when initializing an element.
* The `onrender` element attribute, called when rendering an element.
* The `every` element attribute, used to call a function at regular intervals.

View the ElTag project repository and other examples [here](https://github.com/TSedlar/eltag).