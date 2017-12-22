import geopandas as gpd
import pandas as pd
import requests
import json
from flask import Flask, jsonify, Response
from flask_cors import CORS



app = Flask(__name__)
CORS(app)

@app.route("/danger")
def danger():
    regions_url = "http://www.nwac.us/static/home/data/regions.json"
    forecast_url = "https://www.nwac.us/api/v4/danger_map_data/"
    regions_raw = requests.get(regions_url)
    regions = gpd.GeoDataFrame.from_features(regions_raw.json()['features'])
    regions.set_index('id', inplace=True)
    regions.index = pd.to_numeric(regions.index)
    forecast_raw = requests.get(forecast_url, headers={'referer':"https://www.nwac.us"})
    forecast = pd.read_json(forecast_raw.text).T
    joined = regions.join(forecast)
    return(jsonify(json.loads(joined.to_json())))
    
if __name__ == '__main__':
    app.run()