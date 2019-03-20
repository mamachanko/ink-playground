import * as React from 'react';
import { render, Box, Color } from 'ink';
import Spinner from 'ink-spinner';

const Counter = () => {
    const [counter, setCounter] = React.useState(0);

    const increment = () => setCounter(counter => counter + 1);

    React.useEffect(() => {
        const interval = setInterval(increment, 100);
        return () => clearInterval(interval);
    });

    return <Box>
        <Box width={2}>
            <Spinner type='dots' />
        </Box>
        <Box>
            Counter: <Color green>{counter}</Color>
        </Box>
    </Box>
}

render(<Counter />);
