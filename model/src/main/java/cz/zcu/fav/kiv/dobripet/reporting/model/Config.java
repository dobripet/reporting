package cz.zcu.fav.kiv.dobripet.reporting.model;

import java.util.Map;

/**
 * Configuration for Reporting
 *
 * Created by Petr on 3/24/2017.
 */
public class Config {
    private Map<String, Entity> entities;

    public Map<String, Entity> getEntities() {
        return entities;
    }

    public void setEntities(Map<String, Entity> entities) {
        this.entities = entities;
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
