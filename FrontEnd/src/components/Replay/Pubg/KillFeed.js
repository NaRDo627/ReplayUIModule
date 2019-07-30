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


const LogGroup = styled.ul`
    list-style-type: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 400;
    margin: 5px 0;
    padding: 4px;
    background: grey;
    cursor: pointer;
`

const KillerPlayerName = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
`

const Reason = styled.div`
    text-align: center;
`

const VictimPlayerName = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
`


const weaponIcons = importAll(require.context('../../../assets/Pubg/item/Weapon', true, /.png$/))
const feedIcons = importAll(require.context('../../../assets/Pubg/icons', true, /.png$/))
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
       const { focusPlayer, teammates, killLogs, options, skipTo, stopAutoplay } = this.props;

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
                    >
                        <KillerPlayerName style={{
                            color: (log.killerName === focusPlayer)? options.colors.dot.focused : (teammates.includes(log.killerName))? options.colors.dot.teammate : '#ffffff'
                        }}>
                            {log.killerName}
                        </KillerPlayerName>
                        <Reason>
                            {
                                (log.reasonCategory === "Damage_Gun" || log.reasonCategory === "Damage_Melee") &&
                                <img
                                    src={public_url + weaponIcons[dict[log.reasonName]]}
                                    alt={public_url + weaponIcons[dict[log.reasonName]]}
                                    width={70}
                                />
                            }
                            {
                                (log.reasonCategory === "Damage_BlueZone") &&
                                <img
                                    src={feedIcons["Bluezone"]}
                                    alt={feedIcons["Bluezone"]}
                                    width={70}
                                />
                            }
                            {
                                (log.reasonCategory === "Damage_Drown") &&
                                <img
                                    src={feedIcons["Drown"]}
                                    alt={feedIcons["Drown"]}
                                    width={70}
                                />
                            }
                            {
                                (log.reasonCategory === "Damage_Explosion_RedZone") &&
                                <img
                                    src={feedIcons["Redzone"]}
                                    alt={feedIcons["Redzone"]}
                                    width={70}
                                />
                            }
                            {
                                (log.reasonCategory === "Damage_Explosion_JerryCan" ||
                                    log.reasonCategory === "Damage_Explosion_Grenade") &&
                                <img
                                    src={public_url + weaponIcons[dict["ProjGrenade_C"]]}
                                    alt={public_url + weaponIcons[dict["ProjGrenade_C"]]}
                                    height={30}
                                />
                            }
                            {
                                (log.reasonCategory === "Damage_Explosion_Vehicle") &&
                                <img
                                    src={feedIcons["Vehicle_Explosion"]}
                                    alt={feedIcons["Vehicle_Explosion"]}
                                    width={70}
                                />
                            }
                            {
                                (log.reasonCategory === "Damage_Groggy") &&
                                <img
                                    src={feedIcons["Groggy"]}
                                    alt={feedIcons["Groggy"]}
                                    width={70}
                                />
                            }
                            {
                                (log.reasonCategory === "Damage_Instant_Fall") &&
                                <img
                                    src={feedIcons["Fall"]}
                                    alt={feedIcons["Fall"]}
                                    width={70}
                                />
                            }
                            {
                                (log.reasonCategory === "Damage_Molotov") &&
                                <img
                                    src={public_url + weaponIcons[dict["ProjMolotov_C"]]}
                                    alt={public_url + weaponIcons[dict["ProjMolotov_C"]]}
                                    width={70}
                                />
                            }
                            {
                                (log.reasonCategory === "Damage_Punch") &&
                                <img
                                    src={feedIcons["Punch"]}
                                    alt={feedIcons["Punch"]}
                                    width={70}
                                />
                            }
                            {
                                (log.reasonCategory === "Damage_VehicleCrashHit" ||
                                    log.reasonCategory === "Damage_VehicleHit") &&
                                <img
                                    src={feedIcons["Vehicle"]}
                                    alt={feedIcons["Vehicle"]}
                                    width={70}
                                />
                            }
                        </Reason>
                        <VictimPlayerName style={{
                            color: (log.victimName === focusPlayer)? options.colors.dot.focused : (teammates.includes(log.victimName))? options.colors.dot.teammate : '#ffffff'}}>
                            {log.victimName}
                        </VictimPlayerName>
                    </LogGroup>
                )}
            </React.Fragment>
        )
    }
}


export default KillFeed

