#!/usr/bin/env python
# coding: utf-8

# <h1>Model to predict airport flight delays</h1>
# 
# Much of this model is taken from the work of Fabien Daniel:
# https://www.kaggle.com/code/fabiendaniel/predicting-flight-delays-tutorial/notebook.  
# The difference here is that we are modeling delays for all arrival airports and all airlines given a single departure airport.
# 
# We also incorporate MLflow tracking using the Python API.  
# 
# Input parameters for this script include:
# * num_alpha_increments:  The number of different Ridge regression alpha penalty values to try, spaced by 0.2 apart
#   
# Dependencies:
# * cleaned_data.csv is the input data file, structured appropriately.  The structure of this data file must be:
# 
# | YEAR | MONTH | DAY | DAY_OF_WEEK | ORG_AIRPORT | DEST_AIRPORT | SCHEDULED_DEPARTURE | DEPARTURE_TIME | DEPARTURE_DELAY | SCHEDULED_ARRIVAL | ARRIVAL_TIME | ARRIVAL_DELAY |
# |:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|
# | integer | integer | integer | integer | string | string | integer | integer | integer | integer | integer | integer |
# 
# Outputs:
# * log file named "polynomial_regression.txt" containing information about the model training process
# * MLFlow experiment named with current date containing model training runs, one for each value of the Ridge regression penalty
# 

# Here we import the packages we will need
import datetime
import pandas as pd
import argparse
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
from sklearn.preprocessing import PolynomialFeatures, LabelEncoder, OneHotEncoder
from sklearn import metrics, linear_model
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import Ridge
import mlflow
import mlflow.sklearn
import logging
import os
import pickle
import json

# Determine the absolute path to the project root and data directory
script_path = os.path.abspath(__file__)
project_root = os.path.dirname(script_path)  # Since poly_regressor.py is in the root directory
data_dir = os.path.join(project_root, "data")
input_file = os.path.join(data_dir, "cleaned_data.csv")

# Debug: Print the paths to verify
print(f"Script path: {script_path}")
print(f"Project root: {project_root}")
print(f"Data directory: {data_dir}")
print(f"Input file: {input_file}")

# set up the argument parser
parser = argparse.ArgumentParser(description='Parse the parameters for the polynomial regression')
parser.add_argument('num_alphas', metavar='N', type=int, help='Number of Lasso penalty increments')
order = 1
#args = parser.parse_args()
#num_alpha_increments = args[0]
# Uncomment the two lines above and comment the line below to run this script from the command prompt or as part of an
# MLFlow pipeline
num_alphas = 20

# configure logger
logname = "polynomial_regression.txt"
logging.basicConfig(filename=logname,
                    filemode='w',
                    format='%(asctime)s %(levelname)s %(message)s',
                    datefmt='%H:%M:%S',
                    level=logging.DEBUG)
logging.getLogger('matplotlib.font_manager').disabled = True
logging.info("Flight Departure Delays Polynomial Regression Model Log")

# read the data file
print("Loading data from:", input_file)
try:
    df = pd.read_csv(input_file)
    print("Data loaded successfully. Shape:", df.shape)
    tab_info = pd.DataFrame(df.dtypes).T.rename(index={0:'column type'})
    print("Column types:\n", tab_info)
    print("Missing values:\n", df.isnull().sum())
    print("Unique YEAR values:", df['YEAR'].unique())
    print("Unique MONTH values:", df['MONTH'].unique())
    print("Unique DAY values:", df['DAY'].unique())
    print("Number of unique DEST_AIRPORT values:", df['DEST_AIRPORT'].nunique())
except Exception as e:
    print(f"Error loading data: {e}")
    logging.error(f"Error loading data: {e}")
    raise

# Limit the number of unique DEST_AIRPORT values to prevent memory issues during one-hot encoding
MAX_DESTINATIONS = 50
if df['DEST_AIRPORT'].nunique() > MAX_DESTINATIONS:
    top_destinations = df['DEST_AIRPORT'].value_counts().head(MAX_DESTINATIONS).index
    df = df[df['DEST_AIRPORT'].isin(top_destinations)]
    print(f"Reduced to top {MAX_DESTINATIONS} destinations. New shape:", df.shape)

