

// ============================================================
// PIXEL CURSOR
// ============================================================
const curEl   = document.getElementById('px-cursor');
const trailEl = document.getElementById('px-trail');

document.addEventListener('mousemove', e => {
  curEl.style.left   = (e.clientX - 5) + 'px';
  curEl.style.top    = (e.clientY - 5) + 'px';
  trailEl.style.left = (e.clientX - 3) + 'px';
  trailEl.style.top  = (e.clientY - 3) + 'px';
});

document.querySelectorAll(
  'a,button,.interest-card,.win-file,.humor-card,.book-card,' +
  '.tool-btn,.color-swatch,.social-link,.stab,.win-mi,.win-btn,.humor-mini'
).forEach(el => {
  el.addEventListener('mouseenter', () => curEl.classList.add('hover'));
  el.addEventListener('mouseleave', () => curEl.classList.remove('hover'));
});
// ============================================================
// DRAGGABLE PHOTO
// ============================================================
(function initPhotoDrag() {
  const el = document.getElementById('photo-drag');
  if (!el) return;
  let dragging = false, startX, startY, tx = 0, ty = 0, lastTx = 0, lastTy = 0;
  el.addEventListener('mousedown', e => {
    // don't initiate drag if clicking a corner decoration
    dragging = true;
    startX = e.clientX - lastTx;
    startY = e.clientY - lastTy;
    el.classList.add('dragging');
    el.style.transition = 'none';
    e.preventDefault();
  });
  el.addEventListener('touchstart', e => {
    dragging = true;
    startX = e.touches[0].clientX - lastTx;
    startY = e.touches[0].clientY - lastTy;
    el.classList.add('dragging');
    el.style.transition = 'none';
  }, { passive: true });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    tx = e.clientX - startX;
    ty = e.clientY - startY;
    el.style.transform = `translate(${tx}px,${ty}px)`;
  });
  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    tx = e.touches[0].clientX - startX;
    ty = e.touches[0].clientY - startY;
    el.style.transform = `translate(${tx}px,${ty}px)`;
  }, { passive: true });
  function stopDrag() {
    if (!dragging) return;
    dragging = false;
    lastTx = tx; lastTy = ty;
    el.classList.remove('dragging');
    el.style.transition = 'transform .25s cubic-bezier(.23,1,.32,1)';
  }
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
  // Double-click to snap back
  el.addEventListener('dblclick', () => {
    tx = 0; ty = 0; lastTx = 0; lastTy = 0;
    el.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
    el.style.transform = 'translate(0,0)';
  });
})();
// ============================================================
// MULTILANGUAGE GREETING ROTATOR
// ============================================================
(function initGreeting() {
  const words = document.querySelectorAll('.greeting-word');
  let cur = 0;
  setInterval(() => {
    words[cur].classList.remove('active');
    cur = (cur + 1) % words.length;
    words[cur].classList.add('active');
  }, 2200);
})();


// ============================================================
// IMAGE LIGHTBOX
// ============================================================
var lbRatings    = JSON.parse(localStorage.getItem('dssram-lb-ratings') || '{}');
var lbCurrentKey = '';

function openLightbox(src, label) {
  lbCurrentKey = src;
  document.getElementById('lb-img').src           = src;
  document.getElementById('lb-label').textContent  = label || '';
  document.getElementById('lb-thanks').style.display = 'none';
  updateStars(lbRatings[src] || 0, false);
  document.getElementById('img-lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('img-lightbox').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(function() {
    document.getElementById('lb-img').src = '';
  }, 400);
}

function lbBgClick(e) {
  if (e.target === document.getElementById('img-lightbox')) closeLightbox();
}

function updateStars(count, isHover) {
  document.querySelectorAll('.lb-star').forEach(function(s) {
    s.classList.remove('lit', 'hover-lit');
    if (+s.dataset.v <= count) {
      s.classList.add(isHover ? 'hover-lit' : 'lit');
    }
  });
}

