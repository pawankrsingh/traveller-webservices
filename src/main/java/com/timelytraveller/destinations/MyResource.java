package com.timelytraveller.destinations;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;

@Path("locations")
public class MyResource {
	
	@GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<City> getIt() {
    	try {
    		URL url = new URL("http://autocomplete.wunderground.com/aq?query=");
    		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    		conn.setRequestMethod("GET");
    		conn.setRequestProperty("Accept", "application/json");
     
    		if (conn.getResponseCode() != 200) {
    			throw new RuntimeException("Failed : HTTP error code : "+ conn.getResponseCode());
    		}
     
    		BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
     
    		String output,feed="";
    		while ((output = br.readLine()) != null) {
    			feed += output+"\n";
    		}
    		conn.disconnect();
    		 
    		String place=null;
    		//Retrieving list of cities from the Web Service
    		JSONObject json = new JSONObject(feed);
    		JSONArray locationArray = (JSONArray) json.get("RESULTS");
    		List<City> cities = new ArrayList<City>();
    		for(int i=0;i<locationArray.length();i++)
    		{
    			JSONObject location = (JSONObject) locationArray.get(i);
    			if(location.get("type").toString().equals("city"))
    			{	place = location.get("name").toString();
    				if(!place.contains("School"))
    					cities.add(new City(place));
    			}	
    		}
    			
    		
           return cities;
    	  } catch (MalformedURLException e) {
     
    		e.printStackTrace();
     
    	  } catch (JSONException e) {
    		  e.printStackTrace();
    	
    	  } catch (IOException e) {
    		e.printStackTrace();
    	}
    	
    	
    	return null;
       
    }

    @GET
    @Path("/{searchString}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<City> getIt(@PathParam("searchString") String input) {
    	try {
    		input = input==null? "" : input;
     		URL url = new URL("http://autocomplete.wunderground.com/aq?query="+input);
    		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    		conn.setRequestMethod("GET");
    		conn.setRequestProperty("Accept", "application/json");
     
    		if (conn.getResponseCode() != 200) {
    			throw new RuntimeException("Failed : HTTP error code : "+ conn.getResponseCode());
    		}
     
    		BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
     
    		String output,feed="";
    		while ((output = br.readLine()) != null) {
    			feed += output+"\n";
    		}
    		conn.disconnect();
    	
    		//Retrieving list of cities from the Web Service
    		JSONObject json = new JSONObject(feed);
    		JSONArray locationArray = (JSONArray) json.get("RESULTS");
    		List<City> cities = new ArrayList<City>();
    		for(int i=0;i<locationArray.length();i++)
    		{
    			JSONObject location = (JSONObject) locationArray.get(i);
    			if(location.get("type").toString().equals("city"))
    				cities.add(new City(location.get("name").toString()));
    		}
    		
           return cities;
    	  } catch (MalformedURLException e) {
     
    		e.printStackTrace();
     
    	  } catch (JSONException e) {
    		  e.printStackTrace();
    	  } catch (IOException e) {
    		e.printStackTrace();
    	  }
    	
    	
    	return null;
       
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}
