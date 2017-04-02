package cz.zcu.fav.kiv.dobripet.reporting.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Petr on 3/15/2017.
 */
public class Entity {
    private String name = "";
    private List<Property> properties = new ArrayList<Property>();
    private Map<String, ForeignKey> foreignKeys = new HashMap<String,ForeignKey>();

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

    public Map<String, ForeignKey> getForeignKeys() {
        return  foreignKeys;
    }

    public void setForeignKeys(Map<String, ForeignKey>  foreignKeys) {
        this.foreignKeys =  foreignKeys;
    }
}
