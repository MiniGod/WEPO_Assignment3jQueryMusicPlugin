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
			}

			var pause = function() {
				state.playing = false;
				player.get(0).pause();
			}
			//Im basically recycling much of your code, in everything.
			var stop = function() {
				state.playing = false;
				player.get(0).stop();
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
			//unfinished
			var volume = function() {
				player.get(0).volume();
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
			//stop() is a should stop all <audio> doesn't work, i'm an idiot :) We actually dont have to implement this.
			$(this).find('#stop').on('click', function(e) {
				e.preventDefault();
				stop();
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
			//no idea how to do this --->(o.o)<<
			$(this).find('#volume').on('click', function(e) {	
				var value = $("#volume").attr("value");
				this.volume = value;
       		 	
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