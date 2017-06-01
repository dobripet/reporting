package cz.zcu.fav.kiv.dobripet.reporting.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang3.tuple.Pair;

import java.util.List;
import java.util.Map;

public class Config {
    private Map<String, Entity> entities;

    @JsonIgnore
    private Map<Pair<String, String>, List<List<String>>> paths;

    public Map<String, Entity> getEntities() {
        return entities;
    }

    public void setEntities(Map<String, Entity> entities) {
        this.entities = entities;
    }

    public Map<Pair<String, String>, List<List<String>>> getPaths() {
        return paths;
    }

    public void setPaths(Map<Pair<String, String>, List<List<String>>> paths) {
        this.paths = paths;
    }

    /**
     * Add to url params of entities the root url of documentation
     * @param rootUrl root url where db.html is found
     */
    public void initializeDocumentationUrl(String rootUrl){
        for(Entity entity : entities.values()){
            if(entity.getSchemaUrl().length() > 0){
                entity.setSchemaUrl(rootUrl+entity.getSchemaUrl());
            }
            if(entity.getTableUrl().length() > 0){
                entity.setTableUrl(rootUrl+entity.getTableUrl());
            }
        }
    }
}
