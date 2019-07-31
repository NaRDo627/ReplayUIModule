
import React, { Component } from 'react';
import styled from 'styled-components'

import ReplayLol from "../../components/Replay/Lol";
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
        timelineError: "",
        globalState: null,
        match: null
    }


    componentDidMount() {
        console.log(typeof this.state.timeline);
        this.loadTelemetry();
    }

    loadTelemetry = async () => {
        this.cancelTelemetry();

        const { match: { params } } = this.props;
        this.setState({ timeline: null, timelineLoaded: false, timelineError: "" });

        if(typeof params.matchId === "undefined") {
            console.log(`Loading timeline for local match for test.`);
            const match = jsonData.match
            const rawReplayData = jsonData.rawReplayData
            const { state, globalState, focusedPlayerName } = parseTimeline(match, rawReplayData, "Huttels")

            const timeline = Timeline(state)
            this.setState({
                timeline,
                match,
                timelineLoaded: true,
                globalState,
                playerName: focusedPlayerName
            })

            console.log("success")
            return;
        }

        console.log(`Loading timeline for match ${params.matchId}`);


        this.timelineWorker = new ReplayWorker();

        this.timelineWorker.addEventListener('message', ({ data }) => {
            const { success, error, state, globalState, match, focusedPlayerName } = data

            if (!success) {
                console.error(`Error loading timeline: ${error}`)

                this.setState(prevState => ({
                    timelineError: error,
                }))

                return
            }

            const timeline = Timeline(state)
            this.setState({
                timeline,
                match,
                timelineLoaded: true,
                globalState,
                playerName: focusedPlayerName
            })

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
        const { match, timeline, timelineLoaded, timelineError, globalState, playerName } = this.state

        let content

        if (timelineError === "404 NOT_FOUND") {
            content = <Message>Match not found</Message>
        }
        else if (timelineError === "403 FORBIDDEN") {
            content = <Message>Current API key is not valid</Message>
        }
        else if (timelineError.length !== 0) {
            content = <Message>An error occurred :(</Message>
        } else if (!timelineLoaded) {
            content = <Message>Loading timeline...</Message>
        } else {
            content = <ReplayLol
                match={match}
                timeline={timeline}
                globalState={globalState}
                playerName={playerName}
            />
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
