import React, {Component} from 'react';
import styled from 'styled-components'

const CenteredContainer = styled.div`
    text-align: center;
`


class Home extends Component{
    render() {
        return (
            <CenteredContainer>
                <h2>
                    Amazing Replay UI for ESports games!
                </h2>
            </CenteredContainer>
        );
    }
}

export default Home;