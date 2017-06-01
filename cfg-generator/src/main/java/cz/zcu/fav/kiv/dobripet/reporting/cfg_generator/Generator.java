package cz.zcu.fav.kiv.dobripet.reporting.cfg_generator;

import com.fasterxml.jackson.core.util.DefaultIndenter;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.model.Entity;
import cz.zcu.fav.kiv.dobripet.reporting.model.ForeignKey;
import cz.zcu.fav.kiv.dobripet.reporting.model.Property;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import us.codecraft.xsoup.Xsoup;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.*;


/**
 * Created by Petr on 3/24/2017.
 */
public class Generator {

    public static void main(String[] args) {
        System.out.println("Starting reporting configuration generator from HTML documentation.");
        File input = new File("db.html");
        try {

            //create config object and map for entities
            Config config = new Config();
            Map<String, Entity> entities = new HashMap<>();
            Document document = Jsoup.parse(input, "UTF-8");
            //Extracts href values from section 2(Database tables)
            List<String> tables = Xsoup.compile("//*[@class=\"toc\"]/dl/dd[2]/dl/dt/span/a/@href").evaluate(document).list();
            for (String table : tables) {
                File tableFile = new File("./" + table);
                try {
                    //open href locations (table pages)
                    Document tableDocument = Jsoup.parse(tableFile, "UTF-8");
                    //extract table name from id of title
                    String tableName = Xsoup.compile("//*/h2/@id").evaluate(tableDocument).get();
                    tableName = tableName.substring(tableName.lastIndexOf('.') + 1).trim();
                    //create entity and set params
                    Entity entity = new Entity();
                    entity.setName(tableName);
                    Map<String, Property> properties = new HashMap<>();
                    //extract rows from table that contains columns (informaltable)
                    Elements rows = Xsoup.compile("//*[@class=\"informaltable\"]/table/tbody/tr").evaluate(tableDocument).getElements();
                    for (Element row : rows) {
                        //create property and set params
                        Property property = new Property();
                        //extract column name
                        String  columnName = Xsoup.compile("/td[1]/text()").evaluate(row).get().trim();
                        property.setName(columnName);
                        //extract column description
                        property.setNotNull(Xsoup.compile("/td[3]/allText()").evaluate(row).get().trim().length() > 0);
                        //extract column type
                        String columnType = Xsoup.compile("/td[2]/text()").evaluate(row).get().trim();
                        //extract general dataTypes from columnType. Chosen types:  string, number, datetime, bool and binary
                        String dataType;
                        if (columnType.contains("char") || columnType.contains("text")) {
                            dataType = "string";
                        } else if (columnType.contains("numeric") || columnType.contains("float") || columnType.contains("int")) {
                            dataType = "number";
                        } else if (columnType.contains("date") || columnType.contains("time")) {
                            dataType = "datetime";
                        } else if (columnType.contains("bit")) {
                            dataType = "bool";
                        } else {
                            dataType = "binary";
                        }
                        property.setColumnType(columnType);
                        property.setDataType(dataType);
                        properties.put(columnName, property);
                    }
                    entity.setProperties(properties);
                    entity.setTableUrl(table);
                    entities.put(tableName, entity);
                } catch (IOException e) {
                    System.err.println("Cannot open file " + table + ". Program has to be run from documentation root directory!");
                    e.printStackTrace();
                }
            }
            //Extracts href values from section 1(Database schemas)
            List<String> schemas = Xsoup.compile("//*[@class=\"toc\"]/dl/dd[1]/dl/dt/span/a/@href").evaluate(document).list();
            for (String schema : schemas) {
                File schemaFile = new File("./" + schema);
                try {
                    //open href locations (schema pages)
                    Document schemaDocument = Jsoup.parse(schemaFile, "UTF-8");
                    //get rect elements that represent dividers for tables in svg code (all are in one hierarchy level)
                    Elements rects = Xsoup.compile("//svg/g/rect[@class=\"table\"]").evaluate(schemaDocument).getElements();
                    if(rects.size() == 0){
                        System.err.println("Schema: " + schema + " could not be parsed!");
                    }
                    //process individual tables of given schema
                    for (int i = 0; i < rects.size(); i++) {
                        //process elements between rect dividers
                        Element next = rects.get(i).nextElementSibling();
                        String tableName = "";
                        Map<String, List<ForeignKey>> references = new HashMap<>();
                        Map<String, List<ForeignKey>> referredBy = new HashMap<>();
                        while(next != null && !next.is("rect")){
                            //System.out.println("soused i je " +i +" "+ next);
                            //extract tableName
                            if(next.is("a")) {
                                String name = Xsoup.compile("/@xlink:href").evaluate(next).get();
                                if(name != null && name.length() > 0 && !name.contains(".")){
                                    tableName = name.substring(1);
                                }
                            }
                            //extract foreign keys from ref
                            Elements ref = Xsoup.compile("/use[@id=\"ref\"]").evaluate(next).getElements();
                            Element title = null;
                            if(ref != null && ref.size() > 0 && (title = ref.get(0).nextElementSibling())!= null){
                                parseTitleElement(title, tableName, references, referredBy);
                            }
                            //extract foreign keys from fk
                            Elements fk = Xsoup.compile("/use[@id=\"fk\"]").evaluate(next).getElements();
                            title = null;
                            if(fk != null && fk.size() > 0 && (title = fk.get(0).nextElementSibling())!= null){
                                parseTitleElement(title, tableName, references, referredBy);
                            }
                            next = next.nextElementSibling();
                        }
                        if(entities.get(tableName) != null) {
                            entities.get(tableName).setReferenceMap(references);
                            entities.get(tableName).setReferredByMap(referredBy);
                            entities.get(tableName).setSchemaUrl(schema);
                        } else{
                            System.err.println("Table: " + tableName + " not found in created entities");
                        }
                    }
                }catch (IOException e) {
                    System.err.println("Cannot open file " + schema + ". Program has to be run from documentation root directory!");
                    e.printStackTrace();
                }
            }
            //sorting to be more clear
            /*List<String> sortedKeys = new ArrayList<String>(entities.keySet());
            java.util.Collections.sort(sortedKeys);
            List<Entity> sortedEntities = new ArrayList<Entity>();
            for (String key : sortedKeys) {
                sortedEntities.add(entities.get(key));
            }*/
            config.setEntities(entities);
            ObjectMapper mapper = new ObjectMapper();
            //workaround for nice folding
            DefaultPrettyPrinter prettyPrinter = new DefaultPrettyPrinter();
            prettyPrinter.indentArraysWith(DefaultIndenter.SYSTEM_LINEFEED_INSTANCE);
            mapper.enable(SerializationFeature.INDENT_OUTPUT);
            //write to configFile
            File configFile = new File("reporting-config.json");
            OutputStreamWriter osw = new OutputStreamWriter(new FileOutputStream(configFile));
            osw.write(mapper.writer(prettyPrinter).writeValueAsString(config));
            osw.close();
            System.out.println("Configuration generated to file: " + configFile.getAbsolutePath());
        } catch (IOException e) {
            System.err.println("Cannot open file db.html. Program has to be run from documentation root directory!");
            e.printStackTrace();
        }
    }


