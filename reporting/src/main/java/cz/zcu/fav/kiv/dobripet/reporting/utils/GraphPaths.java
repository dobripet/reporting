package cz.zcu.fav.kiv.dobripet.reporting.utils;


import cz.zcu.fav.kiv.dobripet.reporting.model.Config;
import cz.zcu.fav.kiv.dobripet.reporting.model.Entity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public class GraphPaths {

/*
    private static Logger log = LoggerFactory.getLogger(GraphPaths.class);

    public static List<String> findShortestPath(Entity start, Entity end, Config config){
        Queue<String> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();
        List<String> path = new ArrayList<>();
        Map<String, String> previous = new HashMap<>();
        queue.add(start.getName());
        visited.add(start.getName());
        Entity temp = null;
        while(!queue.isEmpty()) {
            temp = config.getEntities().get(queue.remove());
            //found
            if (temp.getName().equals(end.getName())) {
                break;
            }
            Set<Entity> neighbors = getNeighbors(config, temp);
            for (Entity neighbor : neighbors) {
                if (!visited.contains(neighbor.getName())) {
                    visited.add(neighbor.getName());
                    queue.add(neighbor.getName());
                    previous.put(neighbor.getName(), temp.getName());
                }
            }
        }
        if (!temp.getName().equals(end.getName())){
            log.warn("PATH NOT FOUND");
            return null;
        }
        for(String name = end.getName(); name != null; name = previous.get(name)) {
            path.add(name);
        }
        Collections.reverse(path);
        return path;
    }

    public static List<List<String>> findAllPathsBetween(Entity start, Entity end, Config config){
        Stack<String> path = new Stack<>();
        Set<String> visited = new HashSet<>();
        List<List<String>> allPaths = new ArrayList<>();
        modifiedDFS(start, end, config, path, visited, allPaths);
        return allPaths;
    }
    private static void modifiedDFS(Entity tempStart, Entity end, Config config, Stack<String> path,Set<String> visited, List<List<String>> allPaths){
        // add node tempStart to current path from start
        path.push(tempStart.getName());
        visited.add(tempStart.getName());

        // found path from start to end
        if (tempStart.getName().equals(end.getName())) {
            log.info("PATH FOUND " + path.size() + " path " + path.toString());
            allPaths.add(new ArrayList<>(path));

        }
        // consider all neighbors that would continue path with repeating a node
        else {
            for (Entity neighbor : getNeighbors(config, tempStart)) {
                if (!path.contains(neighbor.getName()) && path.size() <5){
                    modifiedDFS(neighbor, end, config, path, visited, allPaths);
                }
            }
        }

        // done exploring from tempStart, so remove from path
        path.pop();
        visited.remove(tempStart.getName());
    }

    private static Set<Entity> getNeighbors(Config config, Entity entity){
        Set<Entity> neighbors = new HashSet<>();
        Set<String> references = entity.getReferenceMap().keySet();
        Set<String> referredBy = entity.getReferredByMap().keySet();
        Iterator<String> iterator = references.iterator();
        while (iterator.hasNext()) {
            String name = iterator.next();
            Entity e = config.getEntities().get(name);
            if(e != null){
                neighbors.add(e);
            }else{
                log.warn("REFERENCE NOT IN CONFIG: " + name + " REMOVING FROM CONFIG");
                iterator.remove();
            }
        }
        iterator = referredBy.iterator();
        while (iterator.hasNext()) {
            String name = iterator.next();
            Entity e = config.getEntities().get(name);
            if(e != null){
                neighbors.add(e);
            }else{
                log.warn("REFERRED BY NOT IN CONFIG: " + name + " REMOVING FROM CONFIG");
                iterator.remove();
            }
        }

        return neighbors;
    }
*/
}
