import { forEach, groupBy, minBy, sortBy } from 'lodash'

export default function Timeline(state) {
    const stateAt = msSinceEpoch => {
        const interval = Math.floor(msSinceEpoch / 100)
        const s = state[interval]

        return s
    }

    return {
        state,
        stateAt,
    }
}
