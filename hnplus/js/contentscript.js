/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */

var HandleJAFPages = function() {
	$.tablesorter.addParser({ 
		// set a unique id 
		id: 'jafDates', 
		is: function(s) { 
				// return false so this parser is not auto detected 
				return false; 
		}, 
		format: function(s) { 
				// format your data for normalization
				var data = s.split("-");
				return data[2] + data[1] + data[0]; 
		}, 
		// set type, either numeric or text 
		type: 'numeric' 
	}); 
	var extraTables = $("<table width='100%' class='meta'></table>" +
	  	"<div class='buttons'></div>" +
			"<table width='100%' class='jafData'><thead><tr></tr></thead><tbody></tbody></table>" +
			"<table width='100%' class='meta2'></table>");
	$("table").attr('class', 'old');
	$("table.old").before(extraTables);
	var metaMoveCount = 0;
	var headingMoved = false;
	$("table.old tr").each(function() {
		var tdCount = $(this).find("td").length;
		if (tdCount !== 13) {
			$(this).detach();
			if (metaMoveCount < 5) {
				$("table.meta").append($(this));	
			} else {
				$("table.meta2").append($(this));	
			}
			metaMoveCount++;
		} else {
			// Find if "Not Eligible!!" JAF
			var notEligible = $(this).text().indexOf("Not Eligible!!") !== -1;
			var isClosed = $(this).text().indexOf("Jaf Closed") !== -1;
			var signedAleady = $(this).text().indexOf("signed (click to unsign)") !== -1;
			if (headingMoved) {
				if (notEligible) {
					$(this).addClass("notEligible");	
				} else if (signedAleady) {
					$(this).addClass("signedAlready");
				} else if (isClosed) {
					$(this).addClass("jafClosed");
				}
				$("table.jafData tbody").append($(this));
			} else {
				// Move into heading
				$(this).find("td").each(function() {
					var th = $("<th>" + $(this).html() + "</th>");
					$("table.jafData thead tr").append(th);
				})
				headingMoved = true;
			}
		}
	});
	// Make THEAD and TBODY
	
	$("table.jafData").tablesorter({
		sortList: [[7,0]],
		cssAsc: "customHeaderSortUp",
		cssDesc: "customHeaderSortDown",
		cssHeader: "customHeader",
		//debug: true,
		headers: {
			7: {
				sorter: "jafDates"
			}
		}
	});
	var notEligibleVisible = false;
	var signedVisible = true;
	var showClosedJafs = false;
	if (!notEligibleVisible) {
		$("tr.notEligible").slideUp();
	}
	if (!signedVisible) {
		$("tr.signedAleady").slideUp();
	}
	if (!showClosedJafs) {
		$("tr.jafClosed").slideUp();
	}
	$("div.buttons").append($("<button>Show Not Eligible</button>").click(function() {
		if (notEligibleVisible) {
			$("tr.notEligible").slideUp();
			$(this).html("Show Not Eligible");
			notEligibleVisible = false;
		} else {
			$("tr.notEligible").slideDown();
			$(this).html("Hide Not Eligible");
			notEligibleVisible = true;
		}
	}));
	$("div.buttons").append($("<button>Show Closed JAFs</button>").click(function() {
		if (showClosedJafs) {
			$("tr.jafClosed").slideUp();
			$(this).html("Show Closed JAFs");
			showClosedJafs = false;
		} else {
			$("tr.jafClosed").slideDown();
			$(this).html("Hide Closed JAFs");
			showClosedJafs = true;
		}
	}));
	
	$("div.buttons").append($("<button>Hide Signed</button>").click(function() {
		if (signedVisible) {
			$("tr.signedAlready").slideUp();
			$(this).html("Show Signed");
			signedVisible = false;
		} else {
			$("tr.signedAlready").slideDown();
			$(this).html("Hide Signed");
			signedVisible = true;
		}
	}));
	
}

function DoPlacementAwesomeness(data) {
	
	$(document).ready(function() {
		var pathname = window.location.pathname;
		if ((pathname === "/placements/studjaf4stud.jsp") ||
				(pathname === "/placements/studsign2.jsp") ||
				(pathname === "/placements/studunsign2.jsp")) {
			// All JAFs Page
			HandleJAFPages();
		} else if (pathname.indexOf("studjafview.jsp") !== -1) {
			// JAF View Page
			$("body").addClass("jafView");
		}
	});
}
DoPlacementAwesomeness();

