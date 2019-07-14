package com.threeCodeMonkeyz.ReplayUIModule.Service;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import com.threeCodeMonkeyz.ReplayUIModule.Model.PubgDataset;
import com.threeCodeMonkeyz.ReplayUIModule.Model.PubgMatch;
import com.threeCodeMonkeyz.ReplayUIModule.Model.PubgPlayer;
import com.threeCodeMonkeyz.ReplayUIModule.Model.PubgStats;
import org.apache.commons.jcs.utils.zip.CompressionUtil;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

@Service
public class APIServiceImpl implements APIService {

    private String VERSION = "1";
    private String GAME = "battleGround";

    @Override
    public ResponseEntity<String> getLolData(String matchId) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        /* 헤더정보세팅 */
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Origin", "https://developer.riotgames.com");
        httpHeaders.add("Accept-Charset", "application/x-www-form-urlencoded; charset=UTF-8");
        httpHeaders.add("X-Riot-Token", "RGAPI-cdc0ad51-60cb-453a-866d-df1072bae73a");
        httpHeaders.add("Accept-Language", "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7");
        httpHeaders.add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36");

        String url = "https://kr.api.riotgames.com/lol/match/v4/timelines/by-match/" + matchId;

        return restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(httpHeaders), String.class);

    }

    @Override
    public ResponseEntity<String> getPubgData(String platform, String matchId) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Accept", "application/vnd.api+json");

        String url = "https://api.pubg.com/shards/" + platform + "/matches/" + matchId;
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(httpHeaders), String.class);
        String data = responseEntity.getBody();
        JsonParser Parser = new JsonParser();
        JsonArray dataArray = (JsonArray) Parser.parse(data).getAsJsonObject().get("data").getAsJsonObject().get("relationships").getAsJsonObject().get("assets").getAsJsonObject().get("data");
        JsonObject dataObject = (JsonObject) dataArray.get(0);
        String id = dataObject.get("id").toString();
        System.out.println(id);
        JsonArray includedArray = (JsonArray) Parser.parse(data).getAsJsonObject().get("included");
        for (int i = 0; i < includedArray.size(); i++) {
            JsonObject includedObject = (JsonObject) includedArray.get(i);
            if (includedObject.get("id") != null && includedObject.get("id").toString().equals(id)) { //string null 체크?
                JsonObject attrObject = (JsonObject) includedObject.get("attributes");
                url = attrObject.get("URL").getAsString();
                break;
            }
        }
        System.out.println(url);

        // int size = url.length();
        // url = url.substring(1,size-1); //앞 뒤에 %22(")가 붙음 왜 그런진 모르겠음 (url을 toString으로 가져오면 생김,getAsString으로 해결)
        // httpHeaders.add("Accept-Encoding","gzip"); gzip 안붙여도 왜 되지..?
        byte[] telemetryGzip = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(httpHeaders), byte[].class).getBody();
        String telemetry = new String(CompressionUtil.decompressGzipByteArray(telemetryGzip));
        JsonArray jsonArrayTelemetry = Parser.parse(telemetry).getAsJsonArray();

       GsonBuilder builder = new GsonBuilder();
       Gson gson = builder.create();
        List<PubgPlayer> players = new ArrayList<>();
        List<String> pId = new ArrayList<>();
        for (int i = 0; i < includedArray.size(); i++) {
            JsonObject includedObject = (JsonObject) includedArray.get(i);
            
            if (!includedObject.get("type").getAsString().equals("participant"))
                continue;
            
            PubgPlayer pubgPlayer = new PubgPlayer();
            PubgStats pubgStats = new PubgStats();
            JsonObject attributesStats = includedObject.get("attributes").getAsJsonObject().get("stats").getAsJsonObject();
            pubgPlayer.setId(attributesStats.get("playerId").getAsString());
            pubgPlayer.setName(attributesStats.get("name").getAsString());
            pubgStats.setKills(attributesStats.get("kills").getAsInt());
            pubgStats.setWinPlace(attributesStats.get("winPlace").getAsInt());
            pubgPlayer.setStats(pubgStats);
            players.add(pubgPlayer);
            pId.add(includedObject.get("id").getAsString());
        }
        for (int i = 0; i < includedArray.size(); i++) {
            JsonObject includedObject = (JsonObject) includedArray.get(i);
            
            if (!includedObject.get("type").getAsString().equals("roster")) 
                continue;
            
            JsonArray participantsIdAry = includedObject.get("relationships").getAsJsonObject().get("participants").getAsJsonObject().get("data").getAsJsonArray();
         //   int size = includedObject.get("relationships").getAsJsonObject().get("participants").getAsJsonObject().get("data").getAsJsonArray().size();
            for (int j = 0; j < participantsIdAry.size(); j++) {
                Integer pIdIndex = pId.indexOf(participantsIdAry.get(j).getAsJsonObject().get("id").getAsString());
                players.get(pIdIndex).setRosterId(includedObject.get("id").getAsString());
                
//                 for (int k = 0; k < pId.size(); k++) {
//                     if (!participantsIdAry.get(j).getAsJsonObject().get("id").getAsString().equals(pId.get(k))) 
//                         continue;

//                      players.get(k).setRosterId(includedObject.get("id").getAsString());
//                 }
            }
        }

        PubgMatch match = new PubgMatch();
        match.setId(tempDataObject.get("id").getAsString());
        tempDataObject = tempDataObject.get("attributes").getAsJsonObject();
        match.setDurationSeconds(tempDataObject.get("duration").getAsInt());
        match.setGameMode(tempDataObject.get("gameMode").getAsString());
        match.setMapName(tempDataObject.get("mapName").getAsString());
        match.setPlayedAt(tempDataObject.get("createdAt").getAsString());
        match.setShardId(tempDataObject.get("shardId").getAsString());
        match.setTelemetryUrl(url);
        match.setPlayers(players);

        PubgDataset dataset = new PubgDataset();
        dataset.setVersion(VERSION);
        dataset.setGame(GAME);
        dataset.setMatch(match);
        List<JsonObject> listdata = new ArrayList<>();

        if (jsonArrayTelemetry != null) {
            for (int i = 0; i < jsonArrayTelemetry.size(); i++) {
                listdata.add((JsonObject) jsonArrayTelemetry.get(i));
            }
        }
        dataset.setRawReplayData(listdata);
        return new ResponseEntity<>(gson.toJson(dataset), HttpStatus.OK);
    }
}

