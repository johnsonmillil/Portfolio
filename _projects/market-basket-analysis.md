# Market Basket Analysis for Product Associations

## Overview
Identified frequent product combinations in Allias Megastore’s 441 transactions to inform marketing using Apriori.

## Approach
- Preprocessed: One-hot encoded ProductName, grouped by OrderID.
- Applied mlxtend Apriori (min_support=0.01).
- Generated rules with support, confidence, lift metrics.

## Technologies
Python, mlxtend, Pandas.

## Results
| Rule | Antecedent → Consequent | Support | Confidence | Lift |
|------|------------------------|---------|------------|------|
| 1 | {Plasters Circus, Alarm Green} → {Alarm Red, Spotty Plates} | 0.011 | 1.0 | 88.2 |

Strong associations for themed bundles.

## Learnings
High-lift rules enable cross-selling; assumes independent transactions.

## Artifacts
- Full Repo: [Market_Basket_Analysis](../Market_Basket_Analysis)
- Code File: [Market_Basket_Analysis.py](../Market_Basket_Analysis/market_basket_analysis.py)

  <img width="1127" height="337" alt="image" src="https://github.com/user-attachments/assets/7ce77af6-5eea-40e5-a47c-7589793aca45" />

[Back to Home](/)
