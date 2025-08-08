import pulp
import pandas as pd
import numpy as np

# Define hubs, focus cities, and centers
hubs = ['Cincinnati', 'Fort_Worth']
focus_cities = ['Leipzig', 'Hyderabad', 'San_Bernardino']
centers = [
    'Paris', 'Cologne', 'Hanover', 'Bengaluru', 'Coimbatore', 'Delhi', 'Mumbai', 'Cagliari', 'Catania',
    'Milan', 'Rome', 'Katowice', 'Barcelona', 'Madrid', 'Castle_Donington', 'London', 'Mobile', 'Anchorage',
    'Fairbanks', 'Phoenix', 'Los_Angeles', 'Ontario', 'Riverside', 'Sacramento', 'San_Francisco', 'Stockton',
    'Denver', 'Hartford', 'Miami', 'Lakeland', 'Tampa', 'Atlanta', 'Honolulu', 'Kahului', 'Kona', 'Chicago',
    'Rockford', 'Fort_Wayne', 'South_Bend', 'Des_Moines', 'Wichita', 'New_Orleans', 'Baltimore', 'Minneapolis',
    'Kansas_City', 'St_Louis', 'Omaha', 'Manchester', 'Albuquerque', 'New_York', 'Charlotte', 'Toledo',
    'Wilmington', 'Portland', 'Allentown', 'Pittsburgh', 'San_Juan', 'Nashville', 'Austin', 'Dallas', 'Houston',
    'San_Antonio', 'Richmond', 'Seattle', 'Spokane'
]

# Capacities (tons/month) from Table 1
hub_capacities = {
    'Cincinnati': 95650,
    'Fort_Worth': 44350
}
focus_capacities = {
    'Leipzig': 85000,
    'Hyderabad': 19000,
    'San_Bernardino': 36000
}

# Demands (tons/month) from Table 1
center_demands = {
    'Paris': 6500, 'Cologne': 640, 'Hanover': 180, 'Bengaluru': 9100, 'Coimbatore': 570, 'Delhi': 19000,
    'Mumbai': 14800, 'Cagliari': 90, 'Catania': 185, 'Milan': 800, 'Rome': 1700, 'Katowice': 170,
    'Barcelona': 2800, 'Madrid': 3700, 'Castle_Donington': 30, 'London': 6700, 'Mobile': 190,
    'Anchorage': 175, 'Fairbanks': 38, 'Phoenix': 2400, 'Los_Angeles': 7200, 'Ontario': 100,
    'Riverside': 1200, 'Sacramento': 1100, 'San_Francisco': 1900, 'Stockton': 240, 'Denver': 1500,
    'Hartford': 540, 'Miami': 3400, 'Lakeland': 185, 'Tampa': 1600, 'Atlanta': 3000, 'Honolulu': 500,
    'Kahului': 16, 'Kona': 63, 'Chicago': 5100, 'Rockford': 172, 'Fort_Wayne': 200, 'South_Bend': 173,
    'Des_Moines': 300, 'Wichita': 290, 'New_Orleans': 550, 'Baltimore': 1300, 'Minneapolis': 1700,
    'Kansas_City': 975, 'St_Louis': 1200, 'Omaha': 480, 'Manchester': 100, 'Albuquerque': 450,
    'New_York': 11200, 'Charlotte': 900, 'Toledo': 290, 'Wilmington': 150, 'Portland': 1200,
    'Allentown': 420, 'Pittsburgh': 1000, 'San_Juan': 1100, 'Nashville': 650, 'Austin': 975,
    'Dallas': 3300, 'Houston': 3300, 'San_Antonio': 1100, 'Richmond': 600, 'Seattle': 2000, 'Spokane': 260
}

# Costs from Table 2 (N/A set to float('inf'))
costs_hub_to_focus = {
    ('Cincinnati', 'Leipzig'): 1.5, ('Cincinnati', 'Hyderabad'): float('inf'), ('Cincinnati', 'San_Bernardino'): 0.5,
    ('Fort_Worth', 'Leipzig'): float('inf'), ('Fort_Worth', 'Hyderabad'): float('inf'), ('Fort_Worth', 'San_Bernardino'): 0.5
}