def grab_month_year(df:pd.DataFrame) -> tuple:
    """
    grab_month_year is a function to extract the month and year of the flights in the departure delay dataset.

    Parameters
    ----------
    df : pd.DataFrame
        the input data set in Pandas data frame format.

    Returns
    -------
    tuple
        (month,year) of the data set.

    Raises
    ------
    Exception
        If more than one month or year are found in the data set.
    """
    months = pd.unique(df['MONTH'])
    years = pd.unique(df['YEAR'])
    if len(months) >1:
        raise Exception("Multiple months found in data set, only one acceptable")
    else:
        month = int(months[0])
    if len(years) > 1:
        raise Exception("Multiple years found in data set, only one acceptable")
    else:
        year = int(years[0])
    return (month, year)

def format_hour(string: str) -> datetime:
    """
    format_hour is a function to convert an 'HHMM' string input to a time in datetime format.

    Parameters
    ----------
    string : string
        An hour and minute in 'HHMM' format.

    Returns
    -------
    datetime
        An hour and minute (datetime.time).  Returns nan if input string is null.

    """
    if pd.isnull(string):
        return np.nan
    else:
        if string == 2400: string = 0
        string = "{0:04d}".format(int(string))
        hour = datetime.time(int(string[0:2]), int(string[2:4]))
        return hour

def combine_date_hour(x: list) -> datetime:
    """
    combine_date_hour is a function that combines a date and time to produce a datetime.datetime

    Parameters
    ----------
    x : list
        A list containing a date and a time in datetime format.

    Returns
    -------
    datetime
        A combined date and time in datetime format. Returns nan if time is null.

    """
    if pd.isnull(x.iloc[0]) or pd.isnull(x.iloc[1]):
        return np.nan
    else:
        return datetime.datetime.combine(x.iloc[0],x.iloc[1])

def create_flight_time(df: pd.DataFrame, col: str) -> pd.Series:
    """
    create_flight_time is a function that combines two columns of a data frame to produce a datetime.datetime series.

    Parameters
    ----------
    df : pd.DataFrame
        A data frame containing flight departure delay data
    col: string
        The name of one of the columns in the data frame containing flight departure delay data

    Returns
    -------
    pd.Series
        A Pandas series of datetimes with combined date and time

    """
    list = []
    for index, cols in df[['DATE', col]].iterrows():
        if pd.isnull(cols.iloc[1]):
            list.append(np.nan)
        elif float(cols.iloc[1]) == 2400:
            cols.iloc[0] += datetime.timedelta(days=1)
            cols.iloc[1] = datetime.time(0,0)
            list.append(combine_date_hour(cols))
        else:
            cols.iloc[1] = format_hour(cols.iloc[1])
            list.append(combine_date_hour(cols))
    return pd.Series(list)

def create_df(df: pd.DataFrame) -> pd.DataFrame:
    """
    create_df is a function that wrangles data within a flight departure delay data frame into the format needed for ML training.

    Parameters
    ----------
    df : pd.DataFrame
        A data frame containing flight departure delay data

    Returns
    -------
    pd.DataFrame
        A Pandas data frame with modified columns and data formats suitable for regression model training

    """
    df2 = df[['SCHEDULED_DEPARTURE','SCHEDULED_ARRIVAL',
                                    'DEST_AIRPORT','DEPARTURE_DELAY']]
    df2 = df2.dropna(how = 'any')
    df2.loc[:,'weekday'] = df2['SCHEDULED_DEPARTURE'].apply(lambda x:x.weekday())
    #____________________
    # delete delays > 1h
    df2.loc[:,'DEPARTURE_DELAY'] = df2['DEPARTURE_DELAY'].apply(lambda x:x if x < 60 else np.nan)
    df2 = df2.dropna(how = 'any')
    #_________________
    # formating times
    fct = lambda x:x.hour*3600+x.minute*60+x.second
    df2.loc[:,'hour_depart'] = df2['SCHEDULED_DEPARTURE'].apply(lambda x:x.time())
    df2.loc[:,'hour_depart'] = df2['hour_depart'].apply(fct)
    df2.loc[:,'hour_arrive'] = df2['SCHEDULED_ARRIVAL'].apply(fct)
    df2 = df2[['hour_depart','hour_arrive',
            'DEST_AIRPORT','DEPARTURE_DELAY','weekday']]
    df3 = df2.groupby(['hour_depart', 'hour_arrive', 'DEST_AIRPORT'],
                      as_index = False).mean()
    return df3

