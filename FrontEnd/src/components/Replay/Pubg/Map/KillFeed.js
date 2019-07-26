import React from 'react'
import { map, filter, forEach } from 'lodash'
import styled from 'styled-components'
import { Container, Sprite, Graphics, Text } from '@inlet/react-pixi'
import * as PIXI from "pixi.js"
import dict from '../../../../assets/damageCauserName.json'
import Tooltip from "../../../Tooltip";
import Loadout from "../Roster/Loadout";

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


const TeamGroup = styled.ul`
    list-style-type: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 400;
    margin: 5px 0;
    padding: 4px;
    background: #FAFAFA;
`

const LogGroup = styled.ul`
    list-style-type: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 400;
    margin: 5px 0;
    padding: 4px;
    background: grey;
`

const PlayerItem = styled.li`
    margin: 0;
    overflow: hidden;
    cursor: pointer;
    display: grid;
    grid-template-columns: 1fr 15px 25px;
    grid-column-gap: 5px;

    i {
        margin-left: 5px;
        font-size: 1.1rem;
        line-height: 0.5rem;
    }
`

const KillerPlayerName = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
`

const PlayerDatapoint = styled.div`
    text-align: center;
`

const VictimPlayerName = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
`


const weaponIcons = importAll(require.context('../../../../assets/item/Weapon', true, /.png$/))
const feedIcons = importAll(require.context('../../../../assets/icons', true, /.png$/))
const public_url = (process.env.NODE_ENV === 'production')? process.env.PUBLIC_URL : "http://localhost:3000"

