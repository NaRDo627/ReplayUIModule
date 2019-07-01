package com.threeCodeMonkeyz.ReplayUIModule.Controllers;

import com.google.gson.JsonObject;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

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
}
