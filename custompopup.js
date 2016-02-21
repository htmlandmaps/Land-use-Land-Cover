/**
 * A template for a Tab Module JS file for MD iMap, implementing dojo AMD and _TemplatedMixin
 * Created by ssporik on 10/20/2014.
 */
define(["dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/dom-construct", "dojo/on"
        , "dijit/registry", "dojo/_base/lang", "dojo/dom", "dojo/_base/array", "dojo/number"
        , "esri/dijit/Popup", "esri/dijit/PopupTemplate", "esri/layers/FeatureLayer", "esri/dijit/InfoWindow", "esri/InfoTemplate"
        , "../../core/utilities/maphandler", "c3/c3", "dojo/_base/window", "esri/tasks/QueryTask","esri/tasks/query",],
    function(declare, WidgetBase, TemplatedMixin, domConstruct, on
        , registry, lang, dom, arrayUtils, number
        , Popup, PopupTemplate, FeatureLayer, InfoWindow, InfoTemplate
        , mapHandler, c3, win, QueryTask, Query){

        return declare([], {
            // The template HTML fragment (as a string, created in dojo/text definition above,
            // should reference an html file saved in this module directory.)
            templateString: null
            // The CSS class to be applied to the root node in our template
            , baseClass: ""
            // The ESRI map object
            , Map: null
            , webMap: null
            , AppConfig: null
            //  Generic temp property for flexible use.
            , temp: null

            // Creates the content pane.
            , constructor: function (args) {

                // safeMixin automatically sets the properties above that are passed in from the tabmanager.js
                //declare.safeMixin(this, args);

                //singleton object that you can require above and use to get a reference to the map.
                this.Map = mapHandler.map;
                //this.map = args.Map;
            }

            /* Standard module event handlers. In the postcreate and startup handlers,
             * you can assume the module has been created.  You don't need to add a handler function
             * if you are not writing code in it.*/

            //The widget has been added to the DOM, though not visible yet. This is the recommended
            // place to do most of the module's work
            , postcreate: function () {
                this.inherited(arguments);
            }

            , startup: function () {
                this.inherited(arguments);

                //create custom popups on feature layers added to the map

                //-----------LULC popup---------------------------------------------------------------------------------------------------------
                
                // Use the info window instead of the popup.
				
				
                var infoWindow = new InfoWindow(null, domConstruct.create("div"));
                infoWindow.startup();
				
		//only show lulc pop up if lulc 1973 or 2010 map is currently selected
		
	
					
					console.log("Show LULC stacked column pop up");
                this.Map.infoWindow.resize(475, 475);

                //infotemplate
                var infoTemplate = new InfoTemplate();
                infoTemplate.setTitle("County: ${COUNTY}");
                infoTemplate.setContent(this.getc3Chart);


                var counties = new FeatureLayer("http://geodata.md.gov/imap/rest/services/PlanningCadastre/MD_LandUseLandCover/MapServer/0", {
                     mode: FeatureLayer.MODE_ONDEMAND,
                     infoTemplate: infoTemplate,
                     outFields: [
                        "COUNTY", "devac73", "devac10", "Ag73", "Ag10", "For73", "For10", "Ag02", "For02", "DevAc02", "ot73", "ot02", "ot10"
                     ]
                });

                // -----add new feature layers to the map --------------------------------------------------------------------------------------------------------
                this.Map.addLayer(counties);
			
			//remove chart after close first popup - MIO
			 function close () 
			 {
			console.log("map loaded"); 
			var exitPopup = document.querySelector("div.titleButton.close");
			exitPopup.addEventListener("click", function() {
		   console.log("closed pop up");
		   //check if previous hidden exists
		   
		   //find first page of popup and see if it exists
		   var firstPopup = document.querySelector("div.titleButton.prev.hidden");
			if (firstPopup){
			console.log("user closed popup on first popup page");
			//g.c3-axis
			document.querySelector(".c3-axis").style.visibility = "hidden";
					document.querySelector(".c3-axis-y").style.visibility = "hidden";
			//g.c3-legend-item
			document.querySelector("g.c3-legend-item.c3-legend-item-data1").style.visibility = "hidden";
			document.querySelector("g.c3-legend-item.c3-legend-item-data2").style.visibility = "hidden";
			document.querySelector("g.c3-legend-item.c3-legend-item-data3").style.visibility = "hidden";
			document.querySelector("g.c3-legend-item.c3-legend-item-data4").style.visibility = "hidden";
			document.querySelector("rect.c3-legend-item-event").style.visibility="hidden";
			}   
		})	  
			 }
		  window.addEventListener('load', close, false);  
			//remove chart after close first popup  - MIO
			
			
			
			}

            , getc3Chart: function(graphic) {
				
                console.log("in get c3 stacked chart content function");
                console.info(graphic);

                // Show land use types totals by year
                var total73 = graphic.attributes.Ag73 + graphic.attributes.devac73 + graphic.attributes.For73 + graphic.attributes.ot73;
                var total02 = graphic.attributes.Ag02 + graphic.attributes.DevAc02 + graphic.attributes.For02 + graphic.attributes.ot02;
                var total10 = graphic.attributes.Ag10 + graphic.attributes.devac10 + graphic.attributes.For10 + graphic.attributes.ot10;

                //show percentages totals by year*********************

                //1973
                var ag1973p = number.round(graphic.attributes.Ag73 / total73 * 100, 2);
                var forest1973p = number.round(graphic.attributes.For73 / total73 * 100, 2);
                var dev1973p = number.round(graphic.attributes.devac73 / total73 * 100, 2);
                var ot1973p = number.round(graphic.attributes.ot73 / total73 * 100, 2);

                //2002
                var ag2002p = number.round(graphic.attributes.Ag02 / total02 * 100, 2);
                var forest2002p = number.round(graphic.attributes.For02 / total02 * 100, 2);
                var dev2002p = number.round(graphic.attributes.DevAc02 / total02 * 100, 2);
                var ot2002p = number.round(graphic.attributes.ot02 / total02 * 100, 2);


                //2010
                var ag2010p = number.round(graphic.attributes.Ag10 / total10 * 100, 2);
                var forest2010p = number.round(graphic.attributes.For10 / total10 * 100, 2);
                var dev2010p = number.round(graphic.attributes.devac10 / total10 * 100, 2);
                var ot2010p = number.round(graphic.attributes.ot10 / total10 * 100, 2);

                //land use variables

                //1973
                var ag1973 = graphic.attributes.Ag73;
                var forest1973 = graphic.attributes.For73;
                var dev1973 = graphic.attributes.devac73;
                var ot1973 = graphic.attributes.ot73;

                //2002
                var ag2002 = graphic.attributes.Ag02;
                var forest2002 = graphic.attributes.For02;
                var dev2002 = graphic.attributes.DevAc02;
                var ot2002 = graphic.attributes.ot02;

                //2010
                var ag2010 = graphic.attributes.Ag10;
                var forest2010 = graphic.attributes.For10;
                var dev2010 = graphic.attributes.devac10;
                var ot2010 = graphic.attributes.ot10;
				
				
				
		  		  //to fix counties
					var clabelField = "COUNTY";
						 // create a feature layer to show country boundaries
        var countyUrl = "http://geodata.md.gov/imap/rest/services/PlanningCadastre/MD_LandUseLandCover/MapServer/0";
        var county1 = new FeatureLayer(countyUrl, {
          id: "COUNTY",
          outFields: [clabelField]
        });
					
						//var searchField = args.field;
                //querytask to get the features and create the data store
                var queryTask = new QueryTask(countyUrl);
                var query = new Query();
                query.returnGeometry = true;
				query.outSpatialReference = new esri.SpatialReference({wkid : 102100}); 
                query.outFields = [clabelField];
                query.where = graphic.attributes.COUNTY;
				console.log(query); 
		  

				var n;
					//for counties with apostrophe
					//remove it
						if (graphic.attributes.COUNTY.indexOf("'") > -1) {
					console.log("county has apostrophe");
				
				query.where =  graphic.attributes.COUNTY.replace("'s", "");
						 
			console.log(query);
			console.log(query.where);
			//graphic.attributes.COUNTY = query.where;
			console.log(graphic.attributes.COUNTY);
			
			
	 n = domConstruct.place("<div class='pdf'><center><b>Land Use Change</b><br><br><a href='http://mdpgis.mdp.state.md.us/landuse/pdfs/" + query.where + "s.pdf' target='_blank'>View Detailed Chart (PDF)</a></center><br><div class='d3Pop1'></div></div>", win.body());

				}	
				
				//counties with no apostrophe
				else {
				console.log("no apostrophe")
				 n = domConstruct.place("<div class='pdf'><center><b>Land Use Change</b><br><br><a href='http://mdpgis.mdp.state.md.us/landuse/pdfs/" + graphic.attributes.COUNTY + ".pdf' target='_blank'>View Detailed Chart (PDF)</a></center><br><div class='d3Pop1'></div></div>", win.body());
				}				
				//to fix counties

                //c3 chart
                var chart = c3.generate({
                    bindto: '.d3Pop1',
                    size: {
                        height: 240,
                        width: 450
                    },
                    data: {
                        columns: [
                            ['data1', dev1973p, dev2002p, dev2010p],   //developed lands
                            ['data2', ag1973p, ag2002p, ag2010p ],  //agriculture
                            ['data3', forest1973p , forest2002p, forest2010p ],   //forest
                            ['data4', ot1973p, ot2002p, ot2010p]   //other
                        ],
                        names: {
                            data1: 'Developed Lands',
                            data2: 'Agriculture',
                            data3: 'Forest',
                            data4: 'Other Resource Lands'
                        },
                        type: 'bar',
                        groups: [
                            ['data1', 'data2', 'data3', 'data4']
                        ],
                        order: null,   // stack order by data definition,
                        colors: {
                            data4: '#287acc',   //blue
                            data3: '#9fbf7f',    //green
                            data2: '#ffffb2',    //yellow
                            data1:'#b30000'  //red
                        }
                    },
                    tooltip: {
                        show: true,
                        format: {
                            //title: function (d) { return 'Data ' + d; },
                            name: function(name, ratio, id, index) {
                                //console.log(name);
                                return name;
                            },
                            value: function (value, ratio, id) {
                                //console.log(value);
                                //console.log(ratio);
                                //console.log(id);

                                var show = [id, value];
                                //console.log(value);
                                return value + "%";
                            }}
                    },
                    grid: {
                        y: {
                            lines: [{value:0}]
                        }
                    },
                    axis: {
                        x: {
                            type: 'category',
                            categories: ['1973', '2002', '2010'],
                            label: 'Year'
                        },
                        y: {
                            max: 100,
                            min: 0,
                            // Range includes padding, set 0 if no padding needed
                            padding: {top:0, bottom:0},
                            label: 'Percentage (%)'
                        }
                    }
                });

                return n;
		},

        })
    }
);