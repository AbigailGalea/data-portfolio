document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-links a');
  const navIndicator = document.querySelector('.nav-indicator');
  const scrollTargets = document.querySelectorAll('section[id], footer[id]');

  const updateIndicator = (activeLink) => {
    if (!navIndicator || !activeLink) return;

    const navRect = activeLink.parentElement.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const left = linkRect.left - navRect.left + (linkRect.width / 2);
    const top = linkRect.bottom - navRect.top + 4;

    navIndicator.style.left = `${left}px`;
    navIndicator.style.top = `${top}px`;
    navIndicator.style.opacity = '1';
  };

  // Helper function to update the active class manually
  const setActiveLink = (targetId) => {
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${targetId}`) {
        link.classList.add('active');
      }
    });

    const activeLink = document.querySelector(`.nav-links a[href="#${targetId}"]`);
    updateIndicator(activeLink);
  };

  const getTargetElement = (targetId) => {
    return document.getElementById(targetId);
  };

  // --- 1. CLICK TO SCROLL & MOVE DOT INSTANTLY ---
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetHref = link.getAttribute('href');

      if (targetHref && targetHref.startsWith('#')) {
        e.preventDefault();
        const cleanId = targetHref.replace('#', '');
        const targetElement = getTargetElement(cleanId);

        // Move the dot immediately to the clicked item
        setActiveLink(cleanId);

        if (targetElement) {
          // Temporarily disable the scroll listener so it doesn't fight the click
          window.removeEventListener('scroll', handleScroll);

          // Scroll smoothly to the target
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Re-enable scroll listener after the smooth scroll finishes
          setTimeout(() => {
            window.addEventListener('scroll', handleScroll);
          }, 800); // 800ms is standard smooth scroll duration
        }
      }
    });
  });

  // --- 2. ACTIVE NAV HIGHLIGHT ON SCROLL ---
  const handleScroll = () => {
    let currentSectionId = "";

    // Check if user has scrolled to the bottom of the page
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 60;

    if (isAtBottom && scrollTargets.length > 0) {
      currentSectionId = scrollTargets[scrollTargets.length - 1].getAttribute('id');
    } else {
      scrollTargets.forEach(target => {
        const targetTop = target.offsetTop - 120; // Offset for spacing
        const targetHeight = target.offsetHeight;

        if (window.scrollY >= targetTop && window.scrollY < targetTop + targetHeight) {
          currentSectionId = target.getAttribute('id');
        }
      });
    }

    if (currentSectionId) {
      setActiveLink(currentSectionId);
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Set initial active link on page load

  // --- 3. 3D CARD TILT EFFECT ON HOVER ---
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0px) perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });

  // --- 4. SAFE THEME TOGGLE WITH HERO IMAGE SWITCH ---
  const heroImage = document.querySelector('.hero-image');
  const themeToggle = document.getElementById('themeToggle');

  const updateHeroImage = () => {
    if (!heroImage) return;
    heroImage.src = document.body.classList.contains('light-theme')
      ? 'src/cat_image_light.png'
      : 'src/cat_image.png';
  };

  updateHeroImage();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
      updateHeroImage();
    });
  }
});