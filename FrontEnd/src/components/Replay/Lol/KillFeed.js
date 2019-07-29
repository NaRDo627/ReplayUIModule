import React from 'react'
import { map } from 'lodash'
import styled from 'styled-components'
import dict from '../../../assets/Pubg/damageCauserName.json'

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


const LogGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    list-style-type: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 400;
    margin: 5px 0;
    padding: 4px;
    background: linear-gradient( to right, ${props => props.colorStart}, ${props => props.colorEnd});
    cursor: pointer;
`

const KillerPlayerName = styled.div`
    grid-column: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
`

const KillIcon = styled.div`
    grid-column: 2;
    text-align: center;
`

const VictimPlayerName = styled.div`
    grid-column: 3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
`


const weaponIcons = importAll(require.context('../../../assets/Pubg/item/Weapon', true, /.png$/))
const champions = importAll(require.context('../../../assets/Lol/champion', true, /.png$/))
const objects = importAll(require.context('../../../assets/Lol/misc', true, /.png$/))
const killedIcon = require("../../../assets/Lol/sword.png")
const public_url = (process.env.NODE_ENV === 'production')? process.env.PUBLIC_URL : "http://localhost:3000"

class KillFeed extends React.Component {

    // [190727][HKPARK] KillLogs중 비어있는 부분 때문에 KillFeed가 깜빡이는 것처럼 보이는 것 처리
    shouldComponentUpdate(nextProps, nextState) {
        const curLogLength = this.props.killLogs.length
        if(curLogLength === nextProps.killLogs.length ||
            curLogLength > 0 && nextProps.killLogs.length === 0 && nextProps.msSinceEpoch > this.props.killLogs[0].msSinceEpoch) {
            return false;
        }

        return true;
    }

    render() {
       const { focusPlayer, killLogs, options, skipTo, stopAutoplay } = this.props;

        // killlog 최신순으로 정렬
        killLogs.sort(function (prev, next) {
            return next.msSinceEpoch - prev.msSinceEpoch
        })

        return (
            <React.Fragment>
                {map(killLogs, (log, i) =>
                    <LogGroup key={`killfeed-${log.msSinceEpoch}`}
                              onMouseDown={stopAutoplay.bind(this)}
                              onClick={skipTo.bind(this, log.msSinceEpoch)}
                              colorStart={(log.killerName === focusPlayer)? options.colors.dot.focused : (log.killerTeamId === 100)? "skyblue" : "Tomato"}
                              colorEnd={(log.killerName === focusPlayer)? options.colors.dot.focused : (log.killerTeamId === 100)? "Tomato" : "skyblue"}
                    >
                        <KillerPlayerName>
                            {log.killerName === "Minion" &&
                            <img
                                src={objects[log.killerName]}
                                alt={log.killerName}
                                width={40}
                            />}
                            {log.killerName !== "Minion" &&
                            <img
                                src={champions[log.killerName]}
                                alt={log.killerName}
                                width={40}
                            />}
                        </KillerPlayerName>
                        <KillIcon>
                            <img
                                src={killedIcon}
                                alt={"Killed"}
                                width={35}
                            />
                        </KillIcon>
                        <VictimPlayerName>
                            {log.killType === "CHAMPION_KILL" &&
                            <img
                                src={champions[log.victimName]}
                                alt={log.victimName}
                                width={40}
                            />}
                            {(log.killType === "ELITE_MONSTER_KILL" || log.killType === "BUILDING_KILL") &&
                            <img
                                src={objects[log.victimName]}
                                alt={log.victimName}
                                width={40}
                            />}
                        </VictimPlayerName>
                    </LogGroup>
                )}
            </React.Fragment>
        )
    }
}


export default KillFeed

