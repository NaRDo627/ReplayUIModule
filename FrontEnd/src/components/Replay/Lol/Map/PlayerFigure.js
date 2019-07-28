import React from 'react'
import { toScale } from '../../../../lib/canvas-math.js'
import {Container, Sprite, Graphics, Text} from '@inlet/react-pixi'
import {clamp} from "lodash";

import * as PIXI from "pixi.js"

const getBasePlayerColor = ({ colors }, marks, player) => {
    if (marks.focusedPlayer() === player.name) {
        return colors.dot.focused
    }

    return colors.dot.enemy
}

const getPlayerColor = ({ colors }, marks, player) => {
    const base = getBasePlayerColor({ colors }, marks, player)
    return `${base}E0`
}

const getBaseStatusColor = ({ colors }, marks, player) => {
    if (player.status === 'dead') {
        const isFocused = marks.focusedPlayer() === player.name

        if (isFocused) {
            return colors.dot.deadTeammate
        }

        return colors.dot.dead
    }

    return colors.dot.base
}

const getStatusColor = ({ colors }, marks, player) => {
    const base = getBaseStatusColor({ colors }, marks, player)
    return `${base}B0`
}

const PlayerLabel = ({ visible, player, colorStr }) => {
    if (!visible) return null

    const width = player.name.length * 8;

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

           <Text text={`${player.name}`}
                 x={5}
                 y={0}
                 style={new PIXI.TextStyle({
                     fontSize: 7,
                     fontWeight: 200,
                     lineHeight: 13,
                     wordWrapWidth:  width,
                     fill: colorStr,
                 })} />
       </Container>
    )
}


const Player = ({options, player, marks, mapSize}) => {

    return (
        <Graphics
            draw={g => {
                g.clear();

                if(player.health !== 0) {
                    // Draw Figure
                    g.lineStyle(1, 0xffffff, 1)
                    g.beginFill(0xffffff, 1);
                    g.drawCircle(0, 0, 10);
                    g.endFill()

                }
                else {
                    // Draw Status
                    g.lineStyle(1, 0xffffff, 0.7)
                    g.beginFill(0xffffff, 1);
                    g.drawCircle(0, 0, 10);
                    g.endFill()
                }
            }}
        />
    )
}


const PlayerFigure = ({ options, player, lolMapSize, mapSize, marks, showName }) => {
/*    const x=toScale(lolMapSize, mapSize, player.location.x)
    const y=toScale(lolMapSize, mapSize, player.location.y)*/

    const x=toScale(lolMapSize.x, mapSize, player.location.x)
    const y=mapSize-toScale(lolMapSize.y, mapSize, player.location.y)

    return (
        <Container
            position={[x, y]}
            zIndex={(marks.focusedPlayer() === player.name)? 3 : (player.status !== 'dead')? 2 : 1}
            interactive={true}
            mouseover={() => {marks.setHoveredPlayer(player.name)}}
            mouseout={() => {marks.setHoveredPlayer(null)}}
            click={() => { const toToggle = [player.name]
                if (marks.isPlayerTracked(player.name)) {
                    marks.setHoveredPlayer(null)
                }

                marks.toggleTrackedPlayer(...toToggle)}}
        >
            <Player
                options={options}
                player={player}
                marks={marks}
                mapSize={mapSize}
            />

            <PlayerLabel
                player={player}
                visible={showName || marks.isPlayerHovered(player.name)}
                colorStr={getPlayerColor(options, marks, player)}
            />
        </Container>
    )
}





export default PlayerFigure;