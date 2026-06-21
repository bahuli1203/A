/**
 * Akash Shingate - Cybersecurity Portfolio JS Engine
 * Features: Canvas Particles, Shell Simulator, Threat Telemetry,
 *           3D Hover Tilt, Smooth Scroll Spy, Contact Console Submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  initNavbar();
  initMouseGlow();
  initCanvasParticles();
  initTypewriter();
  initTerminalSimulator();
  initThreatMonitor();
  initToolTilt();
  initScrollReveal();
  initContactForm();
  initCertLightbox();
});

/* ==========================================
   1. HUD Navbar & Scroll Spy
   ========================================== */
function initNavbar() {
  const navbar = document.querySelector('.hud-navbar');
  const navLinks = document.querySelectorAll('.navbar-links li');
  const sections = document.querySelectorAll('section[id]');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navbarLinksContainer = document.querySelector('.navbar-links');

  // Sticky border & background shift on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Spy active state
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(li => {
      li.classList.remove('active');
      const a = li.querySelector('a');
      if (a && a.getAttribute('href') === `#${currentSectionId}`) {
        li.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  if (mobileMenuBtn && navbarLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      navbarLinksContainer.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when link is clicked
    navbarLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navbarLinksContainer.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      });
    });
  }
}

/* ==========================================
   2. Cursor Ambient Glow Tracker
   ========================================== */
function initMouseGlow() {
  const glow = document.querySelector('.ambient-mouse-glow');
  if (!glow) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* ==========================================
   3. Canvas Particle Network (Cyber Grid)
   ========================================== */
function initCanvasParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 25000));
  const connectionDistance = 120;
  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      // Regular movement
      this.x += this.vx;
      this.y += this.vy;

      // Bounce on borders
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interactive push/pull
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          // Attract slightly
          this.x += (dx / dist) * force * 0.5;
          this.y += (dy / dist) * force * 0.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 26, 26, 0.4)';
      ctx.fill();
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw grid connections
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 26, 26, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================
   4. Hero Typewriter Animation
   ========================================== */
