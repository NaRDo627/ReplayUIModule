package com.threeCodeMonkeyz.ReplayUIModule.Model;

import com.google.gson.JsonArray;

import java.util.ArrayList;
import java.util.List;

public class PubgDataset {
    private String version;
    private String game;
    private PubgMatch match;
    private List rawReplayData;
    //private String playerName;

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getGame() {
        return game;
    }

    public void setGame(String game) {
        this.game = game;
    }

    public PubgMatch getMatch() {
        return match;
    }

    public void setMatch(PubgMatch match) {
        this.match = match;
    }

    public List getRawReplayData() {
        return rawReplayData;
    }

    public void setRawReplayData(List rawTelemetry) {
        this.rawReplayData = rawTelemetry;
    }

}
