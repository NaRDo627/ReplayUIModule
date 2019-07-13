import React, { Component } from 'react'
import { get } from 'lodash'
import styled from 'styled-components'
import Map from 'components/Pubg/Map/index.js'
import jsonData from 'assets/originalPubg.json'


const MatchContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 250px;
    border: 0px solid black;
    overflow: hidden;
`

const MapContainer = styled.div`
    grid-column: 1;
    position: relative;
    padding-bottom: 100%;
`

let telemetryUrl = jsonData.match.telemetryUrl;

class Match extends Component{
    state = {
        telemetry: null,
        secondsSinceEpoch: 600,
        autoPlay: true
    }


    componentDidMount() {
        console.log(typeof telemetry)
        this.loadTelemetry()
        if(this.state.autoPlay) {
            this.startAutoplay()
        }
    }

    loadTelemetry = async () => {
        console.log('Fetching telemetry')
        const res = await fetch(telemetryUrl)
        const telemetry = await res.json()
        console.log('setting telemetry', telemetry)
        this.setState({ telemetry })
    }

    startAutoplay = () => {
        this.autoplayInterval = setInterval(() => {
            this.setState(prevState => ({ secondsSinceEpoch: prevState.secondsSinceEpoch + 1 }))
        }, 10)
    }

    render() {
        const {telemetry, secondsSinceEpoch } = this.state;
        console.log(jsonData)
        return(
            <div>
                <div>TelemetryUrl : {this.props.match.params.telemetryUrl}</div>
                <MatchContainer>
                    <MapContainer>
                        <Map
                            jsonData={jsonData}
                            telemetry= {telemetry}
                            secondsSinceEpoch = {secondsSinceEpoch}
                        />
                    </MapContainer>
                </MatchContainer>
            </div>
            



        )
    }
}

export default Match;