# Do not set the experiment explicitly; mlflow run . should already set the experiment
run_name = "Run started at " + datetime.datetime.now().strftime("%H:%M")

print("Creating DATE column...")
try:
    df['DATE'] = pd.to_datetime(df[['YEAR', 'MONTH', 'DAY']], errors='coerce')
    print("DATE column created.")
    print("Sample DATE values:", df['DATE'].head())
    print("Missing DATE values after conversion:", df['DATE'].isnull().sum())
except Exception as e:
    print(f"Error creating DATE column: {e}")
    logging.error(f"Error creating DATE column: {e}")
    raise

print("Extracting month and year...")
try:
    (month, year) = grab_month_year(df)
    print(f"Month and year extracted: {month}, {year}")
    logging.info("Month and year of data: %s %s", month, year)
except Exception as e:
    print(f"Error in grab_month_year: {e}")
    logging.error(f"Error in grab_month_year: {e}")
    raise

print("SCHEDULED_DEPARTURE range:", df['SCHEDULED_DEPARTURE'].min(), "to", df['SCHEDULED_DEPARTURE'].max())
print("Missing SCHEDULED_DEPARTURE values:", df['SCHEDULED_DEPARTURE'].isnull().sum())
df['SCHEDULED_DEPARTURE'] = create_flight_time(df, 'SCHEDULED_DEPARTURE')
print("SCHEDULED_DEPARTURE processed.")
df['DEPARTURE_TIME'] = df['DEPARTURE_TIME'].apply(format_hour)
df['SCHEDULED_ARRIVAL'] = df['SCHEDULED_ARRIVAL'].apply(format_hour)
df['ARRIVAL_TIME'] = df['ARRIVAL_TIME'].apply(format_hour)

# define training data as the first 3 weeks of the month, and test data as that from the fourth week of the month
df_train = df[df['SCHEDULED_DEPARTURE'].apply(lambda x:x.date()) < datetime.date(year, month, 23)]
df_test  = df[df['SCHEDULED_DEPARTURE'].apply(lambda x:x.date()) > datetime.date(year, month, 23)]

df3 = create_df(df_train)

# perform one-hot encoding of all destination airports in training data
label_encoder = LabelEncoder()
integer_encoded = label_encoder.fit_transform(df3['DEST_AIRPORT'])
#_________________________________________________________
zipped = zip(integer_encoded, df3['DEST_AIRPORT'])
label_airports = list(set(list(zipped)))
label_airports.sort(key = lambda x:x[0])
#_________________________________________________
onehot_encoder = OneHotEncoder(sparse_output=False)
integer_encoded = integer_encoded.reshape(len(integer_encoded), 1)
onehot_encoded = onehot_encoder.fit_transform(integer_encoded)
#_________________________________________________
b = np.array(df3[['hour_depart', 'hour_arrive']])
X = np.hstack((onehot_encoded, b))
Y = np.array(df3['DEPARTURE_DELAY'])
Y = Y.reshape(len(Y), 1)
logging.info("Airport one-hot encoding successful")

# train/validation split at 30%
X_train, X_validate, Y_train, Y_validate = train_test_split(X, Y, test_size=0.3)

# Use the active MLflow run context created by mlflow run .
# Since mlflow run . should provide a run context, we don't start a new one.
active_run = mlflow.active_run()
if active_run is None:
    print("Warning: No active MLflow run detected. Logging may not work as expected.")
else:
    print(f"Using MLflow run with ID: {active_run.info.run_id}")

