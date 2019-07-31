import React from 'react'
import { toScale } from '../../../../lib/canvas-math.js'
import {Container, Sprite, Graphics, Text} from '@inlet/react-pixi'
import * as PIXI from "pixi.js"

const getBasePlayerColor = ({ colors }, marks, player) => {
    if (marks.focusedPlayer().toLowerCase() === player.name.toLowerCase()) {
        return colors.dot.focused
    }

    return colors.dot.enemy
}

const getPlayerColor = ({ colors }, marks, player) => {
    const base = getBasePlayerColor({ colors }, marks, player)
    return `${base}E0`
}

const PlayerLabel = ({ visible, player, colorStr }) => {
    if (!visible) return null

    const width = player.name.length * 10;

    return (
       <Container position={[-30, 10]}>
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


const Player = ({player, colorHex}) => {
    const champName = player.championName;
    const champion = require(`../../../../assets/Lol/champion/${champName}.png`);
    return (
        <Container>
            <Sprite
                x={-13}
                y={-13}
                width={26}
                height={26}
                image={champion}
            />
            <Graphics
                draw={g => {
                    g.clear();
                    g.lineStyle(2, colorHex, 0.7)
                    g.drawRect(-13, -13, 26, 26);
                }}
            />
        </Container>
    )
}


const PlayerFigure = ({ options, player, lolMapSize, mapSize, marks, showName }) => {
    const x=toScale(lolMapSize.x, mapSize, player.location.x)
    const y=mapSize-toScale(lolMapSize.y, mapSize, player.location.y)
    const playerColor = (marks.focusedPlayer().toLowerCase() === player.name.toLowerCase())?
        0x20FF20 : (player.teamId === 100)? 0x2020FF : 0xFF2020;

    return (
        <Container
            position={[x, y]}
            zIndex={(marks.focusedPlayer() === player.name)? 5 : 4}
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
                player={player}
                colorHex={playerColor}
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