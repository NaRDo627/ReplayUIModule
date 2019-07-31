import React from 'react'
import { filter } from 'lodash'
import {Container, Graphics, Text} from "@inlet/react-pixi";
import * as PIXI from "pixi.js"

const AliveCount = ({ players }) => {
    if (!players) {
        return null
    }

    const aliveCount = Object.keys(players).length - filter(players, p => p.status === 'dead').length

    return (
        <React.Fragment>
            <Container position={[15, 15]} zIndex={4}>
                <Graphics
                    draw={g => {
                        g.clear();

                        g.lineStyle(1, 0x555555, 0.7)
                        g.beginFill(0x555555, 0.7);
                        g.drawRect(0, 0, 36, 38)
                        g.endFill()
                    }}
                />
                <Text text={`${aliveCount}`}
                      x={5}
                      y={5}
                      style={new PIXI.TextStyle({
                          fontSize: 20,
                          fontWeight: 700,
                          fontFamily: "Malgun Gothic",
                          fill: '#ffffff',
                      })} />
            </Container>
            <Container position={[51, 15]} zIndex={4}>
                <Graphics
                    draw={g => {
                        g.clear();

                        g.lineStyle(1, 0x777777, 0.7)
                        g.beginFill(0x777777, 0.7);
                        g.drawRect(0, 0, 70, 38)
                        g.endFill()
                    }}
                />
                <Text text={`Alives`}
                      x={5}
                      y={5}
                      style={new PIXI.TextStyle({
                          fontSize: 20,
                          fontWeight: 700,
                          fontFamily: "Malgun Gothic",
                          fill: '#ffffff',
                      })} />
            </Container>
        </React.Fragment>
    )
}

export default AliveCount
