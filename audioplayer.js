(function($) {
	var defaultOptions = {
		'autoplay': false,
		'repeat': false
	};

	$.fn.musicPlayer = function(playlist, options) {
		options = $.extend({}, defaultOptions, options);

		// `this` is an array of elements
		return this.each(function() {
			// ´this´ is now one of the elements

			var player = $('<audio>');
			$(this).append(player);

			var state =
			{	playing: options.autoplay // Wether or not the player SHOULD be playing
			,	index: -1
			,	url: ''
			,	volume: 100
			,	time: 0
			,	duration: 0
			}

			/***********/
			/* ACTIONS */
			/***********/
			var play = function() {
				state.playing = true;
				player.get(0).play();
			}

			var pause = function() {
				state.playing = false;
				player.get(0).pause();
			}

			var next = function() {
				state.index++;
				state.index %= playlist.length;

				var url = playlist[state.index];

				player.attr('src', url);

				if (state.playing) player.get(0).play();
			}

			/*****************/
			/* BUTTON EVENTS */
			/*****************/
			$(this).find('#play').on('click', function(e) {
				e.preventDefault();
				play();
			});

			$(this).find('#stop').on('click', function(e) {
				e.preventDefault();
				pause();
			});

			$(this).find('#nextSong').on('click', function(e) {	
				e.preventDefault();
				next();
			});

			/*****************/
			/* PLAYER EVENTS */
			/*****************/

			player.on('timeupdate', function(e) {
				var percent = (this.currentTime / this.duration) * 100;
				$('#progress').eq(0).attr('value', percent);
			});

			// Loads the first song into the <audio> tag
			next();
		});
	};
})(jQuery);