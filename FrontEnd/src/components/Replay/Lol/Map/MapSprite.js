import React from 'react'
import { Container, Sprite } from '@inlet/react-pixi'
import {Image} from "react-konva";


class MapSprite extends React.Component {
    state = { image: null }

    render() {
        const mapImage = require(`../../../../assets/Lol/map${this.props.mapName}.png`);
        return (
            <Container>
                <Sprite image={mapImage} height={this.props.mapSize} width={this.props.mapSize} zIndex={0} />
            </Container>
        )
    }
}

export default MapSprite