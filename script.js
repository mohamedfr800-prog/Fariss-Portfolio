// Three.js 3D Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("canvas-container").appendChild(renderer.domElement);

const geometries = [
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.OctahedronGeometry(1, 0),
  new THREE.TetrahedronGeometry(1, 0),
  new THREE.SphereGeometry(0.8, 32, 32),
];

const material = new THREE.MeshPhongMaterial({
  color: 0x06b6d4,
  emissive: 0x06b6d4,
  emissiveIntensity: 0.2,
  shininess: 100,
  transparent: true,
  opacity: 0.6,
  wireframe: true,
});

const secondaryMaterial = new THREE.MeshPhongMaterial({
  color: 0x8b5cf6,
  emissive: 0x8b5cf6,
  emissiveIntensity: 0.2,
  shininess: 100,
  transparent: true,
  opacity: 0.6,
  wireframe: true,
});

const shapes = [];

for (let i = 0; i < 15; i++) {
  const geometry = geometries[Math.floor(Math.random() * geometries.length)];
  const mat = Math.random() > 0.5 ? material : secondaryMaterial;
  const mesh = new THREE.Mesh(geometry, mat);

  mesh.position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 10 - 5,
  );

  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

  mesh.userData = {
    rotationSpeed: {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
    },
    floatSpeed: Math.random() * 0.002 + 0.001,
    floatOffset: Math.random() * Math.PI * 2,
    originalY: mesh.position.y,
  };

  scene.add(mesh);
  shapes.push(mesh);
}

const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight1 = new THREE.PointLight(0x06b6d4, 2, 50);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x8b5cf6, 2, 50);
pointLight2.position.set(-10, -10, 10);
scene.add(pointLight2);

camera.position.z = 5;

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX - windowHalfX) / 100;
  mouseY = (event.clientY - windowHalfY) / 100;
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  targetX = mouseX * 0.5;
  targetY = mouseY * 0.5;

  camera.position.x += (targetX - camera.position.x) * 0.05;
  camera.position.y += (-targetY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  shapes.forEach((shape, index) => {
    shape.rotation.x += shape.userData.rotationSpeed.x;
    shape.rotation.y += shape.userData.rotationSpeed.y;

    shape.position.y =
      shape.userData.originalY +
      Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) *
        0.5;
  });

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 3D Tilt Effect for Cards
const cards = document.querySelectorAll("[data-tilt]");

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  });
});

// Mobile menu toggle
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", function (e) {
  e.preventDefault();
  mobileMenu.classList.toggle("hidden");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("bg-primary/90");
  } else {
    navbar.classList.remove("bg-primary/90");
  }
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      mobileMenu.classList.add("hidden");
    }
  });
});

// Project Details Modal
function showProjectDetails(type) {
  const details = {
    data: "Data Analysis Dashboard: Built with Python (Pandas, NumPy, Matplotlib) and SQL. Features include data cleaning, complex queries, interactive visualizations, and automated reporting.",
    web: "E-Commerce Interface: Full responsive frontend built with HTML5, CSS3, and JavaScript. Includes product filtering, shopping cart functionality, and mobile-first design.",
    algo: "Algorithmic Solutions: Implementation of efficient sorting algorithms, graph traversal, and dynamic programming solutions in C and Java for competitive programming contests.",
  };

  // Create custom modal instead of alert
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm";
  modal.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-md w-full transform scale-100 transition-transform border border-gray-700">
      <h3 class="text-2xl font-bold text-white mb-4 font-display">Project Details</h3>
      <p class="text-gray-300 mb-6 leading-relaxed">${details[type]}</p>
      <button onclick="this.closest('.fixed').remove()" class="w-full bg-accent text-primary font-bold py-3 rounded-xl hover:bg-cyan-400 transition-colors">
        Close
      </button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Coming Soon Modal
function showComingSoon() {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm";
  modal.innerHTML = `
    <div class="glass rounded-2xl p-8 max-w-sm w-full text-center border border-gray-700">
      <div class="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-clock text-3xl text-accent"></i>
      </div>
      <h3 class="text-2xl font-bold text-white mb-2 font-display">Coming Soon</h3>
      <p class="text-gray-400 mb-6">This feature is currently under development. Check back later!</p>
      <button onclick="this.closest('.fixed').remove()" class="bg-accent text-primary font-bold px-8 py-3 rounded-full hover:bg-cyan-400 transition-colors">
        Got it
      </button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Contact Form Handler
document
  .getElementById("contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Show success modal
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm";
    modal.innerHTML = `
      <div class="glass rounded-2xl p-8 max-w-sm w-full text-center border border-gray-700 transform scale-100 animate-pulse-glow">
        <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-check text-3xl text-green-500"></i>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2 font-display">Message Sent!</h3>
        <p class="text-gray-400 mb-6">Thank you for reaching out. I'll get back to you as soon as possible.</p>
        <button onclick="this.closest('.fixed').remove()" class="bg-gradient-to-r from-accent to-secondary text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition-colors">
          Close
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    // Reset form
    this.reset();

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  });

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("opacity-100", "translate-y-0");
      entry.target.classList.remove("opacity-0", "translate-y-10");

      // Animate skill bars when in view
      const skillBars = entry.target.querySelectorAll(".skill-bar");
      skillBars.forEach((bar) => {
        const width = bar.style.width;
        bar.style.width = "0";
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      });
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll("section").forEach((section) => {
  section.classList.add(
    "transition-all",
    "duration-1000",
    "opacity-0",
    "translate-y-10",
  );
  observer.observe(section);
});

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector("#home .floating");
  if (parallax) {
    parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// Typing effect for hero subtitle (optional enhancement)
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = "";

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Initialize typing effect on page load
window.addEventListener("load", () => {
  const subtitle = document.querySelector("#home h2");
  if (subtitle) {
    const originalText = subtitle.textContent;
    typeWriter(subtitle, originalText, 30);
  }
});

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Close any open modals
    const modals = document.querySelectorAll(".fixed.inset-0");
    modals.forEach((modal) => modal.remove());
  }
});

// Performance optimization: Pause animations when tab is hidden
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Pause expensive animations
    shapes.forEach((shape) => {
      shape.userData.rotationSpeed.x = 0;
      shape.userData.rotationSpeed.y = 0;
    });
  } else {
    // Resume animations
    shapes.forEach((shape) => {
      shape.userData.rotationSpeed.x = (Math.random() - 0.5) * 0.01;
      shape.userData.rotationSpeed.y = (Math.random() - 0.5) * 0.01;
    });
  }
});

// Export functions for global access
window.showProjectDetails = showProjectDetails;
window.showComingSoon = showComingSoon;
