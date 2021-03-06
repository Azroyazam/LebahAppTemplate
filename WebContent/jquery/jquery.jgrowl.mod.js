
(function($j) {

	/** jGrowl Wrapper - Establish a base jGrowl Container for compatibility with older releases. **/
	$j.jGrowl = function( m , o ) {
		// To maintain compatibility with older version that only supported one instance we'll create the base container.
		if ( $j('#jGrowl').size() == 0 ) 
			$j('<div id="jGrowl"></div>').addClass( (o && o.position) ? o.position : $j.jGrowl.defaults.position ).appendTo('body');

		// Create a notification on the container.
		$j('#jGrowl').jGrowl(m,o);
	};


	/** Raise jGrowl Notification on a jGrowl Container **/
	$j.fn.jGrowl = function( m , o ) {
		if ( $j.isFunction(this.each) ) {
			var args = arguments;

			return this.each(function() {
				var self = this;

				/** Create a jGrowl Instance on the Container if it does not exist **/
				if ( $j(this).data('jGrowl.instance') == undefined ) {
					$j(this).data('jGrowl.instance', $j.extend( new $j.fn.jGrowl(), { notifications: [], element: null, interval: null } ));
					$j(this).data('jGrowl.instance').startup( this );
				}

				/** Optionally call jGrowl instance methods, or just raise a normal notification **/
				if ( $j.isFunction($j(this).data('jGrowl.instance')[m]) ) {
					$j(this).data('jGrowl.instance')[m].apply( $j(this).data('jGrowl.instance') , $j.makeArray(args).slice(1) );
				} else {
					$j(this).data('jGrowl.instance').create( m , o );
				}
			});
		};
	};

	$j.extend( $j.fn.jGrowl.prototype , {

		/** Default JGrowl Settings **/
		defaults: {
			pool: 			0,
			header: 		'',
			group: 			'',
			sticky: 		false,
			position: 		'top-right',
			glue: 			'after',
			theme: 			'default',
			themeState: 	'highlight',
			corners: 		'10px',
			check: 			250,
			life: 			3000,
			closeDuration:  'normal',
			openDuration:   'normal',
			easing: 		'swing',
			closer: 		true,
			closeTemplate: '&times;',
			closerTemplate: '<div>[ close all ]</div>',
			log: 			function(e,m,o) {},
			beforeOpen: 	function(e,m,o) {},
			afterOpen: 		function(e,m,o) {},
			open: 			function(e,m,o) {},
			beforeClose: 	function(e,m,o) {},
			close: 			function(e,m,o) {},
			animateOpen: 	{
				opacity: 	'show'
			},
			animateClose: 	{
				opacity: 	'hide'
			}
		},
		
		notifications: [],
		
		/** jGrowl Container Node **/
		element: 	null,
	
		/** Interval Function **/
		interval:   null,
		
		/** Create a Notification **/
		create: 	function( message , o ) {
			var o = $j.extend({}, this.defaults, o);

			/* To keep backward compatibility with 1.24 and earlier, honor 'speed' if the user has set it */
			if (typeof o.speed !== 'undefined') {
				o.openDuration = o.speed;
				o.closeDuration = o.speed;
			}

			this.notifications.push({ message: message , options: o });
			
			o.log.apply( this.element , [this.element,message,o] );
		},
		
		render: 		function( notification ) {
			var self = this;
			var message = notification.message;
			var o = notification.options;

			var notification = $j(
				'<div class="jGrowl-notification ' + o.themeState + ' ui-corner-all' + 
				((o.group != undefined && o.group != '') ? ' ' + o.group : '') + '">' +
				'<div class="jGrowl-close">' + o.closeTemplate + '</div>' +
				'<div class="jGrowl-header">' + o.header + '</div>' +
				'<div class="jGrowl-message">' + message + '</div></div>'
			).data("jGrowl", o).addClass(o.theme).children('div.jGrowl-close').bind("click.jGrowl", function() {
				$j(this).parent().trigger('jGrowl.close');
			}).parent();


			/** Notification Actions **/
			$j(notification).bind("mouseover.jGrowl", function() {
				$j('div.jGrowl-notification', self.element).data("jGrowl.pause", true);
			}).bind("mouseout.jGrowl", function() {
				$j('div.jGrowl-notification', self.element).data("jGrowl.pause", false);
			}).bind('jGrowl.beforeOpen', function() {
				if ( o.beforeOpen.apply( notification , [notification,message,o,self.element] ) != false ) {
					$j(this).trigger('jGrowl.open');
				}
			}).bind('jGrowl.open', function() {
				if ( o.open.apply( notification , [notification,message,o,self.element] ) != false ) {
					if ( o.glue == 'after' ) {
						$j('div.jGrowl-notification:last', self.element).after(notification);
					} else {
						$j('div.jGrowl-notification:first', self.element).before(notification);
					}
					
					$j(this).animate(o.animateOpen, o.openDuration, o.easing, function() {
						// Fixes some anti-aliasing issues with IE filters.
						if ($j.browser.msie && (parseInt($j(this).css('opacity'), 10) === 1 || parseInt($j(this).css('opacity'), 10) === 0))
							this.style.removeAttribute('filter');

						$j(this).data("jGrowl").created = new Date();
						
						$j(this).trigger('jGrowl.afterOpen');
					});
				}
			}).bind('jGrowl.afterOpen', function() {
				o.afterOpen.apply( notification , [notification,message,o,self.element] );
			}).bind('jGrowl.beforeClose', function() {
				if ( o.beforeClose.apply( notification , [notification,message,o,self.element] ) != false )
					$j(this).trigger('jGrowl.close');
			}).bind('jGrowl.close', function() {
				// Pause the notification, lest during the course of animation another close event gets called.
				$j(this).data('jGrowl.pause', true);
				$j(this).animate(o.animateClose, o.closeDuration, o.easing, function() {
					$j(this).remove();
					var close = o.close.apply( notification , [notification,message,o,self.element] );

					if ( $j.isFunction(close) )
						close.apply( notification , [notification,message,o,self.element] );
				});
			}).trigger('jGrowl.beforeOpen');
		
			/** Optional Corners Plugin **/
			if ( o.corners != '' && $j.fn.corner != undefined ) $j(notification).corner( o.corners );

			/** Add a Global Closer if more than one notification exists **/
			if ( $j('div.jGrowl-notification:parent', self.element).size() > 1 && 
				 $j('div.jGrowl-closer', self.element).size() == 0 && this.defaults.closer != false ) {
				$j(this.defaults.closerTemplate).addClass('jGrowl-closer ui-state-highlight ui-corner-all').addClass(this.defaults.theme)
					.appendTo(self.element).animate(this.defaults.animateOpen, this.defaults.speed, this.defaults.easing)
					.bind("click.jGrowl", function() {
						$j(this).siblings().trigger("jGrowl.beforeClose");

						if ( $j.isFunction( self.defaults.closer ) ) {
							self.defaults.closer.apply( $j(this).parent()[0] , [$j(this).parent()[0]] );
						}
					});
			};
		},

		/** Update the jGrowl Container, removing old jGrowl notifications **/
		update:	 function() {
			$j(this.element).find('div.jGrowl-notification:parent').each( function() {
				if ( $j(this).data("jGrowl") != undefined && $j(this).data("jGrowl").created != undefined && 
					 ($j(this).data("jGrowl").created.getTime() + parseInt($j(this).data("jGrowl").life))  < (new Date()).getTime() && 
					 $j(this).data("jGrowl").sticky != true && 
					 ($j(this).data("jGrowl.pause") == undefined || $j(this).data("jGrowl.pause") != true) ) {

					// Pause the notification, lest during the course of animation another close event gets called.
					$j(this).trigger('jGrowl.beforeClose');
				}
			});

			if ( this.notifications.length > 0 && 
				 (this.defaults.pool == 0 || $j(this.element).find('div.jGrowl-notification:parent').size() < this.defaults.pool) )
				this.render( this.notifications.shift() );

			if ( $j(this.element).find('div.jGrowl-notification:parent').size() < 2 ) {
				$j(this.element).find('div.jGrowl-closer').animate(this.defaults.animateClose, this.defaults.speed, this.defaults.easing, function() {
					$j(this).remove();
				});
			}
		},

		/** Setup the jGrowl Notification Container **/
		startup:	function(e) {
			this.element = $j(e).addClass('jGrowl').append('<div class="jGrowl-notification"></div>');
			this.interval = setInterval( function() { 
				$j(e).data('jGrowl.instance').update(); 
			}, parseInt(this.defaults.check));
			
			if ($j.browser.msie && parseInt($j.browser.version) < 7 && !window["XMLHttpRequest"]) {
				$j(this.element).addClass('ie6');
			}
		},

		/** Shutdown jGrowl, removing it and clearing the interval **/
		shutdown:   function() {
			$j(this.element).removeClass('jGrowl').find('div.jGrowl-notification').remove();
			clearInterval( this.interval );
		},
		
		close: 	function() {
			$j(this.element).find('div.jGrowl-notification').each(function(){
				$j(this).trigger('jGrowl.beforeClose');
			});
		}
	});
	
	/** Reference the Defaults Object for compatibility with older versions of jGrowl **/
	$j.jGrowl.defaults = $j.fn.jGrowl.prototype.defaults;

})(jQuery);