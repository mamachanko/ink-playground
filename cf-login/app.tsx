import * as React from 'react';
import {CfLogin} from './cf-login';
import {StoreProvider} from './store';

export const App = (): React.ReactElement => (
	<StoreProvider>
		<CfLogin/>
	</StoreProvider>
);
