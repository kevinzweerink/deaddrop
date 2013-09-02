//Dead Drop localstorage post library
//By Kevin Zweerink
//2013

;(function () {
	function DeadDrop() {

		return {

			package : null,

			stash : null,

			//What the drops get prefixed with
			dropPrefix : "dd-pkg-",

			//What the stash is called
			stashName : "dd-stash",

			//Helper functions for other stuff
			helpers : {
				//Processes URL string, needs work probably.
				fixURL : function(url) {
					if(url.charAt(0) === "/") {
						url = url.substr(1);
					}
					url = url.replace(".html", "");
					url = url.replace(".php", "");
					url = url.replace(".js", "");
					url = url.replace(".rb", "");
					return url;
				},

				//Checks if a value is an object
				isObj : function(obj) {
					//Check for leading and closing curly braces
					if(obj != null && obj.charAt(obj.length - 1) === "}" && obj.charAt(0) === "{") {
						//If they're there, return true
						return true;
					}

					//Check for object datatype
					if(typeof obj === "object") {
						return true;
					}

					//If not, return false
					return false;
				},

				//Processes data coming in from localstorage
				read : function(obj) {
					//If it's an object, parse it.
					if (this.isObj) {
						return JSON.parse(obj)
					}
					//Otherwise, return it as it was.
					return obj;
				},

				//Preps datato go out to localstorage
				prep : function(obj) {
					//If it's an object, stringify it
					if(this.isObj) {
						return JSON.stringify(obj);
					}
					//If not, return it as it was.
					return obj;
				},

				extend : function(newObj, oldObj) {

					if (oldObj === null) {
						oldObj = {};
					}

					for (var key in newObj) {
						if (newObj.hasOwnProperty(key)) {
							oldObj[key] = this.prep(newObj[key]);
						}
					}

					return oldObj;
				}
			},

			//Check localstorage for packages against current url
			findPackages : function() {
				//Process the URL
				var url = this.helpers.fixURL(window.location.pathname);
				var drop = this.dropPrefix + url;

				//Find and process any  localstorage properties with the key of drop
				this.package = this.helpers.read(localStorage.getItem(drop));
				localStorage.removeItem(drop);
			},

			purge : function() {
				//Removes all DeadDrop localstorage variables
				for(var i in window.localStorage) {
					if (i.indexOf(this.dropPrefix) != -1){
						localStorage.removeItem(i);
					}
				}

				//Removes DeadDrop Stash
				localStorage.removeItem(this.stashName);
			},

			//Takes an object and appends it to the stash object
			appendStash : function(pkg) {
				stash = this.helpers.read(localStorage.getItem(this.stashName));
				update = this.helpers.extend(pkg, stash);
				localStorage.setItem(this.stashName, this.helpers.prep(update));
			},

			findStash : function() {
				this.stash = this.helpers.read(localStorage.getItem(this.stashName));
				return this.stash;
			},

			drop : function(el, pkg) {
				//Leave a package in localstorage with a key of drop
				var package = this.helpers.prep(pkg);
				var href = el.getAttribute("href");
				var drop = this.dropPrefix + this.helpers.fixURL(href);
				localStorage.setItem(drop, package);
			},

			//DATA API

			d_dropPackage : function(el) {
				//Leave a package in localstorage with a key of drop
				var package = el.getAttribute("data-drop");
				this.drop( el, package );
			},

			d_setListeners : function(triggers) {
				//cache this
				var _this = this;
				//Listen for click events on any tags that should drop a package before the page changes
				for(var i = 0; i < triggers.length; i+=1) {
					triggers[i].addEventListener( "click", function(e) {
						_this.d_dropPackage( this );
					}, false );
				}

				//Listen for page leave, trigger cleanup
				window.onbeforeunload = function() {
					_this.d_cleanup();
				}
			},

			d_cleanup : function() {
				//Remove any drops left for this URL
				var url = window.location.pathname;
				if(url.charAt(0) === "/") {
					url = url.substr(1);
				}
				var url = this.helpers.fixURL(url);
				var drop = this.dropPrefix + url;
				localStorage.removeItem(drop);
			},

			d_initialize : function() {
				var linksToWatch = document.querySelectorAll("[data-drop]");
				this.d_setListeners(linksToWatch);
			},

		};
	}

	// Remove this if you'd rather instantiate Dead Drop yourself
	window.DD = new DeadDrop();
	window.DD.findPackages();
	window.DD.findStash();
	window.DD.d_initialize();
})();