document.querySelectorAll('.lb-star').forEach(function(star) {
  star.addEventListener('mouseenter', function() {
    updateStars(+star.dataset.v, true);
  });
  star.addEventListener('mouseleave', function() {
    updateStars(lbRatings[lbCurrentKey] || 0, false);
  });
  star.addEventListener('click', function() {
    var v = +star.dataset.v;
    lbRatings[lbCurrentKey] = v;
    localStorage.setItem('dssram-lb-ratings', JSON.stringify(lbRatings));
    updateStars(v, false);
    var t = document.getElementById('lb-thanks');
    t.style.display  = 'block';
    t.textContent = ['','⭐ Noted!','⭐⭐ Cool!','⭐⭐⭐ Nice!',
                     '⭐⭐⭐⭐ Love it!','⭐⭐⭐⭐⭐ Too kind!'][v];
  });
});

// Make wp-img elements open lightbox on click
document.querySelectorAll('.wp-img').forEach(function(img) {
  img.style.cursor = 'pointer';
  img.addEventListener('click', function() {
    if (!img.src || img.getAttribute('src') === '') return;
    openLightbox(img.src, img.alt || 'Design Work');
  });
});

// ============================================================
// 3D FLYING AUTHOR QUOTES (Books section)
// ============================================================
(function initQuotes() {
  var scene = document.getElementById('quotes-scene');
  if (!scene) return;
  var quotes = [
    '"A reader lives a thousand lives before he dies."',
    '"Not all those who wander are lost."',
    '"So we beat on, boats against the current."',
    '"It was the best of times, it was the worst of times."',
    '"Imagination is more important than knowledge."',
    '"We accept the love we think we deserve."',
    '"Time you enjoy wasting is not wasted time."',
    '"Stay hungry, stay foolish."',
    '"There is no friend as loyal as a book."',
    '"Words are our most inexhaustible source of magic."',
    '"I am not afraid of storms, for I am learning to sail."',
    '"So many books, so little time."',
    '"Call me Ishmael."',
    '"To be or not to be, that is the question."',
    '"All animals are equal, but some are more equal."',
    '"The journey of a thousand miles begins with one step."',
    '"In the beginning was the Word."',
    '"It is a truth universally acknowledged..."',
  ];
  quotes.forEach(function(q) {
    var el  = document.createElement('div');
    el.className = 'q-float';
    el.textContent = q;
    var dur   = (16 + Math.random() * 16).toFixed(1);
    var delay = (-(Math.random() * parseFloat(dur))).toFixed(1);
    el.style.left             = (5 + Math.random() * 80).toFixed(1) + '%';
    el.style.animationDuration = dur   + 's';
    el.style.animationDelay   = delay + 's';
    scene.appendChild(el);
  });
})();

   // ============================================================
// 3D CARD TILT on mouse move
// ============================================================
(function initTilt() {
  var tiltCards = document.querySelectorAll(
    '.interest-card, .humor-card, .book-card'
  );

  tiltCards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect   = card.getBoundingClientRect();
      var cx     = rect.left + rect.width  / 2;
      var cy     = rect.top  + rect.height / 2;
      var dx     = (e.clientX - cx) / (rect.width  / 2);
      var dy     = (e.clientY - cy) / (rect.height / 2);
      var rotX   = -dy * 8;   // max 8deg tilt
      var rotY   =  dx * 8;
      card.style.transform =
        'perspective(800px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-8px) scale(1.02)';
      card.style.boxShadow =
        (dx * 8) + 'px ' + (dy * 8 + 16) + 'px 40px rgba(0,0,0,.25),' +
        '0 0 20px rgba(255,107,26,.08)';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform  = '';
      card.style.boxShadow  = '';
      card.style.transition =
        'transform .5s cubic-bezier(.23,1,.32,1), box-shadow .5s cubic-bezier(.23,1,.32,1)';
    });

    card.addEventListener('mouseenter', function() {
      card.style.transition = 'none';
    });
  });
})();

// ============================================================
// STORY SECTION — paragraph scroll reveals with stagger
// ============================================================
(function initStory() {
  var paras = document.querySelectorAll('.story-para');
  var storyObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var idx = Array.from(paras).indexOf(el);
        setTimeout(function() {
          el.classList.add('visible');
        }, idx * 120);
        storyObs.unobserve(el);
      }
    });
  }, { threshold: 0.15 });
  paras.forEach(function(p) { storyObs.observe(p); });
})();
// ============================================================
// NAV HAMBURGER
// ============================================================
function toggleNav() {
  document.getElementById('nav-links').classList.toggle('open');
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('nav')) {
    document.getElementById('nav-links').classList.remove('open');
  }
});

