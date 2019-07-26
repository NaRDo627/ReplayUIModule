import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { ordinalSuffix } from 'ordinal-js'

const StyledMatchInfo = styled.div`
    font-size: 1.2rem;
    line-height: 1.3rem;
    margin-bottom: 0;
    margin-right: 20px;
    list-style-type: none;
    grid-template-columns: 180px auto;
    display: grid;

    @media (max-width: 700px) {
        grid-column: 1;
        display: inline-block;
        position: absolute;
        top: -20px;
        width: 100%;
        text-align: center;
        font-size: 1.1rem;

        li {
            display: inline-block;
            margin-right: 3px;
        }
    }
`

const StyledPlayedAt = styled.div`
    display: inline-block;
    grid-column: 1;
`

const StyledMatchEvaluation = styled.div`
    display: inline-block;
    text-align: right;
    grid-column: 2;
`

class MatchInfo extends React.PureComponent {
    render() {
        const { match, marks } = this.props

        const playedAt = moment(match.playedAt).format('MMM Do h:mm a')
        const { stats } = match.players.find(p => p.name === marks.focusedPlayer())

        return (
            <StyledMatchInfo>
                <StyledPlayedAt> {playedAt}</StyledPlayedAt>
                <StyledMatchEvaluation>
                    <strong>{stats.winPlace}</strong>{ordinalSuffix(stats.winPlace)} place,&nbsp;
                    <strong>{stats.kills}</strong> kills
                    &nbsp;-&nbsp;
                    Too Bad! :/
                </StyledMatchEvaluation>
            </StyledMatchInfo>
        )
    }
}


export default MatchInfo
