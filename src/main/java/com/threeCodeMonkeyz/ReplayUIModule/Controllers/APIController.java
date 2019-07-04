package com.threeCodeMonkeyz.ReplayUIModule.Controllers;

import com.google.gson.JsonObject;
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
        httpHeaders.add("X-Riot-Token","RGAPI-b453fc8b-683f-4854-918f-a3edcc65fe52");
        httpHeaders.add("Accept-Language","ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7");
        httpHeaders.add("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36");

        String url = "https://kr.api.riotgames.com/lol/match/v4/timelines/by-match/"+matchId;

        return restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(httpHeaders), String.class);
    }
}
