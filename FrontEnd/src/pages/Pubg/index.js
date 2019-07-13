import React, { Component } from 'react';
import styled from 'styled-components'

const InfoList = styled.div`
    font-size: 1.2rem;
    font-weight: 400;
    color: #714868;
    position: relative;
    align-self: center;
`


class Pubg extends Component{
    render() {
        //const {match} = this.props
        return(
            <div>
                <h2>Pubg</h2>
                <InfoList>
                    <div>PlayerID : {this.props.match.params.playerId}</div>
                    <div>PlatformID : {this.props.match.params.platformId}</div>
                    <div>MatchID : {this.props.match.params.matchId}</div>
                </InfoList>
                </div>
        )
    }
}

export default Pubg;