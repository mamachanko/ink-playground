import * as React from 'react';
import { render, Box, Color } from 'ink';

const Counter = () => {
    const [counter, setCounter] = React.useState(0);

    const increment = () => setCounter(counter => counter + 1);

    React.useEffect(() => {
        const interval = setInterval(increment, 100);
        return () => clearInterval(interval);
    });

    return <Box>
        Counter: <Color green>{counter}</Color>
    </Box>
}

render(<Counter />);