costs_hub_to_center = {
    ('Cincinnati', 'Paris'): 1.6, ('Cincinnati', 'Cologne'): 1.5, ('Cincinnati', 'Hanover'): 1.5,
    ('Cincinnati', 'Bengaluru'): float('inf'), ('Cincinnati', 'Coimbatore'): float('inf'), ('Cincinnati', 'Delhi'): float('inf'),
    ('Cincinnati', 'Mumbai'): float('inf'), ('Cincinnati', 'Cagliari'): 1.5, ('Cincinnati', 'Catania'): 1.5,
    ('Cincinnati', 'Milan'): 1.5, ('Cincinnati', 'Rome'): 1.5, ('Cincinnati', 'Katowice'): 1.4,
    ('Cincinnati', 'Barcelona'): 1.5, ('Cincinnati', 'Madrid'): 1.6, ('Cincinnati', 'Castle_Donington'): 1.4,
    ('Cincinnati', 'London'): 1.6, ('Cincinnati', 'Mobile'): 0.5, ('Cincinnati', 'Anchorage'): 1.3,
    ('Cincinnati', 'Fairbanks'): 1.4, ('Cincinnati', 'Phoenix'): 0.5, ('Cincinnati', 'Los_Angeles'): 0.5,
    ('Cincinnati', 'Ontario'): 0.5, ('Cincinnati', 'Riverside'): 0.5, ('Cincinnati', 'Sacramento'): 0.5,
    ('Cincinnati', 'San_Francisco'): 0.5, ('Cincinnati', 'Stockton'): 0.5, ('Cincinnati', 'Denver'): 0.5,
    ('Cincinnati', 'Hartford'): 0.5, ('Cincinnati', 'Miami'): 0.5, ('Cincinnati', 'Lakeland'): 0.5,
    ('Cincinnati', 'Tampa'): 0.5, ('Cincinnati', 'Atlanta'): 0.5, ('Cincinnati', 'Honolulu'): float('inf'),
    ('Cincinnati', 'Kahului'): float('inf'), ('Cincinnati', 'Kona'): float('inf'), ('Cincinnati', 'Chicago'): 0.5,
    ('Cincinnati', 'Rockford'): 0.5, ('Cincinnati', 'Fort_Wayne'): 0.5, ('Cincinnati', 'South_Bend'): 0.5,
    ('Cincinnati', 'Des_Moines'): 0.5, ('Cincinnati', 'Wichita'): 0.5, ('Cincinnati', 'New_Orleans'): 0.5,
    ('Cincinnati', 'Baltimore'): 0.5, ('Cincinnati', 'Minneapolis'): 0.5, ('Cincinnati', 'Kansas_City'): 0.5,
    ('Cincinnati', 'St_Louis'): 0.5, ('Cincinnati', 'Omaha'): 0.5, ('Cincinnati', 'Manchester'): 0.5,
    ('Cincinnati', 'Albuquerque'): 0.5, ('Cincinnati', 'New_York'): 0.5, ('Cincinnati', 'Charlotte'): 0.5,
    ('Cincinnati', 'Toledo'): 0.5, ('Cincinnati', 'Wilmington'): 0.5, ('Cincinnati', 'Portland'): 0.5,
    ('Cincinnati', 'Allentown'): 0.5, ('Cincinnati', 'Pittsburgh'): 0.5, ('Cincinnati', 'San_Juan'): 0.5,
    ('Cincinnati', 'Nashville'): 0.5, ('Cincinnati', 'Austin'): 0.5, ('Cincinnati', 'Dallas'): 0.5,
    ('Cincinnati', 'Houston'): 0.5, ('Cincinnati', 'San_Antonio'): 0.5, ('Cincinnati', 'Richmond'): 0.5,
    ('Cincinnati', 'Seattle'): 0.5, ('Cincinnati', 'Spokane'): 0.5,
    ('Fort_Worth', 'Paris'): float('inf'), ('Fort_Worth', 'Cologne'): float('inf'), ('Fort_Worth', 'Hanover'): float('inf'),
    ('Fort_Worth', 'Bengaluru'): float('inf'), ('Fort_Worth', 'Coimbatore'): float('inf'), ('Fort_Worth', 'Delhi'): float('inf'),
    ('Fort_Worth', 'Mumbai'): float('inf'), ('Fort_Worth', 'Cagliari'): float('inf'), ('Fort_Worth', 'Catania'): float('inf'),
    ('Fort_Worth', 'Milan'): float('inf'), ('Fort_Worth', 'Rome'): float('inf'), ('Fort_Worth', 'Katowice'): float('inf'),
    ('Fort_Worth', 'Barcelona'): float('inf'), ('Fort_Worth', 'Madrid'): float('inf'), ('Fort_Worth', 'Castle_Donington'): float('inf'),
    ('Fort_Worth', 'London'): float('inf'), ('Fort_Worth', 'Mobile'): 0.5, ('Fort_Worth', 'Anchorage'): 1.0,
    ('Fort_Worth', 'Fairbanks'): 1.0, ('Fort_Worth', 'Phoenix'): 0.5, ('Fort_Worth', 'Los_Angeles'): 0.5,
    ('Fort_Worth', 'Ontario'): 0.5, ('Fort_Worth', 'Riverside'): 0.5, ('Fort_Worth', 'Sacramento'): 0.5,
    ('Fort_Worth', 'San_Francisco'): 0.5, ('Fort_Worth', 'Stockton'): 0.5, ('Fort_Worth', 'Denver'): 0.5,
    ('Fort_Worth', 'Hartford'): 0.5, ('Fort_Worth', 'Miami'): 0.5, ('Fort_Worth', 'Lakeland'): 0.5,
    ('Fort_Worth', 'Tampa'): 0.5, ('Fort_Worth', 'Atlanta'): 0.5, ('Fort_Worth', 'Honolulu'): 0.5,
    ('Fort_Worth', 'Kahului'): 0.5, ('Fort_Worth', 'Kona'): 0.5, ('Fort_Worth', 'Chicago'): 0.5,
    ('Fort_Worth', 'Rockford'): 0.5, ('Fort_Worth', 'Fort_Wayne'): 0.5, ('Fort_Worth', 'South_Bend'): 0.5,
    ('Fort_Worth', 'Des_Moines'): 0.5, ('Fort_Worth', 'Wichita'): 0.5, ('Fort_Worth', 'New_Orleans'): 0.5,
    ('Fort_Worth', 'Baltimore'): 0.5, ('Fort_Worth', 'Minneapolis'): 0.5, ('Fort_Worth', 'Kansas_City'): 0.5,
    ('Fort_Worth', 'St_Louis'): 0.5, ('Fort_Worth', 'Omaha'): 0.5, ('Fort_Worth', 'Manchester'): 0.5,
    ('Fort_Worth', 'Albuquerque'): 0.5, ('Fort_Worth', 'New_York'): 0.5, ('Fort_Worth', 'Charlotte'): 0.5,
    ('Fort_Worth', 'Toledo'): 0.5, ('Fort_Worth', 'Wilmington'): 0.5, ('Fort_Worth', 'Portland'): 0.5,
    ('Fort_Worth', 'Allentown'): 0.5, ('Fort_Worth', 'Pittsburgh'): 0.5, ('Fort_Worth', 'San_Juan'): 0.5,
    ('Fort_Worth', 'Nashville'): 0.5, ('Fort_Worth', 'Austin'): 0.25, ('Fort_Worth', 'Dallas'): float('inf'),
    ('Fort_Worth', 'Houston'): 0.25, ('Fort_Worth', 'San_Antonio'): 0.25, ('Fort_Worth', 'Richmond'): 0.5,
    ('Fort_Worth', 'Seattle'): 0.5, ('Fort_Worth', 'Spokane'): 0.5
}

