# An interactive trade chart for the game Ascii Sector
Ascii Sector is a very cool space freelancer-style game depicted entirely in ascii. You can get it for free at [http://www.asciisector.net/](http://www.asciisector.net/). I'm not affiliated with it's development.

I was motivated to create this trading chart to reduce the time spent figuring out which trade routes would be profitable by searching the in-game list or the chart at the wiki page. The data are based on the wiki [here](http://asciisector.wikia.com/wiki/Import/Export_Chart).

There are two viewing modes:

## List
![List mode](https://github.com/heategn/asciisector_trade_chart/blob/master/screenshots/asciisector_list.png "List Mode")
## Grid
![Grid mode](https://github.com/heategn/asciisector_trade_chart/blob/master/screenshots/asciisector_grid.png "Grid Mode")

*   List - A compact viewing mode that lets you quickly discover which system and locations are importing/exporting a specific good.
*   Grid - A full viewing mode that depicts the same information at a glance.

# Running
The tradechart_standalone.html file in the in "dist" folder contains all of the html/css/javascript needed to run. Alternatively, you can download the files separately -- handy if you want to edit them yourself.

*   tradechart.html -- The HTML file to open in the browser. It searches the local folder for the css/javascript files.
*   tradechart.css -- Styling.
*   tradechart_data.js -- This consists of JSON representing the relations between the goods, systems, and locations.
*   tradechart.js -- This parses tradechart_data.js, handles interaction, and rendering.

# Support and Requirements
It should work on any browser that supports modern javascript (ES6). Tested briefly on Firefox, Chrome, and IE. I haven't tested on mobile devices, yet. The grid view may require a little horizontal scrolling.

# Building the stand-alone
I used some local scripting to translate the data from the wiki into the JSON found in tradechart_data.js.

I used [uglify](https://github.com/mishoo/UglifyJS2/tree/harmony) to minimize the css/javascript, and m4 (Linux macro processor) to combine into tradechart_standalone.m.

`m4 -DCSS="$(cat tradechart.css)" -DJS_DATA="$(cat tradechart_data.min.js)" -DJS_MAIN="$(cat tradechart.min.js)" tradechart_standalone.m > tradechart_standalone.html`