class KillFeed extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.killLogs.length === nextProps.killLogs.length ||
        this.props.killLogs.length !== 0 && nextProps.killLogs.length === 0)
            return false;
        return true;
    }


    render() {
       const { focusPlayer, teammates, mapSize, killLogs, options } = this.props;

        // killlog 최신순으로 정렬
        killLogs.sort(function (prev, next) {
            return next.msSinceEpoch - prev.msSinceEpoch
        })


        return (
            <React.Fragment>
                {map(killLogs, (log, i) =>
                    <LogGroup key={`killfeed-${log.msSinceEpoch}`}
                              y={(mapSize / 17 + 10) * i}
                              scale={1}
                    >
                        {/*             <Graphics
                        scale={1}
                        draw={g => {
                            g.clear();

                            g.lineStyle(1, 0x000000, 0.5)
                            g.beginFill(0x000000, 0.5);
                            g.drawRect(0, 0, mapSize / 4 + 20, mapSize / 17)
                            g.endFill()
                        }}
                    />*/}
                        {/*<Text text={log.killerName}
                          x={5}
                          y={mapSize / 44}
                          style={new PIXI.TextStyle({
                              fontSize: 10,
                              fontWeight: 300,
                              fill: [(log.killerName === focusPlayer)? options.colors.dot.focused : (teammates.includes(log.killerName))? options.colors.dot.teammate : '#ffffff'],
                          })} />*/}
                        <KillerPlayerName style={{
                            color: (log.killerName === focusPlayer)? options.colors.dot.focused : (teammates.includes(log.killerName))? options.colors.dot.teammate : '#ffffff'
                        }}>
                            {log.killerName}
                        </KillerPlayerName>
                        <PlayerDatapoint>
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
                        </PlayerDatapoint>
                        <VictimPlayerName style={{
                            color: (log.victimName === focusPlayer)? options.colors.dot.focused : (teammates.includes(log.victimName))? options.colors.dot.teammate : '#ffffff'}}>
                            {log.victimName}
                        </VictimPlayerName>
                        {/*
                    <Text text={log.victimName}
                          x={mapSize / 4 - 30}
                          y={mapSize / 44}
                          style={new PIXI.TextStyle({
                              fontSize: 10,
                              fontWeight: 300,
                              fill: [(log.victimName === focusPlayer)? options.colors.dot.focused : (teammates.includes(log.victimName))? options.colors.dot.teammate : '#ffffff'],
                          })} />*/}
                    </LogGroup>
                )}
            </React.Fragment>



            /*    <TeamGroup key={`roster-${r[0]}`}>
                    {r.map(playerName => {
                        const p = telemetry.players[playerName]

                        return (
                            <PlayerItem
                                key={p.name}
                                onClick={() => marks.toggleTrackedPlayer(p.name)}
                                onMouseEnter={() => marks.setHoveredPlayer(p.name)}
                                onMouseLeave={() => marks.setHoveredPlayer(null)}
                                style={{
                                    color: getRosterColor(options, marks, p),
                                    textDecoration: marks.isPlayerTracked(p.name) ? 'underline' : '',
                                }}
                            >
                                <Tooltip
                                    arrow
                                    placement="left"
                                    duration={0}
                                    theme="pubgsh"
                                    html={<Loadout items={p.items} />}
                                >
                                    <PlayerName>{p.name}</PlayerName>
                                </Tooltip>
                                <PlayerDatapoint>{p.kills}</PlayerDatapoint>
                                <PlayerDatapoint>{Math.round(p.damageDealt)}</PlayerDatapoint>
                            </PlayerItem>
                        )
                    })}
                </TeamGroup>*/


            /* <Container position={[mapSize * 3 / 4 - 30, 15]} zIndex={3}>

                 {map(killLogs, (log, i) =>
                     <Container key={`killfeed-${log.msSinceEpoch}`}
                                y={(mapSize / 17 + 10) * i}
                                scale={1}
                     >
                         <Graphics
                             scale={1}
                             draw={g => {
                                 g.clear();

                                 g.lineStyle(1, 0x000000, 0.5)
                                 g.beginFill(0x000000, 0.5);
                                 g.drawRect(0, 0, mapSize / 4 + 20, mapSize / 17)
                                 g.endFill()
                             }}
                         />
                         <Text text={log.killerName}
                               x={5}
                               y={mapSize / 44}
                               style={new PIXI.TextStyle({
                             fontSize: 10,
                             fontWeight: 300,
                             fill: [(log.killerName === focusPlayer)? options.colors.dot.focused : (teammates.includes(log.killerName))? options.colors.dot.teammate : '#ffffff'],
                         })} />
                         {
                             (log.reasonCategory === "Damage_Gun" || log.reasonCategory === "Damage_Melee") &&
                             <Sprite
                                 x={(mapSize / 4 + 10) / 3}
                                 y={mapSize / 44}
                                 image={public_url + weaponIcons[dict[log.reasonName]]}
                                 scale={0.1}
                             />
                         }
                         {
                             (log.reasonCategory === "Damage_BlueZone") &&
                             <Sprite
                                 x={(mapSize / 4 + 10) / 3}
                                 y={mapSize / 44-5}
                                 image={feedIcons["Bluezone"]}
                                 scale={0.2}
                             />
                         }
                         {
                             (log.reasonCategory === "Damage_Drown") &&
                             <Sprite
                                 x={(mapSize / 4 + 10) / 3}
                                 y={mapSize / 44-5}
                                 image={feedIcons["Drown"]}
                                 scale={0.2}
                             />
                         }
                         {
                             (log.reasonCategory === "Damage_Explosion_RedZone") &&
                             <Sprite
                                 x={(mapSize / 4 + 10) / 3}
                                 y={mapSize / 44-5}
                                 image={feedIcons["Redzone"]}
                                 scale={0.2}
                             />
                         }
                         {
                             (log.reasonCategory === "Damage_Explosion_JerryCan" ||
                                 log.reasonCategory === "Damage_Explosion_Grenade") &&
                             <Sprite
                                 x={(mapSize / 4 + 10) / 3}
                                 y={mapSize / 44}
                                 image={public_url + weaponIcons[dict["ProjGrenade_C"]]}
                                 scale={0.1}
                             />
                         }
                         {
                             (log.reasonCategory === "Damage_Explosion_Vehicle") &&
                             <Sprite
                                 x={(mapSize / 4 + 10) / 3}
                                 y={mapSize / 44-5}
                                 image={feedIcons["Vehicle_Explosion"]}
                                 scale={0.2}
                             />
                         }
                         {
                             (log.reasonCategory === "Damage_Groggy") &&
                             <Sprite
                                 x={(mapSize / 4 + 10) / 3}
                                 y={mapSize / 44-5}
                                 image={feedIcons["Groggy"]}
                                 scale={0.2}
                             />
                         }
                         {
                             (log.reasonCategory === "Damage_Instant_Fall") &&
                             <Sprite
                                 x={(mapSize / 4 + 10) / 3}
                                 y={mapSize / 44-5}
                                 image={feedIcons["Fall"]}
                                 scale={0.2}
                             />
                         }
                         {
                             (log.reasonCategory === "Damage_Molotov") &&
                             <Sprite
                                 x={(mapSize / 4 + 10) / 3}
                                 y={mapSize / 44}
                                 image={public_url + weaponIcons[dict["ProjMolotov_C"]]}
                                 scale={0.1}
                             />
                         }
                         {
                             (log.reasonCategory === "Damage_Punch") &&
                             <Sprite
                                 x={(mapSize / 4 + 10) / 3}
                                 y={mapSize / 44-5}
                                 image={feedIcons["Punch"]}
                                 scale={0.2}
                             />
                         }
                         {
                             (log.reasonCategory === "Damage_VehicleCrashHit" ||
                                 log.reasonCategory === "Damage_VehicleHit") &&
                             <Sprite
                                 x={(mapSize / 4 + 10) / 3}
                                 y={mapSize / 44-5}
                                 image={feedIcons["Vehicle"]}
                                 scale={0.1}
                             />
                         }
                         <Text text={log.victimName}
                               x={mapSize / 4 - 30}
                               y={mapSize / 44}
                               style={new PIXI.TextStyle({
                                   fontSize: 10,
                                   fontWeight: 300,
                                   fill: [(log.victimName === focusPlayer)? options.colors.dot.focused : (teammates.includes(log.victimName))? options.colors.dot.teammate : '#ffffff'],
                         })} />
                     </Container>
                 )}

             </Container>*/
        )
    }
}


export default KillFeed

