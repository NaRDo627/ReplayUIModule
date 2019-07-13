import React from 'react';
import init from './Init';

// tag::webgl[]
export default class WebGL extends React.Component {
    componentDidMount() {
        init('webgl');
    }

    render() {
        return (<canvas id="webgl" width="400" height="400" style={{ border: '1px solid black' }}></canvas>)
    }
}
// end::webgl[]
