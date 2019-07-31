# ReplayUIModule
Open source game replay UI Module for Naver D2 by "threeCodeMonkeyz"

온라인 E-SPORTS 게임(PUBG, LOL)의 리플레이를 감상하실 수 있는 리플레이 UI 모듈입니다.<br />
이 모듈을 사용하는 사용자는 단 한 줄의 요청 URL로 자신의 웹 브라우저에서 멋진 리플레이를 감상하실 수 있습니다!

# 사용법
## FrontEnd
**PUBG**<br />
`HTTP GET /pubg/{playerId}/{platformId}/{matchId}`

**LOL**<br />
`HTTP GET /lol/{playerId}/{platformId}/{matchId}`

 - `playerId` : 매치 플레이시 집중관찰 하고싶은 플레이어 ID<br />
 만약 매치 안에서 일치하는 아이디가 없을 시 무작위 플레이어를 포커싱합니다.
 - `platformId` : 리플레이를 보고자 하는 매치의 플랫폼 ID<br />
	   PUBG의 경우 steam, xbox, kakao가 가능하며,<br />
	   LOL의 경우 매치 지역(KR, NA1 등)이 가능합니다.
 - `matchId` : 매치별로 생성되는 고유번호입니다.
 
추가로, 파라미터를 넣지 않고 그냥 게임명만 넣는다면(/pubg, /lol), 내장되어 있는 테스트용 로컬 게임 데이터를 재생합니다.

## BackEnd
**PUBG**<br />
`HTTP GET /api/pubg/{platform}/{matchId}`

**LOL**<br />
`HTTP GET /api/lol/{region}/{matchId}`

응답 데이터셋(JSON)
```
{
    version String,
    game String,
    rawReplayData Object[],
    match Object[]
}
```

- `version` : API 백엔드 버전입니다.
- `game` : 게임 종류 입니다. (pubg, lol)
- `rawReplayData` : 실제 경기 데이터 부분입니다. 
- `match` : 요청한 매치에 대한 메타정보가 들어있습니다.

# 설치법
yarn, java, mvn이 설치되어 있다고 가정합니다.

## FrontEnd
1. `git clone` 혹은 zip 다운로드 후, `cd ReplayUIModule/FrontEnd`
2. `.env.local` 파일 생성 후, `REACT_APP_API` 부분에 API 주소 입력, <br />
혹은 `.env.production` 의 URL 주소 사용. (혹은 `NODE_ENV=production` 활성화)
3. `yarn upgrade` 후 `yarn start`
4. 브라우저에서 `http://localhost:3000` 확인

## BackEnd
1. `git clone` 혹은 zip 다운로드 후, `cd ReplayUIModule/BackEnd`
2. `mvn install` 실행
3. `cd BackEnd/target`
4. `java -jar ReplayUIModule-BackEnd-0.0.1-SNAPSHOT.jar` 실행
5. 브라우저에서 `http://localhost:8080/api/test` 확인

## Reference
pubg.sh : <https://pubg.sh/>
pubg.sh client github : <https://github.com/pubgsh/client>

# License
MIT
