import React from 'react'
import { toScale } from '../../../../lib/canvas-math'
import dict from '../../../../assets/Pubg/itemId.json'
import {Container, Graphics, Sprite, Text} from "@inlet/react-pixi";
import * as PIXI from "pixi.js";

const Items = ({ visible, items }) => {
    if (!visible) return null

    const itemsText = items
        .map(i => `${i.stackCount > 1 ? `(${i.stackCount}) ` : ''}${dict[i.itemId] || i.itemId}`)
        .join('\n')

    return (
        <Container position={[-20, 30]}>
            <Graphics
                draw={g => {
                    g.clear();

                    g.lineStyle(1, 0x000000, 0.8)
                    g.beginFill(0x000000, 0.8);
                    g.drawRect(0, 0, 180, 110)
                    g.endFill()
                }} />

            <Text text={`${itemsText}`}
                  x={5}
                  y={0}
                  style={new PIXI.TextStyle({
                      fontSize: 7,
                      fill: '#FFFFFF',
                  })} />
        </Container>
    )
}

class CarePackage extends React.Component {
    state = { flyingImage: null, normalImage: null, isHovered: false }

    render() {
        const { pubgMapSize, mapSize, mapScale, carePackage } = this.props
        if (!carePackage) return null

        const flyingImage = require(`../../../../assets/Pubg/CarePackage_Flying.png`);
        const normalImage = require(`../../../../assets/Pubg/CarePackage_Normal.png`);

        // react-konva uses the deprecated string refs from React.
        // TODO: Investigate upgrade path
        /* eslint-disable react/no-string-refs */
        return (
            <Container
                x={toScale(pubgMapSize, mapSize, carePackage.location.x)}
                y={toScale(pubgMapSize, mapSize, carePackage.location.y)}
                scale={{ x: 1 / mapScale, y: 1 / mapScale }}
                interactive={true}
                mouseover={() => {
                    this.setState({ isHovered: true })
                }}
                mouseout={() => {
                    this.setState({ isHovered: false })
                }}
            >
                <Sprite
                    image={carePackage.state === 'spawned' ? flyingImage : normalImage}
                    width={18}
                    height={carePackage.state === 'spawned' ? 32 : 17}
                    x={0}
                    y={carePackage.state === 'spawned' ? -6 : 9}
                />
                <Items visible={this.state.isHovered} items={carePackage.items} />
            </Container>
        )
    }
}

export default CarePackage
