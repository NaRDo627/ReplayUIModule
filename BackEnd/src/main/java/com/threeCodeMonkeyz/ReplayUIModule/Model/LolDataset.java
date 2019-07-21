package com.threeCodeMonkeyz.ReplayUIModule.Model;

import java.util.List;

public class LolDataset {
    private String version;
    private String game;
    private LolMatch match;
    private List rawReplayData;

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

    public LolMatch getMatch() {
        return match;
    }

    public void setMatch(LolMatch match) {
        this.match = match;
    }

    public List getRawReplayData() {
        return rawReplayData;
    }

    public void setRawReplayData(List rawReplayData) {
        this.rawReplayData = rawReplayData;
    }
}
