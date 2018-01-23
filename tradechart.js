let highlighted = null;
let views = [];
let current_view = null;

const CSS_CLASSES = {
    "systemname": "system-name",
    "commoditylist": "commodity-list",
    "commodity":"commodity-lightondark",
    "sublist" : "sub-list",
    "highlight": "highlight",
    "panel_item":"panel-item",
    "list_item":"list-item",
    "nav_btn" : "nav-btn",
    "panel" : "panel",
};

const ATTRIBUTES = {
    "data_panel_id":"data-panel-id",
    "view_state":"view-state"
};

const IDS = {
    "commodity_panel":"Commodities",
    "system_panel":"Systems",
    "location_panel":"Locations"
};

const CONTROLS = {
    "CE":null,
    "SYSE":null,
    "LOCE":null,
    "C_BTN":null,
    "S_BTN":null,
    "L_BTN":null,
    "output":null,
    "SE":null,
    "BTNS": null,
    "PANELS":null,
    "BACK":null,
    "LIST_ITEMS":{},
};

const CommodityChart = {
    "eHead": null,
    "iHead": null,
    "createHeaders" : function(){
        this.eHead = document.createElement("li");
        this.iHead = document.createElement("li");
        this.eHead.innerHTML = 'Exporting';
        this.iHead.innerHTML = 'Importing';
    },
    "addLocations" : function addLocations(list, system){
        
        let h = this.createLI(system);
        h.classList.add(CSS_CLASSES.systemname);
        h.classList.add(CSS_CLASSES.list_item);
        h.setAttribute(ATTRIBUTES.data_panel_id, IDS.system_panel);
        list.appendChild(h);

        for(let l of Systems[system].locations){
            let loc = document.createElement('div');
            let li = this.createLI(l, CSS_CLASSES.sublist);
            li.setAttribute(ATTRIBUTES.data_panel_id,IDS.location_panel);
            li.classList.add(CSS_CLASSES.list_item);
            list.appendChild(li);
        }

    },
    "createLI" : function(inner, css){
        let li = document.createElement('li');
        if(css){
            li.classList.add(css);
        }
        li.innerHTML = inner;
        return li;
    },
    "renderList": function(list_type,item_name){
        CONTROLS.SE.innerHTML = item_name;
        switch(list_type){
            case IDS.commodity_panel:
                this.printAll(CONTROLS.output, item_name);
            break;
            case IDS.system_panel:
                this.printLocal(CONTROLS.output, Systems[item_name], CSS_CLASSES.commoditylist);
            break;
            case IDS.location_panel:
                this.printLocal(CONTROLS.output, Locations[item_name], CSS_CLASSES.commoditylist);
            break;
        }
    },
    "printAll" : function(targetEle, commodity){

        if(!this.eHead){
            this.createHeaders();
        }

        let exportingSysList = document.createElement("ul");
        exportingSysList.classList.add(CSS_CLASSES.commoditylist);
        exportingSysList.appendChild(this.eHead);
        let importingSysList = document.createElement("ul");
        importingSysList.appendChild(this.iHead);
        importingSysList.classList.add(CSS_CLASSES.commoditylist);
        let sortedESystems = Commodities[commodity].exportingSystems;
        let sortedISystems = Commodities[commodity].importingSystems;

        for(let s of sortedESystems){
            this.addLocations(exportingSysList, s);
        }

        for(let s of sortedISystems){
            this.addLocations(importingSysList, s);
        }

        targetEle.innerHTML = '';
        targetEle.appendChild(importingSysList);
        targetEle.appendChild(exportingSysList);

    },
    "printLocal" : function(targetEle, system, cssClass){
        
        if(!this.eHead){
            this.createHeaders();
        }

        let exports = document.createElement("ul");
        exports.appendChild(this.eHead);
        exports.classList.add(cssClass);
        let imports = document.createElement("ul");
        imports.classList.add(cssClass)
        imports.appendChild(this.iHead);

        for(let c of system.exports){
            let l = this.createLI(c, CSS_CLASSES.commodity);
            l.setAttribute(ATTRIBUTES.data_panel_id,IDS.commodity_panel);
            l.classList.add(CSS_CLASSES.list_item);
            exports.appendChild(l);
        }
        
        for(let c of system.imports){
            let l = this.createLI(c, CSS_CLASSES.commodity);
            l.setAttribute(ATTRIBUTES.data_panel_id, IDS.commodity_panel);
            l.classList.add(CSS_CLASSES.list_item);
            imports.appendChild(l);
        }
        
        targetEle.innerHTML = '';
        targetEle.appendChild(imports);
        targetEle.appendChild(exports);

    }
};

