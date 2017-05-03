package cz.zcu.fav.kiv.dobripet.reporting.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by Petr on 5/2/2017.
 */
public class JSONWrapper {
    private static Logger log = LoggerFactory.getLogger(JSONWrapper.class);
    private static ObjectMapper mapper = new ObjectMapper();

    public static String wrapObjectToString(String objectName, Object objectBody) throws JsonProcessingException{
        return "{\""+objectName+"\":"+mapper.writeValueAsString(objectBody)+"}";
    }
}
