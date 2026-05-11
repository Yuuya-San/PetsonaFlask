/**
 * PetSona UI Fallback Controller - Deployment-Safe Implementation
 * Provides robust sidebar and navbar functionality independent of AdminLTE
 */

(function() {
  'use strict';

  const PetSonaUI = {
    initialized: false,
    sidebarOpen: false,
    isMobile: false,

    /**
     * Initialize the UI controller
     */
    init: function() {
      if (this.initialized) return;
      console.log('[PetSonaUI] Initializing fallback controller...');

      this.checkMobile();
      this.setupEventListeners();
      this.initializeSidebarState();
      this.initialized = true;

      console.log('[PetSonaUI] Fallback controller initialized successfully');
    },

    /**
     * Check if we're on mobile
     */
    checkMobile: function() {
      this.isMobile = window.innerWidth < 1024;
    },

    /**
     * Setup all event listeners
     */
    setupEventListeners: function() {
      // Sidebar toggle buttons
      const toggleButtons = document.querySelectorAll('[data-widget="pushmenu"]');
      toggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggleSidebar();
        });
      });

      // Window resize
      window.addEventListener('resize', this.debounce(() => {
        this.checkMobile();
        this.handleResize();
      }, 250));

      // Outside click to close sidebar on mobile
      document.addEventListener('click', (e) => {
        if (this.isMobile && this.sidebarOpen) {
          const sidebar = document.querySelector('.main-sidebar');
          const toggle = e.target.closest('[data-widget="pushmenu"]');
          if (!sidebar.contains(e.target) && !toggle) {
            this.closeSidebar();
          }
        }
      });

      // ESC key to close sidebar
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.sidebarOpen) {
          this.closeSidebar();
        }
      });
    },

    /**
     * Initialize sidebar state based on body classes
     */
    initializeSidebarState: function() {
      const body = document.body;
      this.sidebarOpen = body.classList.contains('sidebar-open');

      if (this.isMobile) {
        if (!this.sidebarOpen) {
          this.closeSidebar();
        }
      } else {
        // Desktop: respect sidebar-collapse class
        if (body.classList.contains('sidebar-collapse')) {
          this.closeSidebar();
        } else {
          this.openSidebar();
        }
      }
    },

    /**
     * Toggle sidebar visibility
     */
    toggleSidebar: function() {
      if (this.sidebarOpen) {
        this.closeSidebar();
      } else {
        this.openSidebar();
      }
    },

    /**
     * Open sidebar
     */
    openSidebar: function() {
      const sidebar = document.querySelector('.main-sidebar');
      const body = document.body;

      if (!sidebar) return;

      sidebar.style.transform = 'translateX(0)';
      body.classList.add('sidebar-open');
      body.classList.remove('sidebar-collapse');
      this.sidebarOpen = true;

      console.log('[PetSonaUI] Sidebar opened');
    },

    /**
     * Close sidebar
     */
    closeSidebar: function() {
      const sidebar = document.querySelector('.main-sidebar');
      const body = document.body;

      if (!sidebar) return;

      if (this.isMobile) {
        sidebar.style.transform = 'translateX(-100%)';
      } else {
        sidebar.style.left = '-250px';
      }

      body.classList.remove('sidebar-open');
      body.classList.add('sidebar-collapse');
      this.sidebarOpen = false;

      console.log('[PetSonaUI] Sidebar closed');
    },

    /**
     * Handle window resize
     */
    handleResize: function() {
      const wasMobile = this.isMobile;
      this.checkMobile();

      if (wasMobile !== this.isMobile) {
        // Mode changed, reinitialize
        this.initializeSidebarState();
      }
    },

    /**
     * Debounce utility
     */
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };

  // Global error handler
  window.petsonaUIError = function(component, error, details) {
    console.error(`[PetSonaUI:${component}] ${error}`, details);
    // Could send to error tracking service here
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PetSonaUI.init());
  } else {
    PetSonaUI.init();
  }

  // Also try on window load
  window.addEventListener('load', () => {
    if (!PetSonaUI.initialized) {
      console.log('[PetSonaUI] Running initialization on window load');
      PetSonaUI.init();
    }
  });

  // Expose for debugging
  window.PetSonaUI = PetSonaUI;
})();