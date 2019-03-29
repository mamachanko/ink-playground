export interface RunCommand {
	type: 'RUN_COMMAND';
	command: string;
}

interface OutputReceived {
	type: 'OUTPUT_RECEIVED';
	output: string;
}

interface InputRequested {
	type: 'INPUT_REQUESTED';
}

interface InputReceived {
	type: 'INPUT_RECEIVED';
	input: string;
}

interface Finished {
	type: 'FINISHED';
	exitCode: number;
}

export type Action =
	| RunCommand
	| OutputReceived
	| InputRequested
	| InputReceived
	| Finished;

export const runCommand = (command: string): RunCommand => ({type: 'RUN_COMMAND', command});
export const outputReceived = (output: string): OutputReceived => ({type: 'OUTPUT_RECEIVED', output});