function initTypewriter() {
  const container = document.getElementById('typewriter-text');
  if (!container) return;

  const phrases = [
    'Web Application Security Testing',
    'RESTful API Vulnerability Assessment',
    'Mobile Application Security Auditing',
    'Infrastructure & Network Penetration Testing',
    'Security Hardening & Configuration Review'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentPhrase = phrases[phraseIdx];
    
    if (isDeleting) {
      container.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35; // Deleting is faster
    } else {
      container.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 70; // Typing speed
    }

    // Append cursor manually to prevent rendering bugs
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    container.appendChild(cursor);

    if (!isDeleting && charIdx === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full string
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 500; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================
   5. Interactive VAPT Terminal Widget
   ========================================== */
function initTerminalSimulator() {
  const body = document.getElementById('hero-terminal-body');
  if (!body) return;

  const logs = [
    { text: 'root@blackbox:~# nmap -sV -p- -T4 192.168.12.105', type: 'cmd' },
    { text: '[+] Nmap scan initiated at 10:38:00 UTC', type: 'info' },
    { text: '[+] Host 192.168.12.105 is UP. Latency: 4.2ms', type: 'info' },
    { text: '[*] Scanning 65535 ports...', type: 'info' },
    { text: '    Port 22/tcp:  OPEN (OpenSSH 8.9p1 Ubuntu)', type: 'vuln' },
    { text: '    Port 80/tcp:  OPEN (Apache httpd 2.4.52)', type: 'vuln' },
    { text: '    Port 443/tcp: OPEN (Apache httpd 2.4.52 - SSL/TLS)', type: 'vuln' },
    { text: '    Port 8080/tcp: OPEN (Apache Tomcat 9.0.58)', type: 'vuln' },
    { text: '[+] Nmap finished. 4 ports discovered open.', type: 'success' },
    { text: 'root@blackbox:~# dirb http://192.168.12.105:8080/ -w /usr/share/wordlists/dirb/common.txt', type: 'cmd' },
    { text: '[+] Directory traversal scanner active...', type: 'info' },
    { text: '    ==> DIRECTORY: http://192.168.12.105:8080/manager/ (200 OK)', type: 'vuln' },
    { text: '    ==> DIRECTORY: http://192.168.12.105:8080/docs/ (200 OK)', type: 'info' },
    { text: '    ==> DIRECTORY: http://192.168.12.105:8080/api/v1/ (200 OK)', type: 'info' },
    { text: 'root@blackbox:~# python3 exploit_tomcat_lfi.py -u http://192.168.12.105:8080 -p /etc/passwd', type: 'cmd' },
    { text: '[*] Target Endpoint: /api/v1/download?path=../../../../etc/passwd', type: 'info' },
    { text: '[!] Directory Traversal detected. Retrieving payload response...', type: 'warning' },
    { text: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin', type: 'data' },
    { text: '[+] VULNERABILITY CONFIRMED: LFI (Local File Inclusion)', type: 'danger' },
    { text: '[+] MITIGATION: Hardening file-path validation filter on controller api.', type: 'success' },
    { text: 'root@blackbox:~# ./verify_hardening.sh', type: 'cmd' },
    { text: '[+] Injecting escape vectors /..//..//etc/passwd... BLOCKED (400 Bad Request)', type: 'success' },
    { text: '[+] Mitigation verified. Endpoint secured successfully.', type: 'success' }
  ];

  let logIdx = 0;

  function printNextLog() {
    if (logIdx >= logs.length) {
      body.innerHTML = '';
      logIdx = 0;
    }

    const log = logs[logIdx];
    const logEl = document.createElement('div');

    if (log.type === 'cmd') {
      logEl.innerHTML = `<span class="terminal-prompt">akash@vapt:~$</span> <span style="color: #fff;">${log.text.replace('root@blackbox:~# ', '')}</span>`;
    } else if (log.type === 'vuln') {
      logEl.innerHTML = `<span style="color: #ffcc00;">${log.text}</span>`;
    } else if (log.type === 'danger') {
      logEl.innerHTML = `<span style="color: #ff1a1a; font-weight: bold; text-shadow: 0 0 5px rgba(255,26,26,0.3);">${log.text}</span>`;
    } else if (log.type === 'warning') {
      logEl.innerHTML = `<span style="color: #ff7700;">${log.text}</span>`;
    } else if (log.type === 'success') {
      logEl.innerHTML = `<span style="color: #00ff66;">${log.text}</span>`;
    } else if (log.type === 'data') {
      logEl.innerHTML = `<pre style="color: #66ccff; font-family: inherit; font-size: 0.75rem; margin-left: 10px;">${log.text}</pre>`;
    } else {
      logEl.innerHTML = `<span style="color: #9ea4b0;">${log.text}</span>`;
    }

    body.appendChild(logEl);
    body.scrollTop = body.scrollHeight;
    logIdx++;

    // Control speed based on message type
    let nextDelay = 1000;
    if (log.type === 'cmd') nextDelay = 1800;
    if (log.type === 'data') nextDelay = 1500;
    if (log.type === 'info') nextDelay = 800;

    setTimeout(printNextLog, nextDelay);
  }

  printNextLog();
}

/* ==========================================
   6. Live Threat Monitor Widget (HUD Side)
   ========================================== */
function initThreatMonitor() {
  const container = document.getElementById('threat-list');
  if (!container) return;

  const threatVectors = [
    { name: 'SQL Injection', severity: 'HIGH', port: 443 },
    { name: 'SSH Brute Force', severity: 'HIGH', port: 22 },
    { name: 'API Rate Limit Abuse', severity: 'LOW', port: 443 },
    { name: 'XSS Exploit Probe', severity: 'MEDIUM', port: 80 },
    { name: 'IDOR Access Attempt', severity: 'HIGH', port: 8080 },
    { name: 'RCE Shell Upload Attempt', severity: 'CRITICAL', port: 443 },
    { name: 'SMB Exploit Scan', severity: 'HIGH', port: 445 }
  ];

  const ips = [
    '185.220.101.4', '45.143.203.18', '91.241.19.102', '109.202.107.5', 
    '141.98.81.29', '198.51.100.42', '203.0.113.88', '193.106.191.5'
  ];

  function generateThreat() {
    const vector = threatVectors[Math.floor(Math.random() * threatVectors.length)];
    const ip = ips[Math.floor(Math.random() * ips.length)];
    const isHigh = vector.severity === 'HIGH' || vector.severity === 'CRITICAL';
    
    const item = document.createElement('div');
    item.className = 'threat-item';
    item.innerHTML = `
      <div class="threat-meta">
        <span class="threat-ip">${ip}</span>
        <span class="threat-type">${vector.name} [Port ${vector.port}]</span>
      </div>
      <span class="threat-status ${isHigh ? 'high' : ''}">${isHigh ? 'BLOCKED' : 'MITIGATED'}</span>
    `;

    // Prepend to top of list
    container.insertBefore(item, container.firstChild);

    // Keep maximum 8 elements in DOM to prevent performance issues
    if (container.children.length > 8) {
      container.removeChild(container.lastChild);
    }
  }

  // Populate first 4 elements initially
  for (let i = 0; i < 4; i++) {
    generateThreat();
  }

  // Set interval to inject new alerts periodically
  setInterval(generateThreat, 4000);
}

/* ==========================================
   7. Interactive Tool Cards 3D Tilt Effect
   ========================================== */
function initToolTilt() {
  const cards = document.querySelectorAll('.tool-card');
  if (cards.length === 0) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation angles (range -12 to 12 degrees)
      const rotateX = -12 * ((y - height / 2) / (height / 2));
      const rotateY = 12 * ((x - width / 2) / (width / 2));
      
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

/* ==========================================
   8. Scroll Reveal Animations (Observer)
   ========================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // If it is the skills section, animate progress bars
        if (entry.target.id === 'skills') {
          animateProgressBars();
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

function animateProgressBars() {
  const progressBars = document.querySelectorAll('.skill-progress');
  progressBars.forEach(bar => {
    const targetPercent = bar.getAttribute('data-percent');
    bar.style.width = targetPercent + '%';
  });
}

/* ==========================================
   9. Command Center Contact Form & Sim Terminal
   ========================================== */
function initContactForm() {
  const btn = document.getElementById('btn-initiate-contact');
  const consoleOut = document.getElementById('form-console');
  const tunnelStatus = document.getElementById('tunnel-status');
  if (!btn || !consoleOut) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    // Disable button to prevent multiple triggers
    btn.setAttribute('disabled', 'true');
    btn.style.opacity = '0.6';
    btn.style.cursor = 'not-allowed';
    btn.innerHTML = `<i data-lucide="loader-2" class="spin-icon" style="width: 16px; height: 16px; display: inline-block;"></i> SECURING LINK...`;
    
    // If Lucide is imported, re-create icons to show spinner icon
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Update state to CONNECTING
    if (tunnelStatus) {
      tunnelStatus.textContent = 'CONNECTING';
      tunnelStatus.style.color = '#ff9900';
    }

    // Show simulation terminal
    consoleOut.style.display = 'block';
    consoleOut.innerHTML = '';
    consoleOut.scrollTop = 0;

    const steps = [
      { text: '[~] Initializing handshake sequence...', delay: 300 },
      { text: '[~] Routing through gateway proxy for anonymity...', delay: 700 },
      { text: '[~] Gateway handshake: SUCCESSFUL', delay: 1100 },
      { text: '[~] Exchanging ECDHE-RSA keys with relay...', delay: 1500 },
      { text: '[+] Negotiated encryption block: AES-256-GCM', delay: 1900 },
      { text: '[~] Authenticating destination: forms.gle/odh2o88VVuPUpxkt6', delay: 2300 },
      { text: '[+] SECURE TUNNEL ESTABLISHED.', delay: 2700 },
      { text: '[+] Redirecting to secure channel...', delay: 3100 }
    ];

    steps.forEach(step => {
      setTimeout(() => {
        const line = document.createElement('div');
        if (step.text.includes('SUCCESSFUL') || step.text.includes('ESTABLISHED') || step.text.includes('AES-256')) {
          line.innerHTML = `<span style="color: #00ff66; font-weight: bold;">${step.text}</span>`;
        } else if (step.text.includes('Redirecting') || step.text.includes('handshake') || step.text.includes('Routing')) {
          line.innerHTML = `<span style="color: #ff9900;">${step.text}</span>`;
        } else {
          line.innerHTML = `<span>${step.text}</span>`;
        }
        consoleOut.appendChild(line);
        consoleOut.scrollTop = consoleOut.scrollHeight;

        // Perform final transition and redirection
        if (step.delay === 3100) {
          if (tunnelStatus) {
            tunnelStatus.textContent = 'ESTABLISHED';
            tunnelStatus.style.color = '#00ff66';
          }
          setTimeout(() => {
            window.location.href = 'https://forms.gle/odh2o88VVuPUpxkt6';
          }, 800);
        }
      }, step.delay);
    });
  });
}

/* ==========================================
   10. Certificate Lightbox Modal
   ========================================== */
function initCertLightbox() {
  const certCards = document.querySelectorAll('.cert-card');
  const profilePicFrame = document.querySelector('.hero-avatar-frame');
  const lightbox = document.getElementById('cert-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');

  if (!lightbox || !lightboxImg || !lightboxCaption) return;

  // Open Lightbox for cert cards
  if (certCards.length > 0) {
    certCards.forEach(card => {
      card.addEventListener('click', () => {
        const src = card.getAttribute('data-cert-src');
        const title = card.getAttribute('data-cert-title');
        
        if (src) {
          lightboxImg.src = src;
          lightboxCaption.textContent = title || '';
          lightbox.classList.add('active');
          lightbox.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden'; // Lock background scrolling
        }
      });
    });
  }

  // Open Lightbox for profile pic
  if (profilePicFrame) {
    profilePicFrame.addEventListener('click', () => {
      const avatarImg = profilePicFrame.querySelector('.hero-avatar');
      const src = avatarImg ? avatarImg.getAttribute('src') : 'A.png';
      const title = avatarImg ? avatarImg.getAttribute('alt') : 'Akash Shingate';
      
      lightboxImg.src = src;
      lightboxCaption.textContent = title;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    });
  }

  // Close Lightbox function
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock scrolling
    setTimeout(() => {
      lightboxImg.src = '';
      lightboxCaption.textContent = '';
    }, 300); // Clear source after transition completes
  }

  // Close triggers
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    // Only close if user clicked directly on the overlay backdrop
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Escape key support
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

