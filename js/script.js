document.addEventListener("DOMContentLoaded", function () {
  // Preloader
  window.addEventListener("load", function () {
    const preloader = document.querySelector(".preloader");
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  });

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });

        // Close mobile menu if open
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse.classList.contains("show")) {
          navbarCollapse.classList.remove("show");
        }
      }
    });
  });

  // Back to top button
  const backToTopButton = document.querySelector(".back-to-top");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("active");
    } else {
      backToTopButton.classList.remove("active");
    }
  });

  backToTopButton.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Portfolio filtering
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

      portfolioItems.forEach((item) => {
        if (
          filterValue === "all" ||
          item.getAttribute("data-category") === filterValue
        ) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // Testimonial slider
  const testimonialItems = document.querySelectorAll(".testimonial-item");
  const testimonialDots = document.querySelectorAll(".testimonial-dots .dot");
  const prevButton = document.querySelector(".testimonial-prev");
  const nextButton = document.querySelector(".testimonial-next");

  let currentTestimonial = 0;

  function showTestimonial(index) {
    testimonialItems.forEach((item) => item.classList.remove("active"));
    testimonialDots.forEach((dot) => dot.classList.remove("active"));

    testimonialItems[index].classList.add("active");
    testimonialDots[index].classList.add("active");
    currentTestimonial = index;
  }

  testimonialDots.forEach((dot, index) => {
    dot.addEventListener("click", () => showTestimonial(index));
  });

  prevButton.addEventListener("click", () => {
    currentTestimonial =
      (currentTestimonial - 1 + testimonialItems.length) %
      testimonialItems.length;
    showTestimonial(currentTestimonial);
  });

  nextButton.addEventListener("click", () => {
    currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
    showTestimonial(currentTestimonial);
  });

  // Auto-rotate testimonials
  setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
    showTestimonial(currentTestimonial);
  }, 5000);

  // Initialize first testimonial
  showTestimonial(0);

  // Form submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      // Here you would typically send the form data to a server
      // For demo purposes, we'll just show an alert
      alert(
        `Thank you, ${name}! Your message has been sent. We'll get back to you soon.`
      );

      // Reset form
      contactForm.reset();
    });
  }

  // Initialize WebGL background
  initWebGLBackground();
});

// WebGL Background Animation
function initWebGLBackground() {
  const canvas = document.getElementById("webgl-canvas");
  if (!canvas) return;

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Check for WebGL support
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) {
    console.warn("WebGL not supported, falling back to 2D background");
    return;
  }

  // Vertex shader source
  const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
            gl_PointSize = 3.0;
        }
    `;

  // Fragment shader source
  const fragmentShaderSource = `
        precision mediump float;
        uniform vec3 u_color;
        void main() {
            gl_FragColor = vec4(u_color, 0.5);
        }
    `;

  // Compile shader
  function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  // Create shader program
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(
    gl,
    fragmentShaderSource,
    gl.FRAGMENT_SHADER
  );
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program linking error:", gl.getProgramInfoLog(program));
    return;
  }

  gl.useProgram(program);

  // Get attribute and uniform locations
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const colorUniformLocation = gl.getUniformLocation(program, "u_color");

  // Create buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Enable attribute
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // Set color (orange)
  gl.uniform3f(colorUniformLocation, 1.0, 0.42, 0.2);

  // Generate random points
  const numPoints = 100;
  const positions = new Float32Array(numPoints * 2);
  const velocities = new Float32Array(numPoints * 2);

  for (let i = 0; i < numPoints; i++) {
    positions[i * 2] = Math.random() * 2 - 1; // x (-1 to 1)
    positions[i * 2 + 1] = Math.random() * 2 - 1; // y (-1 to 1)
    velocities[i * 2] = (Math.random() - 0.5) * 0.005; // x velocity
    velocities[i * 2 + 1] = (Math.random() - 0.5) * 0.005; // y velocity
  }

  // Animation loop
  function animate() {
    // Update positions
    for (let i = 0; i < numPoints; i++) {
      positions[i * 2] += velocities[i * 2];
      positions[i * 2 + 1] += velocities[i * 2 + 1];

      // Bounce off edges
      if (positions[i * 2] > 1.0 || positions[i * 2] < -1.0) {
        velocities[i * 2] *= -1;
      }
      if (positions[i * 2 + 1] > 1.0 || positions[i * 2 + 1] < -1.0) {
        velocities[i * 2 + 1] *= -1;
      }
    }

    // Update buffer data
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);

    // Clear canvas
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw points
    gl.drawArrays(gl.POINTS, 0, numPoints);

    requestAnimationFrame(animate);
  }

  // Start animation
  animate();

  // Handle window resize
  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  });
}

// Initialize floating animations
document.addEventListener("DOMContentLoaded", function () {
  // Add floating effect to service cards
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      this.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    card.addEventListener("mouseenter", function () {
      this.style.transition = "none";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transition = "all 0.5s ease";
      this.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  });

  // Add tilt effect to portfolio items
  const portfolioItems = document.querySelectorAll(".portfolio-card");
  portfolioItems.forEach((item) => {
    VanillaTilt.init(item, {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
      scale: 1.03,
    });
  });
});
