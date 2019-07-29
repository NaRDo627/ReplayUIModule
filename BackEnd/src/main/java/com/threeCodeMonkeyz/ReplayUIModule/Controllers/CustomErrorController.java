package com.threeCodeMonkeyz.ReplayUIModule.Controllers;

import com.google.gson.JsonObject;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<String> handleError() {
        JsonObject errorObject = new JsonObject();
        errorObject.addProperty("statusCode", "404");
        errorObject.addProperty("message", "NOT FOUND");
        return new ResponseEntity<>(errorObject.toString(), HttpStatus.NOT_FOUND);
    }
    @Override
    public String getErrorPath() {
        return "/error";
    }
}