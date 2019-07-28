import React from 'react'
import styled from 'styled-components'

const PrevButton = styled.button`
    padding: 0;
    font-size: 2rem;
    border: 0;
    margin: 0 5px;
    width: 20px;
    grid-column: 1;
`

const ControlButton = styled.button`
    padding: 0;
    font-size: 2rem;
    border: 0;
    margin: 0 5px;
    width: 20px;
    grid-column: 2;
`

const NextButton = styled.button`
    padding: 0;
    font-size: 2rem;
    border: 0;
    margin: 0 5px;
    width: 20px;
    grid-column: 3;
`

const ControlsWrapper = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;

    @media (max-width: 700px) {
        grid-column: 3;
    }
`

const RewindButton = ({ rewindToStart }) => {
    return (
        <ControlButton className="button" type="submit" onClick={rewindToStart}>
            <i className="fi-previous" />
        </ControlButton>
    )
}


class PlayControls extends React.PureComponent {
    render() {
        const {
            autoplay,
            isFinished,
            toggleAutoplay,
            rewindToStart,
            skip30sForward,
            skip30sReverse
        } = this.props

        return (
            <ControlsWrapper>
                <div>
                    <PrevButton className="button" type="submit" onClick={skip30sReverse}>
                        <i className={`fi-rewind`} />
                    </PrevButton>
                    {!isFinished &&
                    <ControlButton className="button" type="submit" onClick={toggleAutoplay}>
                        <i className={`fi-${autoplay ? 'pause' : 'play'}`} />
                    </ControlButton>
                    }
                    {isFinished &&
                    <RewindButton rewindToStart={rewindToStart} />
                    }
                    <NextButton className="button" type="submit" onClick={skip30sForward}>
                        <i className={`fi-fast-forward`} />
                    </NextButton>
                </div>
            </ControlsWrapper>
        )
    }
}

export default PlayControls