costs_focus_to_center = {
    ('Leipzig', 'Paris'): 0.5, ('Leipzig', 'Cologne'): 0.5, ('Leipzig', 'Hanover'): 0.5,
    ('Leipzig', 'Bengaluru'): 1.5, ('Leipzig', 'Coimbatore'): 1.5, ('Leipzig', 'Delhi'): 1.5,
    ('Leipzig', 'Mumbai'): 1.5, ('Leipzig', 'Cagliari'): 0.5, ('Leipzig', 'Catania'): 0.5,
    ('Leipzig', 'Milan'): 0.5, ('Leipzig', 'Rome'): 0.5, ('Leipzig', 'Katowice'): 0.5,
    ('Leipzig', 'Barcelona'): 0.5, ('Leipzig', 'Madrid'): 0.5, ('Leipzig', 'Castle_Donington'): 0.5,
    ('Leipzig', 'London'): 0.75, ('Leipzig', 'Mobile'): float('inf'), ('Leipzig', 'Anchorage'): float('inf'),
    ('Leipzig', 'Fairbanks'): float('inf'), ('Leipzig', 'Phoenix'): float('inf'), ('Leipzig', 'Los_Angeles'): float('inf'),
    ('Leipzig', 'Ontario'): float('inf'), ('Leipzig', 'Riverside'): float('inf'), ('Leipzig', 'Sacramento'): float('inf'),
    ('Leipzig', 'San_Francisco'): float('inf'), ('Leipzig', 'Stockton'): float('inf'), ('Leipzig', 'Denver'): float('inf'),
    ('Leipzig', 'Hartford'): 1.5, ('Leipzig', 'Miami'): float('inf'), ('Leipzig', 'Lakeland'): float('inf'),
    ('Leipzig', 'Tampa'): float('inf'), ('Leipzig', 'Atlanta'): float('inf'), ('Leipzig', 'Honolulu'): float('inf'),
    ('Leipzig', 'Kahului'): float('inf'), ('Leipzig', 'Kona'): float('inf'), ('Leipzig', 'Chicago'): float('inf'),
    ('Leipzig', 'Rockford'): float('inf'), ('Leipzig', 'Fort_Wayne'): float('inf'), ('Leipzig', 'South_Bend'): float('inf'),
    ('Leipzig', 'Des_Moines'): float('inf'), ('Leipzig', 'Wichita'): float('inf'), ('Leipzig', 'New_Orleans'): float('inf'),
    ('Leipzig', 'Baltimore'): 1.5, ('Leipzig', 'Minneapolis'): float('inf'), ('Leipzig', 'Kansas_City'): float('inf'),
    ('Leipzig', 'St_Louis'): float('inf'), ('Leipzig', 'Omaha'): float('inf'), ('Leipzig', 'Manchester'): 1.5,
    ('Leipzig', 'Albuquerque'): float('inf'), ('Leipzig', 'New_York'): 1.6, ('Leipzig', 'Charlotte'): float('inf'),
    ('Leipzig', 'Toledo'): float('inf'), ('Leipzig', 'Wilmington'): float('inf'), ('Leipzig', 'Portland'): float('inf'),
    ('Leipzig', 'Allentown'): 1.5, ('Leipzig', 'Pittsburgh'): float('inf'), ('Leipzig', 'San_Juan'): float('inf'),
    ('Leipzig', 'Nashville'): float('inf'), ('Leipzig', 'Austin'): float('inf'), ('Leipzig', 'Dallas'): float('inf'),
    ('Leipzig', 'Houston'): float('inf'), ('Leipzig', 'San_Antonio'): float('inf'), ('Leipzig', 'Richmond'): float('inf'),
    ('Leipzig', 'Seattle'): float('inf'), ('Leipzig', 'Spokane'): float('inf'),
    ('Hyderabad', 'Paris'): 1.1, ('Hyderabad', 'Cologne'): 1.0, ('Hyderabad', 'Hanover'): 1.0,
    ('Hyderabad', 'Bengaluru'): 0.5, ('Hyderabad', 'Coimbatore'): 0.5, ('Hyderabad', 'Delhi'): 0.5,
    ('Hyderabad', 'Mumbai'): 0.5, ('Hyderabad', 'Cagliari'): 1.0, ('Hyderabad', 'Catania'): 1.0,
    ('Hyderabad', 'Milan'): 1.0, ('Hyderabad', 'Rome'): 1.1, ('Hyderabad', 'Katowice'): 1.0,
    ('Hyderabad', 'Barcelona'): 1.0, ('Hyderabad', 'Madrid'): 1.1, ('Hyderabad', 'Castle_Donington'): float('inf'),
    ('Hyderabad', 'London'): 1.1, ('Hyderabad', 'Mobile'): float('inf'), ('Hyderabad', 'Anchorage'): float('inf'),
    ('Hyderabad', 'Fairbanks'): float('inf'), ('Hyderabad', 'Phoenix'): float('inf'), ('Hyderabad', 'Los_Angeles'): float('inf'),
    ('Hyderabad', 'Ontario'): float('inf'), ('Hyderabad', 'Riverside'): float('inf'), ('Hyderabad', 'Sacramento'): float('inf'),
    ('Hyderabad', 'San_Francisco'): float('inf'), ('Hyderabad', 'Stockton'): float('inf'), ('Hyderabad', 'Denver'): float('inf'),
    ('Hyderabad', 'Hartford'): float('inf'), ('Hyderabad', 'Miami'): float('inf'), ('Hyderabad', 'Lakeland'): float('inf'),
    ('Hyderabad', 'Tampa'): float('inf'), ('Hyderabad', 'Atlanta'): float('inf'), ('Hyderabad', 'Honolulu'): float('inf'),
    ('Hyderabad', 'Kahului'): float('inf'), ('Hyderabad', 'Kona'): float('inf'), ('Hyderabad', 'Chicago'): float('inf'),
    ('Hyderabad', 'Rockford'): float('inf'), ('Hyderabad', 'Fort_Wayne'): float('inf'), ('Hyderabad', 'South_Bend'): float('inf'),
    ('Hyderabad', 'Des_Moines'): float('inf'), ('Hyderabad', 'Wichita'): float('inf'), ('Hyderabad', 'New_Orleans'): float('inf'),
    ('Hyderabad', 'Baltimore'): float('inf'), ('Hyderabad', 'Minneapolis'): float('inf'), ('Hyderabad', 'Kansas_City'): float('inf'),
    ('Hyderabad', 'St_Louis'): float('inf'), ('Hyderabad', 'Omaha'): float('inf'), ('Hyderabad', 'Manchester'): float('inf'),
    ('Hyderabad', 'Albuquerque'): float('inf'), ('Hyderabad', 'New_York'): float('inf'), ('Hyderabad', 'Charlotte'): float('inf'),
    ('Hyderabad', 'Toledo'): float('inf'), ('Hyderabad', 'Wilmington'): float('inf'), ('Hyderabad', 'Portland'): float('inf'),
    ('Hyderabad', 'Allentown'): float('inf'), ('Hyderabad', 'Pittsburgh'): float('inf'), ('Hyderabad', 'San_Juan'): float('inf'),
    ('Hyderabad', 'Nashville'): float('inf'), ('Hyderabad', 'Austin'): float('inf'), ('Hyderabad', 'Dallas'): float('inf'),
    ('Hyderabad', 'Houston'): float('inf'), ('Hyderabad', 'San_Antonio'): float('inf'), ('Hyderabad', 'Richmond'): float('inf'),
    ('Hyderabad', 'Seattle'): float('inf'), ('Hyderabad', 'Spokane'): float('inf'),
    ('San_Bernardino', 'Paris'): float('inf'), ('San_Bernardino', 'Cologne'): float('inf'), ('San_Bernardino', 'Hanover'): float('inf'),
    ('San_Bernardino', 'Bengaluru'): float('inf'), ('San_Bernardino', 'Coimbatore'): float('inf'), ('San_Bernardino', 'Delhi'): float('inf'),
    ('San_Bernardino', 'Mumbai'): float('inf'), ('San_Bernardino', 'Cagliari'): float('inf'), ('San_Bernardino', 'Catania'): float('inf'),
    ('San_Bernardino', 'Milan'): float('inf'), ('San_Bernardino', 'Rome'): float('inf'), ('San_Bernardino', 'Katowice'): float('inf'),
    ('San_Bernardino', 'Barcelona'): float('inf'), ('San_Bernardino', 'Madrid'): float('inf'), ('San_Bernardino', 'Castle_Donington'): float('inf'),
    ('San_Bernardino', 'London'): float('inf'), ('San_Bernardino', 'Mobile'): 0.5, ('San_Bernardino', 'Anchorage'): 0.7,
    ('San_Bernardino', 'Fairbanks'): 0.7, ('San_Bernardino', 'Phoenix'): 0.5, ('San_Bernardino', 'Los_Angeles'): float('inf'),
    ('San_Bernardino', 'Ontario'): float('inf'), ('San_Bernardino', 'Riverside'): float('inf'), ('San_Bernardino', 'Sacramento'): 0.5,
    ('San_Bernardino', 'San_Francisco'): 0.5, ('San_Bernardino', 'Stockton'): 0.5, ('San_Bernardino', 'Denver'): 0.5,
    ('San_Bernardino', 'Hartford'): 0.5, ('San_Bernardino', 'Miami'): 0.7, ('San_Bernardino', 'Lakeland'): 0.7,
    ('San_Bernardino', 'Tampa'): 0.7, ('San_Bernardino', 'Atlanta'): 0.6, ('San_Bernardino', 'Honolulu'): 0.5,
    ('San_Bernardino', 'Kahului'): 0.5, ('San_Bernardino', 'Kona'): 0.5, ('San_Bernardino', 'Chicago'): 0.5,
    ('San_Bernardino', 'Rockford'): 0.5, ('San_Bernardino', 'Fort_Wayne'): 0.5, ('San_Bernardino', 'South_Bend'): 0.5,
    ('San_Bernardino', 'Des_Moines'): 0.5, ('San_Bernardino', 'Wichita'): 0.5, ('San_Bernardino', 'New_Orleans'): 0.5,
    ('San_Bernardino', 'Baltimore'): 0.7, ('San_Bernardino', 'Minneapolis'): 0.5, ('San_Bernardino', 'Kansas_City'): 0.5,
    ('San_Bernardino', 'St_Louis'): 0.5, ('San_Bernardino', 'Omaha'): 0.5, ('San_Bernardino', 'Manchester'): 0.7,
    ('San_Bernardino', 'Albuquerque'): 0.5, ('San_Bernardino', 'New_York'): 0.7, ('San_Bernardino', 'Charlotte'): 0.7,
    ('San_Bernardino', 'Toledo'): 0.5, ('San_Bernardino', 'Wilmington'): 0.7, ('San_Bernardino', 'Portland'): 0.5,
    ('San_Bernardino', 'Allentown'): 0.7, ('San_Bernardino', 'Pittsburgh'): 0.6, ('San_Bernardino', 'San_Juan'): 1.0,
    ('San_Bernardino', 'Nashville'): 0.5, ('San_Bernardino', 'Austin'): 0.5, ('San_Bernardino', 'Dallas'): 0.5,
    ('San_Bernardino', 'Houston'): 0.5, ('San_Bernardino', 'San_Antonio'): 0.5, ('San_Bernardino', 'Richmond'): 0.7,
    ('San_Bernardino', 'Seattle'): 0.5, ('San_Bernardino', 'Spokane'): 0.5
}