// ============================================================
// SCROLL REVEAL
// ============================================================
var revealObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-l').forEach(function(el) {
  revealObs.observe(el);
});

// ============================================================
// PARALLAX
// ============================================================
window.addEventListener('scroll', function() {
  var y    = window.scrollY;
  var grid = document.getElementById('hero-grid');
  var pu   = document.querySelector('.photo-universe');
  if (grid) {
    grid.style.transform =
      'perspective(600px) rotateX(18deg) scale(1.3) translateY(' + (y * 0.13) + 'px)';
  }
  if (pu && !pu.classList.contains('dragging')) {
    pu.style.transform = 'translateY(' + (y * 0.04) + 'px)';
  }
});

// ============================================================
// WINDOWS EXPLORER — winSel (single clean declaration)
// ============================================================
var winData = {
  designs: {
    name: 'Designs',
    desc: 'Original design work · Figma · Illustrations',
    meta: 'Type: Folder\nPath: C:\\DSSRam\\Design\\'
  },
  ui: {
    name: 'UI Exploration',
    desc: 'Wireframes · Experiments · Component explorations',
    meta: 'Type: Folder\nPath: C:\\DSSRam\\UI\\'
  },
  content: {
    name: 'Content Creation',
    desc: 'Posts · Graphics · Reels · Thumbnails',
    meta: 'Type: Folder\nPath: C:\\DSSRam\\Content\\'
  },
  app: {
    name: 'App Design',
    desc: 'App screens · User flows · Prototypes',
    meta: 'Type: Folder\nPath: C:\\DSSRam\\Apps\\'
  },
  motion: {
    name: 'Motion.ae',
    desc: 'Motion graphics — dropping soon.',
    meta: 'Status: In progress'
  },
  brand: {
    name: 'Brand Kit',
    desc: 'Brand guidelines — dropping soon.',
    meta: 'Status: In progress'
  }
};

function winSel(el, key) {
  document.querySelectorAll('.win-file').forEach(function(f) {
    f.classList.remove('selected');
  });
  el.classList.add('selected');

  var d = winData[key] || {};
  document.getElementById('wp-name').textContent = d.name || '';
  document.getElementById('wp-desc').textContent = d.desc || '';
  document.getElementById('wp-meta').textContent = d.meta || '';

  document.querySelectorAll('.wp-section').forEach(function(s) {
    s.style.display = 'none';
  });

  var pane = document.getElementById('wp-' + key);
  if (pane) {
    pane.style.display = 'block';
    pane.querySelectorAll('.wp-img').forEach(function(img) {
      img.style.cursor = 'pointer';
      img.onclick = function() {
        if (!img.src || img.getAttribute('src') === '') return;
        openLightbox(img.src, img.alt || d.name);
      };
    });
  }

  var statusEl = document.getElementById('win-status');
  if (statusEl) {
    statusEl.textContent =
      '"' + (d.name || key) + '" selected · ' + (d.desc || '');
  }
}

// Initialise on page load
(function() {
  var first = document.querySelector('.win-file.selected');
  if (first) winSel(first, 'designs');
})();

// ============================================================
// CLOCK
// ============================================================
var MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN',
              'JUL','AUG','SEP','OCT','NOV','DEC'];
var DAYS   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

function updateClock() {
  var n = new Date();
  var h = String(n.getHours()).padStart(2,'0');
  var m = String(n.getMinutes()).padStart(2,'0');
  var s = String(n.getSeconds()).padStart(2,'0');
  document.getElementById('clk-time').textContent = h + ':' + m + ':' + s;
  document.getElementById('clk-date').textContent =
    DAYS[n.getDay()] + ' ' +
    String(n.getDate()).padStart(2,'0') + ' ' +
    MONTHS[n.getMonth()] + ' ' +
    n.getFullYear();
}
updateClock();
setInterval(updateClock, 1000);

