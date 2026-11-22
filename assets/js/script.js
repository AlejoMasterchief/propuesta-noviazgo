/**
 * CARTA DE AMOR DE LUJO - ALEJO & Aby
 * Tema: Rosa y Blanco · Lagos y Montañas
 */

(function () {
  'use strict';

  // Configuración personalizada para Alejo & Aby
  const DEFAULT_CONFIG = {
    el: 'Alejo',
    ella: 'Aby',
    pregunta: '¿Quiere ser mi novia, Aby?',
    subtitulo: 'Dos caminos · un mismo destino',
    mensaje: `Aby, si pudieras mirar el futuro conmigo, te vería creciendo, sonriendo y siendo feliz sin tener que preocuparte por nada.

Te elegiría en las mañanas tranquilas y en las decisiones difíciles. Te cuidaría con paciencia, te escucharía de verdad y celebraría cada sueño que quieras alcanzar.

Hoy no quiero promesas perfectas; quiero construir algo real: aventuras compartidas, conversaciones largas, una familia tranquila y un amor que nos permita volver a encontrarnos todos los días.

Con Dios al centro, respeto en todo momento y gratitud por lo sencillo, quiero preguntarte algo muy importante:`,
    fechaInicio: null,
    foto1: 'photo_1.jpg',
    foto2: 'photo_2.jpg'
  };

  // Estado de la aplicación
  let state = {
    config: { ...DEFAULT_CONFIG },
    sobreAbierto: false,
    dijoSi: false,
    fechaSi: null,
    isPlayingMusic: false,
    audioCtx: null,
    melodyInterval: null
  };

  // Elementos DOM
  const dom = {
    canvas: document.getElementById('ambientCanvas'),
    musicBtn: document.getElementById('musicBtn'),
    resetBtn: null, // botón eliminado de UI
    previewBtn: null, // eliminado
    romanticAudio: document.getElementById('romanticAudio'),
    bailandoVideo: document.getElementById('bailandoVideo'),
    videoAudioBtn: document.getElementById('videoAudioBtn'),
    videoAudioIcon: document.getElementById('videoAudioIcon'),
    
    fraseTypewriter: document.getElementById('fraseTypewriter'),
    headerSubtitle: document.getElementById('headerSubtitle'),
    polaroidCard: document.getElementById('polaroidCard'),
    polaroidImg: document.getElementById('polaroidImg'),
    nombresDisplay: document.getElementById('nombresDisplay'),
    polaroidSubtext: document.getElementById('polaroidSubtext'),

    envelope: document.getElementById('envelope'),
    waxSeal: document.getElementById('waxSeal'),
    letter: document.getElementById('letter'),
    cartaDestinataria: document.getElementById('cartaDestinataria'),
    cartaTexto: document.getElementById('cartaTexto'),
    cartaFirma: document.getElementById('cartaFirma'),
    preguntaWrap: document.getElementById('preguntaWrap'),
    preguntaTexto: document.getElementById('preguntaTexto'),
    btnSi: document.getElementById('btnSi'),
    btnNo: document.getElementById('btnNo'),

    contadorDashboard: document.getElementById('contadorDashboard'),
    displayFechaEspecial: document.getElementById('displayFechaEspecial'),
    cntDias: document.getElementById('cntDias'),
    cntHoras: document.getElementById('cntHoras'),
    cntMins: document.getElementById('cntMins'),
    cntSegs: document.getElementById('cntSegs'),
    statLatidos: document.getElementById('statLatidos'),
    statBesos: document.getElementById('statBesos'),
    statLunas: document.getElementById('statLunas'),
    statSonrisas: document.getElementById('statSonrisas'),
    finalImg: document.getElementById('finalImg')
  };

  /* ========================================================
     1. SISTEMA DE AUDIO (Canción del repo: cancion.mpeg)
     ======================================================== */
  function getAudioContext() {
    if (!state.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        state.audioCtx = new AudioCtx();
      }
    }
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
    return state.audioCtx;
  }

  // Sonido de sello de cera rompiéndose
  function playWaxBreakSound() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 850;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  // Campanas y acordes celestiales al decir que SÍ
  function playCelebrationChimes() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);
      gain.gain.setValueAtTime(0, now + idx * 0.14);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.14 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 3.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 3.0);
    });
  }

  // Reproducción de la canción del repo (cancion.mpeg)
  function toggleMusic() {
    getAudioContext();
    const audio = dom.romanticAudio;

    if (state.isPlayingMusic) {
      state.isPlayingMusic = false;
      dom.musicBtn.classList.remove('playing');
      if (audio) audio.pause();
    } else {
      state.isPlayingMusic = true;
      dom.musicBtn.classList.add('playing');
      if (audio) {
        audio.play().catch(err => {
          console.log('Esperando interacción para reproducir audio:', err);
        });
      }
    }
  }

  /* ========================================================
     2. LIENZO DE PÉTALOS Y DESTELLOS DE LUZ ROSA
     ======================================================== */
  function initAmbientCanvas() {
    const canvas = dom.canvas;
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const NUM_PETALS = 32;
    const NUM_SPARKLES = 40;

    // Pétalos de rosa suave y sakura
    for (let i = 0; i < NUM_PETALS; i++) {
      particles.push({
        type: 'petal',
        x: Math.random() * width,
        y: Math.random() * height,
        size: 7 + Math.random() * 11,
        speedX: -0.8 + Math.random() * 1.6,
        speedY: 0.8 + Math.random() * 1.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.025,
        color: ['#ffd1dc', '#ffb6c1', '#f8bbd0', '#ffffff', '#f48fb1'][Math.floor(Math.random() * 5)],
        opacity: 0.4 + Math.random() * 0.45
      });
    }

    // Destellos dorados / luciérnagas sobre el lago
    for (let i = 0; i < NUM_SPARKLES; i++) {
      particles.push({
        type: 'sparkle',
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.2 + Math.random() * 1.8,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -0.3 - Math.random() * 0.5,
        alpha: Math.random(),
        pulseSpeed: 0.02 + Math.random() * 0.03
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        if (p.type === 'petal') {
          p.x += p.speedX + Math.sin(p.y * 0.012) * 0.6;
          p.y += p.speedY;
          p.rotation += p.rotSpeed;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'sparkle') {
          p.x += p.speedX;
          p.y += p.speedY;
          p.alpha += p.pulseSpeed;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          const currentAlpha = Math.abs(Math.sin(p.alpha)) * 0.75 + 0.15;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#fff0f5';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ff80ab';
          ctx.globalAlpha = currentAlpha;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ========================================================
     3. EXPLOSIÓN DE CORAZONES ROSA Y CONFETI
     ======================================================== */
  const HEART_COLORS = ['#e91e63', '#f06292', '#f8bbd0', '#ff4081', '#ffffff', '#ad1457', '#d81b60'];
  const HEART_ICONS = ['♥', '💖', '💕', '🌸', '✨', '🌹', '🏔️'];

  function lanzarCorazon(x, y) {
    const el = document.createElement('div');
    el.className = 'floating-heart-element';
    el.textContent = HEART_ICONS[Math.floor(Math.random() * HEART_ICONS.length)];

    const posX = x !== undefined ? x : Math.random() * window.innerWidth;
    const startY = y !== undefined ? y : window.innerHeight + 10;
    const dur = 2.4 + Math.random() * 2.2;
    const size = 16 + Math.random() * 26;
    const rot = (Math.random() - 0.5) * 600;
    const scale = 0.8 + Math.random() * 0.8;
    const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];

    el.style.cssText = `
      left: ${posX}px;
      top: ${startY}px;
      font-size: ${size}px;
      color: ${color};
      animation-duration: ${dur}s;
      --rot: ${rot}deg;
      --sc: ${scale};
    `;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000);
  }

  function explosionDeCorazones() {
    for (let i = 0; i < 45; i++) {
      setTimeout(() => {
        lanzarCorazon(Math.random() * window.innerWidth, window.innerHeight * 0.85);
      }, i * 65);
    }
  }

  /* ========================================================
     4. ANIMACIÓN Y APERTURA DEL SOBRE
     ======================================================== */
  function abrirSobre() {
    if (state.sobreAbierto) return;
    state.sobreAbierto = true;

    playWaxBreakSound();

    if (navigator.vibrate) {
      navigator.vibrate([60, 40, 80]);
    }

    // Efecto de partículas saliendo del sello
    const sealRect = dom.waxSeal.getBoundingClientRect();
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        lanzarCorazon(sealRect.left + sealRect.width / 2 + (Math.random() - 0.5) * 40, sealRect.top + (Math.random() - 0.5) * 40);
      }, i * 40);
    }

    dom.envelope.classList.add('abierto');
    dom.headerSubtitle.style.opacity = '0';

    setTimeout(() => {
      dom.letter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);

    // Activamos la canción si aún no está sonando
    if (!state.isPlayingMusic) {
      toggleMusic();
    }
  }

  /* ========================================================
     5. GESTIÓN DEL "SÍ, QUIERO" Y CONTADOR
     ======================================================== */
  function decirSi(e) {
    if (e) e.stopPropagation();
    if (state.dijoSi) return;

    state.dijoSi = true;
    state.fechaSi = state.config.fechaInicio ? new Date(state.config.fechaInicio) : new Date();

    localStorage.setItem('amor_carta_dijo_si', 'true');
    localStorage.setItem('amor_carta_fecha', state.fechaSi.toISOString());

    if (navigator.vibrate) {
      navigator.vibrate([100, 60, 150, 60, 300]);
    }

    playCelebrationChimes();
    explosionDeCorazones();

    dom.preguntaWrap.innerHTML = `
      <div style="animation: fadeInDashboard 0.8s ease;">
        <span style="font-size: 32px; display: block; margin-bottom: 8px;">💍✨♥</span>
        <h3 style="font-family: var(--font-serif); font-size: 26px; color: var(--rose-deep); font-style: italic;">
          ¡Dijo que sí!
        </h3>
        <p style="font-family: var(--font-body); font-size: 19px; color: var(--text-muted); margin-top: 6px;">
          El comienzo de nuestra historia
        </p>
      </div>
    `;

    actualizarTypewriter('Desde hoy...');

    setTimeout(() => {
      dom.contadorDashboard.style.display = 'block';
      arrancarContador();
      iniciarVideo();
      dom.contadorDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1500);
  }

  /* ========================================================
     VIDEO BAILANDO — Super 8 / VHS estilo película
     ======================================================== */
  function iniciarVideo() {
    const video = dom.bailandoVideo;
    if (!video) return;

    // Autoplay silenciado (muted para cumplir política de browsers)
    video.muted = true;
    video.play().catch(() => {});

    // Listener del botón de audio del video
    if (dom.videoAudioBtn) {
      dom.videoAudioBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isMuted = video.muted;
        video.muted = !isMuted;

        if (dom.videoAudioIcon) {
          dom.videoAudioIcon.textContent = video.muted ? '🔇' : '🔊';
        }

        // Si activa audio del video, pausar la canción de fondo para no mezclar
        if (!video.muted && dom.romanticAudio && !dom.romanticAudio.paused) {
          dom.romanticAudio.pause();
          state.isPlayingMusic = false;
          if (dom.musicBtn) dom.musicBtn.classList.remove('playing');
        }

        // Label del botón
        const label = dom.videoAudioBtn.querySelector('.video-audio-label');
        if (label) {
          label.textContent = video.muted ? 'Tocar para escuchar' : 'Silenciar video';
        }

        video.play().catch(() => {});
      }, { once: false });
    }

    // Cuando el video termina una vuelta, hacer un efecto de parpadeo de película
    video.addEventListener('timeupdate', function filmFlicker() {
      if (video.currentTime > video.duration - 0.3) {
        const screen = document.getElementById('super8Screen');
        if (screen) {
          screen.style.filter = 'brightness(1.4) contrast(1.1)';
          setTimeout(() => { screen.style.filter = ''; }, 120);
        }
      }
    });
  }

  function actualizarTypewriter(nuevoTexto) {
    const tw = dom.fraseTypewriter;
    tw.classList.remove('escribiendo', 'sin-cursor');
    tw.style.width = '0';
    tw.textContent = nuevoTexto;
    void tw.offsetWidth;
    tw.classList.add('escribiendo');
    setTimeout(() => tw.classList.add('sin-cursor'), 3500);
  }

  /* ========================================================
     6. MOTOR DEL CONTADOR DE TIEMPO
     ======================================================== */
  let contadorTimer = null;

  function formatearFechaEspanol(fecha) {
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    return 'Desde el ' + fecha.toLocaleDateString('es-ES', opciones);
  }

  function arrancarContador() {
    if (!state.fechaSi) return;

    dom.displayFechaEspecial.innerHTML = `<span>${formatearFechaEspanol(state.fechaSi)}</span>`;

    function actualizar() {
      const ahora = Date.now();
      const diff = Math.max(0, ahora - state.fechaSi.getTime());

      const totalSegs = Math.floor(diff / 1000);
      const totalMins = Math.floor(totalSegs / 60);
      const totalHoras = Math.floor(totalMins / 60);
      const totalDias = Math.floor(totalHoras / 24);

      dom.cntDias.textContent = totalDias.toLocaleString('es-ES');
      dom.cntHoras.textContent = (totalHoras % 24).toString().padStart(2, '0');
      dom.cntMins.textContent = (totalMins % 60).toString().padStart(2, '0');
      dom.cntSegs.textContent = (totalSegs % 60).toString().padStart(2, '0');

      // Estadísticas románticas en vivo
      const latidos = totalMins * 75 + (totalSegs % 60);
      dom.statLatidos.textContent = latidos > 0 ? latidos.toLocaleString('es-ES') : '1';

      const besos = Math.max(1, Math.floor(totalHoras * 12 + totalMins));
      dom.statBesos.textContent = besos.toLocaleString('es-ES');

      const lunas = Math.max(1, totalDias);
      dom.statLunas.textContent = lunas.toLocaleString('es-ES');

      const sonrisas = Math.max(1, totalHoras);
      dom.statSonrisas.textContent = sonrisas.toLocaleString('es-ES') + ' hrs';
    }

    actualizar();
    if (contadorTimer) clearInterval(contadorTimer);
    contadorTimer = setInterval(actualizar, 1000);
  }

  /* ========================================================
     7. BOTÓN JUGUETÓN "¿DÉJAME PENSARLO?"
     ======================================================== */
  const MENSAJES_BROMAS = [
    '¡Esa opción no existe en este universo Aby! 🥰',
    '¡El sistema solo admite un SÍ rotundo! ♥',
    '¿Está segura? ¡Piénselo otra vez! 😉',
  ];

  function esquivarBotonNo() {
    const btn = dom.btnNo;
    const randomMsg = MENSAJES_BROMAS[Math.floor(Math.random() * MENSAJES_BROMAS.length)];
    btn.querySelector('span').textContent = randomMsg;
    btn.style.transform = `scale(0.95)`;
    setTimeout(() => {
      btn.style.transform = '';
    }, 400);
    lanzarCorazon();
  }

  /* ========================================================
     8. BOTÓN REINICIAR — solo cierra visualmente para previsualizar
     NO borra el localStorage: el Sí queda grabado permanentemente
     ======================================================== */
  function reiniciarCarta() {
    // Solo cierra para previsualización (no borra el Sí guardado)
    // Restablecer estado visual temporal
    state.sobreAbierto = false;

    if (contadorTimer) {
      clearInterval(contadorTimer);
      contadorTimer = null;
    }

    // Cerrar el sobre visualmente
    dom.envelope.classList.remove('abierto');
    dom.headerSubtitle.style.opacity = '1';

    // Ocultar el contador
    dom.contadorDashboard.style.display = 'none';

    // Si ya había dicho Sí antes (guardado), restaurar los botones de propuesta
    // para que se pueda ver la experiencia completa
    dom.preguntaWrap.innerHTML = `
      <div class="proposal-flourish">
        <span class="flourish-line"></span>
        <span class="flourish-heart">♥</span>
        <span class="flourish-line"></span>
      </div>
      <h3 class="proposal-question" id="preguntaTexto">${state.config.pregunta}</h3>
      <div class="proposal-actions">
        <button class="btn-love-yes" id="btnSi">
          <span class="btn-shimmer"></span>
          <span class="btn-text">¡Sí, quiero con todo mi corazón! ♥</span>
        </button>
        <button class="btn-love-playful" id="btnNo" title="¿Segura?">
          <span>Déjame pensarlo...</span>
        </button>
      </div>
    `;

    // Re-asignar listeners
    document.getElementById('btnSi').addEventListener('click', decirSiGuardado);
    const newBtnNo = document.getElementById('btnNo');
    newBtnNo.addEventListener('mouseenter', esquivarBotonNo);
    newBtnNo.addEventListener('click', esquivarBotonNo);

    // Restaurar frase inicial
    actualizarTypewriter('Aby, esto también quiero construir con usted...');

    // Desplazar al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
    lanzarCorazon();
  }

  // Versión del decirSi que restaura el estado guardado (sin re-grabar fecha)
  function decirSiGuardado(e) {
    if (e) e.stopPropagation();

    // Si hay fecha guardada, usarla; si no, crear nueva
    if (!state.fechaSi) {
      const fechaGuardada = localStorage.getItem('amor_carta_fecha');
      state.fechaSi = fechaGuardada ? new Date(fechaGuardada) : new Date();
    }
    state.dijoSi = true;

    // Asegurar que siempre queda grabado
    localStorage.setItem('amor_carta_dijo_si', 'true');
    localStorage.setItem('amor_carta_fecha', state.fechaSi.toISOString());

    if (navigator.vibrate) navigator.vibrate([100, 60, 150, 60, 300]);
    playCelebrationChimes();
    explosionDeCorazones();

    dom.preguntaWrap.innerHTML = `
      <div style="animation: fadeInDashboard 0.8s ease;">
        <span style="font-size: 32px; display: block; margin-bottom: 8px;">💍✨♥</span>
        <h3 style="font-family: var(--font-serif); font-size: 26px; color: var(--rose-deep); font-style: italic;">
          ¡Dijo que sí!
        </h3>
        <p style="font-family: var(--font-body); font-size: 19px; color: var(--text-muted); margin-top: 6px;">
          El comienzo de nuestra historia
        </p>
      </div>
    `;

    actualizarTypewriter('Desde hoy...');

    setTimeout(() => {
      dom.contadorDashboard.style.display = 'block';
      arrancarContador();
      iniciarVideo();
      dom.contadorDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1500);
  }

  /* ========================================================
     VIDEO BAILANDO — Super 8 / VHS estilo película
     ======================================================== */
  function iniciarVideo() {
    const video = dom.bailandoVideo;
    if (!video) return;

    // Autoplay silenciado (muted para cumplir política de browsers)
    video.muted = true;
    video.play().catch(() => {});

    // Listener del botón de audio del video
    if (dom.videoAudioBtn) {
      dom.videoAudioBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isMuted = video.muted;
        video.muted = !isMuted;

        if (dom.videoAudioIcon) {
          dom.videoAudioIcon.textContent = video.muted ? '🔇' : '🔊';
        }

        // Si activa audio del video, pausar la canción de fondo para no mezclar
        if (!video.muted && dom.romanticAudio && !dom.romanticAudio.paused) {
          dom.romanticAudio.pause();
          state.isPlayingMusic = false;
          if (dom.musicBtn) dom.musicBtn.classList.remove('playing');
        }

        // Label del botón
        const label = dom.videoAudioBtn.querySelector('.video-audio-label');
        if (label) {
          label.textContent = video.muted ? 'Tocar para escuchar' : 'Silenciar video';
        }

        video.play().catch(() => {});
      }, { once: false });
    }

    // Cuando el video termina una vuelta, hacer un efecto de parpadeo de película
    video.addEventListener('timeupdate', function filmFlicker() {
      if (video.currentTime > video.duration - 0.3) {
        const screen = document.getElementById('super8Screen');
        if (screen) {
          screen.style.filter = 'brightness(1.4) contrast(1.1)';
          setTimeout(() => { screen.style.filter = ''; }, 120);
        }
      }
    });
  }

  /* ========================================================
     9. INICIALIZACIÓN
     ======================================================== */
  function init() {
    // 1. Iniciar lienzo de partículas
    initAmbientCanvas();

    // 2. Parallax de la polaroid
    const card = dom.polaroidCard;
    if (card) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = (y / rect.height) * -16;
        const rotY = (x / rect.width) * 16;
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    }

    // 3. Listeners del sobre y sello
    dom.envelope.addEventListener('click', abrirSobre);
    dom.waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirSobre();
    });

    // 4. Botones de propuesta
    dom.btnSi.addEventListener('click', decirSi);
    dom.btnNo.addEventListener('mouseenter', esquivarBotonNo);
    dom.btnNo.addEventListener('click', esquivarBotonNo);

    // 5. Botón de música (el de reinicio fue eliminado)
    dom.musicBtn.addEventListener('click', toggleMusic);

    // 6. Comprobar si Aby ya dijo Sí (guardado en localStorage)
    const yaDijoSi = localStorage.getItem('amor_carta_dijo_si');
    const fechaGuardada = localStorage.getItem('amor_carta_fecha');

    if (yaDijoSi === 'true' && fechaGuardada) {
      // Ya dijo Sí — mostrar directamente el contador con la fecha original
      state.dijoSi = true;
      state.fechaSi = new Date(fechaGuardada);
      state.sobreAbierto = true;
      dom.envelope.classList.add('abierto');
      dom.headerSubtitle.style.opacity = '0';
      dom.preguntaWrap.innerHTML = `
        <div style="animation: fadeInDashboard 0.8s ease;">
                    <h3 style="font-family: var(--font-serif); font-size: 26px; color: var(--rose-deep); font-style: italic;">
            ¡Dijo que sí!
          </h3>
          <p style="font-family: var(--font-body); font-size: 19px; color: var(--text-muted); margin-top: 6px;">
            El comienzo de nuestra historia
          </p>
        </div>
      `;
      actualizarTypewriter('Desde hoy...');
      dom.contadorDashboard.style.display = 'block';
      arrancarContador();
      iniciarVideo();
    } else {
      setTimeout(() => {
        dom.fraseTypewriter.classList.add('escribiendo');
      }, 400);
    }

    // 7. Desbloquear audio en el primer clic de la página
    document.addEventListener('click', function unlockAudio() {
      getAudioContext();
      if (!state.isPlayingMusic) {
        toggleMusic();
      }
      document.removeEventListener('click', unlockAudio);
    }, { once: true });
  }

  // Ejecutar al cargar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
