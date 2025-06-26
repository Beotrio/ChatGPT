(function() {
  function initializeProductHover() {
    handleViewportChange();
    window.addEventListener('resize', handleViewportChange);

    function handleViewportChange() {
      if (window.innerWidth > 768) {
        attachHoverEventListeners();
      } else {
        attachSwipeEventListeners();
      }
    }

    function attachHoverEventListeners() {
      const productContainers = document.querySelectorAll('.collection-product-container');
      productContainers.forEach(container => {
        container.addEventListener('mouseover', handleProductHover);
        container.addEventListener('mouseout', handleProductHoverOut);
      });
    } 

    function attachSwipeEventListeners() {
      const productContainers = document.querySelectorAll('.collection-product-container');
      productContainers.forEach(container => {
        let startX = null;
        let startY = null;

        container.addEventListener('touchstart', event => {
          startX = event.touches[0].clientX;
          startY = event.touches[0].clientY;
        });

        container.addEventListener('touchend', event => {
          const endX = event.changedTouches[0].clientX;
          const endY = event.changedTouches[0].clientY;
          const deltaX = endX - startX;
          const deltaY = Math.abs(endY - startY);

          if (deltaX > 50 && deltaY < 20) {
            showPreviousImage(container);
          } else if (deltaX < -50 && deltaY < 20) {
            showNextImage(container);
          }
        });
      });
    }

    function handleProductHover(event) {
      const mainImage = event.currentTarget.querySelector('.product-image');
      const hoverImage = event.currentTarget.querySelector('.product-image-hover');
      
      if (mainImage && hoverImage) {
        mainImage.style.opacity = '0';
        hoverImage.style.opacity = '1';
      }
    }

    function handleProductHoverOut(event) {
      const mainImage = event.currentTarget.querySelector('.product-image');
      const hoverImage = event.currentTarget.querySelector('.product-image-hover');
      
      if (mainImage && hoverImage) {
        mainImage.style.opacity = '1';
        hoverImage.style.opacity = '0';
      }
    }

    function showPreviousImage(container) {
      const mainImage = container.querySelector('.product-image');
      const hoverImage = container.querySelector('.product-image-hover');
      
      if (mainImage && hoverImage) {
        mainImage.style.opacity = '1';
        hoverImage.style.opacity = '0';
      }
    }

    function showNextImage(container) {
      const mainImage = container.querySelector('.product-image');
      const hoverImage = container.querySelector('.product-image-hover');
      
      if (mainImage && hoverImage) {
        mainImage.style.opacity = '0';
        hoverImage.style.opacity = '1';
      }
    }
  }

  window.initializeProductHover = initializeProductHover;

  // Call the function on initial load
  document.addEventListener('DOMContentLoaded', initializeProductHover);
})();
