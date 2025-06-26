document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const link = item.querySelector('.nav-link-collection');
        const dropdown = item.querySelector('.dropdown, .sub-dropdown'); 
        const arrow = item.querySelector('.pushy-arrow');

        if (link && dropdown) {
            if (link.classList.contains('active')) {
                dropdown.style.display = 'block';
                if (arrow) {
                    arrow.classList.add('rotate');
                }
            }

            link.addEventListener('click', function(e) {
                e.preventDefault();

                const isVisible = dropdown.style.display === 'block';
                dropdown.style.display = isVisible ? 'none' : 'block';

                if (!isVisible) {
                    link.classList.add('active');
                    if (arrow) {
                        arrow.classList.add('rotate'); 
                    }
                } else {
                    link.classList.remove('active');
                    if (arrow) {
                        arrow.classList.remove('rotate');
                    }
                }
            });
        }
    });
});