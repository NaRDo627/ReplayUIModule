import React, { Component } from 'react';
import styled from 'styled-components'
import jsonData from 'assets/loldata.json'

const InfoList = styled.div`
    font-size: 1.2rem;
    font-weight: 400;
    color: #714868;
    position: relative;
    align-self: center;
`




class Lol extends Component{
    render() {
        console.log(typeof jsonData)
        console.log(jsonData.match.players[0])
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
export default Lol;