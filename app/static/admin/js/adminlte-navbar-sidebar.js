(function() {
    'use strict';

    function hasJQuery() {
        return typeof window.jQuery !== 'undefined' && window.jQuery && typeof window.jQuery.fn !== 'undefined';
    }

    function initAdminLTE() {
        if (!hasJQuery()) {
            return;
        }

        var $ = window.jQuery;
        if (typeof $.fn.layout === 'undefined') {
            return;
        }

        try {
            $('body').layout();
        } catch (error) {
            console.warn('AdminLTE layout initialization failed:', error);
        }

        function syncSidebarState() {
            if (window.innerWidth >= 1024) {
                $('body').addClass('sidebar-collapse').removeClass('sidebar-open');
            } else {
                $('body').removeClass('sidebar-collapse sidebar-open');
            }
        }

        syncSidebarState();

        var resizeTimeout;
        $(window).off('resize.petsonaSidebar').on('resize.petsonaSidebar', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(syncSidebarState, 180);
        });

        $('[data-toggle="dropdown"]').attr('aria-haspopup', 'true').attr('aria-expanded', 'false');

        $(document)
            .off('show.bs.dropdown.petsona hide.bs.dropdown.petsona')
            .on('show.bs.dropdown.petsona', '.dropdown', function() {
                $(this).find('.dropdown-menu').attr('aria-hidden', 'false');
            })
            .on('hide.bs.dropdown.petsona', '.dropdown', function() {
                $(this).find('.dropdown-menu').attr('aria-hidden', 'true');
            });
    }

    function bootstrapInit() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAdminLTE);
        } else {
            initAdminLTE();
        }

        setTimeout(initAdminLTE, 750);
    }

    bootstrapInit();
})();