const GRID = {
    "cell_handler": function(evt){
        
        let cell;

        if(evt.target.hasAttribute('data-locations')){
            cell = evt.target;
        }
        else{
            cell = evt.target.parentNode;
        }
        
        let locations = cell.getAttribute('data-locations');

        if(locations && typeof locations != 'undefined'){
            let commodity = cell.getAttribute('data-commodity');
            let system = cell.getAttribute('data-system');
            locations = locations.split('_');
            let c_locations = [];
            for(let l of locations){
                if(Locations[l].imports.indexOf(commodity) != -1){
                    c_locations.splice(0,0,'<span class="import-mark-inline">&nbsp;' + l + '</span>');
                }
                if(Locations[l].exports.indexOf(commodity) != -1){
                    c_locations.push('<span class="export-mark-inline">&nbsp;' + l + '</span>');
                }
            }
            let system_name = "<div>" + system + " -- " + commodity + "</div>";
            CONTROLS.CELL_INFO.innerHTML = system_name + c_locations.join(' -- ');
        }

    },
    "buildTopRow": function(grid, systems){

        let r = document.createElement("tr");
        let d = document.createElement("td");
        r.appendChild(d);

        for( let s of systems ){
            let d = document.createElement("td");
            d.setAttribute("commodity-name", s);
            d.innerHTML = s;
            r.appendChild(d);
        }
        grid.appendChild(r);
        
    },
    "buildColumns": function(grid, columns, commodities, systems){

        let c_len = columns.length;

        for( let c of commodities ){
            let r = document.createElement("tr");
            for( let i = 0; i < c_len; i++ ){

                let s = columns[i];
                let d = document.createElement("td");
                
                if(i > 0){
                    
                    let s_name = s.innerHTML;
                    let exportMark = null
                    let importMark = null;
                    
                    if(systems[s_name].imports.indexOf(c) != -1){
                        importMark = document.createElement("span");
                        importMark.classList.add('import-mark');
                    }
                    
                    if(systems[s_name].exports.indexOf(c) != -1){
                        exportMark = document.createElement("span");
                        exportMark.classList.add('export-mark');
                    }
                    
                    if(importMark) d.appendChild(importMark);
                    if(exportMark) d.appendChild(exportMark);
                    
                    let bTxt = document.createElement('span');
                    bTxt.classList.add('behind-text');
                    bTxt.innerHTML = s_name;
                    d.appendChild(bTxt);
                    let locations = systems[s_name].locations.join('_');
                    d.setAttribute("data-locations", locations);
                    d.setAttribute("data-commodity",c);
                    d.setAttribute("data-system",s_name);

                }
                else{
                    d.innerHTML = c;
                }

                r.appendChild(d);

            }
            grid.appendChild(r);
        }
        
    }
};

function generateBtn(value){
    let b = document.createElement('button');
    b.innerHTML = value;
    b.classList.add('decorated-btn');
    return b;
}

function click_handler(evt){

    if(typeof evt.target.name == 'undefined' && typeof evt.link == 'undefined' && evt.currentTarget != CONTROLS.output && evt.currentTarget != CONTROLS.BACK){
        evt.preventDefault();
        return;
    }
    
    if(evt.currentTarget == CONTROLS.output && !evt.target.classList.contains('list-item')){
        evt.preventDefault();
        return;
    }

    let panel_id,item_name = null;
    let isNavBtn = evt.target.classList.contains(CSS_CLASSES.nav_btn);

    panel_id = evt.target.getAttribute(ATTRIBUTES.data_panel_id);

    if(evt.target == CONTROLS.BACK){
        current_view = views.pop();
        panel_id = current_view.panel;
        item_name = current_view.item;
    }
    else if(!isNavBtn){
        views.push(current_view);
        
        item_name = evt.target.innerHTML;
        current_view = {"panel":panel_id,"item":item_name};
    }

    for(let p of CONTROLS.BTNS){
        p.classList.remove(CSS_CLASSES.highlight);
    }

    switch(panel_id){
        case IDS.system_panel:
            CONTROLS.S_BTN.classList.add(CSS_CLASSES.highlight);
        break;
        case IDS.location_panel:
            CONTROLS.L_BTN.classList.add(CSS_CLASSES.highlight);
        break;
        case IDS.commodity_panel:
            CONTROLS.C_BTN.classList.add(CSS_CLASSES.highlight);
        break;
    }

    for(let p of CONTROLS.PANELS){
        p.classList.add("hide");
    }
    
    let panel = document.getElementById(panel_id);
    panel.classList.remove("hide");

    if(isNavBtn){
        return;
    }
    
    CONTROLS.BACK.style.visibility = (views.length > 1) ? "visible" : "hidden";

    highlighted.classList.remove(CSS_CLASSES.highlight);
    highlighted = CONTROLS.listItems[item_name];
    CONTROLS.listItems[item_name].classList.add(CSS_CLASSES.highlight);
    CommodityChart.renderList(panel_id, item_name);

}