    private static void parseTitleElement(Element title, String tableName,  Map<String, List<ForeignKey>> references, Map<String, List<ForeignKey>> referredBy){
        String column = title.text();
        String[] lines = column.split("\\r\\n|\\n|\\r");
        for (int j = 0; j < lines.length; j++) {
            //split in half
            String[] halves = lines[j].split("\\s*\\(\\s*");
            if(halves.length != 2){
                System.err.println("Table: " + tableName + " line could not be parsed: " + lines[j]);
                continue;
            }
            try {
                if (lines[j].startsWith("References")) {
                    if (!parseReferences(halves, references, tableName)) {
                        //err occurred
                        System.err.println("Chyba");
                    }
                } else if (lines[j].startsWith("Referred")) {
                    if (!parseReferredBy(halves, referredBy, tableName)) {
                        //err occurred
                        System.err.println("Chyba");
                    }
                }
            else {
                System.err.println("Table: " + tableName + " foreign key could not be parsed: " + lines[j]);
            }
            } catch (ArrayIndexOutOfBoundsException e) {
                System.err.println("Table: " + tableName + " line could not be parsed: " + lines[j]);
            }
        }
    }

    private static boolean parseReferences(String[] halves, Map<String, List<ForeignKey>> references, String tableName) throws ArrayIndexOutOfBoundsException{
        //get foreign table name from first half
        //usueal format: References tableName
        String foreignTableName = halves[0].split("\\s+")[1];
        //extract foreign keys from second half
        //usual formats: ( foreignKeyX -> localKeyX )    ( foreignKeyX -> localKeyX, localKeyY )
        String[] keyHalves = halves[1].substring(0,halves[1].indexOf(")")).split("\\s*->\\s*");
        List<String> localColumns = new ArrayList<>();
        List<String> foreignColumns = new ArrayList<>();
        switch(keyHalves.length){
            case 1 : {
                //no arrow ->, add all keys to local and foreign
                localColumns.addAll(Arrays.asList(keyHalves[0].split(",?\\s+")));
                foreignColumns.addAll(Arrays.asList(keyHalves[0].split(",?\\s+")));
            } break;
            case 2 : {
                //one arrow
                //extract local columns from first half
                localColumns.addAll(Arrays.asList(keyHalves[0].split(",?\\s+")));
                //extract foreign columns from second half
                foreignColumns.addAll(Arrays.asList(keyHalves[1].split(",?\\s+")));
            } break;
            default : {
                //error number of arrows
                System.err.println("Table: " + tableName + " foreign key could not be parsed: multiple arrows (->):" + halves[1]);
                return false;
            }
        }
        List<ForeignKey> foreignKeys =  new ArrayList<>();
        addKeys(foreignKeys, localColumns, foreignColumns);
        //TODO delete debug
        if(foreignColumns.size()!= 1 || localColumns.size() != 1 ){
            System.out.println(tableName);
        }
        //add it to current list of keys if exists
        addAllKeys(references, foreignTableName, foreignKeys);
        return true;
    }
    private static boolean parseReferredBy(String[] halves, Map<String, List<ForeignKey>> refferedBy, String tableName) throws ArrayIndexOutOfBoundsException{
        //get foreign table name from first half
        //usual format: Referred By tableName
        String foreignTableName = halves[0].split("\\s+")[2];
        //extract foreign keys from second half
        //usual formats: ( foreignKeyX -> localKeyX, foreignKeyY -> localKeyY ) ( foreignKeyX -> localKeyX, localKeyY )
        List<ForeignKey> foreignKeys = new ArrayList<>();
        String[] keyParts = halves[1].substring(0,halves[1].indexOf(")")).split("\\s*->\\s*");
        List<String> localColumns = new ArrayList<>();
        List<String> foreignColumns = new ArrayList<>();
        //no arrow ->, add all keys to local and foreign
        if(keyParts.length == 1){
            foreignColumns.addAll(Arrays.asList(keyParts[0].split(",?\\s+")));
            localColumns.addAll(Arrays.asList(keyParts[0].split(",?\\s+")));
            addKeys(foreignKeys, localColumns, foreignColumns);
        } else {
            //one or more arrows
            for (int i = 0; i < keyParts.length; i++) {
                if (i == 0) {
                    //first one, add all to first key
                    //System.out.println("Index " + i);
                    foreignColumns.addAll(Arrays.asList(keyParts[i].split(",?\\s+")));
                } else if (i == keyParts.length - 1) {
                    //last one, add all to last key
                    //System.out.println("Index " + i);
                    localColumns.clear();
                    localColumns.addAll((Arrays.asList(keyParts[i].split(",?\\s+"))));
                    //complete new keys from previous round
                    addKeys(foreignKeys, localColumns, foreignColumns);
                } else {
                    //process middle ones
                    List<String> keys = Arrays.asList(keyParts[i].split(",?\\s+"));
                    //cannot process unless they are 2 keys (first is local for for previous arrow and second is foreign for current arrow)
                    if (keys.size() != 2) {
                        System.err.println("Table: " + tableName + " 'referred by' could not be parsed: middle part: " + halves[1]);
                        return false;
                    }
                    //System.out.println("Index " + i);
                    localColumns.clear();
                    localColumns.add(keys.get(1));
                    //complete new keys from previous round
                    addKeys(foreignKeys, localColumns, foreignColumns);
                    //prepare foreignColumns for next round
                    foreignColumns.clear();
                    foreignColumns.add(keys.get(0));
                }
            }
        }
        //add it to current list of keys if exists
        addAllKeys(refferedBy, foreignTableName, foreignKeys);
        return true;
    }
    private static void addKeys(List<ForeignKey> keys,  List<String> locals, List<String> foreigns){
        for(String l : locals){
            for(String f : foreigns){
                ForeignKey key = new ForeignKey(l, f, 2f, false);
                if(!keys.contains(key)) {
                    keys.add(key);
                }
            }
        }
    }
    private static void addAllKeys(Map<String, List<ForeignKey>>  map, String foreignTableName, List<ForeignKey> foreignKeys){
        if(map.get(foreignTableName) != null ){
            for(ForeignKey key : foreignKeys){
                if(!map.get(foreignTableName).contains(key)){
                    map.get(foreignTableName).add(key);
                }
            }
        }else{
            //create new record in map
            map.put(foreignTableName, foreignKeys);
        }
    }
}

