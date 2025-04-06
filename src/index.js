/**
 * Any - Urban Agency & Freelancer Portfolio Theme
 * Main JavaScript file
 */

(function () {
  "use strict";

  // DOM Elements
  const header = document.querySelector(".site-header");
  const topBarToggle = document.querySelector(".top-bar-toggle");
  const topBar = document.querySelector(".top-bar");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const typewriterElement = document.getElementById("typewriter");
  const portfolioFilters = document.querySelectorAll(".portfolio-filter a");
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  const animatedElements = document.querySelectorAll(".slide-up");
  const skillLevels = document.querySelectorAll(".skill-level");
  const particleCanvas = document.getElementById("particle-canvas");
  const profileParticleCanvas = document.getElementById("profile-particle-canvas");
  const contactParticleCanvas = document.getElementById("contact-particle-canvas");
  const blogParticleCanvas = document.getElementById("blog-particle-canvas");
  const heroSection = document.querySelector(".hero-section");
  const profileSection = document.querySelector(".profile-section");
  const contactSection = document.querySelector(".contact-section");
  const blogSection = document.querySelector(".blog-section");
  const heroScroll = document.querySelector(".hero-scroll");
  const profileSkillLevels = document.querySelectorAll(".profile-skill-item .skill-level");

  // Typewriter effect variables
  const textArray = [
    "Frontend Development",
    "Backend Development",
    "Database Management",
    "Infrastructure",
    "Full-Stack Development",
    "Web Application Design",
    "Technical Mentoring"
  ];
  let textArrayIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isWaiting = false;
  const typingSpeed = 100; // Delay between each character
  const deletingSpeed = 50; // Faster when deleting
  const pauseBeforeDelete = 2000; // Pause before start deleting
  const pauseBeforeNewText = 500; // Pause before typing new text

  // Initialize all functions
  function init() {
    // Event Listeners
    window.addEventListener("scroll", handleScroll);

    if (topBarToggle) {
      topBarToggle.addEventListener("click", toggleTopBar);
    }

    if (navToggle) {
      navToggle.addEventListener("click", toggleNavMenu);
    }

    // Initialize typewriter effect
    if (typewriterElement) {
      setTimeout(typeEffect, 1000); // Start after a slight delay
    }

    // Initialize particle effect for hero section
    if (particleCanvas) {
      initParticles(particleCanvas, heroSection);
      animateParticles(particleCanvas);
    }
    
    // Initialize particle effect for profile section
    if (profileParticleCanvas) {
      initParticles(profileParticleCanvas, profileSection, 80, ["#333333", "#444444", "#555555"]);
      animateParticles(profileParticleCanvas);
    }
    
    // Initialize particle effect for contact section
    if (contactParticleCanvas) {
      initParticles(contactParticleCanvas, contactSection, 80, ["#333333", "#444444", "#555555"]);
      animateParticles(contactParticleCanvas);
    }
    
    // Initialize particle effect for blog section
    if (blogParticleCanvas) {
      initParticles(blogParticleCanvas, blogSection, 80, ["#333333", "#444444", "#555555"]);
      animateParticles(blogParticleCanvas);
    }

    // Initialize skill bars animation for hero section
    if (skillLevels.length > 0) {
      animateSkillBars(skillLevels);
      window.addEventListener("scroll", function() {
        checkSkillBarsVisibility(skillLevels);
      });
    }
    
    // Initialize skill bars animation for profile section
    if (profileSkillLevels.length > 0) {
      animateSkillBars(profileSkillLevels);
      window.addEventListener("scroll", function() {
        checkSkillBarsVisibility(profileSkillLevels);
      });
    }

    // Initialize portfolio filter
    if (portfolioFilters.length > 0) {
      portfolioFilters.forEach((filter) => {
        filter.addEventListener("click", filterPortfolio);
      });
    }

    // Add scroll down functionality
    if (heroScroll) {
      heroScroll.addEventListener("click", scrollToContent);
    }

    // Initialize scroll animations
    window.addEventListener("scroll", animateOnScroll);
    // Initial check for animations in viewport
    animateOnScroll();
    checkSkillBarsVisibility(skillLevels);
    checkSkillBarsVisibility(profileSkillLevels);
  }

  // Handle sticky header on scroll
  function handleScroll() {
    if (window.scrollY > 100) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }

    // Check for animations on scroll
    animateOnScroll();
    checkSkillBarsVisibility(skillLevels);
    checkSkillBarsVisibility(profileSkillLevels);
  }

  // Toggle Top Bar
  function toggleTopBar(e) {
    e.preventDefault();
    topBar.classList.toggle("open");
  }

  // Toggle Mobile Navigation Menu
  function toggleNavMenu() {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");

    // Prevent scrolling when menu is open
    document.body.classList.toggle("menu-open");
  }

  // Enhanced typewriter effect function
  function typeEffect() {
    const currentText = textArray[textArrayIndex];
    const typingDelay = isDeleting ? deletingSpeed : typingSpeed;
    
    if (isWaiting) {
      setTimeout(typeEffect, isDeleting ? pauseBeforeNewText : pauseBeforeDelete);
      isWaiting = false;
      return;
    }

    if (!isDeleting && charIndex < currentText.length) {
      // Typing forward
      typewriterElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      setTimeout(typeEffect, typingSpeed);
    } else if (isDeleting && charIndex > 0) {
      // Deleting
      typewriterElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      setTimeout(typeEffect, deletingSpeed);
    } else if (!isDeleting && charIndex === currentText.length) {
      // Finished typing, wait before deleting
      isDeleting = true;
      isWaiting = true;
      setTimeout(typeEffect, pauseBeforeDelete);
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, move to next text
      isDeleting = false;
      isWaiting = true;
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      setTimeout(typeEffect, pauseBeforeNewText);
    }
  }

  // Initialize particle effect
  function initParticles(canvas, section, count = 100, colors = ["#ffffff", "#f5f5f5", "#e0e0e0"]) {
    const context = canvas.getContext("2d");
    const particles = [];
    const particleCount = count;
    const particleColors = colors;
    const connectionDistance = 150;
    const mousePosition = { x: null, y: null };
    
    // Set canvas size
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    
    // Track mouse movement for interactive particles
    section.addEventListener("mousemove", function(e) {
      const rect = canvas.getBoundingClientRect();
      mousePosition.x = e.clientX - rect.left;
      mousePosition.y = e.clientY - rect.top;
    });
    
    section.addEventListener("mouseleave", function() {
      mousePosition.x = null;
      mousePosition.y = null;
    });
    
    // Handle window resize
    window.addEventListener("resize", function() {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    });
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.25
      });
    }
    
    // Animation function
    function animate() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Move particles
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Wrap particles around canvas edges
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
        
        // Draw particle
        context.beginPath();
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context.fillStyle = p.color;
        context.globalAlpha = p.opacity;
        context.fill();
        
        // Draw connections between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distance = Math.sqrt(
            Math.pow(p.x - p2.x, 2) + 
            Math.pow(p.y - p2.y, 2)
          );
          
          if (distance < connectionDistance) {
            // Draw connection with opacity based on distance
            const opacity = 1 - (distance / connectionDistance);
            context.beginPath();
            context.moveTo(p.x, p.y);
            context.lineTo(p2.x, p2.y);
            context.strokeStyle = p.color;
            context.globalAlpha = opacity * 0.2;
            context.stroke();
          }
        }
        
        // Connect to mouse position if within range
        if (mousePosition.x && mousePosition.y) {
          const mouseDistance = Math.sqrt(
            Math.pow(p.x - mousePosition.x, 2) + 
            Math.pow(p.y - mousePosition.y, 2)
          );
          
          if (mouseDistance < connectionDistance * 1.5) {
            const opacity = 1 - (mouseDistance / (connectionDistance * 1.5));
            context.beginPath();
            context.moveTo(p.x, p.y);
            context.lineTo(mousePosition.x, mousePosition.y);
            context.strokeStyle = p.color;
            context.globalAlpha = opacity * 0.5;
            context.stroke();
          }
        }
      }
      
      // Continue animation loop
      requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
  }
  
  function animateParticles(canvas) {
    // This function is now part of initParticles
  }

  // Animate skill bars when in viewport
  function animateSkillBars(elements) {
    elements.forEach(skill => {
      const level = skill.getAttribute("data-level");
      skill.style.width = "0";
      
      // Store the target width for later animation
      skill.setAttribute("data-target", level);
    });
  }
  
  function checkSkillBarsVisibility(elements) {
    const triggerBottom = window.innerHeight * 0.8;
    
    elements.forEach(skill => {
      const skillTop = skill.getBoundingClientRect().top;
      const targetWidth = skill.getAttribute("data-target");
      
      if (skillTop < triggerBottom) {
        skill.style.width = targetWidth;
      } else {
        // Reset the width when scrolling back up (optional)
        // skill.style.width = "0";
      }
    });
  }

  // Portfolio Filter Function
  function filterPortfolio(e) {
    e.preventDefault();

    // Get the filter value
    const filter = e.target.getAttribute("data-filter");

    // Remove active class from all filters
    portfolioFilters.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active class to the clicked filter
    e.target.classList.add("active");

    // Filter the portfolio items
    portfolioItems.forEach((item) => {
      if (filter === "*" || item.classList.contains(filter.substring(1))) {
        item.style.display = "block";
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "scale(1)";
        }, 50);
      } else {
        item.style.opacity = "0";
        item.style.transform = "scale(0.8)";
        setTimeout(() => {
          item.style.display = "none";
        }, 300);
      }
    });
  }
  
  // Scroll down to content
  function scrollToContent() {
    const profileSection = document.querySelector(".profile-section");
    
    if (profileSection) {
      window.scrollTo({
        top: profileSection.offsetTop - header.offsetHeight,
        behavior: "smooth"
      });
    }
  }

  // Animate elements when they come into view
  function animateOnScroll() {
    animatedElements.forEach((element) => {
      if (isElementInViewport(element)) {
        element.classList.add("active");
      }
    });
  }

  // Helper function to check if an element is in the viewport
  function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href !== "#") {
        e.preventDefault();
        const targetElement = document.querySelector(href);

        if (targetElement) {
          // Close mobile menu if open
          if (navMenu.classList.contains("active")) {
            navToggle.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.classList.remove("menu-open");
          }

          // Scroll to the target element
          window.scrollTo({
            top: targetElement.offsetTop - header.offsetHeight,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Initialize when DOM is fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
