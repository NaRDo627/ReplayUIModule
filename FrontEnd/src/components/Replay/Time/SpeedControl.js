import React from 'react'
import styled from 'styled-components'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const StyledSlider = styled(Slider)`
    padding-top: 5px;
    margin-top: 12px;
    grid-column: 2;
    min-width: 80px;
`

const ControlsWrapper = styled.div`
    display: grid;

    @media (max-width: 700px) {
        grid-column: 3;
    }
`

const SliderContainer = styled.div`
    position: relative;
    grid-column: 2;
    margin-right: 10px;
`

const Tooltip = styled.div.attrs({
    style: ({ value, min, max }) => ({
        left: `${(value - min) / (max - min) * 100}%`,
    }),
})`
    position: absolute;
    top: -8px;
    font-size: 12px;
    margin-left: -35px;
    width: 70px;
    text-align: center;
`

class SpeedControl extends React.PureComponent {
    render() {
        const {
            minSpeed,
            maxSpeed,
            autoplaySpeed,
            changeSpeed,
        } = this.props

        return (
            <ControlsWrapper>
                <SliderContainer>
                    <StyledSlider
                        min={minSpeed}
                        max={maxSpeed}
                        value={autoplaySpeed}
                        onChange={changeSpeed}
                        tipFormatter={v => `${v}x`}
                        tipProps={{
                            visible: true,
                            placement: 'top',
                            align: { offset: [0, 8] },
                            overlayStyle: { zIndex: 1 },
                        }}
                    />
                    <Tooltip value={autoplaySpeed} min={minSpeed - 1} max={maxSpeed}>{autoplaySpeed}x</Tooltip>
                </SliderContainer>
            </ControlsWrapper>
        )
    }
}

SpeedControl.defaultProps = {
    minSpeed: 1,
    maxSpeed: 40,
}

export default SpeedControl
