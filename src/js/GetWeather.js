import axios from "axios";
import {weatherKey} from "../../global";
import {useI18n} from "vue-i18n";
const {_, locale} = useI18n();


export async function getCityId(city) {
    if (localStorage.getItem("cityId")) {
        return localStorage.getItem("cityId");
    } else {
        try {
            const response = await axios.get(`https://geoapi.qweather.com/v2/city/lookup?location=${city}&key=${weatherKey}`);
            //console.log(response.data);
            localStorage.setItem("cityId", response.data.location[0].id);
            return response.data.location[0].id;
        } catch (error) {
            console.log(error);
        }
    }

}

export async function getWeather7d(cityId) {
    try {
        const response = await axios.get(`https://devapi.qweather.com/v7/weather/7d?location=${cityId}&key=${weatherKey}`);
        //console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getTemp(cityId) {
    const weather7d = await getWeather7d(cityId);
    return weather7d.daily.slice(0, 7).map(day => [day.tempMax, day.tempMin]);
}

export async function getWeatherToday(cityId) {
    const weather7d = await getWeather7d(cityId);
    return {
        weather: weather7d.daily[0].textDay,
        temp: [weather7d.daily[0].tempMin, weather7d.daily[0].tempMax]
    };
}

export async function getWeatherNow(cityId) {
    let lang = '';
    if (localStorage.getItem('lang')){
        localStorage.getItem('lang').slice(0, 2);
    } else {
        lang = locale.value;
    }
    try {
        const response = await axios.get(`https://devapi.qweather.com/v7/weather/now?location=${cityId}&key=${weatherKey}&lang=${lang}`);
        return {
            weather: response.data.now.text,
            temp: response.data.now.temp,
            icon: response.data.now.icon
        };
    } catch (e) {
        console.log(e);
        return null;
    }
}