# Define valid routes for decision variables (exclude N/A routes)
valid_hub_to_focus = [(i, j) for i in hubs for j in focus_cities if costs_hub_to_focus[(i, j)] != float('inf')]
valid_hub_to_center = [(i, k) for i in hubs for k in centers if costs_hub_to_center[(i, k)] != float('inf')]
valid_focus_to_center = [(j, k) for j in focus_cities for k in centers if costs_focus_to_center[(j, k)] != float('inf')]

# Create LP problem
prob = pulp.LpProblem("Amazon_Air_Optimization", pulp.LpMinimize)

# Decision variables (only for valid routes)
x = pulp.LpVariable.dicts("x", valid_hub_to_focus, lowBound=0, cat='Continuous')
y = pulp.LpVariable.dicts("y", valid_hub_to_center, lowBound=0, cat='Continuous')
z = pulp.LpVariable.dicts("z", valid_focus_to_center, lowBound=0, cat='Continuous')

# Objective function (only valid routes)
prob += (
    pulp.lpSum(costs_hub_to_focus[(i, j)] * x[(i, j)] for (i, j) in valid_hub_to_focus) +
    pulp.lpSum(costs_hub_to_center[(i, k)] * y[(i, k)] for (i, k) in valid_hub_to_center) +
    pulp.lpSum(costs_focus_to_center[(j, k)] * z[(j, k)] for (j, k) in valid_focus_to_center),
    "Total_Cost"
)

