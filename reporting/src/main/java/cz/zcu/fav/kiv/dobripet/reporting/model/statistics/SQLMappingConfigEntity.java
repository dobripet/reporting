package cz.zcu.fav.kiv.dobripet.reporting.model.statistics;

import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.ConstraintQueryRow;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.HistogramQueryRow;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.StatisticHeaderQueryRow;
import cz.zcu.fav.kiv.dobripet.reporting.model.statistics.rows.StatisticsQueryRow;

import javax.persistence.*;

/**
 * Workaround entity to use mappings
 */



@SqlResultSetMappings({
    @SqlResultSetMapping(
        name="HistogramQueryRow",
        classes = {
            @ConstructorResult(
                targetClass = HistogramQueryRow.class,
                columns = {
                    @ColumnResult(name="RANGE_HI_KEY",type = String.class),
                    @ColumnResult(name="RANGE_ROWS",type = Float.class),
                    @ColumnResult(name="EQ_ROWS",type = Float.class),
                    @ColumnResult(name="DISTINCT_RANGE_ROWS",type = Float.class),
                    @ColumnResult(name="AVG_RANGE_ROWS",type = Float.class)
                }
            )
        }
    ),
    @SqlResultSetMapping(
        name="ConstraintQueryRow",
        classes = {
            @ConstructorResult(
                targetClass = ConstraintQueryRow.class,
                columns = {
                    @ColumnResult(name="table_name",type = String.class),
                    @ColumnResult(name="column_name",type = String.class),
                    @ColumnResult(name="constraint_definition",type = String.class)
                }
            )
        }
    ),
    @SqlResultSetMapping(
        name="StatisticsQueryRow",
        classes = {
            @ConstructorResult(
                targetClass = StatisticsQueryRow.class,
                columns = {
                    @ColumnResult(name="column_name",type = String.class),
                    @ColumnResult(name="statistic_name",type = String.class)
                }
            )
        }
    ),

    @SqlResultSetMapping(
        name="StatisticHeaderQueryRow",
        classes = {
            @ConstructorResult(
                targetClass = StatisticHeaderQueryRow.class,
                columns = {
                    @ColumnResult(name="Name",type = String.class),
                    @ColumnResult(name="Updated",type = String.class),
                    @ColumnResult(name="Rows",type = Long.class),
                    @ColumnResult(name="Rows Sampled",type = Long.class),
                    @ColumnResult(name="Steps",type = Integer.class),
                    @ColumnResult(name="Density",type = Float.class),
                    @ColumnResult(name="Average key length",type = Float.class),
                    @ColumnResult(name="String Index",type = String.class),
                    @ColumnResult(name="Filter Expression",type = String.class),
                    @ColumnResult(name="Unfiltered Rows",type = Long.class)
                }
            )
        }
    )
})
@Table(name = "SQLMappingConfigEntity", schema="dciowner")
@Entity
public class SQLMappingConfigEntity {
    @Id
    int id;
}
