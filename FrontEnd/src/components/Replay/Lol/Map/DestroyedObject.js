import React from 'react'
import { toScale } from '../../../../lib/canvas-math.js'
import {Container, Sprite, Graphics, Text} from '@inlet/react-pixi'
import {clamp} from "lodash";

import * as PIXI from "pixi.js"

const ObjectLabel = ({ visible, object, colorStr }) => {
    if (!visible) return null

    const width = object.name.length * 8;

    return (
       <Container position={[-20, 10]}>
           <Graphics
           draw={g => {
               g.clear();

               g.lineStyle(1, 0x0D0D0D, 0.8)
               g.beginFill(0x0D0D0D, 0.8);
               g.drawRect(0, 0, width, 15)
               g.endFill()
           }} />

           <Text text={`${object.name}`}
                 x={5}
                 y={0}
                 style={new PIXI.TextStyle({
                     fontSize: 7,
                     fontWeight: 200,
                     lineHeight: 13,
                     wordWrapWidth:  width,
                     fill: '#FFFFFF',
                 })} />
       </Container>
    )
}


const Building = ({options, building, marks, mapSize}) => {

    return (
        <Graphics
            draw={g => {
                g.clear();

                // Draw Figure
                g.lineStyle(1, 0xffffff, 1)
                g.beginFill(0xffffff, 1);
                g.drawRect(-5, -5, 10, 10);
                g.endFill()
            }}
        />
    )
}


const DestroyedObject = ({ options, object, lolMapSize, mapSize, marks, showName }) => {
/*    const x=toScale(lolMapSize, mapSize, player.location.x)
    const y=toScale(lolMapSize, mapSize, player.location.y)*/


    const x=toScale(lolMapSize.x, mapSize, object.x)
    const y=mapSize-toScale(lolMapSize.y, mapSize, object.y)
    let hover = false;

    return (
        <Container
            position={[x, y]}
            zIndex={3}
            interactive={true}
            mouseover={() => {marks.setHoveredObject(object.msSinceEpoch)}}
            mouseout={() => {marks.setHoveredObject(null)}}
        >
            <Building
                options={options}
                building={object}
                marks={marks}
                mapSize={mapSize}
            />

            <ObjectLabel
                object={object}
                visible={marks.isObjectHovered(object.msSinceEpoch)}
            />
        </Container>
    )
}





export default DestroyedObject;