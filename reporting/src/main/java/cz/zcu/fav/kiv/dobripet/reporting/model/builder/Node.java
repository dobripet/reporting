package cz.zcu.fav.kiv.dobripet.reporting.model.builder;

import java.util.Comparator;

/**
 * Helper class for Dijkstra
 */
public class Node implements Comparable<Node> {
    private String name;
    private String parent;
    private float distance;

    public Node(String name, String parent, float distance) {
        this.name = name;
        this.parent = parent;
        this.distance = distance;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getParent() {
        return parent;
    }

    public void setParent(String parent) {
        this.parent = parent;
    }

    public float getDistance() {
        return distance;
    }

    public void setDistance(float distance) {
        this.distance = distance;
    }

    @Override
    public int compareTo(Node node) {
        if(this.getDistance() - node.getDistance() > 0f) return 1;
        if(this.getDistance() - node.getDistance() == 0f) return 0;
        return -1;
    }
}