// ============================================================
// FOOTER STARS
// ============================================================
(function initStars() {
  var sc     = document.getElementById('stars-layer');
  var footer = document.getElementById('footer');
  if (!sc || !footer) return;

  function resize() {
    sc.width  = footer.offsetWidth;
    sc.height = footer.offsetHeight;
    draw();
  }

  function draw() {
    var ctx = sc.getContext('2d');
    ctx.clearRect(0, 0, sc.width, sc.height);
    for (var i = 0; i < 180; i++) {
      var x = Math.random() * sc.width;
      var y = Math.random() * sc.height * 0.65;
      var r = Math.random() * 1.5 + 0.3;
      var a = Math.random() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,220,' + a + ')';
      ctx.fill();
    }
  }

  resize();
  window.addEventListener('resize', resize);

  setInterval(function() {
    var ctx = sc.getContext('2d');
    ctx.clearRect(0, 0, sc.width, sc.height);
    for (var i = 0; i < 180; i++) {
      var x = (Math.sin(i * 1234.567) * 0.5 + 0.5) * sc.width;
      var y = (Math.sin(i * 987.654)  * 0.5 + 0.5) * sc.height * 0.65;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 1.5 + 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,215,' + (Math.random() * 0.7 + 0.15) + ')';
      ctx.fill();
    }
  }, 1800);
})();

   
// Configuration for Blogger Fetch
const BLOGGER_SUBDOMAIN = 'shanmukh144'; // <- Replace with your blog spot address name
const POSTS_COUNT = 3; // Number of posts you want to pull into the layout

function loadBloggerPosts() {
  const gridContainer = document.getElementById('blogger-posts-grid');
  
  // Script endpoint pointing to Blogger's native JSON output
  const feedUrl = `https://${BLOGGER_SUBDOMAIN}.blogspot.com/feeds/posts/default?alt=json-in-script&max-results=${POSTS_COUNT}&callback=renderBloggerData`;

  // Create a dynamic JSONP script tag to avoid annoying Cross-Origin (CORS) blocks
  const script = document.createElement('script');
  script.src = feedUrl;
  document.body.appendChild(script);
}

// Global Callback handler function explicitly declared for the Blogger payload response
window.renderBloggerData = function(data) {
  const gridContainer = document.getElementById('blogger-posts-grid');
  gridContainer.innerHTML = ''; // Wipe out initialization message

  const entries = data.feed.entry;

  if (!entries || entries.length === 0) {
    gridContainer.innerHTML = '<div class="blog-loading">No blog posts located.</div>';
    return;
  }

  // Parse details out of the Blogger structure loop
  entries.forEach(entry => {
    const title = entry.title.$t;
    
    // Format timestamp smoothly
    const rawDate = new Date(entry.published.$t);
    const formattedDate = rawDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Extract text snippet safely from content string
    const content = entry.summary ? entry.summary.$t : (entry.content ? entry.content.$t : '');
    const cleanSnippet = content.replace(/<[^>]*>/g, '').substring(0, 110) + '...';

    // Find the explicit original outbound desktop alternate link
    const originalLinkObj = entry.link.find(l => l.rel === 'alternate');
    const targetUrl = originalLinkObj ? originalLinkObj.href : '#';

    // Build the portfolio structure component item template
    const cardMarkup = `
      <div class="blog-card">
        <div>
          <span class="blog-date">${formattedDate}</span>
          <h3 class="blog-title">${title}</h3>
          <p class="blog-snippet">${cleanSnippet}</p>
        </div>
        <a href="${targetUrl}" target="_blank" class="blog-link">Read Entry ↗</a>
      </div>
    `;

    gridContainer.innerHTML += cardMarkup;
  });
};

// Initialize execution loop on setup loading checks
document.addEventListener('DOMContentLoaded', loadBloggerPosts);
// ============================================================
// DOODLE CANVAS
// ============================================================
var dcanvas  = document.getElementById('doodle-canvas');
var dctx     = dcanvas.getContext('2d');
var painting = false;
var dtool    = 'draw';
var dcolor   = '#0a0a0a';
var dbsize   = 6;

