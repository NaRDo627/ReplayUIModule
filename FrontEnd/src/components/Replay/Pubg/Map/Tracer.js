import React from 'react'
import { Line } from 'react-konva'
import { toScale } from '../../../../lib/canvas-math.js'
import { Container, Graphics } from "@inlet/react-pixi";

const INTERVALS = 16

const Tracer = ({ pubgMapSize, mapSize, mapScale, players, tracer, msSinceEpoch }) => {
    if (!tracer) return null

    const { attackerName, victimName, startInterval, endInterval } = tracer

    const victimLoc = players[victimName].location
    const attackerLoc = players[attackerName].location

    const realStartInterval = endInterval - 16
    const curInterval = (msSinceEpoch / 100) - realStartInterval
    const tracerInterval = Math.floor(curInterval / ((endInterval - realStartInterval) / INTERVALS))
    const xDeltaPerInterval = (victimLoc.x - attackerLoc.x) / INTERVALS
    const yDeltaPerInterval = (victimLoc.y - attackerLoc.y) / INTERVALS

    const fromX = attackerLoc.x + (xDeltaPerInterval * (tracerInterval + 0.2))
    const fromY = attackerLoc.y + (yDeltaPerInterval * (tracerInterval + 0.2))
    const toX = attackerLoc.x + (xDeltaPerInterval * (tracerInterval + 0.8))
    const toY = attackerLoc.y + (yDeltaPerInterval * (tracerInterval + 0.8))

    //console.log(toScale(pubgMapSize, mapSize, toX), toScale(pubgMapSize, mapSize, toY))

    return (
        <Container zIndex={2}>
            <Graphics
                draw={g => {

                    g.clear()

                 /*   g.lineStyle(1, 0x000000, 1)
                    g.beginFill(0x000000, 1)
                    g.drawCircle(toScale(pubgMapSize, mapSize, toX), toScale(pubgMapSize, mapSize, toY), 1)
                    g.endFill()*/

                    //if(tracerInterval)

                    g.lineStyle(1.5, 0xffffff, 1)
                    g.moveTo(toScale(pubgMapSize, mapSize, attackerLoc.x), toScale(pubgMapSize, mapSize, attackerLoc.y))
                    g.lineTo(toScale(pubgMapSize, mapSize, victimLoc.x), toScale(pubgMapSize, mapSize, victimLoc.y))

                    g.lineStyle(1, 0xffd300, 1)
                    g.beginFill(0xffd300, 1)
                    g.drawStar(toScale(pubgMapSize, mapSize, victimLoc.x), toScale(pubgMapSize, mapSize, victimLoc.y), 5, 4)
                    g.endFill()

                    /*g.moveTo(toScale(pubgMapSize, mapSize, toX), toScale(pubgMapSize, mapSize, toY))
                    g.lineTo(toScale(pubgMapSize, mapSize, fromX), toScale(pubgMapSize, mapSize, fromY))*/
                }}
                /*
                points={[
                    toScale(pubgMapSize, mapSize, toX), toScale(pubgMapSize, mapSize, toY),
                    toScale(pubgMapSize, mapSize, fromX), toScale(pubgMapSize, mapSize, fromY),
                ]}
                stroke="#FFFFFF80"
                strokeWidth={1.5 / Math.max(1, mapScale / 1.4)}*/
            />
        </Container>

    )

  /*  return (
        <Line
            points={[
                toScale(pubgMapSize, mapSize, toX), toScale(pubgMapSize, mapSize, toY),
                toScale(pubgMapSize, mapSize, fromX), toScale(pubgMapSize, mapSize, fromY),
            ]}
            stroke="#FFFFFF80"
            strokeWidth={1.5 / Math.max(1, mapScale / 1.4)}
        />
    )*/
}

export default Tracer
