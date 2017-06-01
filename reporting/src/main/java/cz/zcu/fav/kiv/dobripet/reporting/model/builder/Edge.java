package cz.zcu.fav.kiv.dobripet.reporting.model.builder;

/**
 * Helper class for Dijkstra
 */
public class Edge {
    private String name;
    private float weight;

    public Edge(String name, float weight) {
        this.name = name;
        this.weight = weight;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public float getWeight() {
        return weight;
    }

    public void setWeight(float weight) {
        this.weight = weight;
    }
}
