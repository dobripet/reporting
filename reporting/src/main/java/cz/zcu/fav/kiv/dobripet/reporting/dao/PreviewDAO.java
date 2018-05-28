package cz.zcu.fav.kiv.dobripet.reporting.dao;

import java.util.List;

/**
 * Created by Petr on 6/8/2017.
 */
public interface PreviewDAO {
    List getPreviewForStringQuery(String query);
}
