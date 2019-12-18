package com.threeCodeMonkeyz.ReplayUIModule.Controllers;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.threeCodeMonkeyz.ReplayUIModule.Service.APIService;
import org.apache.commons.jcs.utils.zip.CompressionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.NoHandlerFoundException;


@RestController
@RequestMapping(value = "/")
public class APIController {
    @Autowired
    private APIService apiService;

    @CrossOrigin
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public ResponseEntity<String> getApiTest() {
        JsonObject object = new JsonObject();
        object.addProperty("result", "ok");
        object.addProperty("status", 200);

        return new ResponseEntity<>(object.toString(), HttpStatus.OK);
    }

    @CrossOrigin
    @RequestMapping(value ="/lol/{region}/{matchId}",method = RequestMethod.GET)
    public ResponseEntity<String> getLolData(@PathVariable("region") String region,@PathVariable("matchId") String matchId) throws Exception{
        return apiService.getLolData(region,matchId);
    }

    @CrossOrigin
    @RequestMapping(value ="/pubg/{platform}/{matchId}",method = RequestMethod.GET)
    public ResponseEntity<String> getPubgData(@PathVariable("platform") String platform,@PathVariable("matchId") String matchId) throws Exception{
        return apiService.getPubgData(platform,matchId);
    }

}
