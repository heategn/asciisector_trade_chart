<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <style type="text/css">CSS</style>
    <script type="text/javascript">JS_DATA JS_MAIN</script>
</head>
<body>
<h1>Ascii Sector Trade Chart <button class="decorated-btn highlight" id="ListViewBtn">List</button> <button class="decorated-btn" id="GridViewBtn">Grid</button></h1>
<div id="ListView">
    <div id="Left">
        <div id="Navigation">
            <button data-panel-id="Commodities" id="Commodities-btn" class="nav-btn highlight">Commodities</button>
            <button data-panel-id="Systems" id="Systems-btn"  class="nav-btn">Systems</button>
            <button data-panel-id="Locations" id="Locations-btn"  class="nav-btn">Locations</button>
        </div>
        <div id="Commodities" class="panel"></div>
        <div id="Systems" class="panel hide"></div>
        <div id="Locations" class="panel hide"></div>
    </div>
    <div id="Right">
        <div class="border">
            <span id="Back">Back</span>
            <h4 id="Selected"></h4>
            <div id="output"></div>
        </div>
    </div>
</div>
<div id="GridView">
    <div id="cell-info-wrapper">
        <div id="cell-info">Click a cell.</div>
    </div>
    <div id="grid-header" style="display:flex; flex-flow:row">
        <span id="import-legend" class="legend"><span>&#9698;</span> = import</span>
        <span id="export-legend" class="legend"><span>&#9701;</span> = export</span>
    </div>
    <table id="grid">
        <thead id="grid-thead"></thead>
        <tbody id="grid-table"></tbody>
    </table>
</div>
</body>
</html>