import React from 'react'
import { map, filter, forEach } from 'lodash'
import styled from 'styled-components'
import { Container, Sprite, Graphics, Text } from '@inlet/react-pixi'
import * as PIXI from "pixi.js"
import dict from '../../../../assets/damageCauserName.json'

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

const weaponIcons = importAll(require.context('../../../../assets/item/Weapon', true, /.png$/))
const feedIcons = importAll(require.context('../../../../assets/icons', true, /.png$/))
const public_url = (process.env.NODE_ENV === 'production')? process.env.PUBLIC_URL : "http://localhost:3000"

const Wrapper = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
    grid-template-columns: 32px;
    text-align: center;
    display: grid;
    font-family: 'Teko';
    font-weight: 300;
    font-size: 2.5rem;
    line-height: 2.5rem;
    padding: 0.2rem;
    opacity: 0.8;
    text-transform: uppercase;
    user-select: none;
    pointer-events: none;
    background-color: #333333;
`

const AliveCountNumber = styled.div`
    grid-column: 1;
    color: #FFFFFF;
    background-color: #777777;
    padding: 0.5rem 0.5rem 0;
`

const AliveText = styled.div`
    grid-column: 2;
    color: #CCCCCC;
    background-color: #333333;
    padding: 0.5rem 0.5rem 0;
`

const KillerText = styled.div`
    grid-column: 1;
    padding: 0.5rem 0.5rem 0;
`

const UsedWeapon = styled.div`
    grid-column: 2;
    padding: 0.5rem 0.5rem 0;
`

const VictimText = styled.div`
    grid-column: 3;
    padding: 0.5rem 0.5rem 0;
`

const KillFeed = ({ focusPlayer, teammates, mapSize, killLogs, options }) => {

//    console.log(images)

    //const aliveCount = Object.keys(players).length - filter(players, p => p.status === 'dead').length

  //  console.log(weaponIcons)

    // killlog 최신순으로 정렬
    killLogs.sort(function (prev, next) {
        return next.msSinceEpoch - prev.msSinceEpoch
    })


    return (
        <Container position={[mapSize * 3 / 4 - 30, 15]} zIndex={3}>
            {/*
            <Graphics
                draw={g => {
                    g.clear();

                    g.lineStyle(1, 0x000000, 0.5)
                    g.beginFill(0x000000, 0.5);
                    g.drawRect(0, 0, mapSize / 4 + 10, mapSize / 17)
                    g.endFill()
                }}
            />
         <Text text={"NaLDo627"}
                  x={5}
                  y={mapSize / 44}
                  style={new PIXI.TextStyle({
                      fontSize: 9,
                      fontWeight: 350,
                      fill: ['#ffffff'],
                  })} />
            <Sprite
                x={(mapSize / 4 + 10) / 3}
                y={mapSize / 44-5}
                //image={public_url + weaponIcons[dict["WeapHK416_C"]]}
                image={feedIcons["Redzone"]}
                scale={0.2}
            />

            <Text text={"Cgull"}
                  x={mapSize / 4 - 35}
                  y={mapSize / 44}
                  style={new PIXI.TextStyle({
                      fontSize: 9,
                      fontWeight: 350,
                      fill: ['#ffffff'],
                  })} />*/}

            {map(killLogs, (log, i) =>
                <Container key={`killfeed-${log.msSinceEpoch}`}
                           y={(mapSize / 17 + 10) * i}
                           scale={1}
                          /* width={mapSize / 4 - 10}
                           height={mapSize / 17}*/
                >
                    <Graphics
                        scale={1}
                        draw={g => {

                            /*console.log(log)
                            console.log(dict)
                            console.log(weaponIcons)
                            console.log(feedIcons)*/
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

        </Container>


       /* <Wrapper>
            <AliveCountNumber>{aliveCount}</AliveCountNumber>
            <AliveText>alive</AliveText>
        </Wrapper>*/
    )
}

export default KillFeed

