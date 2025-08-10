# Plant Seedling Classification with CNN (OHN1)

## Overview
Developed a Convolutional Neural Network (CNN) to classify plant seedlings into 12 categories for automated weed detection, using a dataset of seedling images to improve agricultural efficiency.

## Approach
- Preprocessed images: Resized to 64x64, normalized, split 70/15/15.
- Architecture: Conv2D layers (32/64 filters), MaxPooling, Flatten, Dense (128 units, ReLU), output (softmax for 12 classes).
- Trained with Adam optimizer, categorical cross-entropy, early stopping (epoch 10).

## Technologies
Python, TensorFlow/Keras, Matplotlib.

## Results
| Metric          | Value          |
|-----------------|----------------|
| Test Accuracy   | 78.7%          |
| Classes         | 12 (e.g., Fat Hen, Maize) |

## Learnings
CNN captured spatial features effectively; low resolution limited accuracy—suggest higher res for 85%+.

## Artifacts
- Code: [plant-seedling](../Neural_Networks/plant_seedling_classification.ipynb)
- Model: [/plant-seedling/plant_seedling_cnn.keras]

<img width="713" height="638" alt="image" src="https://github.com/user-attachments/assets/e2af2304-5086-46d3-847c-34e92c4ba8b5" />


[Back to Home](/)
