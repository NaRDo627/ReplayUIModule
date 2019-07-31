import React from 'react'
import { map, clamp, sortBy } from 'lodash'
import { Container, Stage } from '@inlet/react-pixi'
import Figure from './PlayerFigure'
import MapSprite from "./MapSprite"

import styled from 'styled-components'
import { Safezone, Bluezone, Redzone } from './ZoneCircle.js'
import CarePackage from './CarePackage.js'
import Tracer from './Tracer.js'
import AliveCount from './AliveCount.js'

const SCALE_STEP = 1.2
const MIN_SCALE = 1
const MAX_SCALE = 50
const CLAMP_MAP = true // TODO: This should be a configurable option
const MAP_SIZES = {
    Erangel_Main: 816000,
    Baltic_Main: 816000,
    Desert_Main: 816000,
    Savage_Main: 408000,
    DihorOtok_Main: 612000,
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

let isDrag = false;

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

    endDrag = e => {
        isDrag = false
    }

    actualDrag = e => {
        e.preventDefault()

        if(!isDrag)
            return false

        this.setState(prevState => {
            let offsetX =  prevState.offsetX + e.movementX
            let offsetY = prevState.offsetY + e.movementY

            if (CLAMP_MAP) {
                offsetX = clamp(offsetX, -(this.state.mapScale - 1) * this.props.mapSize, 0)
                offsetY = clamp(offsetY, -(this.state.mapScale - 1) * this.props.mapSize, 0)
            }

            return {
                offsetX,
                offsetY,
            }
        })
    }

    startDrag = e => {
        isDrag = true
    }

    handleMousewheel =  e => {
        e.preventDefault();
        const scaleDelta = e.deltaY > 0 ? 1 / SCALE_STEP : SCALE_STEP;
        this.handleZoom(scaleDelta, e.layerX, e.layerY);
    }

    handleZoom = (scaleDelta, layerX, layerY) => {
        if (!layerX) layerX = this.props.mapSize / 2 // eslint-disable-line
        if (!layerY) layerY = this.props.mapSize / 2 // eslint-disable-line
        this.setState(prevState => {
            const newScale = clamp(prevState.mapScale * scaleDelta, MIN_SCALE, MAX_SCALE)

            const mousePointX = layerX / prevState.mapScale - prevState.offsetX / prevState.mapScale
            const mousePointY = layerY / prevState.mapScale - prevState.offsetY / prevState.mapScale

            let offsetX = -(mousePointX - layerX / newScale) * newScale
            let offsetY = -(mousePointY - layerY / newScale) * newScale

            if (CLAMP_MAP) {
                offsetX = clamp(offsetX, -(newScale - 1) * this.props.mapSize, 0)
                offsetY = clamp(offsetY, -(newScale - 1) * this.props.mapSize, 0)
            }

            return {
                mapScale: newScale,
                offsetX,
                offsetY,
            }
        })
    }

    componentDidMount() {
        document.getElementById("StageWrapper").addEventListener("wheel", this.handleMousewheel, {passive:false})
        document.getElementById("StageWrapper").addEventListener("mouseup", this.endDrag)
        document.getElementById("StageWrapper").addEventListener("mousedown", this.startDrag)
        document.getElementById("StageWrapper").addEventListener("mousemove", this.actualDrag, {passive:false})
    }

    componentWillUnmount() {

    }

    render() {
        const { match: { mapName }, telemetry, mapSize, marks, msSinceEpoch, options } = this.props
        const { mapScale, offsetX, offsetY } = this.state
        const scale = { x: mapScale, y: mapScale }

        const pubgMapSize = MAP_SIZES[mapName]

        // The order players are added to the canvas determines their relative z-index. We want to render
        // focused players on top, then tracked, etc, so we need to sort the players. We want dead players
        // below everything else, so we have to do this sort on every render. We use ~ and @ as they wrap
        // the ASCII range and we want a stable sort, so we use the player's name as the default value.
        const sortedPlayers = telemetry && sortBy(telemetry.players, player => {
            const { name } = player

            if (marks.isPlayerFocused(name)) return '~z'
            if (marks.isPlayerTracked(name)) return `~y${name}`
            if (telemetry.players[marks.focusedPlayer()].teammates.includes(name)) return `~x${name}`
            if (player.status === 'dead') return `@y${name}`
            if (player.health === 0) return `@z${name}`
            return name
        })

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
                            {telemetry.safezone && <Safezone
                                mapSize={mapSize}
                                pubgMapSize={pubgMapSize}
                                mapScale={mapScale}
                                circle={telemetry.safezone}
                            />}
                            {telemetry.bluezone && <Bluezone
                                mapSize={mapSize}
                                pubgMapSize={pubgMapSize}
                                mapScale={mapScale}
                                circle={telemetry.bluezone}
                            />}
                            {telemetry.redzone && <Redzone
                                mapSize={mapSize}
                                pubgMapSize={pubgMapSize}
                                mapScale={mapScale}
                                circle={telemetry.redzone}
                            />}
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
                        </Container>
                        {telemetry && <AliveCount players={telemetry.players} />}
                    </StyledStage>
            </StageWrapper>
        )
    }
}

export default Map
