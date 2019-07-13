const React = require('react');
const ReactDOM = require('react-dom');


// tag::app[]
class App extends React.Component {
	render() {
		return (
			<div>
				Hello, World!2
			</div>
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

