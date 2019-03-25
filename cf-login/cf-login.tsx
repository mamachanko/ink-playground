import * as React from 'react';
import * as PropTypes from 'prop-types';
import {Text, StdinContext, Box} from 'ink';
import Spinner from 'ink-spinner';
import {useStore} from './store';

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

const Start = ({command}): React.ReactElement => {
	const SPACE = ' ';
	const {dispatch} = useStore();
	const start = React.useCallback(
		() => dispatch({type: 'START', command}),
		[command, dispatch]
	);
	const handleInput = (input: string): void => {
		if (input === SPACE) {
			start();
		}
	};

	useStdin(handleInput);

	return <Text>{`press <space> to run "${command}"`}</Text>;
};

Start.propTypes = {
	command: PropTypes.string.isRequired
};

const Command = ({command}): React.ReactElement => {
	const {state: {running}} = useStore();

	if (running) {
		return (
			<Box>
				<Box width={2}>
					<Spinner type="dots"/>
				</Box>
				<Text>running</Text>
			</Box>
		);
	}

	return <Start command={command}/>;
};

Command.propTypes = {
	command: PropTypes.string.isRequired
};

const InputPrompt = (): React.ReactElement => {
	const {state: {inputRequested}} = useStore();

	if (inputRequested) {
		return <Text>input requested</Text>;
	}

	return null;
};

const ExitStatus = (): React.ReactElement => {
	const {state: {finished, exitCode}} = useStore();

	if (finished) {
		return <Text>{`finished w/ ${exitCode}`}</Text>;
	}

	return null;
};

const Output = (): React.ReactElement => {
	const {state: {output}} = useStore();

	const outputLine = (text: string): React.ReactElement =>
		<Text key={text + String(Date.now())}>{text}</Text>;

	if (output && output.length > 0) {
		return (
			<Box flexDirection="column">
				<Text>output:</Text>
				<Box flexDirection="column">
					{output.map(outputLine)}
				</Box>
			</Box>
		);
	}

	return null;
};

export const CfLogin = (): React.ReactElement => {
	return (
		<Box flexDirection="column">
			<Output/>
			<InputPrompt/>
			<ExitStatus/>
			<Command command="curl mockbin.org/delay/1500"/>
		</Box>
	);
};
