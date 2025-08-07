# Sentiment Analysis with LSTM Neural Networks (D604)

## Overview
Built a Recurrent Neural Network (RNN) with LSTM layers to classify customer sentiments (positive/negative) from UCI datasets (Amazon, IMDB, Yelp), aiding e-commerce decision-making.

## Approach
- Preprocessed text: Tokenized with Keras (3,000-word vocab, 40-word sequences), 70/15/15 split.
- Architecture: 100-dim Embedding, 2 LSTM layers (64 units, ReLU), Dense (sigmoid).
- Trained with Adam, binary cross-entropy, early stopping (epoch 7).

## Technologies
Python, TensorFlow/Keras, NumPy.

## Results
| Metric          | Value          |
|-----------------|----------------|
| Test Accuracy   | 81.36%         |
| Parameters      | ~402,977       |
| Vocabulary Size | 3,000 words    |

Visuals: Loss/accuracy plots show training convergence, minor overfitting mitigated by dropout (0.2).

## Learnings
LSTM captured context well; dropout addressed overfitting. Ethical data splits ensured fairness.

## Artifacts
- Code: [sentiment_analysis.ipynb](../sentiment-analysis/sentiment_analysis.ipynb)
- Model: sentiment_model.keras
- <img width="640" height="480" alt="loss_plot" src="https://github.com/user-attachments/assets/49edb672-01db-4add-93d2-f7bc8b02fe53">
[Back to Home](/)
