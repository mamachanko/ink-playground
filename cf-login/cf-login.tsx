import * as React from 'react';
import {Text, StdinContext, Box} from 'ink';
import {useGlobalState} from './app';

const useStdin = (handleInput: (input: string) => void): void => {
	const {stdin, setRawMode} = React.useContext(StdinContext);

	React.useEffect(() => {
		setRawMode(true);
		stdin.on('data', handleInput);

		return () => {
			stdin.removeListener('data', handleInput);
			setRawMode(false);
		};
	});
};

export const CfLogin = (): React.ReactElement => {
	const {state: {running, finished, output, exitCode}, dispatch} = useGlobalState();
	const start = React.useCallback(() => dispatch({type: 'START'}), [dispatch]);

	const handleInput = (input: string): void => {
		if (input === ' ') {
			start();
		}
	};

	useStdin(handleInput);

	return (
		<Box flexDirection="column">
			<Text>cf login</Text>
			<Box flexDirection="column">
				{'output:'}
				{output.map(text => <Text key={Date.now()}>{text}</Text>)}
			</Box>
			<Text>{running ? 'running' : 'not running'}</Text>
			<Text>{finished ? `finished w/ ${exitCode}` : 'not finished'}</Text>
		</Box>
	);
};