# Constraints
# 1. Hub capacity constraints
for i in hubs:
    prob += (
        pulp.lpSum(x.get((i, j), 0) for j in focus_cities) +
        pulp.lpSum(y.get((i, k), 0) for k in centers) <= hub_capacities[i],
        f"Hub_Capacity_{i}"
    )

# 2. Focus city flow balance
for j in focus_cities:
    prob += (
        pulp.lpSum(x.get((i, j), 0) for i in hubs) ==
        pulp.lpSum(z.get((j, k), 0) for k in centers),
        f"Focus_Flow_{j}"
    )

# 3. Focus city capacity
for j in focus_cities:
    prob += (
        pulp.lpSum(z.get((j, k), 0) for k in centers) <= focus_capacities[j],
        f"Focus_Capacity_{j}"
    )

# 4. Center demand
for k in centers:
    prob += (
        pulp.lpSum(y.get((i, k), 0) for i in hubs) +
        pulp.lpSum(z.get((j, k), 0) for j in focus_cities) == center_demands[k],
        f"Demand_{k}"
    )

# Solve the problem
prob.solve()

# Print results
print(f"Status: {pulp.LpStatus[prob.status]}")
print(f"Total Cost: ${pulp.value(prob.objective):,.2f}")

# Print all non-zero variables
print("\nNon-zero Decision Variables:")
for v in prob.variables():
    if v.varValue and v.varValue > 0:
        print(f"{v.name} = {v.varValue:,.2f} tons")

