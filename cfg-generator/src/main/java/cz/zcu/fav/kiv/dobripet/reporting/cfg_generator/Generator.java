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
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import us.codecraft.xsoup.Xsoup;

import java.io.*;
import java.util.*;


import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;


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
            Map<String, Entity> entities = new HashMap<String, Entity>();
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
                    List<Property> properties = new ArrayList<Property>();
                    //extract rows from table that contains columns (informaltable)
                    Elements rows = Xsoup.compile("//*[@class=\"informaltable\"]/table/tbody/tr").evaluate(tableDocument).getElements();
                    for (Element row : rows) {
                        //create property and set params
                        Property property = new Property();
                        //extract column name
                        property.setName(Xsoup.compile("/td[1]/text()").evaluate(row).get().trim());
                        //extract column description
                        property.setDescription(Xsoup.compile("/td[3]/text()").evaluate(row).get().trim());
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
                        properties.add(property);
                    }
                    entity.setProperties(properties);
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
                        Map<String, ForeignKey> foreignKeys = new HashMap<String, ForeignKey>();
                        while(next != null && !next.is("rect")){
                            //System.out.println("soused i je " +i +" "+ next);
                            //extract tableName
                            if(next.is("a")) {
                                String name = Xsoup.compile("/@xlink:href").evaluate(next).get();
                                if(name != null && name.length() > 0 && !name.contains(".")){
                                    tableName = name.substring(1);
                                }
                            }
                            //extract foreign key columns
                            Elements use = Xsoup.compile("/use[@id=\"fk\"]").evaluate(next).getElements();
                            Element title = null;
                            if(use != null && use.size() > 0 && (title = use.get(0).nextElementSibling())!= null){
                                String column = title.text();
                                String[] lines = column.split("\\r\\n|\\n|\\r");
                                for (int j = 0; j < lines.length; j++) {
                                    if(lines[j].contains("References")){
                                        //split in half
                                        String[] halves = lines[j].split("\\s*\\(\\s*");
                                        if(halves.length != 2){
                                            System.err.println("bTable: " + tableName + " foreign key could not be parsed: " + lines[j]);
                                            continue;
                                        }
                                        ForeignKey foreignKey = new ForeignKey();
                                        //extract foreign keys from second half
                                        String[] keyHalves = halves[1].substring(0,halves[1].indexOf(")")).split("\\s*->\\s*");
                                        List<String> localColumns = new ArrayList<String>();
                                        List<String> foreignColumns = new ArrayList<String>();
                                        if(keyHalves.length != 2){
                                            //one item had not the arrow -> (Menu Menu_Key)
                                            if(keyHalves[0].trim().equals("Menu_Key")){
                                                //add him to FK
                                                localColumns.add("Menu_Key");
                                                foreignColumns.add("Menu_Key");
                                                foreignKey.setLocalColumnName(localColumns);
                                                foreignKey.setForeignColumnNames(foreignColumns);
                                                foreignKeys.put(halves[0].split("\\s+")[1], foreignKey);
                                                continue;
                                            } else {
                                                System.err.println("aTable: " + tableName + " foreign key could not be parsed: " + lines[j]);
                                                continue;
                                            }
                                        }
                                        //extract local columns from first half
                                        localColumns.addAll(Arrays.asList(keyHalves[0].split(",?\\s+")));
                                        //extract foreign columns from second half
                                        foreignColumns.addAll(Arrays.asList(keyHalves[1].split(",?\\s+")));
                                        foreignKey.setLocalColumnName(localColumns);
                                        foreignKey.setForeignColumnNames(foreignColumns);
                                        foreignKeys.put(halves[0].split("\\s+")[1], foreignKey);
                                    }else if (lines[j].contains("Referred")){
                                        //skip referred lines
                                        continue;
                                    }
                                    else {
                                        System.err.println("Table: " + tableName + " foreign key could not be parsed: " + lines[i]);
                                    }
                                }
                            }
                            next = next.nextElementSibling();
                        }
                        if(entities.get(tableName) != null) {
                            entities.get(tableName).setForeignKeys(foreignKeys);
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
            List<String> sortedKeys = new ArrayList<String>(entities.keySet());
            java.util.Collections.sort(sortedKeys);
            List<Entity> sortedEntities = new ArrayList<Entity>();
            for (String key : sortedKeys) {
                sortedEntities.add(entities.get(key));
            }
            config.setEntities(sortedEntities);
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
}
