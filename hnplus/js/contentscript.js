/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
var HNPlus = function() {

	/**
	 * Implements keyboard shortcuts for the current page.
	 */
	var keyboardShortcuts = function() {

		/**
		 * Returns a story Object given corresponding DOM.
		 *
		 * @param domElement The DOM Element corresponding to the story.
		 * @return Correspoding story Object.
		 */
		var story = function(row1, row2, row3) {
			var isSelected = false;
			var url = (typeof row1.find("td:last-child a").attr("href") === "undefined") ?
					row2.find("td:last-child a").attr("href") : row1.find("td:last-child a").attr("href");
			/**
			 * Selects the story.
			 */
			var selectStory = function() {
				if (isSelected) {
					return;
				}
				isSelected = true;

				row1.addClass("selected");
				row1.addClass("top");
				row2.addClass("selected");
				row2.addClass("bottom");

				var offset = row1.offset().top - $(window).scrollTop();
				if((offset > window.innerHeight) || (offset < 0)){
					$('html, body').animate({
							scrollTop: row1.offset().top
						}, { queue: false, duration: 600});
				}
			};

			/**
			 * Deselects the story.
			 */
			var deselectStory = function() {
				if (!isSelected) {
					return;
				}
				isSelected = false;
				row1.removeClass("selected");
				row1.removeClass("top");
				row2.removeClass("selected");
				row2.removeClass("bottom");
			};
			return {
				select : selectStory,
				deselect : deselectStory,
				isSelected : function() {
					return isSelected;
				},
				openHere : function() {
					window.location = url;
				},
				openInNew : function() {
					window.open(url);
				}
			}
		};

		var stories = [];
		var currentlySelected = -1;

		/**
		 * Deselects the previous story, selects the new one.
		 *
		 * @param newIndex Index of the new story to be selected.
		 */
		var selectElement = function(newIndex) {
			if (newIndex == currentlySelected) {
				return;
			}
			stories[currentlySelected].deselect();
			stories[newIndex].select();
			currentlySelected = newIndex;
		}

		/**
		 * Select the story that comes prior to the current story
		 *
		 */
		var selectPrevious = function() {
			if (currentlySelected == 0) {
				return;
			}
			selectElement(currentlySelected - 1);
		}

		/**
		 * Select the story that comes after to the current story
		 *
		 */
		var selectNext = function() {
			if (currentlySelected == stories.length - 1) {
				return;
			}
			selectElement(currentlySelected + 1);
		}

		/**
		 * Selects the first story.
		 */
		var selectFirst = function() {
			selectElement(0);
		}

		/**
		 * Selects the last story.
		 */
		var selectLast = function() {
			selectElement(stories.length - 1);
		}

		/**
		 * Open Story in the current Tab.
		 */
		var openStoryHere = function() {
			stories[currentlySelected].openHere();
		}

		/**
		 * Open Story in the a New Tab.
		 */
		var openStoryInNew = function() {
			stories[currentlySelected].openInNew();
		}

		/**
		 * Parses DOM to get an array of story Objects.
		 */
		var parseStories = function () {
			var rowElements = [];
			$("table").each(function(index) {
				if (index != 2) {
					return;
				}
				$(this).find("tr").each(function () {
					rowElements.push($(this));
					$(this).addClass("genericRow");
					// $(this).text();
				});
			});
			for (var i = 0; i < rowElements.length / 3; i++) {
				stories.push(story(rowElements[3 * i], rowElements[3 * i + 1], rowElements[3 * i + 2]));
			}
			stories[0].select();
			currentlySelected = 0;

			// Register events.
			$(document).bind("keydown", "k", selectPrevious);
			$(document).bind("keydown", "j", selectNext);
			$(document).bind("keydown", "home", selectFirst);
			$(document).bind("keydown", "end", selectLast);
			$(document).bind("keydown", "m", openStoryHere);
			$(document).bind("keydown", "n", openStoryInNew);
			$(document).bind("keydown", "return", openStoryHere);
			$(document).bind("keydown", "shift+return", openStoryInNew);
		};

		parseStories();
	};

	/**
	 * Checks if the string starts with any of the given prefixes.
	 *
	 * @param string String to be searched.
	 * @param prefixes Array of string prefixes.
	 * @return True if string starts with any of the prefixes, false otherwise.
	 */
	var hasPrefix = function (string, prefixes) {
		for (var id in prefixes) {
			if (string.indexOf(prefixes[id]) == 0) {
				return true;
			}
		}
		return false;
	};


	/**
	 * Initiate operations: Keyboard Shortcuts etc.
	 */
	var initate = function() {
		var pathname = window.location.pathname;

		// Keyboard shortcuts.
		var prefixes = [ "", "/news", "/newest", "/x"];
		if (hasPrefix(pathname, prefixes)) {
			// Operations for news pages.
			keyboardShortcuts();
		}
	};

	$(document).ready(function () {
		initate();
	});
} ();

