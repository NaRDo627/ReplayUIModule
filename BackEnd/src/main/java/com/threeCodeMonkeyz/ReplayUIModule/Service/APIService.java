package com.threeCodeMonkeyz.ReplayUIModule.Service;

import org.springframework.http.ResponseEntity;

public interface APIService {

    ResponseEntity<String> getLolData(String region,String matchId) throws Exception;
    ResponseEntity<String> getPubgData(String platform, String matchId) throws Exception;

}
