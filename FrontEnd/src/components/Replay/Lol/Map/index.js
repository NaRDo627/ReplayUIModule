import React from 'react'
import { map, clamp, sortBy } from 'lodash'
import { Container, Stage } from '@inlet/react-pixi'
import PlayerFigure from './PlayerFigure'
import MapSprite from "./MapSprite"

import styled from 'styled-components'
import DestroyedObject from "./DestroyedObject";

const SCALE_STEP = 1.2
const MIN_SCALE = 1
const MAX_SCALE = 50
const CLAMP_MAP = true // TODO: This should be a configurable option
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


    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        const { match: { mapName }, timeline, mapSize, marks, msSinceEpoch, options } = this.props
        const { mapScale, offsetX, offsetY } = this.state
        const scale = { x: mapScale, y: mapScale }

        const lolMapSize = MAP_SIZES[mapName]

        // The order players are added to the canvas determines their relative z-index. We want to render
        // focused players on top, then tracked, etc, so we need to sort the players. We want dead players
        // below everything else, so we have to do this sort on every render. We use ~ and @ as they wrap
        // the ASCII range and we want a stable sort, so we use the player's name as the default value.

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
                                    mapScale={mapScale}
                                    key={`player-${player.name}`}
                                    marks={marks}
                                    showName={marks.isPlayerTracked(player.name)}
                                />
                            )}
                            {map(timeline.destroyedObjectLocations, object =>
                                <DestroyedObject
                                    options={options}
                                    object={object}
                                    mapSize={mapSize}
                                    lolMapSize={lolMapSize}
                                    mapScale={mapScale}
                                    key={`${object.name}-${object.msSinceEpoch}`}
                                    marks={marks}
                                />
                            )}

                            {/*
                            {telemetry.carePackages.map(carePackage =>
                                <CarePackage
                                    key={carePackage.key}
                                    mapSize={mapSize}
                                    pubgMapSize={pubgMapSize}
                                    mapScale={mapScale}
                                    carePackage={carePackage}
                                />
                            )}
                            {map(sortedPlayers, player =>
                                <Figure
                                options={options}
                                player={player}
                                mapSize={mapSize}
                                pubgMapSize={pubgMapSize}
                                mapScale={mapScale}
                                key={`dot-${player.name}`}
                                marks={marks}
                                showName={marks.isPlayerTracked(player.name)}
                                />
                                )}
                            {telemetry.tracers.map(tracer =>
                                <Tracer
                                    key={tracer.key}
                                    mapSize={mapSize}
                                    pubgMapSize={pubgMapSize}
                                    mapScale={mapScale}
                                    players={telemetry.players}
                                    tracer={tracer}
                                    msSinceEpoch={msSinceEpoch}
                                />
                            )}
                            */}
                        </Container>
                    </StyledStage>
            </StageWrapper>
        )
    }
}

export default Map
