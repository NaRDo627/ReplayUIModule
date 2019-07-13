package com.threeCodeMonkeyz.ReplayUIModule.Model;

import com.google.gson.JsonObject;

public class PubgPlayer {
    private String id;
    private String name;
    private String rosterId;
    private PubgStats stats;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRosterId() {
        return rosterId;
    }

    public void setRosterId(String rosterId) {
        this.rosterId = rosterId;
    }

    public PubgStats getStats() {
        return stats;
    }

    public void setStats(PubgStats stats) {
        this.stats = stats;
    }
}
