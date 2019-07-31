import React from 'react'
import { map } from 'lodash'
import { Container, Stage } from '@inlet/react-pixi'
import PlayerFigure from './PlayerFigure'
import MapSprite from "./MapSprite"

import styled from 'styled-components'
import DestroyedObject from "./DestroyedObject";


const MAP_SIZES = {
    "8": {x: 13987, y: 13987},
    "10": {x: 15398, y: 15398},
    "11": {x: 14990, y: 15100},
    "12": {x: 15500, y: 15500},
}


const StageWrapper = styled.div`
    position: relative;

    &:after {
        content: "";
        display: block;
        padding-bottom: 100%;
    }
`

const StyledStage = styled(Stage)`
    position: absolute;
    overflow: hidden;
    div.konvajs-content {
        overflow: hidden;
        border-radius: 4px;
        position: absolute !important;
    }
`


class Map extends React.Component {
    state = { mapScale: 1, offsetX: 0, offsetY: 0 }

    static getDerivedStateFromProps(props) {
        if (props.options.tools.enabled) {
            const { offsetX, offsetY, mapScale } = props.options.tools.map
            return {
                offsetX,
                offsetY,
                mapScale,
            }
        }
        return {}
    }

    render() {
        const { match: { mapName }, timeline, mapSize, marks, options } = this.props
        const { mapScale, offsetX, offsetY } = this.state
        const scale = { x: mapScale, y: mapScale }
        const lolMapSize = MAP_SIZES[mapName]

        return (
            <StageWrapper id="StageWrapper">
                    <StyledStage
                        width={mapSize}
                        height={mapSize}
                    >
                        <Container scale={scale}
                                   x={offsetX}
                                   y={offsetY}
                                   sortableChildren={true}
                        >
                            <MapSprite mapName={mapName} mapSize={mapSize} mapScale={mapScale} />
                            {map(timeline.players, player =>
                                <PlayerFigure
                                    options={options}
                                    player={player}
                                    mapSize={mapSize}
                                    lolMapSize={lolMapSize}
                                    marks={marks}
                                    showName={marks.isPlayerTracked(player.name)}
                                    key={`player-${player.name}`}
                                />
                            )}
                            {map(timeline.destroyedObjectLocations, object =>
                                <DestroyedObject
                                    object={object}
                                    lolMapSize={lolMapSize}
                                    mapSize={mapSize}
                                    marks={marks}
                                    key={`${object.name}-${object.msSinceEpoch}`}
                                />
                            )}
                        </Container>
                    </StyledStage>
            </StageWrapper>
        )
    }
}

export default Map
