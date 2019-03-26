import * as React from 'react';
import * as PropTypes from 'prop-types';
import {Text, StdinContext, Box, Color} from 'ink';
import * as InkBox from 'ink-box';
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
	const {state: {inputRequested}, dispatch} = useStore();
	const [userInput, setUserInput] = React.useState('');
	const submit = React.useCallback(
		() => {
			setUserInput('');
			dispatch({type: 'INPUT_RECEIVED', input: userInput});
		},
		[dispatch, userInput]
	);

	const handleInput = (input: string): void => {
		if (input === '\r') {
			submit();
		} else {
			setUserInput((prevUserInput: string) => prevUserInput + input);
		}
	};

	useStdin(handleInput);

	if (inputRequested) {
		return (
			<Box>
				<Text>{'>_ '}</Text>
				<Text>{userInput}</Text>
			</Box>
		);
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

const Title = (): React.ReactElement => (
	<InkBox
		borderStyle="round"
		borderColor="cyan"
	>
		Welcome to <Color green>cfpush</Color>
	</InkBox>
);

export const CfLogin = (): React.ReactElement => {
	return (
		<Box flexDirection="column">
			<Title/>
			<Output/>
			<InputPrompt/>
			<ExitStatus/>
			{/* <Command command="cf login --sso -a api.run.pivotal.io"/> */}
			<Command command="echo hello there"/>
		</Box>
	);
};