# Verify demand satisfaction for each center
print("\nDemand Satisfaction Check:")
total_demand_met = 0
for k in centers:
    total_supply = sum(v.varValue for v in prob.variables() if (v.name.startswith('y_') or v.name.startswith('z_')) and k in v.name and v.varValue)
    total_demand_met += total_supply
    print(f"Center {k}: Demand = {center_demands[k]:,.2f}, Supplied = {total_supply:,.2f}")
    if abs(total_supply - center_demands[k]) > 1e-6:
        print(f"Warning: Demand mismatch for {k}")

print(f"\nTotal Demand Met: {total_demand_met:,.2f} tons (Expected: 133,747.00 tons)")
if abs(total_demand_met - 133747) > 1e-6:
    print("Warning: Total demand not fully met")

# Solve the problem
prob.solve()

# Save output to a text file
with open('output.txt', 'w') as f:
    f.write(f"Status: {pulp.LpStatus[prob.status]}\n")
    f.write(f"Total Cost: ${pulp.value(prob.objective):,.2f}\n")
    f.write("\nNon-zero Decision Variables:\n")
    for v in prob.variables():
        if v.varValue and v.varValue > 0:
            f.write(f"{v.name} = {v.varValue:,.2f} tons\n")

    f.write("\nDemand Satisfaction Check:\n")
    total_demand_met = 0
    for k in centers:
        total_supply = sum(v.varValue for v in prob.variables() if
                           (v.name.startswith('y_') or v.name.startswith('z_')) and k in v.name and v.varValue)
        total_demand_met += total_supply
        f.write(f"Center {k}: Demand = {center_demands[k]:,.2f}, Supplied = {total_supply:,.2f}\n")
        if abs(total_supply - center_demands[k]) > 1e-6:
            f.write(f"Warning: Demand mismatch for {k}\n")

    f.write(f"\nTotal Demand Met: {total_demand_met:,.2f} tons (Expected: 133,747.00 tons)\n")
    if abs(total_demand_met - 133747) > 1e-6:
        f.write("Warning: Total demand not fully met\n")

# Print results to console (for verification)
print(f"Status: {pulp.LpStatus[prob.status]}")
print(f"Total Cost: ${pulp.value(prob.objective):,.2f}")
print("\nNon-zero Decision Variables:")
for v in prob.variables():
    if v.varValue and v.varValue > 0:
        print(f"{v.name} = {v.varValue:,.2f} tons")
print("\nDemand Satisfaction Check:")
total_demand_met = 0
for k in centers:
    total_supply = sum(v.varValue for v in prob.variables() if
                       (v.name.startswith('y_') or v.name.startswith('z_')) and k in v.name and v.varValue)
    total_demand_met += total_supply
    print(f"Center {k}: Demand = {center_demands[k]:,.2f}, Supplied = {total_supply:,.2f}")
    if abs(total_supply - center_demands[k]) > 1e-6:
        print(f"Warning: Demand mismatch for {k}")
print(f"\nTotal Demand Met: {total_demand_met:,.2f} tons (Expected: 133,747.00 tons)")
if abs(total_demand_met - 133747) > 1e-6:
    print("Warning: Total demand not fully met")