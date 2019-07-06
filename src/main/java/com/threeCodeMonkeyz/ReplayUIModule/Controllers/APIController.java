package com.threeCodeMonkeyz.ReplayUIModule.Controllers;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.commons.jcs.utils.zip.CompressionUtil;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;


@RestController
@RequestMapping(value = "/api")
public class APIController {

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public ResponseEntity<String> getApiTest() {
        JsonObject object = new JsonObject();
        object.addProperty("result", "ok");
        object.addProperty("status", 200);

        return new ResponseEntity<>(object.toString(), HttpStatus.OK);
    }

    @RequestMapping(value ="/lol/{matchId}",method = RequestMethod.GET)
    public ResponseEntity<String> getLolData(@PathVariable("matchId") long matchId) throws Exception{

        RestTemplate restTemplate = new RestTemplate();

        /* 헤더정보세팅 */
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Origin", "https://developer.riotgames.com");
        httpHeaders.add( "Accept-Charset", "application/x-www-form-urlencoded; charset=UTF-8");
        httpHeaders.add("X-Riot-Token","RGAPI-94b62fe9-6e88-4ecd-a26a-3d790a21ca29");
        httpHeaders.add("Accept-Language","ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7");
        httpHeaders.add("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36");

        String url = "https://kr.api.riotgames.com/lol/match/v4/timelines/by-match/"+matchId;

        return restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(httpHeaders), String.class);
    }

    @RequestMapping(value ="/pubg/{platform}/{matchId}",method = RequestMethod.GET)
    public ResponseEntity<String> getPubgData(@PathVariable("platform") String platform,@PathVariable("matchId") String matchId) throws Exception{
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Accept", "application/vnd.api+json");

        String url = "https://api.pubg.com/shards/"+platform+"/matches/"+matchId;
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(httpHeaders), String.class);
        String data = responseEntity.getBody();

        JsonParser Parser = new JsonParser();
        JsonArray dataArray = (JsonArray)Parser.parse(data).getAsJsonObject().get("data").getAsJsonObject().get("relationships").getAsJsonObject().get("assets").getAsJsonObject().get("data");
        JsonObject dataObject = (JsonObject)dataArray.get(0);
        String id = dataObject.get("id").toString();
        System.out.println(id);
        JsonArray includedArray = (JsonArray)Parser.parse(data).getAsJsonObject().get("included");
        for(int i=0;i<includedArray.size();i++) {
            JsonObject includedObject = (JsonObject) includedArray.get(i);
            if(includedObject.get("id").toString().equals(id)) { //string null 체크?
                JsonObject attrObject = (JsonObject) includedObject.get("attributes");
                url = attrObject.get("URL").getAsString();
                break;
            }
        }
        System.out.println(url);

       // int size = url.length();
       // url = url.substring(1,size-1); //앞 뒤에 %22(")가 붙음 왜 그런진 모르겠음 (url을 toString으로 가져오면 생김,getAsString으로 해결)
        //httpHeaders.add("Accept-Encoding","gzip"); gzip 안붙여도 왜 되지..?
        byte[] telemetryGzip = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(httpHeaders), byte[].class).getBody();
        //String  decompressed = null;
        String telemetry= new String(CompressionUtil.decompressGzipByteArray(telemetryGzip));
        JsonArray jsonArrayTelemetry = (JsonArray)Parser.parse(telemetry);
        return new ResponseEntity<>(jsonArrayTelemetry.toString(), HttpStatus.OK);
            }
}