score_min = 10000
alpha_max = num_alphas * 2
count = 1
best_alpha = None
best_model = None
# loop through all alpha values
for alpha in range(0, alpha_max, 2):
    run_num = "Training Run Number " + str(count)
    # create a Ridge regressor with the stated alpha
    ridgereg = Ridge(alpha=alpha/10)
    # create polynomial features based on the polynomial order
    poly = PolynomialFeatures(degree=order)
    # fit the model using the training data
    X_ = poly.fit_transform(X_train)
    ridgereg.fit(X_, Y_train)
    X_ = poly.fit_transform(X_validate)
    # predict against the validation data
    result = ridgereg.predict(X_)
    # how well did the model do when compared to the validation actuals?
    score = metrics.mean_squared_error(result, Y_validate)
    with mlflow.start_run(run_name=run_num, nested=True):
        mlflow.log_param("alpha", alpha/10)
        mlflow.log_metric("Training Data Mean Squared Error", score)
        mlflow.log_metric("Training Data Average Delay", np.sqrt(score))
    if score < score_min:
        score_min = score
        best_alpha = alpha/10
        best_model = ridgereg
        parameters = [alpha, order]
    logging.info("n={} alpha={} , MSE = {:<0.5}".format(order, alpha/10, score))
    count += 1

# train and predict on validation data with optimal alpha found
X_ = poly.fit_transform(X_validate)
tresult = ridgereg.predict(X_)
tscore = metrics.mean_squared_error(tresult, Y_validate)
logging.info('Training Data Final MSE = {}'.format(round(tscore, 2)))
mlflow.log_metric("Training Data Mean Squared Error", tscore)
mlflow.log_metric("Training Data Average Delay", np.sqrt(tscore))

logging.info("Model training loop completed with %s iterations", count-1)

# create a data frame of the test data
df3 = create_df(df_test)

# Run final model on test data in a nested run
with mlflow.start_run(run_name="Final Model - Test Data", nested=True):
    # Prepare test data
    integer_encoded = label_encoder.transform(df3['DEST_AIRPORT'])
    integer_encoded = integer_encoded.reshape(len(integer_encoded), 1)
    onehot_encoded = onehot_encoder.transform(integer_encoded)
    b = np.array(df3[['hour_depart', 'hour_arrive']])
    X_test = np.hstack((onehot_encoded, b))
    Y_test = np.array(df3['DEPARTURE_DELAY'])
    Y_test = Y_test.reshape(len(Y_test), 1)

    # Predict using the best model
    X_ = poly.fit_transform(X_test)
    test_predictions = best_model.predict(X_)
    test_score = metrics.mean_squared_error(test_predictions, Y_test)

    # Log metrics for test data
    mlflow.log_metric("Test Data Mean Squared Error", test_score)
    mlflow.log_metric("Test Data Average Delay", np.sqrt(test_score))

    # Log parameters
    mlflow.log_param("alpha", best_alpha)
    mlflow.log_param("order", order)

    # Log the model
    mlflow.sklearn.log_model(best_model, "model")

    # Save the model as a pickle file
    with open("finalized_model.pkl", "wb") as f:
        pickle.dump(best_model, f)
    mlflow.log_artifact("finalized_model.pkl")

    # Create and save a performance plot
    plt.figure(figsize=(10, 6))
    plt.scatter(Y_test, test_predictions, alpha=0.5)
    plt.xlabel("Actual Departure Delay (minutes)")
    plt.ylabel("Predicted Departure Delay (minutes)")
    plt.title("Actual vs Predicted Departure Delays (Test Data)")
    plt.plot([Y_test.min(), Y_test.max()], [Y_test.min(), Y_test.max()], 'r--', lw=2)
    plt.savefig("model_performance_test.jpg")
    mlflow.log_artifact("model_performance_test.jpg")

label_conversion = dict()
for s in label_airports:
    label_conversion[s[1]] = int(s[0])

# export airport label conversion for test data to json file for later use
with open("label_conversion.json", "w") as f:
    json.dump(label_conversion, f)
mlflow.log_artifact("label_conversion.json")