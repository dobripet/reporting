package cz.zcu.fav.kiv.dobripet.reporting.model;

import java.util.*;

/**
 * Created by Petr on 3/15/2017.
 */
public class Entity {
    private String name = "";
    private String schemaUrl = "";
    private String tableUrl = "";
    private Map<String, Property> properties = new HashMap<String, Property>();
    private Map<String, List<ForeignKey>> referenceMap = new HashMap<String, List<ForeignKey>>();
    private Map<String, List<ForeignKey>> referredByMap = new HashMap<String, List<ForeignKey>>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSchemaUrl() {
        return schemaUrl;
    }

    public void setSchemaUrl(String schemaUrl) {
        this.schemaUrl = schemaUrl;
    }

    public String getTableUrl() {
        return tableUrl;
    }

    public void setTableUrl(String tableUrl) {
        this.tableUrl = tableUrl;
    }

    public Map<String, Property> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Property> properties) {
        this.properties = properties;
    }

    public Map<String, List<ForeignKey>> getReferenceMap() {
        return referenceMap;
    }

    public void setReferenceMap(Map<String, List<ForeignKey>> referenceMap) {
        this.referenceMap = referenceMap;
    }

    public Map<String, List<ForeignKey>> getReferredByMap() {
        return referredByMap;
    }

    public void setReferredByMap(Map<String, List<ForeignKey>> referredByMap) {
        this.referredByMap = referredByMap;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Entity entity = (Entity) o;
        return Objects.equals(name, entity.name) &&
                Objects.equals(schemaUrl, entity.schemaUrl) &&
                Objects.equals(tableUrl, entity.tableUrl) &&
                Objects.equals(properties, entity.properties) &&
                Objects.equals(referenceMap, entity.referenceMap) &&
                Objects.equals(referredByMap, entity.referredByMap);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, schemaUrl, tableUrl, properties, referenceMap, referredByMap);
    }
}
