
import React, { Component } from 'react';
import styled from 'styled-components'

import ReplayLol from "../../components/Replay/Lol";
import Telemetry from "../../models/Telemetry"
import ReplayWorker from "../../models/Replay.worker.js";
import jsonData from '../../assets/Lol/loldata.json'
import DocumentTitle from 'react-document-title'
import parseTimeline from "../../models/Timeline.parser";
import Timeline from "../../models/Timeline";

const Message = styled.p`
    text-align: center;
`


class Lol extends Component{
    state = {
        rawTelemetry: null,
        telemetry: null,
        telemetryLoaded: false,
        telemetryError: false,
        rosters: null,
        globalState: null,
        match: null
    }


    componentDidMount() {
        console.log(typeof this.state.telemetry);
        this.loadTelemetry();
    }

    loadTelemetry = async () => {
        // console.log('Fetching telemetry')
        // const res = await fetch(telemetryUrl)
        // const telemetry = await res.json()
        // console.log('setting telemetry', telemetry)
        // this.setState({ telemetry })

        this.cancelTelemetry();

        const { match: { params } } = this.props;
        this.setState({ telemetry: null, telemetryLoaded: false, telemetryError: false });

        if(typeof params.matchId === "undefined") {
            console.log(`Loading telemetry for local match for test.`);
            const match = jsonData.match
            const rawReplayData = jsonData.rawReplayData
            const { state, globalState } = parseTimeline(match, rawReplayData, "Huttels")

            const telemetry = Timeline(state)
            this.setState(prevState => ({
                rawTelemetry: rawReplayData,
                telemetry,
                match,
                telemetryLoaded: true,
                globalState,
                playerName: "Huttels"
            }))

            console.log("success")
            return;
        }

        console.log(`Loading telemetry for match ${params.matchId}`);



        this.telemetryWorker = new ReplayWorker();

        this.telemetryWorker.addEventListener('message', ({ data }) => {
            const { success, error, state, globalState, rawReplayData, match } = data

            if (!success) {
                console.error(`Error loading telemetry: ${error}`)

                this.setState(prevState => ({
                    telemetryError: true,
                }))

                return
            }

            const telemetry = Timeline(state)
            this.setState(prevState => ({
                rawTelemetry: rawReplayData,
                telemetry,
                match,
                telemetryLoaded: true,
                rosters: telemetry.finalRoster(params.playerId),
                globalState,
                playerName: params.playerId
            }))

            console.log(success)
        })

        this.telemetryWorker.postMessage({
            game: 'lol',
            platform: params.regionId,
            matchId: params.matchId,
            focusedPlayer: params.playerId,
        })
    }

    // startAutoplay = () => {
    //     this.autoplayInterval = setInterval(() => {
    //         this.setState(prevState => ({ secondsSinceEpoch: prevState.secondsSinceEpoch + 1 }))
    //     }, 10)
    // }

    cancelTelemetry = () => {
        if (this.telemetryWorker) {
            this.telemetryWorker.terminate()
            this.telemetryWorker = null
        }
    }

    render() {
        const { match: { params } } = this.props
        const { match, telemetry, rawTelemetry, telemetryLoaded, telemetryError, globalState, playerName } = this.state

        let content

        if (telemetryError) {
            content = <Message>An error occurred :(</Message>
        } /*else if (!match) {
            content = <Message>Match not found</Message>
        }*/ else if (!telemetryLoaded) {
            content = <Message>Loading telemetry...</Message>
        } else {
            console.log(match)
            content = <ReplayLol
                match={match}
                rawTelemetry={rawTelemetry}
                telemetry={telemetry}
                globalState={globalState}
                playerName={playerName}
            />
            // content = <Message>{rawTelemetry.map(object => <div>{object._T}</div>)}</Message>
        }

        return (
            <React.Fragment>
                <DocumentTitle title="Lol Replay UI" />
                {content}
            </React.Fragment>
        )
    }
}

export default Lol;
