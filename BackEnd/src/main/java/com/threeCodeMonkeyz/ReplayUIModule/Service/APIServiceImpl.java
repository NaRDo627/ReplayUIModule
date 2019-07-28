package com.threeCodeMonkeyz.ReplayUIModule.Service;

import com.google.gson.*;
import com.threeCodeMonkeyz.ReplayUIModule.Model.*;
import org.apache.commons.jcs.utils.zip.CompressionUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class APIServiceImpl implements APIService {

    private String PUBGVERSION = "1";
    private String PUBGGAME = "battleGround";
    private String LOLVERSION = "1";
    private String LOLGAME = "lol";

    @Value("${lol.api.key}")
    private String apiKey;


    @Override
    public ResponseEntity<String> getLolData(String region,String matchId) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        /* 헤더정보세팅 */
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Origin", "https://developer.riotgames.com");
        httpHeaders.add("Accept-Charset", "application/x-www-form-urlencoded; charset=UTF-8");
        httpHeaders.add("X-Riot-Token", apiKey);
        httpHeaders.add("Accept-Language", "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7");
        httpHeaders.add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36");

        String url = "https://"+region+".api.riotgames.com/lol/match/v4/timelines/by-match/" + matchId;

        ResponseEntity<String> responseEntity;

        try{
            responseEntity =  restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(httpHeaders), String.class);
        }
        catch (HttpClientErrorException e) {
            return new ResponseEntity<>(e.getMessage(),e.getStatusCode());
        }
        catch(Exception e){ // region코드 틀리면 어떻게 처리?
            JsonObject object = new JsonObject();
            object.addProperty("statusCode", "404");
            object.addProperty("error", "Not Found");
            object.addProperty("message", "Not Found");
            return new ResponseEntity<>(object.toString(), HttpStatus.NOT_FOUND);
        }

        String rawTimeLineData = responseEntity.getBody();
        JsonParser Parser = new JsonParser();
        JsonArray replayDataAry = Parser.parse(rawTimeLineData).getAsJsonObject().get("frames").getAsJsonArray();

        url = "https://"+region+".api.riotgames.com/lol/match/v4/matches/" + matchId;

        try {
            responseEntity =  restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(httpHeaders), String.class);
        }
        catch (HttpClientErrorException e) {
            return new ResponseEntity<>(e.getMessage(),e.getStatusCode());
        }
        catch(Exception e){ // region코드 틀리면 어떻게 처리?
            JsonObject object = new JsonObject();
            object.addProperty("statusCode", "404");
            object.addProperty("error", "Not Found");
            object.addProperty("message", "Not Found");
            return new ResponseEntity<>(object.toString(), HttpStatus.NOT_FOUND);
        }

        String rawMatchData = responseEntity.getBody();
        JsonArray participantsIdentitiesAry = Parser.parse(rawMatchData).getAsJsonObject().get("participantIdentities").getAsJsonArray();
        JsonObject matchDataObject = Parser.parse(rawMatchData).getAsJsonObject();

        List<JsonObject> lolPlayerList = new ArrayList<>();
        for(int i=0;i<participantsIdentitiesAry.size();i++){
            lolPlayerList.add(participantsIdentitiesAry.get(i).getAsJsonObject());
        }
        LolMatch lolMatch = new LolMatch();
        lolMatch.setPlayers(lolPlayerList);
        lolMatch.setId(matchDataObject.get("gameId").getAsString());
        lolMatch.setShardId(matchDataObject.get("platformId").getAsString());
        lolMatch.setGameMode(matchDataObject.get("gameMode").getAsString());
        lolMatch.setPlayedAt(matchDataObject.get("gameCreation").getAsString());
        lolMatch.setMapName(matchDataObject.get("mapId").getAsString());
        lolMatch.setDurationSeconds(matchDataObject.get("gameDuration").getAsInt());

        List<JsonObject> replayDataList = new ArrayList<>();
        if (replayDataAry != null) {
            for (int i = 0; i < replayDataAry.size(); i++) {
                replayDataList.add(replayDataAry.get(i).getAsJsonObject());
            }
        }

        LolDataset lolDataset = new LolDataset();
        lolDataset.setGame(LOLGAME);
        lolDataset.setVersion(LOLVERSION);
        lolDataset.setMatch(lolMatch);
        lolDataset.setRawReplayData(replayDataList);
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();
        return new ResponseEntity<>(gson.toJson(lolDataset), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> getPubgData(String platform, String matchId) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Accept", "application/vnd.api+json");

        String url = "https://api.pubg.com/shards/" + platform + "/matches/" + matchId;
        //ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(httpHeaders), String.class);
        //return restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(httpHeaders), String.class);
        ResponseEntity<String> responseEntity;
        try {
            responseEntity = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(httpHeaders), String.class);

        } catch (HttpClientErrorException e) {
            return new ResponseEntity<>(e.getMessage(), e.getStatusCode());
        }


        String data = responseEntity.getBody();
        JsonParser Parser = new JsonParser();
        //JsonArray dataArray = Parser.parse(data).getAsJsonObject().get("data").getAsJsonObject().get("relationships").getAsJsonObject().get("assets").getAsJsonObject().get("data").getAsJsonArray();
        JsonObject pubgDataObject = Parser.parse(data).getAsJsonObject().get("data").getAsJsonObject();
        JsonArray assetDataArray = pubgDataObject.get("relationships").getAsJsonObject().get("assets").getAsJsonObject().get("data").getAsJsonArray();
        JsonObject dataObject = (JsonObject) assetDataArray.get(0);
        String id = dataObject.get("id").toString();
        System.out.println(id);
        JsonArray includedArray = Parser.parse(data).getAsJsonObject().get("included").getAsJsonArray();
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



        //여기에는 어떤 exception 넣어야되지?
        byte[] telemetryGzip = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(httpHeaders), byte[].class).getBody();
        String telemetry = new String(CompressionUtil.decompressGzipByteArray(telemetryGzip));
        JsonArray jsonArrayTelemetry = Parser.parse(telemetry).getAsJsonArray();


        List<PubgPlayer> players = new ArrayList<>();
        List<String> pId = new ArrayList<>();
        for (int i = 0; i < includedArray.size(); i++) {
            JsonObject includedObject = includedArray.get(i).getAsJsonObject();
            
            if (!includedObject.get("type").getAsString().equals("participant"))
                continue;
            
            PubgPlayer pubgPlayer = new PubgPlayer();
            PubgStat pubgStat = new PubgStat();
            JsonObject attributesStats = includedObject.get("attributes").getAsJsonObject().get("stats").getAsJsonObject();
            pubgPlayer.setId(attributesStats.get("playerId").getAsString());
            pubgPlayer.setName(attributesStats.get("name").getAsString());
            pubgStat.setKills(attributesStats.get("kills").getAsInt());
            pubgStat.setWinPlace(attributesStats.get("winPlace").getAsInt());
            pubgPlayer.setStats(pubgStat);
            players.add(pubgPlayer);
            pId.add(includedObject.get("id").getAsString());
        }
        for (int i = 0; i < includedArray.size(); i++) {
            JsonObject includedObject = includedArray.get(i).getAsJsonObject();;
            
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

        JsonObject tempDataObject = Parser.parse(data).getAsJsonObject().get("data").getAsJsonObject();
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
        dataset.setVersion(PUBGVERSION);
        dataset.setGame(PUBGGAME);
        dataset.setMatch(match);
        List<JsonObject> listData = new ArrayList<>();

        if (jsonArrayTelemetry != null) {
            for (int i = 0; i < jsonArrayTelemetry.size(); i++) {
                listData.add(jsonArrayTelemetry.get(i).getAsJsonObject());
            }
        }
        dataset.setRawReplayData(listData);
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();
        return new ResponseEntity<>(gson.toJson(dataset), HttpStatus.OK);


    }
}