function resizeDCanvas() {
  var data = dcanvas.toDataURL();
  dcanvas.width  = dcanvas.offsetWidth;
  dcanvas.height = dcanvas.offsetHeight || 400;
  var img   = new Image();
  img.onload = function() { dctx.drawImage(img, 0, 0); };
  img.src    = data;
}
resizeDCanvas();
window.addEventListener('resize', resizeDCanvas);

var dcolors = ['#0a0a0a','#FF6B1A','#FFD580','#FF6B9D',
               '#6B9DFF','#6BFFB8','#ffffff','#FF4444'];
var swatchContainer = document.getElementById('swatches');

dcolors.forEach(function(c, i) {
  var s = document.createElement('div');
  s.className = 'color-swatch' + (i === 0 ? ' active' : '');
  s.style.background = c;
  if (c === '#ffffff') s.style.border = '2px solid #ccc';
  s.onclick = function() {
    dcolor = c;
    dtool  = 'draw';
    document.querySelectorAll('.color-swatch').forEach(function(x) {
      x.classList.remove('active');
    });
    s.classList.add('active');
    setTool('draw');
  };
  swatchContainer.appendChild(s);
});

document.getElementById('brush-sz').addEventListener('input', function(e) {
  dbsize = e.target.value;
});

function getDP(e) {
  var r = dcanvas.getBoundingClientRect();
  if (e.touches) {
    return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
  }
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

dcanvas.addEventListener('mousedown', function(e) {
  painting = true;
  var p = getDP(e);
  dctx.beginPath();
  dctx.moveTo(p.x, p.y);
});

dcanvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  painting = true;
  var p = getDP(e);
  dctx.beginPath();
  dctx.moveTo(p.x, p.y);
}, { passive: false });

function doDraw(e) {
  if (!painting) return;
  var p = getDP(e);
  dctx.lineWidth  = dbsize;
  dctx.lineCap    = 'round';
  dctx.lineJoin   = 'round';
  if (dtool === 'erase') {
    dctx.globalCompositeOperation = 'destination-out';
    dctx.strokeStyle = 'rgba(0,0,0,1)';
  } else {
    dctx.globalCompositeOperation = 'source-over';
    dctx.strokeStyle = dcolor;
  }
  dctx.lineTo(p.x, p.y);
  dctx.stroke();
  dctx.beginPath();
  dctx.moveTo(p.x, p.y);
}

dcanvas.addEventListener('mousemove', doDraw);
dcanvas.addEventListener('touchmove', function(e) {
  e.preventDefault();
  doDraw(e);
}, { passive: false });

dcanvas.addEventListener('mouseup',    function() { painting = false; });
dcanvas.addEventListener('touchend',   function() { painting = false; });
dcanvas.addEventListener('mouseleave', function() { painting = false; });

function setTool(t) {
  dtool = t;
  document.getElementById('btn-draw').classList.toggle('active',  t === 'draw');
  document.getElementById('btn-erase').classList.toggle('active', t === 'erase');
}
function clearC() {
  dctx.globalCompositeOperation = 'source-over';
  dctx.clearRect(0, 0, dcanvas.width, dcanvas.height);
}
function dlDoodle() {
  var a      = document.createElement('a');
  a.download = 'doodle-dssram.png';
  a.href     = dcanvas.toDataURL();
  a.click();
}

// ============================================================
// FEEDBACK PANEL — UI toggle only (save is in Firebase module)
// ============================================================
var fbOpen = false;
function toggleFb() {
  fbOpen = !fbOpen;
  document.getElementById('feedback-panel').classList.toggle('open', fbOpen);

  // Load all notes from Firestore every time panel opens
  if (fbOpen && typeof window.loadNotes === 'function') {
    window.loadNotes();
  }
}

// ============================================================
// INTEREST CARD FORMS — toggle open/close only
// (submitIcForm is handled by Firebase module below)
// ============================================================
function toggleIcForm(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.style.display = (el.style.display === 'none') ? 'flex' : 'none';
}

// ============================================================
// BOOK / MOVIE SUGGEST — tab switching
// (addSuggestion is handled by Firebase module below)
// ============================================================
window._sugTab = 'book';
function switchTab(tab, el) {
  window._sugTab = tab;
  document.querySelectorAll('.stab').forEach(function(s) {
    s.classList.remove('active');
  });
  el.classList.add('active');
}

