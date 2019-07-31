import { forEach } from 'lodash'

export default function Timeline(state) {
    const stateAt = msSinceEpoch => {
        const interval = Math.floor(msSinceEpoch / 1000)
        const s = state[interval]

        // Overwrite player pointer records with interpolated values. This will generate the correct value
        // for this interval and replace the pointer record with it so that a re-request of this interval
        // will not require any computation.

        forEach(s.players, (player, playerId) => {
            if (!Object.hasOwnProperty.call(player, 'location')) {
                s.players[playerId] = {
                    ...s.players[playerId],
                    location: s.playerLocations[playerId],
                }
            }
        })

        return s
    }

    return {
        state,
        stateAt,
    }
}
