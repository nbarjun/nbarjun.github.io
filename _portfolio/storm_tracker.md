---
title: <i class="fa-solid fa-hurricane"></i> Storm Tracker
excerpt: "Storm Tracker is a real-time weather visualization tool that detects powerful storms across the globe"
collection: portfolio
---
Storm Tracker is a simplified version of a powerful algorithm I developed called [SCAFET](https://github.com/nbarjun/SCAFET) (short for Scalable Feature Extraction and Tracking). While SCAFET is designed to detect and track a wide range of weather patterns in complex climate data, Storm Tracker focuses specifically on identifying and following storms in real time.
# [Click here to see the current storms identified by StormTracker](../folium_map.html)

### What is SCAFET?
At its core, SCAFET analyzes the shape of weather patterns, not just their intensity—think of it like applying a geometric filter to reveal features such as cyclones, atmospheric rivers, jet streams, and more. Unlike traditional methods, SCAFET doesn’t rely on preset thresholds or model or dataset-specific assumptions. Instead, it uses something called a shape index to figure out where interesting weather features are happening, no matter which region or dataset you're looking at. For a full explanation of how it works, check out my [article in Geoscientific Model Development](https://gmd.copernicus.org/articles/17/301/2024/). 

### How does Storm Tracker work?
Storm Tracker applies the SCAFET approach to daily wind forecasts from ECMWF’s (European Centre for Medium-Range Weather Forecasts) Integrated Forecasting System (IFS). The data is accessed from [ECMWF Data Store](https://data.ecmwf.int/forecasts/) (ECPDS). 

Here’s how it works:
* It reads daily wind forecasts.
* It calculates vorticity, a measure of how much the air is spinning.
* Then, it identifies convex cap-shaped patterns that indicate storm systems.
* Finally, it filters out the weaker ones and highlights the strongest storms globally.

This analysis is updated every day, and the results are posted right here.

## Disclaimer
This is a personal research project by Dr. Arjun Babu Nellikkattil, inspired by his PhD work. It’s not an operational weather forecasting tool—just a hobby and a scientific exploration. Please refer to official weather services for accurate forecasts and warnings related to extreme weather events.