window.onload = function(){

    CONTROLS.CE = document.getElementById("Commodities");
    CONTROLS.SYSE = document.getElementById("Systems");
    CONTROLS.LOCE = document.getElementById("Locations");
    CONTROLS.output = document.getElementById("output");
    CONTROLS.SE = document.getElementById("Selected");
    CONTROLS.C_BTN = document.getElementById("Commodities-btn");
    CONTROLS.S_BTN = document.getElementById("Systems-btn");
    CONTROLS.L_BTN = document.getElementById("Locations-btn");
    CONTROLS.LEFT_CONTAINER = document.getElementById("Left");
    CONTROLS.RIGHT_CONTAINER = document.getElementById("Right");
    CONTROLS.BTNS = [CONTROLS.C_BTN, CONTROLS.S_BTN, CONTROLS.L_BTN];
    CONTROLS.PANELS = [CONTROLS.CE,CONTROLS.SYSE,CONTROLS.LOCE];
    CONTROLS.BACK = document.getElementById("Back");
    CONTROLS.LIST_VIEW_BTN = document.getElementById("ListViewBtn");
    CONTROLS.GRID_VIEW_BTN = document.getElementById("GridViewBtn");
    CONTROLS.LIST_VIEW = document.getElementById("ListView");
    CONTROLS.GRID_VIEW = document.getElementById("GridView");
    CONTROLS.GRID_TABLE = document.getElementById("grid-table");
    CONTROLS.listItems = {};
    CONTROLS.CELL_INFO = document.getElementById("cell-info");
    CONTROLS.GRID_HEADER = document.getElementById("grid-header");
    CONTROLS.GRID_THEAD = document.getElementById("grid-thead");

    CONTROLS.LIST_VIEW_BTN.addEventListener("click",function(evt){
        CONTROLS.LIST_VIEW.style.display = 'block';
        CONTROLS.GRID_VIEW.style.display = 'none';
        CONTROLS.LIST_VIEW_BTN.classList.toggle('highlight');
        CONTROLS.GRID_VIEW_BTN.classList.toggle('highlight');
    });
    
    CONTROLS.GRID_VIEW_BTN.addEventListener("click",function(){
        CONTROLS.LIST_VIEW.style.display = 'none';
        CONTROLS.GRID_VIEW.style.display = 'block';
        CONTROLS.LIST_VIEW_BTN.classList.toggle('highlight');
        CONTROLS.GRID_VIEW_BTN.classList.toggle('highlight');
    });

    GRID.buildTopRow(CONTROLS.GRID_TABLE, SystemList);
    let columns = CONTROLS.GRID_TABLE.children[0].children;
    GRID.buildColumns(CONTROLS.GRID_TABLE, columns, CommodityList, Systems);

    CONTROLS.GRID_TABLE.addEventListener("click", GRID.cell_handler);

    for(let c of CommodityList){
        if(c == undefined) continue;
        let b = generateBtn(c);
        CONTROLS.listItems[c] = b;
        b.classList.add(CSS_CLASSES.commodity);
        b.classList.add(CSS_CLASSES.panel_item);
        b.setAttribute(ATTRIBUTES.data_panel_id,IDS.commodity_panel);
        CONTROLS.CE.appendChild(b);
    }

    for(let s of SystemList){
        if(s == "") continue;
        let b = generateBtn(s);
        CONTROLS.listItems[s] = b;
        b.classList.add(CSS_CLASSES.commodity);
        b.classList.add(CSS_CLASSES.panel_item);
        b.setAttribute(ATTRIBUTES.data_panel_id,IDS.system_panel);
        CONTROLS.SYSE.appendChild(b);
    }

    for(let l of LocationList){
        if(l == undefined) continue;
        let lb = generateBtn(l);
        CONTROLS.listItems[l] = lb;
        lb.classList.add(CSS_CLASSES.commodity);
        lb.classList.add(CSS_CLASSES.panel_item);
        lb.setAttribute(ATTRIBUTES.data_panel_id,IDS.location_panel);
        CONTROLS.LOCE.appendChild(lb);
    }

    CONTROLS.output.addEventListener("click",click_handler);
    CONTROLS.BACK.addEventListener("click", click_handler);

    //Nav buttons
    let navBtns = document.body.querySelectorAll("."+CSS_CLASSES.nav_btn);
    for(let b in navBtns){
        navBtns.item(b).addEventListener("click", click_handler);
    }

    //Panels
    let panels = document.body.querySelectorAll("."+CSS_CLASSES.panel);
    for(let b in panels){
        panels.item(b).addEventListener("click", click_handler);
    }

    //Default view
    let default_commodity = document.body.querySelectorAll("#Commodities .decorated-btn")[0];
    
    let default_selection = document.getElementById("Commodities");
    highlighted = default_commodity;
    current_view = { "panel": IDS.commodity_panel, "item": default_commodity.innerHTML };
    let defaultEvent = {};
    defaultEvent.target = default_commodity;
    defaultEvent.currentTarget = default_selection;
    defaultEvent.target.name = "default";

    // defaultEvent
    click_handler(defaultEvent);

};