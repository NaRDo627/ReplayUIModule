import React from 'react'
import { Graphics } from '@inlet/react-pixi'
import { toScale } from '../../../../lib/canvas-math.js'

const ZoneCircle = ({ pubgMapSize, mapSize, mapScale, circle, color, background }) => {
    const x=toScale(pubgMapSize, mapSize, circle.x)
    const y=toScale(pubgMapSize, mapSize, circle.y)
    const backgroundColor = parseInt(background, 16)
    const lineColor = parseInt(color, 16)
    const scaledDiameter = toScale(pubgMapSize, mapSize, circle.radius)

    return (
        <Graphics
            draw={g => {
                g.clear()
                g.lineStyle(1 / mapScale, lineColor, (color === "ff0000")? 0x44 / 0xff : 1)
                g.beginFill(backgroundColor, (color === "ff0000")? 0x44 / 0xff : 0);
                g.drawCircle(x, y, scaledDiameter);
                g.endFill()
            }}

        />
    )
}

export const Safezone = props =>
    <ZoneCircle {...props} color="ffffff" />

export const Bluezone = props =>
    <ZoneCircle {...props} color="0000ff" />

export const Redzone = props =>
    <ZoneCircle {...props} color="ff0000" background="ff0000" />
