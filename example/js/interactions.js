function reset_grid () {
	$("#ag_1_1 > p").show();
}

function hide_text_1_1() {
	$("#ag_1_1 > p").hide();
}

function change_color(id,color) {
	$("#"+id).css("background-color", color);
}

function resize_callback(pos) {
	var pos_str = pos.r+"_"+pos.c;
	hide_text_1_1();
	switch (pos_str) {
		
		case "1_2":
			change_color("ag_1_2", "#FFFFFF");
			break;
		default:
			break;
	}
}

function restore_callback(pos) {
	reset_grid();
}