package cz.zcu.fav.kiv.dobripet.reporting.model;

import java.util.Objects;

/**
 * Foreign key metadata
 *
 * Created by Petr on 3/24/2017.
 */
public class ForeignKey {
    private String localColumnName;
    private String foreignColumnName;
    private float weight;
    private boolean selected;

    public ForeignKey() {
    }

    public ForeignKey(String localColumnName, String foreignColumnName, float weight, boolean selected) {
        this.localColumnName = localColumnName;
        this.foreignColumnName = foreignColumnName;
        this.weight = weight;
        this.selected = selected;
    }

    public String getLocalColumnName() {
        return localColumnName;
    }

    public void setLocalColumnName(String localColumnName) {
        this.localColumnName = localColumnName;
    }

    public String getForeignColumnName() {
        return foreignColumnName;
    }

    public void setForeignColumnName(String foreignColumnName) {
        this.foreignColumnName = foreignColumnName;
    }

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public float getWeight() {
        return weight;
    }

    public void setWeight(float weight) {
        this.weight = weight;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ForeignKey that = (ForeignKey) o;
        return Float.compare(that.weight, weight) == 0 &&
                selected == that.selected &&
                Objects.equals(localColumnName, that.localColumnName) &&
                Objects.equals(foreignColumnName, that.foreignColumnName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(localColumnName, foreignColumnName, weight, selected);
    }
}
