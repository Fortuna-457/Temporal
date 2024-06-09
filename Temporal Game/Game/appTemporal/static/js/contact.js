// Function to generate stars
function generateStars(container, numStars) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
  
    const minDistance = 10;
  
    const numCircularStars = Math.floor(numStars * 0.8);
    const numRhombusStars = numStars - numCircularStars;
  
    for (let i = 0; i < numCircularStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      star.style.top = `${minDistance + Math.random() * (containerHeight - minDistance * 2)}px`;
      star.style.left = `${minDistance + Math.random() * (containerWidth - minDistance * 2)}px`;
      container.appendChild(star);
    }
  
    for (let i = 0; i < numRhombusStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star-rhombus');
      star.style.top = `${minDistance + Math.random() * (containerHeight - minDistance * 2)}px`;
      star.style.left = `${minDistance + Math.random() * (containerWidth - minDistance * 2)}px`;
      container.appendChild(star);
    }
  }
  
  // Generate stars for each stars-container
  const starContainers = document.querySelectorAll('.stars-container');
  starContainers.forEach(container => {
    generateStars(container, 50);
  });addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    const stars = document.querySelectorAll('.star');
    const rhombusStars = document.querySelectorAll('.star-rhombus');
    stars.forEach(star => {
      // Calculate the translation distance for parallax effect
      const translateY = Math.max(-scrollY * 0.2, -star.parentNode.clientHeight);
  
      // Apply the translation
      star.style.transform = `translateY(${translateY}px)`;
    });
    rhombusStars.forEach(star => {
      // Calculate the translation distance for parallax effect
      const translateY = Math.max(-scrollY * 0.4, -star.parentNode.clientHeight);
  
      // Apply the translation
      star.style.transform = `translateY(${translateY}px)`;
    });
  });
  
  feather.replace();

  