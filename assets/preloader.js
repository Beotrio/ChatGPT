const preloader = document.getElementById('preloader');
console.log('preloader value', preloader);
if(preloader){
  console.log('preloader found');
  window.addEventListener('load', () => {
    const duration = (preloader.dataset.duration || 2) * 1000;
    
    setTimeout(() => {
      preloader.style.transition = 'opacity 1s';
      preloader.style.opacity = '0';
      
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 1000); // Wait for transition to complete
      
    }, duration);
  });
} else {
}