// [190713][HKPARK] 파라미터로 받은 리플레이 종류를 API 서버로 요청해서 응답을 메세지 형태로 리턴함

import parseTelemetry from './Telemetry.parser.js'
import parseTimeline from "./Timeline.parser";

async function handleMessage({ data: { game, platform, matchId, focusedPlayer } }) {
    try {
        if(game === "pubg") {
            const reqUrl = `${process.env.REACT_APP_API}/api/pubg/${platform}/${matchId}`;
            const res = await fetch(reqUrl);
            const resData = await res.json();
            if(res.status !== 200)
                throw Error(resData.statusCode)

            console.log("fetch successful");
            console.log(resData.match);
            const { state, globalState, focusedPlayerName } = parseTelemetry(resData.match, resData.rawReplayData, focusedPlayer)
            postMessage({ success: true, state, globalState, match: resData.match, focusedPlayerName: focusedPlayerName })
        } else if (game === "lol") {
            const reqUrl = `${process.env.REACT_APP_API}/api/lol/${platform}/${matchId}`;
            const res = await fetch(reqUrl);
            const resData = await res.json();
            if(res.status !== 200)
                throw Error(resData.statusCode)

            console.log("fetch successful");
            console.log(resData.match);
            const { state, globalState, focusedPlayerName } = parseTimeline(resData.match, resData.rawReplayData, focusedPlayer)
            postMessage({ success: true, state, globalState, match: resData.match, focusedPlayerName: focusedPlayerName })
        } else
            throw "Unknown or unsupported game for ReplayUI";
    } catch (error) {
        postMessage({ success: false, error: error.message })
    }
}

self.addEventListener('message', handleMessage)
