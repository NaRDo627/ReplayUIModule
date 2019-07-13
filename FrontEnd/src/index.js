import React from 'react'
import ReactDOM from 'react-dom'

import Routes from './routes.js'


// tag::app[]
class App extends React.Component {
	render() {
		return (
			<React.Fragment>
				<div>
					Hello, World~!
				</div>
				<Routes />
			</React.Fragment>

		)
	}
}
// end::app[]

// tag::render[]
ReactDOM.render(
	<App />,
	document.getElementById('react')
)
// end::render[]