// ============================================================
// GITHUB CONTRIBUTIONS MODAL
// ============================================================
function openGhModal() {
  document.getElementById('gh-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeGhModal() {
  document.getElementById('gh-modal').style.display = 'none';
  document.body.style.overflow = '';
}

// ============================================================
// ADMIN DOOR TRIGGER (click 5 times)
// ============================================================
var _atc   = 0;
var _atimer;
var _AU    = 'ZHNzcmFtMjQ=';    // dssram24
var _AP    = 'Q2hhbnRpMTIzKg=='; 

function adminTriggerClick() {
  _atc++;
  clearTimeout(_atimer);
  if (_atc >= 5) {
    _atc = 0;
    document.getElementById('admin-modal').classList.add('open');
    document.getElementById('admin-user').focus();
  }
  _atimer = setTimeout(function() { _atc = 0; }, 1800);
}

function closeAdmin() {
  document.getElementById('admin-modal').classList.remove('open');
  document.getElementById('admin-err').style.display    = 'none';
  document.getElementById('admin-user').value           = '';
  document.getElementById('admin-pass').value           = '';
  document.getElementById('admin-dashboard').style.display = 'none';
  document.getElementById('admin-login-form').style.display = 'block';
  document.getElementById('admin-title').textContent    = '// ADMIN ACCESS';
  ['sug','pl','fit','qt'].forEach(function(k) {
    var p = document.getElementById('admin-panel-' + k);
    if (p) p.style.display = 'none';
  });
}

function adminLogin() {
  var u = document.getElementById('admin-user').value.trim();
  var p = document.getElementById('admin-pass').value;
  if (btoa(u) === _AU && btoa(p) === _AP) {
    document.getElementById('admin-login-form').style.display = 'none';
    document.getElementById('admin-err').style.display        = 'none';
    document.getElementById('admin-title').textContent        = '// INBOX';
    document.getElementById('admin-dashboard').style.display  = 'block';
    // adminTab lives in the Firebase module — call it via window
    if (typeof window.adminTab === 'function') {
      window.adminTab('sug', document.querySelector('#admin-dashboard .stab'));
    }
  } else {
    var err = document.getElementById('admin-err');
    err.style.display = 'block';
    err.textContent   = 'Access denied.';
    document.getElementById('admin-pass').value = '';
  }
}

document.getElementById('admin-pass').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') adminLogin();
});

// Mapped exactly 1:1 with styleTexts (8 items total)
const randomStyles = [
  // 1. Terminal Style
  {
    background: "#000000",
    borderRadius: "0px",
    color: "#00ff33",
    fontFamily: "'Courier New', Courier, monospace",
    border: "2px solid #00ff33",
    textTransform: "uppercase",
    letterSpacing: "3px",
    transform: "rotate(0deg) skew(0deg)",
    boxShadow: "none"
  },
  // 2. Windows Executable Style
  {
    background: "#1c1c1c",
    borderRadius: "50px", 
    color: "#ffffff",
    fontFamily: "'Arial Black', Gadget, sans-serif",
    border: "2px solid transparent",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transform: "rotate(0deg)",
    boxShadow: "none"
  },
  // 3. Minimalist Cyberpunk Style
  {
    background: "#000000",
    borderRadius: "8px",
    color: "#00ff33",
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
    textTransform: "none",
    letterSpacing: "1px",
    transform: "rotate(0deg)",
    boxShadow: "none"
  },
  // 4. Glitched & Tilted Amber CRT
  {
    background: "#1a0f00",
    borderRadius: "4px",
    color: "#ffb000",
    fontFamily: "'Courier New', monospace",
    border: "1px solid #ffb000",
    textTransform: "uppercase",
    letterSpacing: "2px",
    transform: "skewX(-7deg) rotate(-1deg)", 
    boxShadow: "0 0 10px rgba(255, 176, 0, 0.4)"
  },
  // 5. Classic Windows 95
  {
    background: "#c0c0c0",
    borderRadius: "0px",
    color: "#000000",
    fontFamily: "'MS Sans Serif', Geneva, sans-serif",
    borderTop: "2px solid #ffffff",
    borderLeft: "2px solid #ffffff",
    borderRight: "2px solid #808080",
    borderBottom: "2px solid #808080",
    textTransform: "none",
    letterSpacing: "0px",
    transform: "rotate(0deg)",
    boxShadow: "none"
  },
  // 6. Matrix Distortion
  {
    background: "#000000",
    borderRadius: "0px",
    color: "#00ff00",
    fontFamily: "monospace",
    border: "1px dashed #00ff00",
    textTransform: "lowercase",
    letterSpacing: "5px",
    transform: "rotate(2deg)", 
    boxShadow: "inset 0 0 8px rgba(0, 255, 0, 0.5)"
  },
  // 7. Hard Glitch Red Warning (Filled in based on your notes)
  {
    background: "#ff0000",
    borderRadius: "0px",
    color: "#ffffff",
    fontFamily: "'Impact', sans-serif",
    border: "3px double #ffffff",
    textTransform: "uppercase",
    letterSpacing: "2px",
    transform: "skewX(5deg) rotate(1deg)",
    boxShadow: "0 0 15px rgba(255, 0, 0, 0.8)"
  },
  // 8. Vaporwave Blueprint
  {
    background: "#0000ff",
    borderRadius: "0px",
    color: "#00ffff",
    fontFamily: "Impact, sans-serif",
    border: "2px solid #00ffff",
    textTransform: "uppercase",
    letterSpacing: "4px",
    transform: "rotate(0deg)",
    boxShadow: "none"
  }
];

