import React from 'react'
import styled from 'styled-components'
import Tooltip from '../../../../components/Tooltip'
import Loadout from './Loadout.js'
import * as Options from '../Options.js'
import championDict from '../../../../assets/Lol/championFull.json'

const importAll = req => {

    return req.keys().reduce((prev, r) => {
        // Split by directory and then reverse to get the filename
        const [itemId] = r.split('/').reverse()

        // Remove the extension from the file name.
        const key = itemId.substr(0, itemId.length - 4)

        // Require the file and assign it to the itemId property
        return {
            ...prev,
            [key]: req(r),
        }
    }, {})
}


const getRosterColor = ({ colors }, marks, player) => {
    const dead = player.status === 'dead'
    const knocked = player.status !== 'dead' && player.health === 0

    if (knocked) {
        return colors.roster.knocked
    } else if (marks.focusedPlayer() === player.name) {
        return dead ? colors.roster.deadTeammate : colors.roster.focused
    }

    return dead ? colors.roster.dead : colors.roster.enemy
}

const getSkillName = (championName, slot) => championDict.data[championName].spells[slot-1].id

const SummonerGroup = styled.div`
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1.2rem;
    font-weight: 500;
    text-align: center;
    margin: 5px;
    padding: 4px;
    background: ${props => props.backgroud};
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(15px, auto);
    grid-column-gap: 5px;
    grid-row-gap: 3px;
    cursor: pointer;
`

const SummonerName = styled.div`
    border: 1px solid #D0D0D0;
    border-radius: 4px
    font-size: 1.3rem; 
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    grid-row: 1;
    grid-column: 1 / 5;
`

const SummonerIcon = styled.div`
    grid-column: 1 / 3;
    grid-row: 2;
`

const SummonerKDA = styled.div`
    grid-column: 3 / 5;
    grid-row: 2;
    margin: 0;
    overflow: hidden;

    i {
        margin-left: 5px;
        font-size: 1rem;
        line-height: 0.5rem;
    }
`

const SummonerSkill = styled.div`
    grid-row: 3;
    grid-column: ${props => props.slot};
`

const SummonerSkillImg = styled.div`
    grid-row: 1;
    height: 32px;
`

const SummonerSkillLevels = styled.div`
    font-size: 2px;
    height: 4px;
    grid-row: 2;
`

const SummonerSkillLevel = styled.div`
    width: ${props => props.width}%;
    height: 4px;
    background-color: black;
`

const PlayerName = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

function arrayContainsArray (superset, subset) {
    if (0 === subset.length) {
        return false;
    }
    return subset.every(function (value) {
        return (superset.indexOf(value) >= 0);
    });
}

const champions = importAll(require.context('../../../../assets/Lol/champion', true, /.png$/))
const spells = importAll(require.context('../../../../assets/Lol/spell', true, /.png$/))

const SummonerList = ({match, currentTimeline, marks, players}) => {
    // switch side to see focused player more conveninetly
    if(players.find(p => p.name === marks.focusedPlayer()).teamId === 200)
        players = players.slice(5, 10).concat(players.slice(0, 5))

    return (
        <Options.Context.Consumer>
            {({options}) => players.map((p, i) => {
                return (
                    <SummonerGroup key={`summoner-${i}`}
                                   backgroud={(p.teamId === 100)? '#A0A0FF' : '#FFA0A0'}
                                   onClick={() => marks.toggleTrackedPlayer(p.name)}
                                   onMouseEnter={() => marks.setHoveredPlayer(p.name)}
                                   onMouseLeave={() => marks.setHoveredPlayer(null)}>
                        <SummonerName style={{
                            color: getRosterColor(options, marks, p),
                            textDecoration: marks.isPlayerTracked(p.name) ? 'underline' : '',
                        }}>
                            {p.name}
                        </SummonerName>
                        {/*<Tooltip
                            arrow
                            placement="left"
                            duration={0}
                            theme="pubgsh"
                            html={<Loadout items={p.items}/>}
                        >*/}
                            <SummonerIcon>
                                <img
                                    src={champions[p.championName]}
                                    alt={p.championName}
                                    width={40}
                                />
                            </SummonerIcon>
                            <SummonerKDA>
                                {p.kills} / {p.deaths} / {p.assists}
                            </SummonerKDA>
                            <SummonerSkill slot={1}>
                                <SummonerSkillImg>
                                    <img
                                        src={spells[getSkillName(p.championName, 1)]}
                                        alt={p.championName}
                                        width={30}
                                    />
                                </SummonerSkillImg>
                                <SummonerSkillLevels>
                                    <SummonerSkillLevel width={p.skillLvlSlot1 * 20}>&nbsp;</SummonerSkillLevel>
                                </SummonerSkillLevels>
                            </SummonerSkill>
                            <SummonerSkill slot={2}>
                                <SummonerSkillImg>
                                    <img
                                        src={spells[getSkillName(p.championName, 2)]}
                                        alt={p.championName}
                                        width={30}
                                    />
                                </SummonerSkillImg>
                                <SummonerSkillLevels>
                                    <SummonerSkillLevel width={p.skillLvlSlot2 * 20}>&nbsp;</SummonerSkillLevel>
                                </SummonerSkillLevels>
                            </SummonerSkill>
                            <SummonerSkill slot={3}>
                                <SummonerSkillImg>
                                    <img
                                        src={spells[getSkillName(p.championName, 3)]}
                                        alt={p.championName}
                                        width={30}
                                    />
                                </SummonerSkillImg>
                                <SummonerSkillLevels>
                                    <SummonerSkillLevel width={p.skillLvlSlot3 * 20}>&nbsp;</SummonerSkillLevel>
                                </SummonerSkillLevels>
                            </SummonerSkill>
                            <SummonerSkill slot={4}>
                                <SummonerSkillImg>
                                    <img
                                        src={spells[getSkillName(p.championName, 4)]}
                                        alt={p.championName}
                                        width={30}
                                    />
                                </SummonerSkillImg>
                                <SummonerSkillLevels>
                                    <SummonerSkillLevel width={p.skillLvlSlot4 * 33}>&nbsp;</SummonerSkillLevel>
                                </SummonerSkillLevels>
                            </SummonerSkill>
                      {/*  </Tooltip>*/}

                    </SummonerGroup>
                )
            })}
        </Options.Context.Consumer>
    )
}

export default SummonerList
