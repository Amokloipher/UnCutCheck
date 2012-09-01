var config = {
		database				:	{
			name			:	'films',
			description		:	'Your Movies Storage',
			version			:	'1.0',
			size			:	20000,
			MoviesTable		:	'movieshelf',
			modes			:	{
				shelf		:	'shelf',
				wishlist	:	'wishlist',
				current		:	''
			}
		}
};

var UncutCheckR	=	{
		database		:	{
			db					:	{},
			
			initializeDatabase	:	function(){
				console.log('[database] start init');
				
				UncutCheckR.database.db = window.sqlitePlugin.openDatabase(
													config.database.name, 
													config.database.version,
													config.database.description, 
													config.database.size);
				console.log('[database] db created');
				this.db.transaction(function(tx){
					tx.executeSql('CREATE TABLE IF NOT EXISTS '+config.database.MoviesTable+' (ean text primary key, title text, fsk text, cut text, indexed text, time text, mode text)'
							,[],
							function(tx, rs){
								console.log('[database] db initialized');
							},function(error){
								console.log('[database] Error creating table: '+config.database.MoviesTable);
							});
				});
			},
			clearDatabase		:	function(){
				this.db.transaction(function(tx){
					tx.executeSql('DROP TABLE IF EXISTS '+config.database.MoviesTable, [],
							function(tx, rs){
								console.log('[database] Dropped table '+ config.database.MoviesTable);
							},function(error){
								console.log('[database] Error dropping table '+ config.database.MoviesTable + ' - ' + error.message);
							});
				});
			},
			getMovie			:	function(ean, mode, successCB, errorCB){
				this.db.transaction(function(tx){
					tx.executeSql("SELECT * FROM "+ config.database.MoviesTable + " WHERE ean='"+ ean +"'", [], successCB, errorCB);
				});
				
			},
			getMovieList		:	function(mode, successCB, errorCB){
				console.debug('[database] getting Movies List in Mode: '+mode);
				this.db.transaction(function(tx){
					tx.executeSql("SELECT * FROM "+ config.database.MoviesTable +" WHERE mode='"+mode+"'", [], successCB, errorCB);
				});
			},
			addMovie			:	function(movie, successCB, errorCB){
				this.db.transaction(function(tx){
//					var moviesArray = movie.toArray();
					tx.executeSql("INSERT OR REPLACE INTO "+ config.database.MoviesTable+" (ean, title, fsk, cut, indexed, time, mode) VALUES ('"+movie.ean+"','"+movie.title+"','"+movie.fsk+"','"+movie.cut+"','"+movie.index+"','"+movie.time+"','"+movie.mode+"')", [], successCB, errorCB);
				});
			},
			removeMovie			:	function(ean, successCB, errorCB){
				this.db.transaction(function(tx){
					tx.executeSql("DELETE FROM "+config.database.MoviesTable+" WHERE ean='"+ean+"'",[],successCB, errorCB);
				});
			}
		},
		gui				:	{
			renderShelf			:	function(parent){
				console.debug('[gui] renderShelf invoked!');
				UncutCheckR.database.getMovieList(config.database.modes.current, function(tx, rs){
					console.debug('[gui] successfully received MoviesList');
					var i;
					for(i=0;i<rs.rows.length;i++){
						$(parent).append("<li class='movie'>"+rs.rows.item(i).title+"</li>");
						console.debug('[gui] successfully appended Movie: '+rs.rows.item(i).title);
					}
				}, 
				function(error){
					console.error('Error fetching MoviesList in '+ config.database.modes.current +' Mode');
				});
			}
		},
		debug			:	{
			fillDummyData		:	function(){
				
				console.log('[debug] fillDummyData is invoked');
				
				var moviesArray = new Array();
				
					moviesArray.push(new Movie(12345, 'Krieg der Sterne', '12','false','false','120 min', config.database.modes.shelf));
					moviesArray.push(new Movie(12232, 'Schweigen der Laemmer', '16','true','false','120 min', config.database.modes.wishlist));
					moviesArray.push(new Movie(32345, 'Star Crash', '12','false','false','120 min', config.database.modes.shelf));
					moviesArray.push(new Movie(42345, 'Rambo', '18','false','false','120 min', config.database.modes.shelf));
					moviesArray.push(new Movie(52345, 'Bladerunner', '16','false','false','120 min', config.database.modes.shelf));
					moviesArray.push(new Movie(62345, 'Mad Max', '18','false','false','120 min', config.database.modes.shelf));
					moviesArray.push(new Movie(72345, 'Dirty Harry', '16','true','false','120 min', config.database.modes.wishlist));
					moviesArray.push(new Movie(82345, 'Fanboys', '12','false','false','120 min', config.database.modes.shelf));
					moviesArray.push(new Movie(92345, 'Cannibal Holocaust', 'keine Jugendfreigabe','false','true','120 min', config.database.modes.wishlist));
					
				var i;
					
				for(i=0;i<moviesArray.length;i++){
					UncutCheckR.database.addMovie(moviesArray[i], function(tx, rs){
						console.debug('[debug] dummy Movie '+moviesArray[i].title+' added!');
					});
				}
			}
		}
	}

function Movie(ean, title, fsk, cut, index, time, mode){
	this.ean = ean;
	this.title = title;
	this.fsk = fsk;
	this.cut = cut;
	this.index = index;
	this.time = time;
	this.mode = mode;
	that = this;
	
	this.toArray	=	function(){
		var values = new Array();
		
			values.push(that.ean);
			values.push(that.title);
			values.push(that.fsk);
			values.push(that.cut);
			values.push(that.index);
			values.push(that.time);
			values.push(that.mode);
		
			
			
		return values;
	};
};