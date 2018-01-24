from bs4 import BeautifulSoup
import requests
import re

url_template = "https://www.nwac.us/avalanche-forecast/current/{region}"


def _getElevBandForecast(fcst, band):
    result = {}
    fcst = fcst.find(id=band)
    now_day = fcst.select("div.span4")[1].select('h4.mobile')[0].text
    now_fcst = fcst.select("div.span4")[1].select(
        'div.danger-description h4')[0].text
    fut_day = fcst.select("div.span3")[0].select('h4.mobile')[0].text
    fut_fcst = fcst.select("div.span3")[0].select(
        'div.danger-description h4')[0].text
    result['now'] = {
        'day': now_day,
        'danger': now_fcst
    }
    result['tomorrow'] = {
        'day': fut_day,
        'danger': fut_fcst
    }
    return(result)


def _getUpdatedTime(fcst):
    return(fcst.find('div', 'forecast-date').text.strip())


def _getProblems(fcst):
    result = []
    problems = fcst.find_all(class_="problem")
    for problem in problems:
        this = {}
        this['name'] = problem.select(
            "div.problem-description h3")[0].text.strip()[:-1]
        this['rose_img_url'] = "https://www.nwac.us" + \
            problem.select('img.problem-octagon')[0].attrs['src']
        this['likelihood_img_url'] = problem.select(
            'img.problem-likelihood')[0].attrs['src']
        this['size_img_url'] = problem.select(
            'img.problem-sizes')[0].attrs['src']
        result.append(this)
    return(result)

def _get_detailed_summary(fcst):
    ta = fcst.find(id='discussion')
    allp = ta.find_all('p')
    summary = ""
    it = 0
    text = ""
    while text != "Observations":
        summary += text + '\n'
        text = allp[it].text
        it += 1
    return summary.strip()

def _get_detailed_forecast(fcst):
    fd = fcst.find(class_='forecast-detailed')
    title = fd.find('h2').text[0:-1]
    return({
        'forecast_title' : title,
        'forecast' : "\n".join(map(lambda x: x.text, fd.find_all('p')))
    })

def _getWeatherForecast(fcst):
    base_url  = "https://www.nwac.us/mountain-weather-forecast/mountain-weather-forecast-by-zone/{id}/{region}"
    url_regex = "\/mountain-weather-forecast\/mountain-weather-forecast-by-zone\/(\d{4})\/([\w-]*)\/"
    raw = fcst.find_all('script')[19].text
    matches = re.search(url_regex, raw)
    url = base_url.format(id=matches.group(1), region=matches.group(2))
    markup = requests.get(url, headers={"Referer" : "http://www.nwac.us"}).text
    return({
        'meta' : {
            'current_id' : matches.group(1),
            'region' : matches.group(2)
        }, 
        'url' : url, 
        'html' : markup
    })



def getRegionalForecast(region):
    forecast = {}
    url = url_template.format(region=region)
    tree = BeautifulSoup(requests.get(url).text)
    # Forecast Time
    try: 
        forecast["updateTime"] = _getUpdatedTime(tree)
    except Exception:
        forecast['updateTime'] = ""
    # Elevation Band Danger Levels
    danger = {}
    bands = ["treeline-above", 'treeline-near', 'treeline-below']
    for elev_band in bands:
        try:
            danger[elev_band] = _getElevBandForecast(tree, elev_band)
        except Exception: 
            danger[elev_band] = []
    forecast['danger'] = danger
    # Problems
    try: 
        forecast['problems'] = _getProblems(tree)
    except Exception:
        forecast['problems'] = []
    try: 
        forecast['detailed_summary'] = _get_detailed_summary(tree)
    except Exception:
        forecast['detailed_summary'] = ""
    try:
        forecast['detailed_forecast'] = _get_detailed_forecast(tree)
    except Exception:
        forecast['detailed_forecast'] = ""

    try:
        forecast['weather'] = _getWeatherForecast(tree)
    except Exception:
        forecast['weather'] = {}
    return(forecast)
