import React from 'react'
import { toScale } from '../../../../lib/canvas-math.js'
import {Container, Sprite, Graphics} from '@inlet/react-pixi'
import {clamp} from "lodash";
//import {Arc, Group, Label, Tag, Text} from "react-konva";
import parachute from '../../../../assets/open-parachute.png'
import vehicleCar from '../../../../assets/jeep.png'
import vehicleBoat from '../../../../assets/boat.png'

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
/*

const PlayerLabel = ({ visible, player, strokeColor }) => {
    if (!visible) return null

    return (
        <Label offsetY={-11}>
            <Tag
                fill="#000000A0"
                pointerDirection="up"
                pointerHeight={7}
                pointerWidth={11}
                stroke={strokeColor}
                strokeWidth={0.5}
                cornerRadius={4}
            />
            <Text
                fill={strokeColor}
                lineHeight={1}
                padding={5}
                text={player.name}
                fontSize={10}
                align="center"
            />
        </Label>
    )
}
*/

const HealthBar = ({player, x, y}) => {

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
                g.drawRect(x-12, y-12, 25, 3)
                g.endFill()

                g.lineStyle(0)
                g.beginFill(healthColor, 1);
                g.drawRect(x-12, y-12, health, 3)
                g.endFill()
            }}
        />
    )
}

const Player = ({options, player, marks, mapScale, x, y}) => {
    const playerColor = parseInt(getPlayerColor(options, marks, player).substr(1, 6), 16);
    const playerColorAlpha = parseInt(getPlayerColor(options, marks, player).substring(7), 16) / 0xFF;
    const statusColor = parseInt(getStatusColor(options, marks, player).substr(1, 6), 16);
    const diameter = marks.isPlayerHovered(player.name) ? 11 : 8
    const scaledDiameter = diameter * clamp(mapScale / 1.4, 1, 1.3)

    // Step 1. 낙하산에 타고 있는가?
    if(player.inParachute) {
        return (
            <Sprite
                x={x-10}
                y={y-10}
                width={20}
                height={20}
                image={parachute}
                zIndex={(player.status !== 'dead')? 2 : 1}
                interactive={true}
                mouseover={() => {marks.setHoveredPlayer(player.name)}}
                mouseout={() => {marks.setHoveredPlayer(null)}}
                click={() => { const toToggle = [player.name]
                    if (marks.isPlayerTracked(player.name)) {
                        marks.setHoveredPlayer(null)
                    }

                    marks.toggleTrackedPlayer(...toToggle)}}/>
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
                x={x-10}
                y={y-10}
                width={20}
                height={20}
                zIndex={(player.status !== 'dead')? 2 : 1}
                interactive={true}
                mouseover={() => {marks.setHoveredPlayer(player.name)}}
                mouseout={() => {marks.setHoveredPlayer(null)}}
                click={() => { const toToggle = [player.name]
                    if (marks.isPlayerTracked(player.name)) {
                        marks.setHoveredPlayer(null)
                    }

                    marks.toggleTrackedPlayer(...toToggle)}}/>
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
                    //      g.drawRoundedRect(x-7, y, 15, 10, 5)
                    g.drawCircle(x, y, scaledDiameter / 2);
                    g.endFill()

                }
                else {
                    // Draw Status
                    g.lineStyle(1, 0x000000, 0.7)
                    g.beginFill(statusColor, 0.7);
                    //     g.drawRoundedRect(x-7, y, 15, 10, 5)
                    g.drawCircle(x, y, scaledDiameter / 2);
                    g.endFill()
                }
            }}

            interactive={true}
            mouseover={() => {marks.setHoveredPlayer(player.name)}}
            mouseout={() => {marks.setHoveredPlayer(null)}}
            click={() => { const toToggle = [player.name]
                if (marks.isPlayerTracked(player.name)) {
                    marks.setHoveredPlayer(null)
                }

                marks.toggleTrackedPlayer(...toToggle)}}
        />
    )
}


const PlayerFigure = ({ options, player, pubgMapSize, mapSize, marks, mapScale, showName }) => {
    const x=toScale(pubgMapSize, mapSize, player.location.x)
    const y=toScale(pubgMapSize, mapSize, player.location.y)

    return (
        <Container
            zIndex={(player.status !== 'dead')? 2 : 1}
        >
            <Player
                options={options}
                player={player}
                marks={marks}
                mapScale={mapScale}
                x={x}
                y={y}
            />
            <HealthBar
                player={player}
                x={x}
                y={y}
            />
        </Container>


    )
}





export default PlayerFigure;