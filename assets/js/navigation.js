/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
( function() {
	var container, button, menu, links, subMenus, i, len;

	container = document.getElementById( 'site-navigation' );
	if ( ! container ) {
		return;
	}

	button = container.getElementsByTagName( 'button' )[0];
	if ( 'undefined' === typeof button ) {
		return;
	}

	menu = container.getElementsByTagName( 'ul' )[0];

	// Hide menu toggle button if menu is empty and return early.
	if ( 'undefined' === typeof menu ) {
		button.style.display = 'none';
		return;
	}

	menu.setAttribute( 'aria-expanded', 'false' );
	if ( -1 === menu.className.indexOf( 'nav-menu' ) ) {
		menu.className += ' nav-menu';
	}

	function closeMenu() {
		container.className = container.className.replace( ' toggled', '' );
		button.setAttribute( 'aria-expanded', 'false' );
		menu.setAttribute( 'aria-expanded', 'false' );
	}
	
	function openMenu() {
		container.className += ' toggled';
		button.setAttribute( 'aria-expanded', 'true' );
		menu.setAttribute( 'aria-expanded', 'true' );
	}
	
	button.onclick = function() {
		if ( -1 !== container.className.indexOf( 'toggled' ) ) {
			closeMenu();
		} else {
			openMenu();
		}
	};
	
	// Close menu when clicking on close button (::after pseudo-element)
	var menuContainer = container.querySelector( '.menu-testing-menu-container' );
	if ( menuContainer ) {
		// Create actual close button since ::after can't be clicked
		var closeBtn = document.createElement( 'button' );
		closeBtn.className = 'menu-close-button';
		closeBtn.innerHTML = '✕';
		closeBtn.setAttribute( 'aria-label', 'Close menu' );
		closeBtn.style.cssText = 'position: absolute; top: 25px; right: 25px; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 28px; color: rgba(255, 255, 255, 0.8); background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 12px; cursor: pointer; transition: all 0.3s ease; z-index: 10001; opacity: 0; pointer-events: none;';
		menuContainer.appendChild( closeBtn );
		
		closeBtn.onclick = function( e ) {
			e.stopPropagation();
			closeMenu();
		};
		
		// Show close button when menu opens
		var observer = new MutationObserver( function( mutations ) {
			mutations.forEach( function( mutation ) {
				if ( -1 !== container.className.indexOf( 'toggled' ) ) {
					closeBtn.style.opacity = '1';
					closeBtn.style.pointerEvents = 'all';
				} else {
					closeBtn.style.opacity = '0';
					closeBtn.style.pointerEvents = 'none';
				}
			});
		});
		
		observer.observe( container, { attributes: true, attributeFilter: [ 'class' ] } );
		
		// RTL support
		if ( document.documentElement.dir === 'rtl' ) {
			closeBtn.style.right = 'auto';
			closeBtn.style.left = '25px';
		}
	}

	// Get all the link elements within the menu.
	links    = menu.getElementsByTagName( 'a' );
	subMenus = menu.getElementsByTagName( 'ul' );

	// Set menu items with submenus to aria-haspopup="true".
	for ( i = 0, len = subMenus.length; i < len; i++ ) {
		subMenus[i].parentNode.setAttribute( 'aria-haspopup', 'true' );
	}

	// Each time a menu link is focused or blurred, toggle focus.
	for ( i = 0, len = links.length; i < len; i++ ) {
		links[i].addEventListener( 'focus', toggleFocus, true );
		links[i].addEventListener( 'blur', toggleFocus, true );
		
		// Handle link clicks - smooth scroll and close menu
		links[i].addEventListener( 'click', function(e) {
			var href = this.getAttribute('href');
			
			// Check if it's an anchor link
			if (href && href.indexOf('#') === 0) {
				e.preventDefault();
				
				var targetId = href.substring(1);
				var targetElement = document.getElementById(targetId) || document.querySelector('[id="' + targetId + '"]');
				
				if (targetElement) {
					// Close mobile menu first
					if ( window.innerWidth <= 991 ) {
						closeMenu();
					}
					
					// Smooth scroll to target
					setTimeout(function() {
						var offset = 80; // Header height offset
						var elementPosition = targetElement.getBoundingClientRect().top;
						var offsetPosition = elementPosition + window.pageYOffset - offset;
						
						window.scrollTo({
							top: offsetPosition,
							behavior: 'smooth'
						});
					}, window.innerWidth <= 991 ? 300 : 0);
				} else {
					// If target not found, just close menu
					if ( window.innerWidth <= 991 ) {
						closeMenu();
					}
				}
			} else {
				// Regular link - just close menu on mobile
				if ( window.innerWidth <= 991 ) {
					closeMenu();
				}
			}
		});
	}
	
	// Close menu when clicking outside
	document.addEventListener( 'click', function( event ) {
		if ( window.innerWidth <= 991 ) {
			var isClickInside = container.contains( event.target );
			var isCloseButton = event.target.classList.contains('menu-close-button') || 
			                    event.target.closest('.menu-close-button');
			var isLanguageButton = event.target.classList.contains('lang-btn') || 
			                      event.target.closest('.lang-btn');
			
			// Don't close if clicking language buttons
			if (isLanguageButton) {
				return;
			}
			
			if ( !isClickInside && container.className.indexOf( 'toggled' ) !== -1 && !isCloseButton ) {
				closeMenu();
			}
		}
	});
	
	// Close menu on ESC key
	document.addEventListener( 'keydown', function( event ) {
		if ( event.key === 'Escape' && container.className.indexOf( 'toggled' ) !== -1 ) {
			container.className = container.className.replace( ' toggled', '' );
			button.setAttribute( 'aria-expanded', 'false' );
			menu.setAttribute( 'aria-expanded', 'false' );
		}
	});

	/**
	 * Sets or removes .focus class on an element.
	 */
	function toggleFocus() {
		var self = this;

		// Move up through the ancestors of the current link until we hit .nav-menu.
		while ( -1 === self.className.indexOf( 'nav-menu' ) ) {

			// On li elements toggle the class .focus.
			if ( 'li' === self.tagName.toLowerCase() ) {
				if ( -1 !== self.className.indexOf( 'focus' ) ) {
					self.className = self.className.replace( ' focus', '' );
				} else {
					self.className += ' focus';
				}
			}

			self = self.parentElement;
		}
	}
	
	// Premium scroll effect for navbar
	var headerWrapper = document.querySelector('.site-header-affix-wrapper');
	if (headerWrapper) {
		var lastScroll = 0;
		var scrollThreshold = 50;
		
		function handleScroll() {
			var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
			
			if (currentScroll > scrollThreshold) {
				headerWrapper.classList.add('scrolled');
			} else {
				headerWrapper.classList.remove('scrolled');
			}
			
			lastScroll = currentScroll;
		}
		
		// Throttle scroll events for better performance
		var ticking = false;
		window.addEventListener('scroll', function() {
			if (!ticking) {
				window.requestAnimationFrame(function() {
					handleScroll();
					ticking = false;
				});
				ticking = true;
			}
		}, { passive: true });
		
		// Initial check
		handleScroll();
	}
	
	// إلغاء sticky-bar بشكل قوي - منع navbar من البقاء ثابت
	(function() {
		function removeSticky() {
			var masthead = document.getElementById('masthead');
			var header = document.querySelector('.site-header');
			var wrapper = document.querySelector('.site-header-affix-wrapper');
			
			if (masthead) {
				masthead.classList.remove('sticky-bar');
				masthead.style.position = 'relative';
				masthead.style.top = 'auto';
			}
			if (header) {
				header.classList.remove('sticky-bar');
				header.style.position = 'relative';
				header.style.top = 'auto';
			}
			if (wrapper) {
				wrapper.style.position = 'relative';
				wrapper.style.top = 'auto';
			}
		}
		
		// إزالة sticky فوراً
		removeSticky();
		
		// إزالة sticky كل 100ms
		setInterval(removeSticky, 100);
		
		// إزالة sticky عند التمرير
		window.addEventListener('scroll', removeSticky, { passive: true });
	})();
} )();
