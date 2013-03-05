//jquery implementation of audioplayer

(function($) {
	var defaultOptions = {
		'autoplay': false,
		'repeat': 0, // 0: Off, 1: Repeat One, 2: Repeat Playlist
		'shuffle': false
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
			,	shuffle: options.shuffle
			,	repeat: options.repeat
			}

			
			/********************/
			/* HELPER FUNCTIONS */
			/********************/
			var getSongAtIndex = function(i) {
				if (i<0 || i>playlist.length-1)
					return false;

				var song = playlist[i];

				// If song is a URL, try to parse out the name
				if (typeof song == 'string') {
					var name = song.substring(song.lastIndexOf('/')+1);
					name = decodeURIComponent(name);

					return {
						url: song,
						name: name
					};
				}
				// Otherwise, expect it to be an object
				else {
					return song;
				}
			}

			
			/***********/
			/* ACTIONS */
			/***********/
			var play = function() {
				state.playing = true;
				player.get(0).play();
				$('#play').addClass("pause");
				
			}

			var pause = function() {
				state.playing = false;
				player.get(0).pause();
				$('#play').removeClass("pause");
			}

			var next = function() {

				// Shuffle choice of next song
				if (state.shuffle) {
					var prevIndex = state.index;

					// Shuffle to an index other than it self (unless playlist size is 0)
					do {
						state.index += Math.floor(Math.random() * playlist.length);
						state.index %= playlist.length;
					} while (state.index == prevIndex && playlist.length > 1);
				}
				// Increase index unless its repeat-one
				else if (state.repeat != 1) {
					state.index++;

					// If repeat-playlist, then circle index
					if (state.repeat == 2)
						state.index %= playlist.length;
				}

				// If this index is "out of bounds", set index to 0, and stop it.
				// Happens if repeat is off
				if (state.index > playlist.length-1) {
					state.index = -1;
					stop();
					return;
				}

				var url = getSongAtIndex(state.index).url;

				player.attr('src', url);

				if (state.playing) player.get(0).play();
			}

			var prev = function() {
				state.index += playlist.length - 1;
				state.index %= playlist.length;

				var url = getSongAtIndex(state.index).url;

				player.attr('src', url);

				if (state.playing) player.get(0).play();
			}


			// Gets or sets the volume - between 0 to 100
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