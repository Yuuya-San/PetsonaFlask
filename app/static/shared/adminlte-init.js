/**
 * AdminLTE Initialization and Sidebar Management
 * Enhanced with deployment-safe fallbacks
 */

(function() {
  'use strict';
  
  const AdminLTEInit = {
    initialized: false,
    retryCount: 0,
    maxRetries: 5,
    
    /**
     * Check if all dependencies are loaded
     */
    checkDependencies: function() {
      if (typeof jQuery === 'undefined') {
        console.warn('[AdminLTE] jQuery not loaded yet');
        return false;
      }
      
      const $ = jQuery;
      
      if (typeof $.fn.layout !== 'function') {
        console.warn('[AdminLTE] AdminLTE layout plugin not loaded yet');
        return false;
      }
      
      return true;
    },
    
    /**
     * Initialize AdminLTE layout and sidebar
     */
    init: function() {
      if (!this.checkDependencies()) {
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log('[AdminLTE] Retrying initialization (' + this.retryCount + '/' + this.maxRetries + ')');
          setTimeout(() => this.init(), 200);
        } else {
          console.error('[AdminLTE] Failed to initialize after ' + this.maxRetries + ' retries - falling back to PetSonaUI');
          // Fallback is already loaded and initialized
        }
        return;
      }
      
      const $ = jQuery;
      
      try {
        // Initialize AdminLTE layout
        $('body').layout();
        console.log('[AdminLTE] Layout initialized successfully');
        
        // Setup pushmenu
        this.setupPushmenu($);
        
        this.initialized = true;
        console.log('[AdminLTE] Full initialization complete');
        
      } catch (error) {
        console.error('[AdminLTE] Initialization error:', error);
        if (typeof window.petsonaUIError !== 'undefined') {
          window.petsonaUIError('AdminLTE', 'Initialization failed', error);
        }
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          setTimeout(() => this.init(), 300);
        }
      }
    },
    
    /**
     * Setup pushmenu handling
     */
    setupPushmenu: function($) {
      // Get all pushmenu toggle buttons
      const toggleButtons = document.querySelectorAll('[data-widget="pushmenu"]');
      console.log('[AdminLTE] Found ' + toggleButtons.length + ' pushmenu buttons');
      
      const self = this;
      
      toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          const $body = $('body');
          
          // Check current state
          if ($body.hasClass('sidebar-open')) {
            self.collapseSidebar($body);
          } else {
            self.expandSidebar($body);
          }
        });
      });
      
      // Also listen for AdminLTE's native pushmenu events
      $(document).on('collapsed.pushmenu', function() {
        console.log('[AdminLTE] Sidebar collapsed via event');
      });
      
      $(document).on('expanded.pushmenu', function() {
        console.log('[AdminLTE] Sidebar expanded via event');
      });
    },
    
    /**
     * Toggle sidebar visibility
     */
    toggleSidebar: function() {
      const body = document.body;
      
      if (body.classList.contains('sidebar-open')) {
        this.collapseSidebar();
      } else {
        this.expandSidebar();
      }
    },
    
    /**
     * Expand sidebar
     */
    expandSidebar: function($body) {
      if (typeof $body === 'undefined') {
        $body = jQuery('body');
      }
      
      $body.removeClass('sidebar-collapse');
      $body.addClass('sidebar-open');
      console.log('[AdminLTE] Sidebar expanded');
      
      // Trigger event
      jQuery(document).trigger('expanded.pushmenu');
    },
    
    /**
     * Collapse sidebar
     */
    collapseSidebar: function($body) {
      if (typeof $body === 'undefined') {
        $body = jQuery('body');
      }
      
      $body.removeClass('sidebar-open');
      $body.addClass('sidebar-collapse');
      console.log('[AdminLTE] Sidebar collapsed');
      
      // Trigger event
      jQuery(document).trigger('collapsed.pushmenu');
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => AdminLTEInit.init(), 100);
    });
  } else {
    setTimeout(() => AdminLTEInit.init(), 100);
  }
  
  // Also try on window load
  window.addEventListener('load', () => {
    if (!AdminLTEInit.initialized) {
      console.log('[AdminLTE] Running initialization on window load');
      AdminLTEInit.init();
    }
  });
  
  // Expose for debugging
  window.AdminLTEInit = AdminLTEInit;
})();
