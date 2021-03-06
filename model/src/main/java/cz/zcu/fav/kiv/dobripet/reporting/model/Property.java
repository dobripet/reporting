package cz.zcu.fav.kiv.dobripet.reporting.model;

import java.util.Objects;
import java.util.Set;

/**
 * Property metadata
 *
 * Created by Petr on 3/15/2017.
 */
public class Property {
    private String name;
    private String columnType;
    private String dataType;
    private String statisticName;
    private boolean notNull;
    private Set<String> enumConstraints;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getColumnType() {
        return columnType;
    }

    public void setColumnType(String columnType) {
        this.columnType = columnType;
    }

    public String getStatisticName() {
        return statisticName;
    }

    public void setStatisticName(String statisticName) {
        this.statisticName = statisticName;
    }

    public boolean isNotNull() {
        return notNull;
    }

    public void setNotNull(boolean notNull) {
        this.notNull = notNull;
    }

    public Set<String> getEnumConstraints() {
        return enumConstraints;
    }

    public void setEnumConstraints(Set<String> enumConstraints) {
        this.enumConstraints = enumConstraints;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Property property = (Property) o;
        return notNull == property.notNull &&
                Objects.equals(name, property.name) &&
                Objects.equals(columnType, property.columnType) &&
                Objects.equals(dataType, property.dataType) &&
                Objects.equals(statisticName, property.statisticName) &&
                Objects.equals(enumConstraints, property.enumConstraints);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, columnType, dataType, statisticName, notNull, enumConstraints);
    }
}
