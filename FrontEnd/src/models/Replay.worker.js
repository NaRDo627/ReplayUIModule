// [190713][HKPARK] 파라미터로 받은 리플레이 종류를 API 서버로 요청해서 응답을 메세지 형태로 리턴함

import parseTelemetry from './Telemetry.parser.js'

async function handleMessage({ data: { game, platform, matchId, focusedPlayer } }) {
    try {
        if(game === "pubg") {
            const reqUrl = `${process.env.REACT_APP_API}/api/pubg/${platform}/${matchId}`;
            const res = await fetch(reqUrl);
            const pubgData = await res.json();

            console.log("fetch successful");
            console.log(pubgData.match);
            // const state = true
            // const globalState = true
            // postMessage({ success: true, state, globalState, rawReplayData: pubgData })
            const { state, globalState } = parseTelemetry(pubgData.match, pubgData.rawReplayData, focusedPlayer)
            postMessage({ success: true, state, globalState, rawReplayData: pubgData.rawReplayData, match: pubgData.match })
        } else if (game === "lol") {
            const reqUrl = `${process.env.REACT_APP_API}/api/lol/${platform}/${matchId}`;
            const res = await fetch(reqUrl);
            const pubgData = await res.json();

            console.log("fetch successful");
            console.log(pubgData.match);
        } else
            throw "Unknown or unsupported game for ReplayUI";
    } catch (error) {
        postMessage({ success: false, error: error.message })
    }
}

self.addEventListener('message', handleMessage)
