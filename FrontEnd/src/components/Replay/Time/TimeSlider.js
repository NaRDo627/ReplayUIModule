import React from 'react'
import styled from 'styled-components'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import ripIcon from '../../../assets/Pubg/ripIcon.png'

const getDurationFormat = ms => {
    const minutes = Math.floor(ms / 1000 / 60)
    const seconds = Math.floor((ms - (minutes * 60 * 1000)) / 1000)
    const decis = Math.floor((ms - (minutes * 60 * 1000) - (seconds * 1000)) / 100)
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${decis}`
}

const SliderContainer = styled.div`
    position: relative;

    @media (max-width: 700px) {
        grid-column: 2;
    }
`

const StyledSlider = styled(Slider)`
    padding-top: 5px;
    margin-top: 12px;
`

const TimePositionedElement = styled.div.attrs({
    style: ({ value, durationSeconds }) => ({
        left: `${value / (durationSeconds * 1000) * 100}%`,
    }),
})

const Tooltip = TimePositionedElement`
    position: absolute;
    top: -8px;
    font-size: 12px;
    margin-left: -35px;
    width: 70px;
    text-align: center;
`

const HoverableTimePositionedElement = TimePositionedElement`
    &:hover:before {
        display: block;
        position: absolute;
        font-size: 12px;
        bottom: -35px;
        background-color: white;
        white-space: nowrap;
        border: 1px solid #ddd;
        border-radius: 3px;
        transform: translateX(-50%);
        background: #F7F7F7;
        padding: 2px 6px;
    }
`

const Marker = HoverableTimePositionedElement.extend`
    position: absolute;
    top: 23px;
    margin-left: -6px;
    width: 12px;
    text-align: center;
    height: ${props => props.count > 1 ? 10 : 10}px;
    cursor:pointer;
        
    background: linear-gradient(to right,
        transparent 0%,
        transparent calc(50% - 0.41px),
        ${props => props.color} calc(50% - 0.8px),
        ${props => props.color} calc(50% + 0.8px),
        transparent calc(50% + 0.41px),
        transparent 100%
    );

    &:after {
        content: "${props => props.count > 1 ? `(${props.count})` : ''}";
        color: ${props => props.color};
        display: block;
        top: 9px;
        position: absolute;
        text-align: center;
        font-size: 11px;
    }
`

const KillMarker = Marker.extend`
    &:hover:before {
        content: "You Killed: ${props => props.victimNames}";
    }
`

const DeathMarker = Marker.extend`
    &:hover:before {
        content: "Killed By: ${props => props.killerName}";
    }
`

const DeathMarkerIcon = HoverableTimePositionedElement.extend`
    position: absolute;
    top: 26px;
    margin-left: -10px;
    width: 19px;
    height: 19px;
    background: url('${ripIcon}');
    background-size: 19px;
    background-repeat: no-repeat;
    cursor:pointer;

    &:after {
        content: "";
        display: block;
    }

    &:hover:before {
        content: "Killed By: ${props => props.killerName}";
    }
`

class TimeSlider extends React.PureComponent {
    render() {
        const { value, stopAutoplay, onChange, durationSeconds, globalState, skipTo } = this.props

        const groupedKills = globalState && globalState.kills.reduce((acc, kill, idx) => {
            if (idx === 0) return [[kill]]

            const [previousKill] = acc[acc.length - 1]
            const shouldGroupWithPrevious = kill.msSinceEpoch - previousKill.msSinceEpoch < 1000

            if (shouldGroupWithPrevious) {
                acc[acc.length - 1].push(kill)
            } else {
                acc.push([kill])
            }

            return acc
        }, null)

        const groupedDeaths = (globalState.deaths && globalState.deaths.reduce((acc, kill, idx) => {
            if (idx === 0) return [[kill]]

            const [previousKill] = acc[acc.length - 1]
            const shouldGroupWithPrevious = kill.msSinceEpoch - previousKill.msSinceEpoch < 1000

            if (shouldGroupWithPrevious) {
                acc[acc.length - 1].push(kill)
            } else {
                acc.push([kill])
            }

            return acc
        }, null))
        return (
            <SliderContainer>
                <StyledSlider
                    min={1000}
                    max={durationSeconds * 1000}
                    step={100}
                    onChange={onChange}
                    onBeforeChange={stopAutoplay}
                    value={value}
                />
                <Tooltip value={value} durationSeconds={durationSeconds}>{getDurationFormat(value)}</Tooltip>
                {groupedKills && groupedKills.map((kills, idx) =>
                    <KillMarker
                        key={`killmarker-${idx}`} // eslint-disable-line react/no-array-index-key
                        value={kills[0].msSinceEpoch}
                        count={kills.length}
                        durationSeconds={durationSeconds}
                        color={'#F12020'}
                        victimNames={kills.map(k => k.victimName).join(', ')}
                        onClick={skipTo.bind(this, kills[0].msSinceEpoch)}
                        onMouseDown={stopAutoplay.bind(this)}
                    />
                )}
                {globalState && globalState.death &&
                    <DeathMarkerIcon
                        value={globalState.death.msSinceEpoch}
                        durationSeconds={durationSeconds}
                        killerName={globalState.death.killedBy}
                        onClick={skipTo.bind(this, globalState.death.msSinceEpoch)}
                        onMouseDown={stopAutoplay.bind(this)}
                    />
                }
                {globalState && globalState.deaths && groupedDeaths && typeof(groupedDeaths) !== 'number' &&
                    groupedDeaths.map((deaths, idx) =>
                            <DeathMarker
                                key={`deathmarker-${idx}`} // eslint-disable-line react/no-array-index-key
                                value={deaths[0].msSinceEpoch}
                                count={deaths.length}
                                durationSeconds={durationSeconds}
                                color={'#5D69FF'}
                                killerName={deaths[0].killedBy}
                                onClick={skipTo.bind(this, deaths[0].msSinceEpoch)}
                                onMouseDown={stopAutoplay.bind(this)}
                            />
                    )
                }
            </SliderContainer>
        )
    }
}

export default TimeSlider
