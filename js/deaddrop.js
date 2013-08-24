//Dead Drop localstorage post library
//By Kevin Zweerink
//2013

;(function () {
	function DeadDrop() {

		return {

			package : null,

			findPackages : function() {
				//Check localstorage for packages against current url
				var url = window.location.pathname;
				if(url.charAt(0) === "/") {
					url = url.substr(1);
				}
				var url = this.dataAPI.helpers.fixURL(url);
				var drop = "dd-pkg-" + url;
				this.package = localStorage.getItem(drop);
				if(this.package != null && this.package.charAt(this.package.length - 1) === "}" && this.package.charAt(0) === "{") {
					this.package = JSON.parse(this.package);
				}
				localStorage.removeItem(drop);
			},

			purge : function() {
				//Removes all DeadDrop localstorage variables
				for(var i in window.localStorage) {
					if (i.indexOf("dd-pkg-") != -1){
						localStorage.removeItem(i);
					}
				}
			},

			drop : function(el, pkg) {
				//Leave a package in localstorage with a key of drop
				var package = pkg;
				var href = el.getAttribute("href");
				var drop = "dd-pkg-" + this.dataAPI.helpers.fixURL(href);
				if (typeof package === "object") {
					package = JSON.stringify(package);
				}
				localStorage.setItem(drop, package);
			},

			dataAPI : { 
				dropPackage : function(el) {
					//Leave a package in localstorage with a key of drop
					var package = el.getAttribute("data-drop");
					var href = el.getAttribute("href");
					var drop = "dd-pkg-" + this.helpers.fixURL(href);
					if (typeof package === "object") {
						package = JSON.stringify(package);
					}
					localStorage.setItem(drop, package);
				},

				setListeners : function(triggers) {
					//cache this
					var _this = this;
					//Listen for click events on any tags that should drop a package before the page changes
					for(var i = 0; i < triggers.length; i+=1) {
						triggers[i].addEventListener( "click", function() { 
							_this.dropPackage( this ) 
						}, false );
					}

					//Listen for page leave, trigger cleanup
					window.onbeforeunload = function() {
						_this.cleanup();
					}
				},

				cleanup : function() {
					//Remove any drops left for this URL
					var url = window.location.pathname;
					if(url.charAt(0) === "/") {
						url = url.substr(1);
					}
					var url = this.helpers.fixURL(url);
					var drop = "dd-pkg-" + url;
					localStorage.removeItem(drop);
				},

				helpers : {
					fixURL : function(url) {
						url = url.replace(".html", "");
						url = url.replace(".php", "");
						url = url.replace(".js", "");
						url = url.replace(".rb", "");
						return url;
					}
				},

				initialize : function() {
					var linksToWatch = document.querySelectorAll("[data-drop]");
					this.setListeners(linksToWatch);
				},
			}

		};
	}

	// Remove this if you'd rather instantiate Dead Drop yourself
	window.DD = new DeadDrop();
	window.DD.findPackages();
	window.DD.dataAPI.initialize();
})();