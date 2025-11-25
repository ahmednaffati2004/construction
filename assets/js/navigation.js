/**
 * Professional Navbar Navigation Handler
 * Handles mobile menu toggle, smooth scrolling, and accessibility
 */

(function() {
	'use strict';

	// تعطيل دالة init_navbar من script.min.js التي تضيف sticky-bar
	(function() {
		try {
			Object.defineProperty(window, 'init_navbar', {
				configurable: true,
				get: function() {
					return function() { return; };
				},
				set: function() {
					// تجاهل أي محاولة لإعادة تعريفها
				}
			});
		} catch (err) {
			window.init_navbar = function() { return; };
		}
	})();

	// Get navbar elements
	var navbar = document.querySelector('.main-navbar');
	var menuToggle = document.querySelector('.mobile-menu-toggle');
	var menuOverlay = document.querySelector('.mobile-menu-overlay');
	var menuClose = document.querySelector('.mobile-menu-close');
	var menuLinks = document.querySelectorAll('.navbar-menu a');
	var navbarContainer = document.querySelector('.navbar-container');

	if (!navbar || !menuToggle || !menuOverlay) {
		return;
	}

	// Menu toggle functions
	function openMenu() {
		menuToggle.classList.add('active');
		menuOverlay.classList.add('active');
		document.body.style.overflow = 'hidden';
		menuToggle.setAttribute('aria-expanded', 'true');
	}

	function closeMenu() {
		menuToggle.classList.remove('active');
		menuOverlay.classList.remove('active');
		document.body.style.overflow = '';
		menuToggle.setAttribute('aria-expanded', 'false');
	}

	// Toggle menu on button click
	menuToggle.addEventListener('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		if (menuOverlay.classList.contains('active')) {
			closeMenu();
		} else {
			openMenu();
		}
	});

	// Close menu on close button click
	if (menuClose) {
		menuClose.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			closeMenu();
		});
	}

	// Close menu when clicking outside
	document.addEventListener('click', function(event) {
		if (menuOverlay.classList.contains('active')) {
			var isClickInside = navbarContainer && navbarContainer.contains(event.target);
			var isMenuToggle = menuToggle.contains(event.target);
			var isMenuClose = menuClose && menuClose.contains(event.target);
			var isLanguageButton = event.target.classList.contains('lang-btn') || 
			                      event.target.closest('.lang-btn');
			
			// Don't close if clicking language buttons
			if (isLanguageButton) {
				return;
			}
			
			if (!isClickInside && !isMenuToggle && !isMenuClose) {
				closeMenu();
			}
		}
	});

	// Close menu on ESC key
	document.addEventListener('keydown', function(event) {
		if (event.key === 'Escape' && menuOverlay.classList.contains('active')) {
			closeMenu();
		}
	});

	// Smooth scroll for anchor links
	menuLinks.forEach(function(link) {
		link.addEventListener('click', function(e) {
			var href = this.getAttribute('href');
			
			// Check if it's an anchor link
			if (href && href.indexOf('#') === 0 && href.length > 1) {
				e.preventDefault();
				
				var targetId = href.substring(1);
				var targetElement = document.getElementById(targetId) || 
				                   document.querySelector('[id="' + targetId + '"]');
				
				if (targetElement) {
					// Close mobile menu first
					if (window.innerWidth <= 991) {
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
					if (window.innerWidth <= 991) {
						closeMenu();
					}
				}
			} else {
				// Regular link - just close menu on mobile
				if (window.innerWidth <= 991) {
					closeMenu();
				}
			}
		});
	});

	// Handle window resize
	var resizeTimer;
	window.addEventListener('resize', function() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			// Close menu if window is resized to desktop size
			if (window.innerWidth > 991 && menuOverlay.classList.contains('active')) {
				closeMenu();
			}
		}, 250);
	});

	// Prevent body scroll when menu is open
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
				if (menuOverlay.classList.contains('active')) {
					document.body.style.overflow = 'hidden';
				} else {
					document.body.style.overflow = '';
				}
			}
		});
	});

	observer.observe(menuOverlay, {
		attributes: true,
		attributeFilter: ['class']
	});

	// Ensure navbar is always relative (not fixed/sticky)
	function ensureNavbarRelative() {
		if (navbar) {
			navbar.style.setProperty('position', 'relative', 'important');
			navbar.style.setProperty('top', 'auto', 'important');
			navbar.style.setProperty('left', 'auto', 'important');
			navbar.style.setProperty('right', 'auto', 'important');
		}
	}

	// Call immediately and on scroll
	ensureNavbarRelative();
	window.addEventListener('scroll', ensureNavbarRelative, { passive: true });

	// Prevent sticky-bar class from being added
	if (window.jQuery && jQuery.fn && !jQuery.fn._addClassWithoutSticky) {
		jQuery.fn._addClassWithoutSticky = jQuery.fn.addClass;
		jQuery.fn.addClass = function(classNames) {
			if (typeof classNames === 'string' && classNames.indexOf('sticky-bar') !== -1) {
				var filtered = classNames
					.split(/\s+/)
					.filter(function(cls) { return cls && cls !== 'sticky-bar'; })
					.join(' ');
				if (!filtered) {
					return this;
				}
				return jQuery.fn._addClassWithoutSticky.call(this, filtered);
			}
			return jQuery.fn._addClassWithoutSticky.apply(this, arguments);
		};
	}

})();
