'use strict';
const React = require('react');
const { render, Color } = require('ink');

const Counter = () => {
    const [counter, setCounter] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => setCounter(counter + 1), 100);
        return () => clearInterval(interval);
    });

    return <Color green>{counter} tests passed</Color>
}

render(
    <Counter />
);
