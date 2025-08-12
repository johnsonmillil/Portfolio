# Patient Characteristics Clustering

## Overview
Applied K-means clustering to segment patients in medical_clean.csv based on Initial_days, TotalCharge, Additional_charges for cost-effective care at Horizon Health Network.

## Approach
- Preprocessed: Scaled features, Elbow method for k=3.
- Clustered: K-means (n_clusters=3), assigned labels.
- Evaluated: Visualized clusters, interpreted groups.

## Technologies
Python, Scikit-learn, Matplotlib.

## Results
| Cluster         | Description                        |
|-----------------|------------------------------------|
| 0               | Short stays, low charges           |
| 1               | Long stays, high daily charges     |
| 2               | Moderate stays, high additional charges |

## Learnings
Assumes spherical clusters; may miss hierarchies.

## Artifacts
- Full Repo: [Clustering_Techniques_Patient_Characteristics](../Clustering_Techniques_Patient_Characteristics)
- Code File: [analysis.py](../Clustering_Techniques_Patient_Characteristics/analysis.py)

   <img width="800" height="600" alt="elbow_plot" src="https://github.com/user-attachments/assets/b70481dd-4241-4d53-afce-3227fdb83e84" />

  <img width="800" height="600" alt="cluster_plot" src="https://github.com/user-attachments/assets/bea27847-52f2-4944-beaa-ada9b3a9528c" />


[Back to Home](/)
