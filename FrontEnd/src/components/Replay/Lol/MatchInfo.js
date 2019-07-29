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

        // for use moment.format change date to string
        const playedAtDate = new Date(Number(match.playedAt))
        const currentYear = playedAtDate.getFullYear()
        const currentMonth = playedAtDate.getMonth() + 1
        const currentDate = playedAtDate.getDate()
        const currentHour = playedAtDate.getHours()
        const currentMinute = playedAtDate.getMinutes()
        const currentSecond = playedAtDate.getSeconds()
        const dateString = currentYear + "-" + currentMonth + "-" + currentDate + " " +
            currentHour + ":" + currentMinute + ":" + currentSecond

        console.log(playedAtDate, dateString)

        const playedAt = moment(dateString).format('MMM Do h:mm a')
     //   const { stats } = match.players.find(p => p.name === marks.focusedPlayer())
     //   const message = (stats.winPlace > 10)? "Too bad :/" : (stats.winPlace > 1)? "Top 10 Reached! ;)" : "Winner winner chicken dinner!! XD"

        return (
            <StyledMatchInfo>
                <StyledPlayedAt> {playedAt}</StyledPlayedAt>
                <StyledMatchEvaluation>
             {/*       <strong>{stats.winPlace}</strong>{ordinalSuffix(stats.winPlace)} place,&nbsp;
                    <strong>{stats.kills}</strong> kills
                    &nbsp;-&nbsp;
                    {message}*/}
                </StyledMatchEvaluation>
            </StyledMatchInfo>
        )
    }
}


export default MatchInfo
