import React from 'react'
//import { Circle } from 'react-konva'
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
                g.lineStyle(0)
                g.beginFill(backgroundColor, (color === "ff0000")? 0x44 / 0xff : 0);
                g.drawCircle(x, y, scaledDiameter);
                g.endFill()
            }}

            //strokeWidth={1 / mapScale}
        />
    )
}

export const Safezone = props =>
    <ZoneCircle {...props} color="ffffff" />

export const Bluezone = props =>
    <ZoneCircle {...props} color="0000ff" />

export const Redzone = props =>
    <ZoneCircle {...props} color="ff0000" background="ff0000" />


    /*import React from 'react'
import { Circle } from 'react-konva'
import { toScale } from '../../../../lib/canvas-math.js'

const ZoneCircle = ({ pubgMapSize, mapSize, mapScale, circle, color, background }) => {
    return (
        <Circle
            x={toScale(pubgMapSize, mapSize, circle.x)}
            y={toScale(pubgMapSize, mapSize, circle.y)}
            fill={background}
            stroke={color}
            width={toScale(pubgMapSize, mapSize, circle.radius * 2)}
            height={toScale(pubgMapSize, mapSize, circle.radius * 2)}
            strokeWidth={1 / mapScale}
        />
    )
}

export const Safezone = props =>
    <ZoneCircle {...props} color="white" />

export const Bluezone = props =>
    <ZoneCircle {...props} color="blue" />

export const Redzone = props =>
    <ZoneCircle {...props} color="#FF000044" background="#FF000044" />
*/