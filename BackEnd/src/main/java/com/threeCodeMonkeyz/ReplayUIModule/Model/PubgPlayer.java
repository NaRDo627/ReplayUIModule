package com.threeCodeMonkeyz.ReplayUIModule.Model;

public class PubgPlayer {
    private String id;
    private String name;
    private String rosterId;
    private PubgStat stats;

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

    public PubgStat getStats() {
        return stats;
    }

    public void setStats(PubgStat stats) {
        this.stats = stats;
    }
}
