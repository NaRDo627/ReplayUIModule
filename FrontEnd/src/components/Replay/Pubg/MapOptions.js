import React from 'react'
import styled from 'styled-components'


const LogGroup = styled.div`
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1.2rem;
    font-weight: 400;
    margin: 5px 0;
    padding: 4px;
    background: #FAFAFA;
    cursor: pointer;
`

class MapOptions extends React.Component {
    handleChecked = e => {
        this.props.setOption('showHealthBar', e.target.checked)
        this.setState({showHealthBar:  e.target.checked})
    }


    render() {
        return(
            <LogGroup>
                options<br/>
                <label>
                    <input type="checkbox"
                           checked={this.props.options.showHealthBar}
                           onChange={this.handleChecked} />
                    showHealthBar
                </label>
            </LogGroup>
        )
    }
}

export default MapOptions
