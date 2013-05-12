(function( $ ) {

	//Default settings
	var settings = {
			"rows": 3,
      		"cols": 3,
      		"minCellWidth": "30px",
      		"minCellHeight": "30px",
      		"maxCellWidth": "510px",
      		"maxCellHeight": "510px",
      		"cellWidth": 0,
      		"cellHeight": 0,
      		"animate": true,
      		"duration": 400,
      		"easing": "swing",
      		"callbacks": null
		};

	var lastPos = {"r":0, "c":0};

	$.fn.awesomeGrid = function(options) {
  	
	  	//Default options
    	settings = $.extend(settings,options);
	   
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
	   	var getCellSize = true;

	   	//Create first row for status array
	   	cells.each(function (){	

	   		//Get cell size and safe into settings
	   		if (getCellSize) {
	   			settings.cellWidth = $(this).css("width");
	   			settings.cellHeight = $(this).css("height");
	   			getCellSize = false;
	   		}

	   		//Check if the columns are finished
			if (c > settings.cols) {
				c = 1;
				r++;
			}

			//Set ID
	   		$(this).attr("id", "ag_"+r+"_"+c);

	   		//Set callback
	   		$(this).click(function (){
	   			toggleCell($(this));
	   		});

	   		c++;
	   	});
	};

	function toggleCell(obj) {

		//Get cell status
		var pos = getCellPosition(obj);


		//Always restore grid to init status
		//With or withour animation
		if (settings.animate) {
			restoreElementsAnimated(obj);
		} else {
			restoreElements(obj);
		}

		//Enlarge or restore depending on cell status
		if (lastPos.r == pos.r && lastPos.c == pos.c) {

			//Initialize variable because all cells are at init status
			lastPos = {"r":0, "c":0};
			executeCellCallback("restore", pos);
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
		for (i=1; i<=settings.cols; i++) {

			if (i != pos.c) {
				$("div[id^='ag_"+pos.r+"_"+i+"']").animate({"width": settings.minCellWidth, "height": settings.maxCellHeight}, settings.duration, settings.easing);
			}
		}

		//Set new size of clicked cell
		$("#ag_"+pos.r+"_"+pos.c).animate({"width": settings.maxCellWidth, "height": settings.maxCellHeight}, settings.duration, settings.easing);	
		
		//Walk through the other rows and cells
		for (i=1; i<=settings.rows; i++) {

			if (i != pos.r) {
				$("div[id^='ag_"+i+"']").animate({"height": settings.minCellHeight}, settings.duration, settings.easing);
			}
		}

		
	}

	//Restores all elements to the original size
	function restoreElements (obj) {
		$("[id^='ag_']").css("width", settings.cellWidth);
		$("[id^='ag_']").css("height", settings.cellHeight);
	}

	//Restores elements using animeted function
	function restoreElementsAnimated (obj) {
		$("[id^='ag_']").animate({"width": settings.cellWidth, "height": settings.cellHeight}, settings.duration, settings.easing);
	}
	//Returns grid position as an object
	function getCellPosition(obj) {
		var idString = obj.attr("id");

		var idArray = idString.split("_");

		return {"r": idArray[1], "c": idArray[2]};
	}

	//Execute cell function callback
	function executeCellCallback (type,pos) {
		var fn = settings[type+"_callback_"+pos.r+"_"+pos.c];

		if (fn) {
			fn.apply();
		}
   	}


})( jQuery );