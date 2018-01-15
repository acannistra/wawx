from bs4 import BeautifulSoup
import requests

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
            problems[0].select('img.problem-octagon')[0].attrs['src']
        this['likelihood_img_url'] = problem.select(
            'img.problem-likelihood')[0].attrs['src']
        this['size_img_url'] = problem.select(
            'img.problem-sizes')[0].attrs['src']
        result.append(this)
    return(result)


def getRegionalForecast(region):
    forecast = {}
    url = url_template.format(region=region)
    tree = BeautifulSoup(requests.get(url).text)
    # Forecast Time
    forecast["updateTime"] = _getUpdatedTime(tree)
    # Elevation Band Danger Levels
    danger = {}
    for elev_band in ["treeline-above", 'treeline-near', 'treeline-below']:
        danger[elev_band] = _getElevBandForecast(tree, elev_band)
    forecast['danger'] = danger
    # Problems
    forecast['problems'] = _getProblems(tree)
    return(forecast)