// Added an 8th text element to prevent 'undefined' mismatch crash
const styleTexts = [
  "CONTACT_NOW",   
  "CONTACT.EXE",   
  "Connect",       
  "Get in Touch",
  "Click Here",    
  "//initialize",   
  "Say Hi! ",
  "LINK_START" ,
  "Let's Connect"

];

const btn = document.getElementById("cta-btn");

function changeCTAStyle() {
  const randomIndex = Math.floor(Math.random() * randomStyles.length);
  const selectedStyle = randomStyles[randomIndex];
  const selectedText = styleTexts[randomIndex];

  // FIX: Reset individual inline style mutations safely.
  // Using cssText = '' clears all previous JS properties but keeps 
  // the element completely viable for the static CSS stylesheets to target.
  btn.style.cssText = ''; 

  // Inject the new variant properties 
  Object.assign(btn.style, selectedStyle);
  btn.textContent = selectedText;
}

// Loop pacing
setInterval(changeCTAStyle, 800);
// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  if (document.getElementById('img-lightbox').classList.contains('open')) closeLightbox();
  if (document.getElementById('gh-modal').style.display === 'flex') closeGhModal();
  if (document.getElementById('admin-modal').classList.contains('open')) closeAdmin();
});


// NIGHT SKY CANVAS (stars + meteors on dark sections)
// ============================================================
(function initNightSky() {
  var canvas = document.getElementById('night-sky-canvas');
  if (!canvas) return;
  var ctx     = canvas.getContext('2d');
  var W, H;
  var stars   = [];
  var meteors = [];
  var raf, active = false, spawnInterval;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = [];
    for (var i = 0; i < 200; i++) {
      stars.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.4 + 0.2,
        a:  Math.random(),
        da: (Math.random() * 0.008 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
        z:  Math.random()
      });
    }
  }

  function spawnMeteor() {
    meteors.push({
      x:      Math.random() * W * 1.4 - W * 0.2,
      y:      -20,
      vx:     3  + Math.random() * 5,
      vy:     4  + Math.random() * 6,
      len:    80 + Math.random() * 140,
      alpha:  1,
      width:  0.8 + Math.random() * 1.2,
      bright: Math.random() < 0.2
    });
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    stars.forEach(function(s) {
      s.a = Math.max(0.05, Math.min(1, s.a + s.da));
      if (s.a <= 0.05 || s.a >= 1) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * (0.5 + s.z * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = s.z > 0.7
        ? 'rgba(255,230,180,' + (s.a * 0.85) + ')'
        : 'rgba(220,225,255,' + (s.a * 0.7)  + ')';
      ctx.fill();
    });

    meteors = meteors.filter(function(m) {
      return m.alpha > 0.02 && m.x < W + 100 && m.y < H + 100;
    });

    meteors.forEach(function(m) {
      var hyp = Math.hypot(m.vx, m.vy);
      var tx  = m.x - (m.vx / hyp) * m.len;
      var ty  = m.y - (m.vy / hyp) * m.len;
      var g   = ctx.createLinearGradient(tx, ty, m.x, m.y);

      if (m.bright) {
        g.addColorStop(0,   'rgba(255,220,120,0)');
        g.addColorStop(0.6, 'rgba(255,180,80,'  + (m.alpha * 0.5) + ')');
        g.addColorStop(1,   'rgba(255,240,200,' + m.alpha + ')');
      } else {
        g.addColorStop(0, 'rgba(180,200,255,0)');
        g.addColorStop(1, 'rgba(220,230,255,' + m.alpha + ')');
      }

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = g;
      ctx.lineWidth   = m.width * (m.bright ? 1.8 : 1);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(m.x, m.y, m.bright ? 2.2 : 1.2, 0, Math.PI * 2);
      ctx.fillStyle = m.bright
        ? 'rgba(255,220,150,' + m.alpha + ')'
        : 'rgba(200,220,255,' + m.alpha + ')';
      ctx.fill();

      m.x    += m.vx;
      m.y    += m.vy;
      m.alpha -= 0.016;
    });

    raf = requestAnimationFrame(drawFrame);
  }

  function startSky() {
    if (active) return;
    active = true;
    canvas.style.opacity = '1';
    buildStars();
    drawFrame();
    spawnMeteor();
    spawnInterval = setInterval(function() {
      if (Math.random() < 0.6) spawnMeteor();
      if (Math.random() < 0.2) spawnMeteor();
    }, 900);
  }

  function stopSky() {
    if (!active) return;
    active = false;
    canvas.style.opacity = '0';
    cancelAnimationFrame(raf);
    clearInterval(spawnInterval);
    ctx.clearRect(0, 0, W, H);
  }

  var visibleDark = new Set();
  var nightObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) visibleDark.add(e.target.id);
      else visibleDark.delete(e.target.id);
    });
    if (visibleDark.size > 0) startSky();
    else stopSky();
  }, { threshold: 0.08 });

