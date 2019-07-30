
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
        rawTimeline: null,
        timeline: null,
        timelineLoaded: false,
        timelineError: false,
        globalState: null,
        match: null
    }


    componentDidMount() {
        console.log(typeof this.state.timeline);
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
        this.setState({ timeline: null, timelineLoaded: false, timelineError: false });

        if(typeof params.matchId === "undefined") {
            console.log(`Loading timeline for local match for test.`);
            const match = jsonData.match
            const rawReplayData = jsonData.rawReplayData
            const { state, globalState } = parseTimeline(match, rawReplayData, "Huttels")

            const timeline = Timeline(state)
            this.setState(prevState => ({
                rawTimeline: rawReplayData,
                timeline,
                match,
                timelineLoaded: true,
                globalState,
                playerName: "Huttels"
            }))

            console.log("success")
            return;
        }

        console.log(`Loading timeline for match ${params.matchId}`);



        this.timelineWorker = new ReplayWorker();

        this.timelineWorker.addEventListener('message', ({ data }) => {
            const { success, error, state, globalState, rawReplayData, match, focusedPlayerName } = data

            if (!success) {
                console.error(`Error loading timeline: ${error}`)

                this.setState(prevState => ({
                    timelineError: true,
                }))

                return
            }

            const timeline = Timeline(state)
            this.setState(prevState => ({
                rawTimeline: rawReplayData,
                timeline,
                match,
                timelineLoaded: true,
                globalState,
                playerName: focusedPlayerName
            }))

            console.log(success)
        })

        this.timelineWorker.postMessage({
            game: 'lol',
            platform: params.regionId,
            matchId: params.matchId,
            focusedPlayer: params.playerId,
        })
    }

    cancelTelemetry = () => {
        if (this.timelineWorker) {
            this.timelineWorker.terminate()
            this.timelineWorker = null
        }
    }

    render() {
        const { match: { params } } = this.props
        const { match, timeline, rawTimeline, timelineLoaded, timelineError, globalState, playerName } = this.state

        let content

        if (timelineError) {
            content = <Message>An error occurred :(</Message>
        } /*else if (!match) {
            content = <Message>Match not found</Message>
        }*/ else if (!timelineLoaded) {
            content = <Message>Loading timeline...</Message>
        } else {
            console.log(match)
            content = <ReplayLol
                match={match}
                rawTimeline={rawTimeline}
                timeline={timeline}
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
