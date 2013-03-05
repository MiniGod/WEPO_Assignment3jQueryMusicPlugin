//jquery implementation of audioplayer

(function($) {

	var html = '\
	<div>\
		<button class="prevSong" ></button>\
		<button class="play"></button>\
		<button class="nextSong"></button>\
		<button type="button" class="shuffle" /></button>\
		<button class="repeat"></button>\
		<meter class="progress" min="0" max="100" value="0"></meter><p class="songTime">0:00/0:00</p>\
	</div>\
	\
	<div>\
		<img src="volume.png" class="volumeIcon"></img>\
		<input type="range" class="volume" name="volume" min="0" value="100" max="100">\
	</div>\
	\
	<div class="playlist">\
	<h2>Playlist</h2>\
		<ul>\
			<li>SONGLIST</li>\
		</ul>\
	</div>';

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
			var root = $(this).addClass('audioPlayer').html(html);

			var player = $('<audio>');
			root.append(player);

			var state =
			{	playing: options.autoplay // Wether or not the player SHOULD be playing
			,	index: -1
			,	shuffle: options.shuffle
			,	repeat: options.repeat
			};
			
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

			var updatePlaylistUI = function() {
				// Create playlist
				var ul = root.find('.playlist ul').eq(0);
				ul.empty();

				var song;
				for (var i in playlist) {
					if (song = getSongAtIndex(i)) {
						var li = $('<li>').text(song.name).data('index', i).on('click', function() {
							playIndex($(this).data('index'));
							play();
						});

						ul.append(li);
					}
				}
			}

			
			/***********/
			/* ACTIONS */
			/***********/
			var play = function() {
				state.playing = true;
				player.get(0).play();
				root.find('.play').addClass("pause");
				
			}

			var pause = function() {
				state.playing = false;
				player.get(0).pause();
				root.find('.play').removeClass("pause");
			}

			var next = function() {

				var index = state.index;

				// Shuffle choice of next song
				if (state.shuffle) {
					var prevIndex = index;

					// Shuffle to an index other than it self (unless playlist size is 0)
					do {
						index += Math.floor(Math.random() * playlist.length);
						index %= playlist.length;
					} while (index == prevIndex && playlist.length > 1);
				}
				// Increase index unless its repeat-one
				else if (state.repeat != 1) {
					index++;

					// If repeat-playlist, then circle index
					if (state.repeat == 2)
						index %= playlist.length;
				}

				playIndex(index);
			}

			var prev = function() {
				var index = state.index;
				index += playlist.length - 1;
				index %= playlist.length;

				playIndex(index);
			}

			var repeat = function() {
				state.repeat++;
				state.repeat %= 3;

				// 0: off
				// 1: one
				// 2: all
				var states = [
					'repeatNone',
					'repeatOne',
					'repeatAll'
				];

				var el = root.find('.repeat');
				for (var i=0; i<3; i++) {
					if (i == state.repeat) el.addClass(states[i]);
					else el.removeClass(states[i]);
				}
			}

			var shuffle = function() {
				state.shuffle = !state.shuffle;
				if (state.shuffle)
					root.find('.shuffle').addClass("shuffleOn");
				else
					root.find('.shuffle').removeClass("shuffleOn");
			}

			// Gets or sets the volume - between 0 to 100
			var volume = function(vol) {
				if (vol) return player.get(0).volume = vol/100;
				return player.get(0).volume / 100;
			}

			var playIndex = function(index) {
				state.index = index;
				// If this index is "out of bounds", set index to 0, and stop it.
				// Happens if repeat is off
				var song = getSongAtIndex(state.index);
				if (!song) {
					state.index = -1;
					pause();
					return;
				}

				var lis = root.find('.playlist ul li')
					.removeClass('playing')
					.eq(index).addClass('playing');

				player.attr('src', song.url);

				if (state.playing) player.get(0).play();
			}

			/*****************/
			/* BUTTON EVENTS */
			/*****************/
			root.find('.play').on('click', function(e) {
				e.preventDefault();
				//The play button now plays/pauses
				if(state.playing == true)
					pause();
				else
					play();
			});

			root.find('.volume').on('change', function(e) {	
				var value = $(this).get(0).value;
				volume(value);
			});

			var clickEvents = [
				['.nextSong', next],
				['.prevSong', prev],
				['.repeat', repeat],
				['.shuffle', shuffle]
			];

			for (var i=0; i<clickEvents.length; i++) {
				root.find(clickEvents[i][0]).on('click', clickEvents[i][1]);
			}

			 

			/*****************/
			/* PLAYER EVENTS */
			/*****************/

			player.on('timeupdate', function(e) {
				// Update progress-bar
				var percent = (this.currentTime / this.duration) * 100;
				root.find('.progress').eq(0).attr('value', percent);

				// Update time counter
				var two = function(a) {
					return (a < 10) ? '0'+a : a;
				}, minutes, seconds, played, duration;
				
				minutes = Math.floor(this.currentTime / 60);
				seconds = Math.floor(this.currentTime % 60);
				played = [minutes, two(seconds)].join(':');

				minutes = Math.floor(this.duration / 60);
				seconds = Math.floor(this.duration % 60);
				duration = [minutes, two(seconds)].join(':');

				var songTime = [played, duration].join('/');
				if (songTime.indexOf('NaN')!==-1) songTime = '0:00/0:00';

				root.find('.songTime').text(songTime);
			});

			player.on('ended', next);

			// @TODO: Might go into a infinite loop/cycle through the playlist if every song gives error...
			player.on('error', next);

			/***************/
			/***************/
			
			// Update repeat button (ugly)
			state.repeat--;
			repeat();

			// Update shuffle button (ugly again)
			state.shuffle = !state.shuffle;
			shuffle();

			// Update playlist
			updatePlaylistUI();
			// Load first song into <audio>
			next();
		});
	};
})(jQuery);