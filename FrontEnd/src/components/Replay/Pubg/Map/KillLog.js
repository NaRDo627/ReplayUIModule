import React from 'react'
import { map, filter, forEach } from 'lodash'
import styled from 'styled-components'
import { Container, Sprite, Graphics, Text } from '@inlet/react-pixi'
import * as PIXI from "pixi.js"

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

const images = importAll(require.context('../../../../assets/item/Weapon', true, /.png$/))


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

const KillLog = ({ players, mapSize, killLogs }) => {
    if (!players) {
        return null
    }

//    console.log(images)

    const aliveCount = Object.keys(players).length - filter(players, p => p.status === 'dead').length
    const public_url = (process.env.NODE_ENV === 'production')? process.env.PUBLIC_URL : "http://localhost:3000/"
    console.log(images)

    // killlog 최신순으로 정렬
    killLogs.sort(function (prev, next) {
        return next.msSinceEpoch - prev.msSinceEpoch
    })


    return (
        <Container x={mapSize * 3 / 4} y={16} options={{ backgroundColor: 0xeef1f5 }}>

            {map(killLogs, (log, i) =>
                <Container>
                    <Graphics
                        draw={g => {
                            console.log(log)
                            g.clear();

                            g.lineStyle(1, 0x000000, 1)
                            g.beginFill(0x000000, 0.5);
                            g.drawRect(0, (mapSize / 17 + 10) * i, mapSize / 4 - 10, mapSize / 17)
                            g.endFill()
                        }}
                    />
                    <Text text={log.killerName} x={5} y={(mapSize / 17 + 10) * i} style={new PIXI.TextStyle({
                        fontSize: 15,
                        fontWeight: 400,
                        fill: ['#ffffff'],
                    })} />
                    {
                        (log.reasonCategory === "Damage_Gun") &&
                        <Sprite
                            x={25} y={(mapSize / 17 + 10) * i}
                            image={public_url + images[log.reasonName]}
                            scale={0.1}
                        />
                    }
                    <Text text={log.victimName} x={35} y={(mapSize / 17 + 10) * i} style={new PIXI.TextStyle({
                        fontSize: 15,
                        fontWeight: 400,
                        fill: ['#ffffff'],
                    })} />
                </Container>
            )}
            <Sprite
                x={25} y={(mapSize / 17 + 10) * 1}
                image={public_url + images["Item_Weapon_M249_C"]}
                scale={0.1}
            />

        </Container>


       /* <Wrapper>
            <AliveCountNumber>{aliveCount}</AliveCountNumber>
            <AliveText>alive</AliveText>
        </Wrapper>*/
    )
}

export default KillLog

