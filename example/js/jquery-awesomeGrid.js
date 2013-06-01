(function( $ ) {

	//Default settings
	var settings = {
			"gridDef": null,
      		"animate": true,
      		"duration": 400,
      		"easing": "swing",
      		"resize_callback": null,
      		"restore_callback": null
		};

	var lastPos = {"r":0, "c":0};

	var gridProperties = new Array(); //Cotains arrays of objects with cells properties

	var gridDefinition = null;

	$.fn.awesomeGrid = function(options) {

	  	//Default options
    	settings = $.extend(settings,options);

    	//Assign gridDefinition to a global variable (just to simplify de code)
    	gridDefinition = settings.gridDef;
	   
	   	//Get grid width and height
	   	var width = this.css("width");
	   	var height = this.css("height");

	   	//Get cell width and height
	   	if (!height) {
	   		height = width;
	   	}

	   	settings = $.extend(settings, {"width":width, "height":height});

	   	var cells = this.children(".grid_cell");

	   	var r = 1;
	   	var c = 1;

	   	//Create first row for status array

	   	gridProperties[r] = new Array();

	   	cells.each(function (){

	   		//Check if the columns are finished
			if (c > gridDefinition[r].cells) {
				c = 1;
				r++;
				gridProperties[r] = new Array();
			}

			//Get cell size and safe into gridProperties
	   		var width = $(this).css("width");
			var height = $(this).css("height");

	   		gridProperties[r][c] = {"width": width, "height": height};			

			//Set ID
	   		$(this).attr("id", "ag_"+r+"_"+c);

	   		//Set callback only if cell enabled
	   		if (jQuery.inArray(c, gridDefinition[r].disabled_cells) < 0) {

	   			//The cell IS NOT in disabled array so we hook the callback
	   			$(this).click(function (){
	   				toggleCell($(this));
	   			});
	   		}

	   		c++;
	   	});
	};

	function toggleCell(obj) {

		//Get cell status
		var pos = getCellPosition(obj);


		//Always restore grid to init status
		//With or withour animation
		//Always execute resotre callback if any
		executeCellCallback("restore", pos);
		if (settings.animate) {

			restoreElementsAnimated();
		} else {
			restoreElements();
		}

		//Enlarge or restore depending on cell status
		if (lastPos.r == pos.r && lastPos.c == pos.c) {

			//Initialize variable because all cells are at init status
			lastPos = {"r":0, "c":0};
		} else {
			
			//Resize elements with or without animation
			if (settings.animate) {
				resizeElementsAnimated(obj);
			} else {
				resizeElements(obj);
			}

			lastPos = pos;
			executeCellCallback("resize", pos);
		}
	}

	//Resizes grid elements
	function resizeElements(obj) {
		
		var pos = getCellPosition(obj);

		$("div[id^='ag_"+pos.r+"']").css("width", settings.minCellWidth);
		$("div[id^='ag_"+pos.r+"']").css("height", settings.maxCellHeight);

		//Walk through the other rows
		for (i=1; i<=settings.rows; i++) {

			if (i != pos.r) {
				$("div[id^='ag_"+i+"']").css("height", settings.minCellHeight);
			}
		}

		$("#ag_"+pos.r+"_"+pos.c).css("width", settings.maxCellWidth);
		$("#ag_"+pos.r+"_"+pos.c).css("height", settings.maxCellHeight);
	}

	//Reizes the cells with an animation
	function resizeElementsAnimated (obj) {
		var pos = getCellPosition(obj);

		/*
		*	The order of animate function is very important in not the animation is not fluent
		*/

		//First set new size for cells in the same row
	   	var cols = gridDefinition[pos.r].cells;

	   	for (i=1; i<=cols; i++) {
	   		
	   		var width = gridDefinition[pos.r].minCellWidth;
	   		var height = gridDefinition[pos.r].maxCellHeight;

			if (i != pos.c) {
				$("div[id^='ag_"+pos.r+"_"+i+"']").animate({"width": width, "height": height}, settings.duration, settings.easing);
			}
		}


		//Set new size of clicked cell
		var maxCellWidth = gridDefinition[pos.r].maxCellWidth;
		var maxCellHeight = gridDefinition[pos.r].maxCellHeight;

		$("#ag_"+pos.r+"_"+pos.c).animate({"width": maxCellWidth, "height": maxCellHeight}, settings.duration, settings.easing);	
		
		//Iterate through the other rows and cells
		var rows = gridDefinition.length;

		for (i=1; i<rows; i++) {
			
			var height = gridDefinition[i].minCellHeight;

			if (i != pos.r) {
				$("div[id^='ag_"+i+"']").animate({"height": height}, settings.duration, settings.easing);
			}
		}
	}

	//Restores all elements to the original size
	function restoreElements () {
		$("div[id^='ag_']").css("width", settings.cellWidth);
		$("div[id^='ag_']").css("height", settings.cellHeight);
	}

	//Restores elements using animeted function
	function restoreElementsAnimated () {

	   	var rows = gridDefinition.length;

	   	for (i=1; i<rows; i++) {

	   		var cols = gridDefinition[i].cells;
	
			for (j=1; j<=cols; j++) {
	   	
				var cellProperties = gridProperties[i][j];

	   			$("#ag_"+i+"_"+j).animate({"width": cellProperties.width, "height": cellProperties.height}, settings.duration, settings.easing);

	   		}
	   	}
	}

	//Returns grid position as an object
	function getCellPosition(obj) {
		var idString = obj.attr("id");

		var idArray = idString.split("_");

		return {"r": idArray[1], "c": idArray[2]};
	}

	//Execute cell function callback
	function executeCellCallback (type,pos) {

		var args = [pos];

		if (type == "resize") {
			if (settings.resize_callback) {
				settings.resize_callback.apply(null, args);
			}
		} else {
			if (settings.restore_callback) {
				settings.restore_callback.apply(null, args);
			}
		}
   	}


})( jQuery );