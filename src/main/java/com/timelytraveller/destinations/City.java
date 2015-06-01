package com.timelytraveller.destinations;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class City {

	String cityName;
	
	public City(){}

	public City(String name)
	{
		this.cityName=name;
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
}
