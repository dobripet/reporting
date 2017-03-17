package cz.zcu.fav.kiv.dobripet.model;

import java.util.List;

/**
 * Created by Petr on 3/15/2017.
 */
public class Entity {
    private String name;
    private List<Property> properties;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Property> getProperties() {
        return properties;
    }

    public void setProperties(List<Property> properties) {
        this.properties = properties;
    }
}
