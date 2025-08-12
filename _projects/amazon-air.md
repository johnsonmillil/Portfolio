# Amazon Air Optimization: Minimizing Transportation Costs

## Overview
Developed a linear programming model to minimize cargo shipping costs from Amazon Air hubs (Cincinnati, Fort Worth) and focus cities (Leipzig, Hyderabad, San Bernardino) to 65 fulfillment centers, satisfying capacity and demand for 133,747 tons.

## Approach
- Used PuLP in Python with CBC solver.
- Objective: Minimize total cost (hub-to-focus + hub-to-center + focus-to-center).
- Constraints: Hub capacities (95,650/44,350 tons), focus city flow/capacity, demand equality.
- Iterated via GitLab to fix invalid routes and verify demand with dict.get().

## Technologies
Python, PuLP, CBC solver, GitLab CI/CD.

## Results
| Metric          | Value          |
|-----------------|----------------|
| Optimal Status  | Achieved       |
| Total Cost      | $199,476.25    |
| Demand Met      | 133,747 tons (100%) |

Key shipments: Cincinnati to Leipzig (43,470 tons). All 73 constraints satisfied.

## Learnings
Iterative debugging emphasized precise constraint alignment in linear programming.

## Artifacts
- Full Repo: [Amazon_Air_Optimization](../Amazon_Air_Optimization)
- Code: [amazon_air_optimization.py](../Amazon_Air_Optimization/amazon_air_optimization.py)


[Back to Home](/)