document.querySelectorAll('#humor, #books, #footer, #story, #projects').forEach(function(s) { 
    nightObs.observe(s);
  });

  window.addEventListener('resize', resize);
  resize();
})();

/* ── NAV: clock + scroll shrink + active section + dark mode ── */
(function () {

  // Clock
  function updateClock() {
    var now = new Date();
    var h = String(now.getHours()).padStart(2, '0');
    var m = String(now.getMinutes()).padStart(2, '0');
    var el = document.getElementById('nav-time');
    if (el) el.textContent = h + ':' + m;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Elements
  var pill         = document.getElementById('nav-pill');
  var hero         = document.getElementById('hero');
var darkSections = ['story', 'projects', 'books','footer'];
  var sections     = ['about', 'design','blogs', 'photos', 'doodle'];
  var navLinks     = document.querySelectorAll('.nav-links a');

  function onScroll() {
    if (!pill) return;

    // Shrink when past hero
    var heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    if (heroBottom < 0) {
      pill.classList.add('scrolled');
    } else {
      pill.classList.remove('scrolled');
    }

    // Dark mode when over a dark section
    var navMid = 60;
    var isDark = false;
    darkSections.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var rect = el.getBoundingClientRect();
      if (rect.top <= navMid && rect.bottom >= navMid) {
        isDark = true;
      }
    });
    if (isDark) {
      pill.classList.add('dark-mode');
    } else {
      pill.classList.remove('dark-mode');
    }

    // Active link highlight
    var scrollY = window.scrollY + 120;
    var current = '';
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    });
    navLinks.forEach(function (a) {
      var href = a.getAttribute('href').replace('#', '');
      if (href === current) {
        a.classList.add('nav-active');
      } else {
        a.classList.remove('nav-active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile toggle
  window.toggleNav = function () {
    var links = document.getElementById('nav-links');
    if (links) links.classList.toggle('open');
  };

})();
