var config = {
		database				:	{
			name			:	'films',
			description		:	'Your Movies Storage',
			version			:	'1.0',
			size			:	20000,
			MoviesTable		:	'movieshelf',
			WishlistTable	:	'wishlist'
		}
};

var UncutCheckR	=	{
		database		:	{
			db					:	{},
			
			testDB				:	function(){
				var db = window.sqlitePlugin.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);

			      db.transaction(function(tx) {
			        tx.executeSql('DROP TABLE IF EXISTS test_table');
			        tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');

			        tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", 100], function(tx, res) {
			          console.log("insertId: " + res.insertId + " -- probably 1");
			          console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
			          db.transaction(function(tx) {
			            tx.executeSql("select count(id) as cnt from test_table;", [], function(tx, res) {
			              console.log("res.rows.length: " + res.rows.length + " -- should be 1");
			              console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
			            });
			          });

			        }, function(e) {
			          console.log("ERROR: " + e.message);
			        });
			      });
			},
			
			initializeDatabase	:	function(){
				console.log('[database] start init');
				
				UncutCheckR.database.db = window.sqlitePlugin.openDatabase(
													config.database.name, 
													config.database.version,
													config.database.description, 
													config.database.size);
				console.log('[database] db created');
				this.db.transaction(function(tx){
					tx.executeSql('CREATE TABLE IF NOT EXISTS '+config.database.MoviesTable+' (ean text primary key, title text, fsk text, cut text, indexed text, time text)'
							,[],
							function(tx, rs){
								console.log('[database] Created table: '+config.database.MoviesTable);
							},function(error){
								console.log('[database] Error creating table: '+config.database.MoviesTable);
							});
					tx.executeSql('CREATE TABLE IF NOT EXISTS '+config.database.WishlistTable+' (ean text primary key, title text, fsk text, cut text, indexed text, time text)'
							,[],
							function(tx, rs){
								console.log('[database] Created table: '+config.database.WishlistTable);
							},function(error){
								console.log('[database] Error creating table: '+config.database.WishlistTable);
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
					tx.executeSql('DROP TABLE IF EXISTS '+config.database.WishlistTable, [],
							function(tx, rs){
								console.log('[database] Dropped table '+ config.database.WishlistTable);
							},function(error){
								console.log('[database] Error dropping table '+ config.database.WishlistTable + ' - ' + error.message);
							});
				});
			},
			getMovie			:	function(ean, table, successCB, errorCB){
				this.db.transaction(function(tx){
					tx.executeSql("SELECT * FROM "+ table + " WHERE ean='"+ ean +"'", [], successCB, errorCB);
				});
				
			},
			getMovieList		:	function(table, successCB, errorCB){
				this.db.transaction(function(tx){
					tx.executeSql("SELECT * FROM "+ table, [], successCB, errorCB);
				});
			},
			addMovie			:	function(table, movie, successCB, errorCB){
				this.db.transaction(function(tx){
					tx.executeSql("INSERT INTO "+ table, movie.toArray(), successCB, errorCB);
				});
			},
			removeMovie			:	function(table, ean, successCB, errorCB){
				this.db.transaction(function(tx){
					tx.executeSql("DELETE FROM "+table+" WHERE ean='"+ean+"'",[],successCB, errorCB);
				});
			}
		},
		gui				:	{
			renderShelf			:	function(){
				
			}
		}
}

function Movie(ean, title, fsk, cut, index, time){
	this.ean = ean;
	this.title = title;
	this.fsk = fsk;
	this.cut = cut;
	this.index = index;
	this.time = time;
	that = this;
	
	toArray	:	function(){
		var values = new Array();
		values.push(that.ean);
		values.push(that.title);
		values.push(that.fsk);
		values.push(that.cut);
		values.push(that.index);
		values.push(that.time);
		return values;
	}
}

$(document).on('infogathered', function(){
	var MovieInfo = $(document).uncut("getMovieInfo");
	$("#title-cell").html(MovieInfo.title);
	$("#label-cell").html(MovieInfo.label);
	$("#cut-cell").html(MovieInfo.isCut);
	$("#freigabe-cell").html(MovieInfo.freigabe);
	$("#index-cell").html(MovieInfo.indiziert);
	$("#laufzeit-cell").html(MovieInfo.laufzeit);
	
	$.mobile.changePage("#scan-result");
	hideModal();
});

$(document).on('ready', function(){
	$(".apage").each(function(index, element) {
		$(element).live('pageshow', function(event){
			var windowheight = parseInt($(window).height());
			var headerHeight = parseInt($('#'+$(element).attr('id')+' .my-header').height());
			var footerHeight = parseInt($('#'+$(element).attr('id')+' .my-footer').height());
			
			$('#'+$(element).attr('id') + ' .content').height(parseInt(windowheight - headerHeight - footerHeight)+"px");
		});
	});
	
});

$(document).bind('deviceready', function(){
	UncutCheckR.database.initializeDatabase();
	
});

function showModal(){
	  $("body").append('<div class="modalWindow"/>');
	  $.mobile.showPageLoadingMsg();
}
function hideModal(){
	 $(".modalWindow").remove();
	  $.mobile.hidePageLoadingMsg();

	}

