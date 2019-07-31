import React from 'react'
import styled from 'styled-components'

const StyledOption = styled.div`
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
        if(e.target.value === "showHealthBar"){
            this.props.setOption('showHealthBar', e.target.checked)
            this.setState({showHealthBar:  e.target.checked})
        } else if(e.target.value === "showAllRosters")  {
            this.props.setOption('showAllRosters', e.target.checked)
            this.setState({showAllRosters:  e.target.checked})
        }
    }


    render() {
        return(
            <StyledOption>
                options<br/>
                <label>
                    <input type="checkbox"
                           value={"showHealthBar"}
                           checked={this.props.options.showHealthBar}
                           onChange={this.handleChecked} />
                    showHealthBar
                </label>
                <label>
                    <input type="checkbox"
                           value={"showAllRosters"}
                           checked={this.props.options.showAllRosters}
                           onChange={this.handleChecked} />
                    showAllRosters
                </label>
            </StyledOption>
        )
    }
}

export default MapOptions
