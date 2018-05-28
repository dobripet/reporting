package cz.zcu.fav.kiv.dobripet.reporting.model.builder.dto;

/**
 * Created by Petr on 5/24/2017.
 */
public class Column {

    private String propertyName;
    private String entityName;
    private String title;
    private String name;
    private String aggregateFunction;
    private String dataType;
    private boolean displayed;

    public String getPropertyName() {
        return propertyName;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAggregateFunction() {
        return aggregateFunction;
    }

    public void setAggregateFunction(String aggregateFunction) {
        this.aggregateFunction = aggregateFunction;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public boolean isDisplayed() {
        return displayed;
    }

    public void setDisplayed(boolean displayed) {
        this.displayed = displayed;
    }

    @Override
    public String toString() {
        return "Column{" +
                "propertyName='" + propertyName + '\'' +
                ", entityName='" + entityName + '\'' +
                ", title='" + title + '\'' +
                ", name='" + name + '\'' +
                ", aggregateFunction='" + aggregateFunction + '\'' +
                ", dataType='" + dataType + '\'' +
                ", displayed=" + displayed +
                '}';
    }
}
