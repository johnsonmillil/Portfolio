import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# Step 1: Load data
df = pd.read_csv('medical_clean.csv')
print(df.head())

# Step 2: Select and preprocess data
features = ['Initial_days', 'TotalCharge', 'Additional_charges']
df_selected = df[features]
print("Selected features:", df_selected.columns.tolist())

# Scale features
scaler = StandardScaler()
df_scaled = scaler.fit_transform(df_selected)
df_scaled = pd.DataFrame(df_scaled, columns=features)
print("First 5 rows of scaled data:")
print(df_scaled.head())

# Save cleaned dataset
df_scaled.to_csv('medical_cleaned.csv', index=False)
print("Cleaned data saved as medical_cleaned.csv")

# Step 3: Determine optimal number of clusters (elbow method)
inertia = []
K = range(1, 11)
for k in K:
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(df_scaled)
    inertia.append(kmeans.inertia_)
print("Inertia values for k=1 to 10:", inertia)

# Plot elbow curve
plt.figure(figsize=(8, 6))
plt.plot(K, inertia, 'bx-')
plt.xlabel('Number of Clusters (k)')
plt.ylabel('Inertia')
plt.title('Elbow Method for Optimal k')
plt.savefig('elbow_plot.png')
plt.close()
print("Elbow plot saved as elbow_plot.png")

# Step 4: Apply k-means with optimal k (e.g., k=3, to be confirmed by elbow plot)
optimal_k = 3  # Update based on elbow plot inspection
kmeans = KMeans(n_clusters=optimal_k, random_state=42)
df_scaled['Cluster'] = kmeans.fit_predict(df_scaled)
print("Cluster assignments for first 5 rows:")
print(df_scaled.head())

# Save clustered dataset
df_scaled.to_csv('medical_clustered.csv', index=False)
print("Clustered data saved as medical_clustered.csv")

# Step 5: Visualize clusters (2D scatter plot: Initial_days vs. TotalCharge)
plt.figure(figsize=(8, 6))
scatter = plt.scatter(df_scaled['Initial_days'], df_scaled['TotalCharge'],
                     c=df_scaled['Cluster'], cmap='viridis')
plt.xlabel('Initial_days (Scaled)')
plt.ylabel('TotalCharge (Scaled)')
plt.title('K-Means Clustering Results')
plt.colorbar(scatter, label='Cluster')
plt.savefig('cluster_plot.png')
plt.close()
print("Cluster visualization saved as cluster_plot.png")
