/**
 * Petsona UI Fallback System
 * Deployment-safe navbar and sidebar functionality
 * This script runs independently of AdminLTE and provides robust fallbacks
 */

(function() {
    'use strict';

    // Configuration
    var CONFIG = {
        mobileBreakpoint: 1024,
        sidebarWidth: 250,
        collapsedWidth: 80,
        animationDuration: 300,
        zIndex: {
            sidebar: 1000,
            navbar: 1030,
            dropdown: 1050,
            modal: 1060
        }
    };

    // Utility functions
    var Utils = {
        // Check if element exists
        exists: function(selector) {
            return document.querySelector(selector) !== null;
        },

        // Add event listener with fallback
        addEvent: function(element, event, handler) {
            if (element && typeof element.addEventListener === 'function') {
                element.addEventListener(event, handler);
            } else if (element && typeof element.attachEvent === 'function') {
                element.attachEvent('on' + event, handler);
            }
        },

        // Get element by selector with fallback
        getElement: function(selector) {
            try {
                return document.querySelector(selector);
            } catch (e) {
                console.warn('Petsona UI: Invalid selector', selector);
                return null;
            }
        },

        // Check if mobile
        isMobile: function() {
            return window.innerWidth < CONFIG.mobileBreakpoint;
        },

        // Debounce function
        debounce: function(func, wait) {
            var timeout;
            return function executedFunction() {
                var context = this;
                var args = arguments;
                var later = function() {
                    timeout = null;
                    func.apply(context, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };

    // Sidebar Controller
    var SidebarController = {
        sidebar: null,
        toggleButtons: [],
        isOpen: false,
        isMobile: false,

        init: function() {
            this.sidebar = Utils.getElement('.main-sidebar');
            if (!this.sidebar) return;

            this.toggleButtons = document.querySelectorAll('[data-widget="pushmenu"], .sidebar-toggle-icon-sm, .nav-link.sidebar-toggle-icon-sm');
            this.isMobile = Utils.isMobile();

            this.bindEvents();
            this.setInitialState();
            this.setupResizeHandler();

            console.log('Petsona UI: Sidebar controller initialized');
        },

        bindEvents: function() {
            var self = this;

            // Bind toggle buttons
            this.toggleButtons.forEach(function(button) {
                Utils.addEvent(button, 'click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.toggle();
                });
            });

            // Close on overlay click (mobile only)
            var contentWrapper = Utils.getElement('.content-wrapper');
            if (contentWrapper) {
                Utils.addEvent(contentWrapper, 'click', function() {
                    if (self.isMobile && self.isOpen) {
                        self.close();
                    }
                });
            }

            // ESC key to close
            Utils.addEvent(document, 'keydown', function(e) {
                if (e.keyCode === 27 && self.isMobile && self.isOpen) {
                    self.close();
                }
            });
        },

        setInitialState: function() {
            var body = document.body;
            this.isOpen = body.classList.contains('sidebar-open');

            if (this.isMobile) {
                body.classList.remove('sidebar-collapse');
                if (!this.isOpen) {
                    this.sidebar.style.transform = 'translateX(-100%)';
                }
            } else {
                body.classList.add('sidebar-collapse');
                this.sidebar.style.transform = '';
            }
        },

        toggle: function() {
            this.isOpen ? this.close() : this.open();
        },

        open: function() {
            if (this.isOpen) return;
            this.isOpen = true;

            document.body.classList.add('sidebar-open');
            this.sidebar.style.transform = 'translateX(0)';

            // Prevent body scroll on mobile
            if (this.isMobile) {
                document.body.style.overflow = 'hidden';
            }
        },

        close: function() {
            if (!this.isOpen) return;
            this.isOpen = false;

            document.body.classList.remove('sidebar-open');
            this.sidebar.style.transform = 'translateX(-100%)';

            // Restore body scroll
            document.body.style.overflow = '';
        },

        setupResizeHandler: function() {
            var self = this;
            var resizeHandler = Utils.debounce(function() {
                var wasMobile = self.isMobile;
                self.isMobile = Utils.isMobile();

                if (wasMobile !== self.isMobile) {
                    self.setInitialState();
                }
            }, 250);

            Utils.addEvent(window, 'resize', resizeHandler);
        }
    };

    // Dropdown Controller
    var DropdownController = {
        init: function() {
            this.bindDropdowns();
            this.setupOutsideClick();
            console.log('Petsona UI: Dropdown controller initialized');
        },

        bindDropdowns: function() {
            var dropdowns = document.querySelectorAll('.dropdown-toggle');
            var self = this;

            dropdowns.forEach(function(toggle) {
                var menu = toggle.nextElementSibling;
                if (!menu || !menu.classList.contains('dropdown-menu')) return;

                Utils.addEvent(toggle, 'click', function(e) {
                    e.preventDefault();

                    // Close other dropdowns
                    self.closeAllDropdowns(menu);

                    // Toggle this dropdown
                    menu.classList.toggle('show');
                    toggle.setAttribute('aria-expanded', menu.classList.contains('show'));
                });
            });
        },

        closeAllDropdowns: function(except) {
            var menus = document.querySelectorAll('.dropdown-menu.show');
            menus.forEach(function(menu) {
                if (menu !== except) {
                    menu.classList.remove('show');
                }
            });

            var toggles = document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]');
            toggles.forEach(function(toggle) {
                if (toggle.nextElementSibling !== except) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        },

        setupOutsideClick: function() {
            var self = this;
            Utils.addEvent(document, 'click', function(e) {
                if (!e.target.closest('.dropdown')) {
                    self.closeAllDropdowns();
                }
            });
        }
    };

    // Error Handler
    var ErrorHandler = {
        init: function() {
            window.petsonaUIError = function(component, error) {
                console.error('Petsona UI Error in ' + component + ':', error);
                // Could send to error tracking service here
            };
        }
    };

    // Initialize when DOM is ready
    function initializePetsonaUI() {
        try {
            SidebarController.init();
            DropdownController.init();
            ErrorHandler.init();

            // Mark as initialized
            document.body.setAttribute('data-petsona-ui', 'initialized');
            console.log('Petsona UI: All components initialized successfully');
        } catch (error) {
            console.error('Petsona UI: Initialization failed', error);
            window.petsonaUIError('initialization', error);
        }
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        Utils.addEvent(document, 'DOMContentLoaded', initializePetsonaUI);
    } else {
        initializePetsonaUI();
    }

    // Fallback initialization
    setTimeout(function() {
        if (!document.body.hasAttribute('data-petsona-ui')) {
            console.warn('Petsona UI: Using fallback initialization');
            initializePetsonaUI();
        }
    }, 2000);

    // Expose for debugging
    window.PetsonaUI = {
        SidebarController: SidebarController,
        DropdownController: DropdownController,
        Utils: Utils,
        CONFIG: CONFIG
    };

})();