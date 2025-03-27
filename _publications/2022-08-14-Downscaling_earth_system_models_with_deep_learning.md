---
title: "Downscaling earth system models with deep learning"
collection: publications
category: conferences
permalink: /publication/2022-08-14-Downscaling_earth_system_models_with_deep_learning
excerpt: 'We introduce GINE, a new statistical downscaling method that uses computer vision to enhance climate model resolution while preserving key spatial features. This approach improves the accuracy and visual quality of downscaled data, making high-resolution climate projections more accessible for policymakers.'
date: 2022-08-14
venue: 'Proceedings of the 28th ACM SIGKDD conference on knowledge discovery and data mining'
paperurl: 'https://dl.acm.org/doi/abs/10.1145/3534678.3539031'
citation: 'Park, Sungwon, Karandeep Singh, Arjun Nellikkattil, Elke Zeller, Tung Duong Mai, and Meeyoung Cha. "Downscaling earth system models with deep learning." In Proceedings of the 28th ACM SIGKDD conference on knowledge discovery and data mining, pp. 3733-3742. 2022.'
---

Modern climate models offer simulation results that provide unprecedented details at the local level. However, even with powerful supercomputing facilities, their computational complexity and associated costs pose a limit on simulation resolution that is needed for agile planning of resource allocation, parameter calibration, and model reproduction. As regional information is vital for policymakers, data from coarse-grained resolution simulations undergo the process of "statistical downscaling" to generate higher-resolution projection at a local level. We present a new method for downscaling climate simulations called GINE (Geospatial INformation Encoded statistical downscaling). To preserve the characteristics of climate simulation data during this process, our model applies the latest computer vision techniques over topography-driven spatial and local-level information. The comprehensive evaluations on 2x, 4x, and 8x resolution factors show that our model substantially improves performance in terms of RMSE and the visual quality of downscaled data.