![GitHub](https://img.shields.io/github/license/BassJonathan/D3_Draggable_Chart) ![GitHub Repo stars](https://img.shields.io/github/stars/BassJonathan/D3_Draggable_Chart) ![GitHub forks](https://img.shields.io/github/forks/BassJonathan/D3_Draggable_Chart)

# Interactive Line Chart with D3.js
This project utilizes D3.js to create an interactive line chart visualization that allows users to manipulate data points dynamically. It features draggable points connected by lines, creating a visual representation of a dataset that can be modified in real-time by the user. The visualization simulates a looping effect by extending the first and last points outside the visible area, making it appear as though the line is continuous.

## Table of Contents
1. [Features](#features)
2. [Technology](#technology)
3. [Setup](#setup)
4. [License](#license)
5. [Notes](#notes)

## Features:
- **Interactive Data Points:** Users can click and drag to move data points along the chart. The chart updates dynamically to reflect these changes.
- **Point Addition and Deletion:** Users can double-click on the chart to add new data points and press the 'Delete' key to remove a selected data point.
- **Grid Layout:** Both horizontal and vertical grid lines are displayed to enhance readability and precision in viewing data points.
- **Extended Looping:** To create a seamless visual loop, the first and last data points are projected outside the visual boundaries, and the line connects these extended points back to the main data.

## Technology:
This project is simply built using:
- **D3.js**: A JavaScript library for producing dynamic, interactive data visualizations in web browsers.
- **HTML/CSS**: Basic HTML5 and CSS3 for structuring and styling the webpage.

## Setup:
To get this project up and running on your local machine, follow these steps:
1. Clone the repository:
```bash
git clone https://github.com/BassJonathan/interactive-line-chart.git
```
2. Navigate to the project directory:
```bash
cd interactive-line-chart
```
3. Open the index.html file in a web browser.
You can also use a local development server if you have one installed (e.g., using Python's HTTP server or Node.js).
4. Interact with the visualization:
- Drag points to move them.
- Double-click to add new points.
- Select a point and press 'Delete' to remove it.

## License:
This project is licensed under the MIT License - see the `LICENSE.md` file for details.

## Notes:
This documentation was created using a generative ai!