import moment from 'moment'
import { get, remove, minBy, cloneDeep } from 'lodash'

const blankIntervalState = () => ({
    players: {},
    playerLocations: {},
    killLogs: []
})

export default function parseTimeline(matchData, timeline, focusedPlayerName) {
    const epoch = new Date(Number(matchData.playedAt));
    const state = Array(matchData.durationSeconds + 5)
    const globalState = { kills: [], assists: [], deaths: [] }
    const latestPlayerStates = {}
    let curState = blankIntervalState()

    const setNewPlayerLocation = (participantId, location) => {
        curState.playerLocations[participantId + ""] = location
    }

    const setNewPlayerState = (participantId, newVals) => {
        if (!curState.players[participantId + ""]) {
            // TODO: Needs cloneDeep once state holds nested values
            curState.players[participantId + ""] = { ...latestPlayerStates[participantId + ""] }
        }

        // TODO: Needs deep property setting support once state holds nested values
        Object.assign(curState.players[participantId + ""], newVals)
        latestPlayerStates[participantId + ""] = curState.players[participantId + ""]
    }

    const incrementPlayerStateVal = (participantId, path, delta) => {
        setNewPlayerState(participantId, { [path]: latestPlayerStates[participantId][path] + delta })
    }

    let focusedPlayerId = 1;
    { // --- Step Zero: Initialize state
        // [190727][HKPARK] 1~5 까지 1팀, 6~10까지 2팀으로 한다.

        matchData.players.forEach(p => {
            curState.players[p.participantId + ""] = {
                name: p.player.summonerName,
                teamNumber: (p.participantId < 6)? 1 : 2,
                level: 1,
                xp: 0,
                kills: 0,
                assists: 0,
                deaths: 0,
                currentGold: 500,
                dominionScore: 0,
                teamScore: 0,
                items: [],
                skillLvlSlot1: 0,
                skillLvlSlot2: 0,
                skillLvlSlot3: 0,
                skillLvlSlot4: 0,

            }

            latestPlayerStates[p.participantId + ""] = curState.players[p.participantId + ""]

            if(p.player.summonerName === focusedPlayerName)
                focusedPlayerId = p.participantId
        })
        console.log(focusedPlayerId)
        state[0] = curState
    }

    { // --- Step One: Iterate through all telemetry data and store known points
        console.time('Timeline-eventParsing')

    //    let matchStarted = false
        let curStateInterval = 0
        let lastTimestamp = 0
        timeline.forEach((d, i) => {
            // [190728][HKPARK] 현재 발생한 이벤트를 처리 후, 현재 타임라인 정보를 업데이트 한다.
            d.events.forEach((e, i) => {
                const msSinceEpoch = e.timestamp
                const currentInterval = Math.floor(msSinceEpoch / 1000)

                if (msSinceEpoch > (curStateInterval + 1) * 1000) {
                    // [190721][HKPARK] KillFeed 객체 복사 - 4초가 안 지난 것들만
                    // [190726][HKPARK] KillFeed 모두 복사하는걸로 변경
                    state[curStateInterval] = curState
                    const curKillLogs = curState.killLogs.slice()  // deep copy
                    curState = JSON.parse(JSON.stringify(curState));
                    curStateInterval = currentInterval
                    curState.killLogs = curKillLogs
                }

                // Possible events : CHAMPION_KILL(pos),
                // WARD_PLACED, WARD_KILL, BUILDING_KILL(pos),
                // ELITE_MONSTER_KILL, ITEM_PURCHASED, ITEM_SOLD,
                // ITEM_DESTROYED(used), ITEM_UNDO, SKILL_LEVEL_UP,
                // ASCENDED_EVENT, CAPTURE_POINT, PORO_KING_SUMMON

                // events with is I dont know : PORO_KING_SUMMON, CAPTURE_POINT, ASCENDED_EVENT
                //

                if (e.type === 'CHAMPION_KILL') {
                    if (e && e.killerId) {
                        incrementPlayerStateVal(e.killerId, 'kills', 1)
                    }
                    if (e && e.victimId) {
                        incrementPlayerStateVal(e.victimId, 'deaths', 1)
                    }

                    if (e && e.victimId === focusedPlayerId) {
                        globalState.deaths.push({
                            msSinceEpoch,
                            killerId: e.killerId,
                        })
                    }

                    if (e && e.killerId === focusedPlayerId) {
                        globalState.kills.push({
                            msSinceEpoch,
                            victimId: e.victimId,
                        })
                    }

                    // assist
                    if (e && e.assistingParticipantIds) {
                        e.assistingParticipantIds.map(p => {
                            incrementPlayerStateVal(p, 'assists', 1)

                            if (p === focusedPlayerId) {
                                globalState.assists.push({
                                    msSinceEpoch,
                                    // victimId: e.victimId,
                                })
                            }
                        })
                    }

                    // pos update
                    setNewPlayerLocation(e.killerId, { x: e.position.x, y: e.position.y })
                    setNewPlayerLocation(e.victimId, { x: e.position.x, y: e.position.y })

                    // [190721][HKPARK] KillFeed 관련 추가
                    curState.killLogs.push({
                        killType: "CHAMPION_KILL",
                        killerId: e.killerId,
                        victimId: e.victimId,
                        msSinceEpoch
                    })
                }


                if (e.type === 'BUILDING_KILL') {
                    // pos update
                    setNewPlayerLocation(e.killerId, { x: e.position.x, y: e.position.y })
                    setNewPlayerLocation(e.victimId, { x: e.position.x, y: e.position.y })

                    curState.killLogs.push({
                        killType: "BUILDING_KILL",
                        killerId: e.killerId,
                        victimId: e.buildingType,
                        msSinceEpoch
                    })
                }

                if (e.type === 'ELITE_MONSTER_KILL') {
                    // pos update
                    setNewPlayerLocation(e.killerId, { x: e.position.x, y: e.position.y })
                    setNewPlayerLocation(e.victimId, { x: e.position.x, y: e.position.y })

                    curState.killLogs.push({
                        killType: "ELITE_MONSTER_KILL",
                        killerId: e.killerId,
                        victimId: (e.monsterSubType)? e.monsterSubType: e.monsterType,
                        msSinceEpoch
                    })
                }


                if (e.type === 'ITEM_PURCHASED') {
                    const participantId = e.participantId + "";
                    const currentItems = curState.players[participantId].items

                    setNewPlayerState(e.participantId, { items: [...currentItems, e.itemId] })
                }


                if (e.type === 'ITEM_SOLD' || e.type === 'ITEM_DESTROYED' || e.type === 'ITEM_UNDO') {
                    const participantId = e.participantId + "";
                    const currentItems = curState.players[participantId].items

                    setNewPlayerState(e.participantId, {
                        items: currentItems.filter(item => item !== e.itemId),
                    })
                }


                if (e.type === 'SKILL_LEVEL_UP') {
                    const skillSlot = e.skillSlot
                    incrementPlayerStateVal(e.participantId, "skillLvlSlot" + skillSlot, 1)
                }
            })

            // Players Pos Update
            for(let i = 1; i <= 10; i++) {
                const level = d.participantFrames[String(i)].level
                const xp = d.participantFrames[String(i)].xp
                const currentGold = d.participantFrames[String(i)].currentGold;
                const minionsKilled = d.participantFrames[String(i)].minionsKilled;
                const jungleMinionsKilled = d.participantFrames[String(i)].jungleMinionsKilled;
                const dominionScore = d.participantFrames[String(i)].dominionScore;
                const teamScore = d.participantFrames[String(i)].teamScore;

                setNewPlayerState(String(i), { level, xp, currentGold,
                    minionsKilled, jungleMinionsKilled, dominionScore, teamScore })

                if(get(d.participantFrames[String(i)], 'position')) {
                    const curX = d.participantFrames[String(i)].position.x
                    const curY = d.participantFrames[String(i)].position.y
                    setNewPlayerLocation(String(i), { x: curX, y: curY })
                }
            }
        })

        state[curStateInterval] = curState
        state.matchEnd = curState

        console.timeEnd('Timeline-eventParsing')
    }

    { // --- Step Two: Ensure there are no gaps in the state array
        let lastState = null;
        for (let i = 0; i < state.length; i++) {

            if (!state[i]) {
                state[i] = lastState
            }
            else
                lastState = JSON.parse(JSON.stringify(state[i])); // deep copy
        }
    }


    console.log(epoch)

    return { state, globalState }
}
