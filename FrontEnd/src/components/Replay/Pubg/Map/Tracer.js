import React from 'react'
import { toScale } from '../../../../lib/canvas-math.js'
import { Container, Graphics } from "@inlet/react-pixi";

const Tracer = ({ pubgMapSize, mapSize, mapScale, players, tracer }) => {
    if (!tracer) return null

    const { attackerName, victimName } = tracer

    const victimLoc = players[victimName].location
    const attackerLoc = players[attackerName].location

    return (
        <Container
            zIndex={2}
        >
            <Graphics
                draw={g => {
                    g.clear()

                    g.lineStyle(1 / mapScale, 0xffffff, 1)
                    g.moveTo(toScale(pubgMapSize, mapSize, attackerLoc.x), toScale(pubgMapSize, mapSize, attackerLoc.y))
                    g.lineTo(toScale(pubgMapSize, mapSize, victimLoc.x), toScale(pubgMapSize, mapSize, victimLoc.y))

                    g.lineStyle(1 / mapScale, 0xffd300, 1)
                    g.beginFill(0xffd300, 1)
                    g.drawStar(toScale(pubgMapSize, mapSize, victimLoc.x), toScale(pubgMapSize, mapSize, victimLoc.y), 5, 7 / mapScale)
                    g.endFill()

                }}
            />
        </Container>
    )
}

export default Tracer
