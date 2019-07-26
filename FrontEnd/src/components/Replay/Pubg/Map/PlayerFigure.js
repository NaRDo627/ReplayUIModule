import React from 'react'
import { toScale } from '../../../../lib/canvas-math.js'
import {Container, Sprite, Graphics, Text} from '@inlet/react-pixi'
import {clamp} from "lodash";
import parachute from '../../../../assets/open-parachute.png'
import vehicleCar from '../../../../assets/jeep.png'
import vehicleBoat from '../../../../assets/boat.png'
import * as PIXI from "pixi.js"

const getBasePlayerColor = ({ colors }, marks, player) => {
    if (marks.focusedPlayer() === player.name) {
        return colors.dot.focused
    } else if (player.teammates.includes(marks.focusedPlayer())) {
        return colors.dot.teammate
    }

    return colors.dot.enemy
}

const getPlayerColor = ({ colors }, marks, player) => {
    const base = getBasePlayerColor({ colors }, marks, player)
    return `${base}E0`
}

const getBaseStatusColor = ({ colors }, marks, player) => {
    if (player.status === 'dead') {
        const isTeammate = player.teammates.includes(marks.focusedPlayer())
        const isFocused = marks.focusedPlayer() === player.name

        if (isTeammate || isFocused) {
            return colors.dot.deadTeammate
        }

        return colors.dot.dead
    }

    if (player.status !== 'dead' && player.health === 0) {
        return colors.dot.knocked
    }

    return colors.dot.base
}

const getStatusColor = ({ colors }, marks, player) => {
    const base = getBaseStatusColor({ colors }, marks, player)
    return `${base}B0`
}

const PlayerLabel = ({ visible, player, colorStr }) => {
    if (!visible) return null

    const width = (player.name.length >= 13)? 95 : 55;

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

const HealthBar = ({options, player, mapSize}) => {
    //console.log(options)
    if(!options.showHealthBar)
        return null;

    if(player.health === 0)
        return null;

    const health = player.health / 4;
    const healthColor = (health > 18)? 0x008000 : (health > 9)? 0xffff00 : 0xff0000;
    return (
        <Graphics
            draw={g => {
                g.clear();

                // Draw Health Bar
                g.lineStyle(2, 0x000000, 1)
                g.beginFill(0x000000, 0.7);
                g.drawRect(-(mapSize / 60), -(mapSize / 68), mapSize / 28, mapSize / 241)
                g.endFill()

                g.lineStyle(0)
                g.beginFill(healthColor, 1);
                g.drawRect(-(mapSize / 60), -(mapSize / 68), ((mapSize / 28) / 25) * health, mapSize / 241)
                g.endFill()
            }}
        />
    )
}

const Player = ({options, player, marks, mapScale, mapSize}) => {
    const playerColor = parseInt(getPlayerColor(options, marks, player).substr(1, 6), 16);
    const playerColorAlpha = parseInt(getPlayerColor(options, marks, player).substring(7), 16) / 0xFF;
    const statusColor = parseInt(getStatusColor(options, marks, player).substr(1, 6), 16);
    const diameter = marks.isPlayerHovered(player.name) ? (mapSize / 70) : (mapSize / 80)
    const scaledDiameter = diameter * clamp(mapScale / 1.4, 1, 1.3)

    // Step 1. 낙하산에 타고 있는가?
    if(player.inParachute) {
        return (
            <Sprite
                x={-(mapSize / 70)}
                y={-(mapSize / 70)}
                width={(mapSize * 2 / 50)}
                height={(mapSize * 2 / 50)}
                image={parachute}
            />
        );
    }

    // Step 2. 차에 타고 있는가?
    if(player.vehicle === "WheeledVehicle" || player.vehicle === "FloatingVehicle") {
        let vehicleType = null
        if(player.vehicle === "WheeledVehicle")
            vehicleType = vehicleCar
        else if(player.vehicle === "FloatingVehicle")
            vehicleType = vehicleBoat

        return (
            <Sprite
                image={vehicleType}
                x={-(mapSize / 70)}
                y={-(mapSize / 70)}
                width={(mapSize * 2 / 50)}
                height={(mapSize * 2 / 50)}
            />
        );
    }

    return (
        <Graphics
            draw={g => {
                g.clear();

                if(player.health !== 0) {
                    // Draw Figure
                    g.lineStyle(1, 0x000000, 1)
                    g.beginFill(playerColor, playerColorAlpha);
                    g.drawCircle(0, 0, scaledDiameter / 2);
                    g.endFill()

                }
                else {
                    // Draw Status
                    g.lineStyle(1, 0x000000, 0.7)
                    g.beginFill(statusColor, 0.7);
                    g.drawCircle(0, 0, scaledDiameter / 2);
                    g.endFill()
                }
            }}
        />
    )
}


const PlayerFigure = ({ options, player, pubgMapSize, mapSize, marks, mapScale, showName }) => {
    const x=toScale(pubgMapSize, mapSize, player.location.x)
    const y=toScale(pubgMapSize, mapSize, player.location.y)

    return (
        <Container
            position={[x, y]}
            scale={{ x: 1 / mapScale, y: 1 / mapScale }}
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
                mapScale={mapScale}
                mapSize={mapSize}
            />
            <HealthBar
                player={player}
                mapSize={mapSize}
                options={options}
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