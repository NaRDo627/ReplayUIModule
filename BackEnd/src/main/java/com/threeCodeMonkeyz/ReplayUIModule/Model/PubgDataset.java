package com.threeCodeMonkeyz.ReplayUIModule.Model;

import com.google.gson.JsonArray;

public class PubgDataset {
    private String version;
    private String game;
    private PubgMatch match;
    private JsonArray rawTelemetry;
    private String playerName;

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

    public JsonArray getRawTelemetry() {
        return rawTelemetry;
    }

    public void setRawTelemetry(JsonArray rawTelemetry) {
        this.rawTelemetry = rawTelemetry;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }
}
