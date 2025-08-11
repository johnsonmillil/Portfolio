# NoSQL MongoDB for Medical/Fitness Data

## Overview
Designed MongoDB for medical/fitness data to analyze device usage, health trends, linking patients/trackers for insights.

## Approach
- Collections: Medical (CSV import), FitnessTrackers (JSON import).
- Queries: Most-used trackers, top-rated trackers, trackers for conditions.
- Optimization: Indexes on fields (e.g., medical_conditions, Rating), pre/post timings showed improvement (e.g., 0.2s to 0.1s).
- Scalability: Sharding on patient_id/Tracker, replication.

## Technologies
MongoDB, Python (pymongo).

## Results
| Metric          | Value          |
|-----------------|----------------|
| Queries         | 3 (most-used, top-rated, condition-linked) |
| Optimization    | Indexing speedup (e.g., 2x faster) |

## Learnings
Flexibility for semi-structured data; security with RBAC/encryption.

## Artifacts
- Full Repo: [NoSQL MongoDB for Medical and Fitness Data](../NoSQL_MongoDB_for_Medical_and_Fitness_Data)
- Queries:

  Patients using Specific Trackers:
<img width="341" height="482" alt="image" src="https://github.com/user-attachments/assets/71560d37-3130-4128-8399-47bef86a831b" />
<img width="314" height="483" alt="image" src="https://github.com/user-attachments/assets/0a7acb0f-884e-4471-81ff-2a5e151f32a4" />

  Top-Rated Fitness Trackers:
<img width="724" height="697" alt="image" src="https://github.com/user-attachments/assets/3fab6273-5935-4b15-a50d-952c055e470f" />
<img width="318" height="578" alt="image" src="https://github.com/user-attachments/assets/f188fc70-eac1-41d9-a28d-ee62ac354be6" />

  Trackers Linked to Specific Conditions:
<img width="318" height="578" alt="image" src="https://github.com/user-attachments/assets/4f137831-4a5c-4086-ac85-bb5225274065" />
<img width="459" height="646" alt="image" src="https://github.com/user-attachments/assets/44bd1a76-2df3-4bc7-8095-05e8e12f9a60" />

  Optimization:
<img width="947" height="189" alt="image" src="https://github.com/user-attachments/assets/c679a079-248e-4c82-9269-5de4c9171a65" />






[Back to Home](/)
