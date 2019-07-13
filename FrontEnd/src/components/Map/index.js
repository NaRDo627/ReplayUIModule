import React from 'react'
import { map } from 'lodash'
import Telemetry from 'models/Telemetry.js'
import ZoneCircle from './ZoneCircle.js'
import PlayerDot from './PlayerDot.js'
import MapBackground from './MapBackground.js'

const Map = ({ jsonData, telemetry, secondsSinceEpoch, focusPlayer }) => {
    if (!telemetry) return 'Loading telemetry'
    console.log(`찾고자 하는값 : ${secondsSinceEpoch}`);
    const t = Telemetry(jsonData, telemetry)
    const { players, safezone, bluezone } = t.stateAt(secondsSinceEpoch)
    console.log(`Map 에서 받은 mapname: ${jsonData.match.mapName}`);
    return (
        <MapBackground mapName={jsonData.match.mapName}>
            {map(players, (player, name) =>
                <PlayerDot key={name} name={name} {...player} focusPlayer={focusPlayer} />
            )}
            {safezone.position && <ZoneCircle key="safezone" {...safezone} color="white" />}
            {bluezone.position && <ZoneCircle key="bluezone" {...bluezone} color="blue" />}
        </MapBackground>
    )
}

export default Map