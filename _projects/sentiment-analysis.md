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
- [Add loss_plot.png to assets/, e.g., <<img width="242" height="686" alt="image" src="https://github.com/user-attachments/assets/f6c19714-ccc0-4b9d-b702-887d2d8ba547" />
>]

[Back to Home](/)
