import React from 'react';
import FileExported from '../containers/file-exported';
import QuestionDetail from '../containers/question-detail';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
require('../../scss/style.scss');
import PropTypes from 'prop-types';

const App = () => (
	<div className = "main-wrapper">
		<div>
				<FileExported/>
		</div>
		<div>
			<h2>Fetch Spreadsheet:</h2>
			<QuestionDetail />
		</div>
	</div>
);

export default App;


