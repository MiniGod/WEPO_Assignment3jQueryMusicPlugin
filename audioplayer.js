//jquery implementation of audioplayer

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
				$('#play').removeClass("pause");
			}

			var pause = function() {
				state.playing = false;
				player.get(0).pause();
				$('#play').addClass("pause");
			}

			var next = function() {
				state.index++;
				state.index %= playlist.length;

				var url = playlist[state.index];

				player.attr('src', url);

				if (state.playing) player.get(0).play();
			}

			//Previous song, but doesn't cycle backwards, only goes to the first one
			var prev = function() {
				state.index--;
				state.index %= playlist.length;

				var url = playlist[state.index];

				player.attr('src', url);

				if (state.playing) player.get(0).play();
			}


			// Gets or sets the volume - 0 to 100
			var volume = function(vol) {
				if (vol) return player.get(0).volume = vol/100;
				return player.get(0).volume / 100;
			}

			// need to implement the loop() command to loop song.

			/*****************/
			/* BUTTON EVENTS */
			/*****************/
			$(this).find('#play').on('click', function(e) {
				e.preventDefault();
				//The play button now plays/pauses
				if(state.playing == true)
				{
					pause();	
				}
				else
				{
					play();
					
				}

			});

			$(this).find('#nextSong').on('click', function(e) {	
				e.preventDefault();
				next();
			});

			$(this).find('#prevSong').on('click', function(e) {	
				e.preventDefault();
				prev();
			});

			//Volume control implementation, maybe a jquery slider is more suitable
			$(this).find('#volume').on('change', function(e) {	
				var value = $(this).get(0).value;
				volume(value);
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