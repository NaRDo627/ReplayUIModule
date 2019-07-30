import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import score from '../../../assets/Lol/misc/score.png'

const StyledMatchInfo = styled.div`
    font-size: 1.2rem;
    margin-bottom: 0;
    margin-right: 20px;
    list-style-type: none;
    grid-template-columns: 130px 1fr auto;
    display: grid;
`

const StyledPlayedAt = styled.div`
    margin: auto 0;
    display: inline-block;
    grid-column: 1;
`

const StyledMatchStatus = styled.div`
    margin: auto 0;
    font-size: 1.4rem;
    font-weight: 600;
    display: inline-block;
    grid-column: 2;
    height: 100%;
`

const StyledMatchEvaluation = styled.div`
    margin: auto 0;
    display: inline-block;
    text-align: right;
    grid-column: 3;
`

const StyledTeam1Score = styled.div`
    font-size: 1.7rem;
    display: inline-block;
    padding: 7px 12px 7px 7px;
    margin: 0 5px 0 0;
    width: 28%;
    background: linear-gradient(to right, #FFFFFF, #0000A0);
    color: white;
    text-align: right;
`

const StyledImgWrapper = styled.div`
    display: inline-block;
    text-align: center;
`

const StyledTeam2Score = styled.div`
    font-size: 1.7rem;
    display: inline-block;
    padding: 7px 7px 7px 12px;
    margin: 0 0 0 5px;
    width: 28%;
    background: linear-gradient(to right, #A00000, #FFFFFF);
    color: white;
`

class MatchInfo extends React.PureComponent {
    render() {
        const { match, marks, currentTimeline } = this.props

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

        const playedAt = moment(dateString).format('MMM Do h:mm a')
        const { participantId } = match.players.find(p => p.player.summonerName.toLowerCase() === marks.focusedPlayer().toLowerCase())
        const focusedTeamId = (participantId < 6)? "100" : "200";
        const message = (focusedTeamId === match.victoryTeam)? "Your Team Win! XD" : "Your Team Lost.. :/";

        return (
            <StyledMatchInfo>
                <StyledPlayedAt> {playedAt}</StyledPlayedAt>
                <StyledMatchStatus>
                    <StyledTeam1Score>
                        {currentTimeline.killLogs.filter(k => (k.victimTeamId === 200 && k.killType === "CHAMPION_KILL")).length}
                    </StyledTeam1Score>
                    <StyledImgWrapper>
                        <img src={score} alt={"VS"} style={{display: "inline-block"}}/>
                    </StyledImgWrapper>
                    <StyledTeam2Score>
                        {currentTimeline.killLogs.filter(k => (k.victimTeamId === 100 && k.killType === "CHAMPION_KILL")).length}
                    </StyledTeam2Score>
                </StyledMatchStatus>
                <StyledMatchEvaluation>
                    {message}
                </StyledMatchEvaluation>
            </StyledMatchInfo>
        )
    }
}


export default MatchInfo
