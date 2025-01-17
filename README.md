# Intelli Home Web APP

#### This webpage is a front-end page for Sichuan University course design project of Computer Science College. 

## Introduction

This webpage provides a comprehensive solution for managing **smart home devices** and checking the **weather** from a single interface. Built with **Vite** for fast development and **Element-Plus** for a polished, user-friendly UI, this application allows users to control their smart home devices such as lights, air conditioning, and more. Additionally, it integrates weather services to provide real-time weather information for users' locations.

## Features

- **Smart Home Device Control**:
    - Control various smart devices such as lights, air conditioners, smart plugs, and thermostats.
    - Turn devices on/off, adjust settings, and monitor device statuses.

- **Real-Time Weather Updates**:
    - View current weather conditions, including temperature, humidity, and forecasts.
    - Get weather information for your location or any city worldwide.

- **User-Friendly Interface**:
    - Built with **Element-Plus**, a comprehensive UI library that ensures a sleek and responsive experience.
    - Modern design with easy navigation and device control features.

- **Device Status Monitoring**:
    - Check the status of all connected devices (e.g., on/off, temperature, brightness).
    - Receive real-time updates on device performance and health.

- **Customizable User Settings**:
    - Adjust the layout and appearance of the page to suit your preferences.
    - Manage account settings and personalize device names and groups.

## Requirements

To run this webpage, you need:
- **Modern Web Browser**: Any browser that supports modern JavaScript (e.g., Chrome, Firefox, Edge).
- **Internet Connection**: Required for fetching weather data and controlling smart devices.

## Installation and Setup

1. Clone or download the repository.
2. Make sure you have **Node.js** and **npm** (or **yarn**) installed on your machine.
3. Install the project dependencies:

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

5. Open the webpage in your browser at `http://localhost:8080`.

## How to Use

### 1. Smart Device Control
- **Lights**:
    - Turn lights on or off with a simple toggle.
    - Adjust brightness and color temperature for supported smart bulbs.
- **Air Conditioners**:
    - Set the temperature and mode (cooling/heating) for your air conditioner.
    - View the current status (on/off, temperature).
- **Other Devices**:
    - Control additional devices like smart plugs, thermostats, and more.

### 2. Weather Service
- Enter your location or enable geolocation to get real-time weather information.
- View the current temperature, humidity, wind speed, and more.
- Get forecasts for the next few hours and days.

### 3. Weather Chart (Powered by Apache ECharts)
- **Interactive Weather Charts**: The weather data is displayed in an interactive chart powered by **Apache ECharts**.
    - View hourly or daily temperature trends.
    - Display wind speed and humidity levels over time.
    - Easily toggle between different types of visualizations (e.g., line chart, bar chart, etc.).

### 4. Device Status
- Monitor the status of each device.
- Receive notifications if any device malfunctions or needs attention.

## Tech Stack

- **Vite**: A fast build tool and development server, providing a fast development experience.
- **Element-Plus**: A UI component library built with Vue 3, offering a wide range of components such as buttons, sliders, and input fields for a responsive and intuitive user interface.
- **Vue 3**: A progressive JavaScript framework for building modern web applications.
- **Weather API**: An external API that fetches real-time weather data for the user’s location.
- **Apache ECharts**: A powerful charting and data visualization library, used to render interactive weather charts for temperature, humidity, wind speed, and more.

## Example Usage

### Smart Device Control:
- Control the brightness of the living room light, set the air conditioner temperature to 22°C, and turn off the smart plug connected to the coffee machine.

### Weather Service:
- Get the current weather forecast for your location (e.g., 25°C, partly cloudy, with a 10% chance of rain).

### Device Monitoring:
- Monitor the air conditioner’s temperature and energy usage.

## Future Features

- **Voice Control**: Integrate voice assistants like Google Assistant or Alexa for hands-free control.
- **Multiple User Support**: Allow multiple users to control and monitor devices.
- **Scheduling and Automation**: Set schedules for devices (e.g., lights turn on at sunset, air conditioner starts at 7 AM).
- **Energy Consumption Analytics**: Track energy usage of connected devices over time.

## Contributing

Contributions are welcome! If you'd like to contribute to the project, feel free to fork the repository and submit a pull request with your improvements.

## Acknowledgements

- **Element-Plus**: [Element-Plus Documentation](https://element-plus.org/)
- **Vite**: [Vite Documentation](https://v3.vitejs.dev/)
- **Weather API**: [qweatherAPI](https://dev.qweather.com)
- some UI is powered by **UIVERSE**: [UIVERSE](https://uiverse.io/)
