// ══════════════════════════════════════════════
//  NEXUSSTORE — Lógica principal
//  Paradigmas aplicados:
//    · POO     → class Cart, class GameCatalog, class AuthManager
//    · Funcional → .filter(), .map(), .reduce()
//    · SRP     → cada función hace UNA sola cosa
//    · DRY     → helpers reutilizables
// ══════════════════════════════════════════════


// ════════════════════════════════════════════
//  DATA — Array de juegos
// ════════════════════════════════════════════
const games = [
  { id:1,  title:"Counter-Strike 2",      img:"images/counter_strike_2.jpg",      tags:["accion","estrategia","gratis"],   rating:4.8, price:0,     oldPrice:null,  desc:"El shooter táctico más competitivo del mundo. Equipos de 5 jugadores se enfrentan en rondas de alto riesgo. Gratis para jugar." },
  { id:2,  title:"Resident Evil 8",        img:"images/resident_evil_8.jpg",        tags:["terror","oferta"],                rating:4.6, price:19.99, oldPrice:39.99, desc:"Supervivencia y terror en primera persona. Explora el misterioso pueblo europeo y descubre los secretos de la familia Dimitrescu." },
  { id:3,  title:"Minecraft",              img:"images/minecraft.jpg",              tags:["estrategia","accion","indie"],    rating:4.3, price:24.99, oldPrice:null,  desc:"El juego de construcción y supervivencia más vendido de la historia. Sin límites, sin reglas: solo tu imaginación." },
  { id:4,  title:"RUST",                   img:"images/rust.jpg",                   tags:["accion","oferta"],                rating:4.5, price:7.99,  oldPrice:14.99, desc:"Sobrevivir es la única regla. Recolectá recursos, construí refugios y defendete de otros jugadores en un mundo abierto hostil." },
  { id:5,  title:"The Sims 4",             img:"images/los_sims_4.jpg",             tags:["simulacion","gratis"],            rating:4.1, price:0,     oldPrice:null,  desc:"Creá y controlá personas virtuales. Diseñá hogares, construí carreras y viví historias únicas. 100% gratis." },
  { id:6,  title:"SimCity",                img:"images/simcity.jpg",                tags:["estrategia","simulacion"],        rating:4.7, price:0,     oldPrice:null,  desc:"Construí y gestioná tu propia metrópolis. Tomá decisiones sobre economía, infraestructura y transporte." },
  { id:7,  title:"Cyberpunk 2077",         img:"images/cyberpunk2077.jpg",         tags:["accion","rpg","oferta"],          rating:4.4, price:14.99, oldPrice:29.99, desc:"RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder y la modificación corporal." },
  { id:8,  title:"Star Wars Jedi",         img:"images/star_wars_jedi.jpg",         tags:["accion","aventura"],              rating:4.2, price:0,     oldPrice:null,  desc:"Encarnás a Cal Kestis, un joven Jedi que sobrevivió al Orden 66. Combate con sable de luz y exploración de planetas." },
  { id:9,  title:"Grand Theft Auto V",     img:"images/gta_v.jpg",                   tags:["accion","rpg"],                   rating:4.9, price:34.99, oldPrice:null,  desc:"El sandbox más grande del gaming. Tres protagonistas, una historia épica y un mundo online en constante expansión." },
  { id:10, title:"Dark Souls 2",           img:"images/dark_souls_2.jpg",           tags:["rpg","oferta"],                   rating:3.9, price:9.99,  oldPrice:29.99, desc:"El RPG de acción más exigente. Cada derrota es una lección. Explorá un reino maldito y desafiá a los Señores del Alma." },
  { id:11, title:"Life is Strange",        img:"images/life_is_strange.jpg",        tags:["aventura","indie"],               rating:4.6, price:12.99, oldPrice:null,  desc:"Aventura narrativa donde manipulás el tiempo. Cada decisión altera el futuro de Arcadia Bay y sus habitantes." },
  { id:12, title:"Red Dead Redemption 2",  img:"images/rdr_2.jpg",  tags:["accion","aventura","oferta"],     rating:4.0, price:4.99,  oldPrice:19.99, desc:"La historia de Arthur Morgan, forajido con honor en el ocaso del Lejano Oeste. Narrativa cinematográfica y mundo vivo." },
  { id:13, title:"Hades",                  img:"images/hades.jpg",                  tags:["indie","rpg"],                    rating:4.8, price:14.99, oldPrice:null,  desc:"Roguelike de acción del submundo griego. Cada intento de escape revela más de la historia y los personajes." },
  { id:14, title:"FIFA 24",                img:"images/fc24.jpg",                tags:["deportes","oferta"],              rating:4.3, price:29.99, oldPrice:59.99, desc:"El simulador de fútbol más realista. HyperMotion V captura el movimiento real de los jugadores con fidelidad sin precedentes." },
  { id:15, title:"Among Us",               img:"images/amonas.jpg",               tags:["indie","gratis"],                 rating:4.0, price:0,     oldPrice:null,  desc:"Deducción social en el espacio. Completá tareas o descubrí al impostor antes de que elimine a toda la tripulación." }
];


// ════════════════════════════════════════════
//  CLASE: Cart
// ════════════════════════════════════════════
class Cart {

  constructor() {
    /** @type {Array<Object>} */
    this.items = [];
  }

  has(id) { return this.items.some(item => item.id === id); }

  getTotal() { return this.items.reduce((sum, item) => sum + item.price, 0); }

  getCount() { return this.items.length; }

  add(game) {
    // Debug: log state to help diagnose add failures
    try {
      console.log('Cart.add called', { id: game.id, has: this.has(game.id), authLogged: auth.isLoggedIn() });
    } catch (e) { /* ignore */ }

    if (this.has(game.id)) return false;
    if (auth.isLoggedIn() && getUserLibrary().some(p => p.id === game.id)) return false;
    this.items.push(game);
    return true;
  }

  _renderBadge() {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    const count = this.getCount();
    badge.textContent = count;
    // Mostrar u ocultar según cantidad
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }

  remove(id) { this.items = this.items.filter(item => item.id !== id); }

  clear() { this.items = []; }

  render() {
    this._renderBadge();
    this._renderItems();
    this._renderTotal();
  }
  _renderItems() {
    const itemsEl = document.getElementById('cartItems');
    if (this.items.length === 0) {
      itemsEl.innerHTML = '<div class="cart-empty">Tu carrito está vacío</div>';
      return;
    }
    itemsEl.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <div class="cart-item-thumb">
          <img src="${item.img}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/64x64/1a1f2e/ffffff?text=?'" />
        </div>
        <div class="cart-item-details">
          <span class="cart-item-name">${item.title}</span>
          <span class="cart-item-price">
            ${item.price === 0 ? 'Gratis' : '$' + item.price.toFixed(2)}
          </span>
        </div>
        <button class="cart-remove" onclick="cart.remove(${item.id}); cart.render(); catalog.render();">✕</button>
      </div>
    `).join('');
  }

  _renderTotal() {
    const totalBlock = document.getElementById('cartTotalBlock');
    if (this.items.length === 0) { totalBlock.style.display = 'none'; return; }
    document.getElementById('cartTotal').textContent = '$' + this.getTotal().toFixed(2);
    totalBlock.style.display = 'block';
  }

  toggle() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('open');
  }

  checkout() {
    this.toggle();
  }
}


// ════════════════════════════════════════════
//  CLASE: GameCatalog
// ════════════════════════════════════════════
class GameCatalog {

  constructor(games) {
    this.games       = games;
    this.activeFilter = 'todos';
    this.searchQuery  = '';
  }

  filterGames() {
    const q = this.searchQuery.toLowerCase().trim();
    return this.games.filter(game => {
      const matchFilter = this._matchesFilter(game);
      const matchSearch = this._matchesSearch(game, q);
      return matchFilter && matchSearch;
    });
  }

  _matchesFilter(game) {
    if (this.activeFilter === 'todos') return true;
    if (this.activeFilter === 'gratis') return game.price === 0;
    if (this.activeFilter === 'oferta') return game.oldPrice !== null;
    return game.tags.includes(this.activeFilter);
  }

  _matchesSearch(game, q) {
    if (!q) return true;
    return (
      game.title.toLowerCase().includes(q) ||
      game.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  render() {
    const visible = this.filterGames();
    const grid    = document.getElementById('gameGrid');
    const noRes   = document.getElementById('noResults');

    if (visible.length === 0) {
      grid.innerHTML = '';
      noRes.style.display = 'block';
      return;
    }
    noRes.style.display = 'none';
    grid.innerHTML = visible.map(game => this._buildCard(game)).join('');
  }

  _buildCard(game) {
    const inCart = cart.has(game.id);
    const userLibrary = auth.isLoggedIn() ? getUserLibrary() : [];
    const isPurchased = userLibrary.some(p => p.id === game.id);
    const buttonText = isPurchased ? 'Comprado' : inCart ? '✓' : '+';
    const buttonDisabled = inCart || isPurchased ? 'disabled' : '';
    const buttonClass = inCart || isPurchased ? 'added' : '';
    const buttonAction = inCart || isPurchased ? 'void(0)' : 'addToCart(' + game.id + ')';
    return `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="game-card" onclick="openModal(${game.id})">
          <img class="game-thumb" src="${game.img}" alt="Imagen de ${game.title}" onerror="this.src='https://via.placeholder.com/320x180/1a1f2e/ffffff?text=Imagen+no+disponible'" />
          <div class="game-body">
            <div class="game-title">${game.title}</div>
            <div class="game-tags">
              ${game.tags.map(t => `<span class="game-tag">${t}</span>`).join('')}
            </div>
            <div class="game-rating">${buildStarsHtml(game.rating)} ${game.rating}</div>
            <div class="game-footer">
              ${buildPriceHtml(game)}
              <button
                class="add-cart-btn ${buttonClass}"
                onclick="event.stopPropagation(); ${buttonAction}"
                ${buttonDisabled}>
                ${buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }

  applyFilter(filter) {
    this.activeFilter = filter;
    this._updateFilterButtons(filter);
    this.render();
    if (filter !== 'todos') scrollToGames();
  }

  _updateFilterButtons(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle(
        'active',
        btn.getAttribute('onclick').includes(`'${filter}'`)
      );
    });
  }

  setSearch(query) {
    this.searchQuery = query;
    this.render();
  }
}


// ════════════════════════════════════════════
//  CLASE: AuthManager
//  Responsabilidad: manejar login, registro,
//  bloqueo por intentos y recuperación de clave.
//
//  Almacenamiento: sessionStorage (simula DB local)
//  Bloqueo: 3 intentos → 5 minutos
// ════════════════════════════════════════════
class AuthManager {

  constructor() {
    /**
     * Usuarios registrados: { email → { username, passwordHash, email } }
     * Se guarda en sessionStorage para simular persistencia en la sesión.
     */
    this._loadUsers();

    /** Usuario actualmente logueado (null = no logueado) */
    this.currentUser = this._loadSession();

    /**
     * Estado de intentos fallidos por email.
     * { email → { count: number, lockedUntil: number|null } }
     */
    this.loginAttempts = {};

    /**
     * Tokens de recuperación de contraseña.
     * { token → { email, expiresAt: timestamp, usedAt: timestamp|null } }
     */
    this.recoveryTokens = {};

    /** Timer para el countdown de bloqueo */
    this._lockTimer = null;

    /** Regex para validar contraseña */
    this.pwdRules = {
      len:   pwd => pwd.length >= 8,
      upper: pwd => /[A-Z]/.test(pwd),
      num:   pwd => /[0-9]/.test(pwd),
      spec:  pwd => /[!@#$%^&*()_+\-=\[\]{}|;':",.<>?/\\`~]/.test(pwd),
    };
  }

  // ── Persistencia simulada ─────────────────

  _loadUsers() {
    try {
      this.users = JSON.parse(sessionStorage.getItem('nexus_users') || '{}');
    } catch {
      this.users = {};
    }
  }

  _saveUsers() {
    sessionStorage.setItem('nexus_users', JSON.stringify(this.users));
  }

  _loadSession() {
    try {
      const s = sessionStorage.getItem('nexus_session');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }

  _saveSession(user) {
    sessionStorage.setItem('nexus_session', JSON.stringify(user));
  }

  _clearSession() {
    sessionStorage.removeItem('nexus_session');
  }

  // ── Hash simple (demo — no usar en producción) ──
  _hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h) ^ str.charCodeAt(i);
    }
    return (h >>> 0).toString(16);
  }

  // ── Validación de contraseña ─────────────

  /**
   * Valida que la contraseña cumpla todas las reglas.
   * @param {string} pwd
   * @returns {{ valid: boolean, failed: string[] }}
   */
  validatePassword(pwd) {
    const failed = Object.keys(this.pwdRules).filter(k => !this.pwdRules[k](pwd));
    return { valid: failed.length === 0, failed };
  }

  // ── Control de intentos / bloqueo ────────

  /**
   * Obtiene o inicializa el estado de intentos para un email.
   * @param {string} email
   */
  _getAttemptState(email) {
    if (!this.loginAttempts[email]) {
      this.loginAttempts[email] = { count: 0, lockedUntil: null };
    }
    return this.loginAttempts[email];
  }

  /**
   * Retorna true si la cuenta está bloqueada en este momento.
   * @param {string} email
   */
  isLocked(email) {
    const state = this._getAttemptState(email);
    if (!state.lockedUntil) return false;
    if (Date.now() < state.lockedUntil) return true;
    // El bloqueo expiró → resetear
    state.lockedUntil = null;
    state.count = 0;
    return false;
  }

  /**
   * Segundos restantes de bloqueo (0 si no está bloqueado).
   * @param {string} email
   */
  lockSecondsLeft(email) {
    const state = this._getAttemptState(email);
    if (!state.lockedUntil) return 0;
    return Math.max(0, Math.ceil((state.lockedUntil - Date.now()) / 1000));
  }

  /**
   * Registra un intento fallido. Bloquea si se llega a 3.
   * @param {string} email
   * @returns {{ locked: boolean, attemptsLeft: number }}
   */
  recordFailedAttempt(email) {
    const state = this._getAttemptState(email);
    state.count += 1;

    if (state.count >= 3) {
      state.lockedUntil = Date.now() + 5 * 60 * 1000; // 5 minutos
      return { locked: true, attemptsLeft: 0 };
    }

    return { locked: false, attemptsLeft: 3 - state.count };
  }

  /** Resetea el contador de intentos (login exitoso). */
  resetAttempts(email) {
    if (this.loginAttempts[email]) {
      this.loginAttempts[email] = { count: 0, lockedUntil: null };
    }
  }

  /** Intentos fallidos usados (para mostrar los dots). */
  usedAttempts(email) {
    return this._getAttemptState(email).count;
  }

  // ── Registro ─────────────────────────────

  /**
   * Registra un nuevo usuario.
   * @param {{ username, email, password }} data
   * @returns {{ ok: boolean, error?: string }}
   */
  register({ username, email, password }) {
    const emailKey = email.toLowerCase().trim();

    if (!username.trim() || username.trim().length < 3) {
      return { ok: false, error: 'El nombre de usuario debe tener al menos 3 caracteres.' };
    }
    if (!this._isValidEmail(emailKey)) {
      return { ok: false, error: 'El correo electrónico no es válido.' };
    }
    if (this.users[emailKey]) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
    }

    const { valid, failed } = this.validatePassword(password);
    if (!valid) {
      return { ok: false, error: 'La contraseña no cumple los requisitos de seguridad.' };
    }

    // Guardar usuario
    this.users[emailKey] = {
      username: username.trim(),
      email: emailKey,
      passwordHash: this._hash(password),
    };
    this._saveUsers();

    return { ok: true };
  }

  // ── Login ─────────────────────────────────

  /**
   * Intenta autenticar al usuario.
   * @param {{ email, password }} data
   * @returns {{ ok: boolean, user?: Object, error?: string, locked?: boolean, attemptsLeft?: number }}
   */
  login({ email, password }) {
    const emailKey = email.toLowerCase().trim();

    if (!emailKey || !password) {
      return { ok: false, error: 'Completá todos los campos.' };
    }

    // Verificar bloqueo
    if (this.isLocked(emailKey)) {
      const secs = this.lockSecondsLeft(emailKey);
      return { ok: false, locked: true, secondsLeft: secs };
    }

    const user = this.users[emailKey];

    // Email o contraseña incorrectos (mismo mensaje por seguridad)
    if (!user || user.passwordHash !== this._hash(password)) {
      const result = this.recordFailedAttempt(emailKey);
      if (result.locked) {
        return { ok: false, locked: true, secondsLeft: this.lockSecondsLeft(emailKey) };
      }
      return {
        ok: false,
        error: 'Email o contraseña incorrectos.',
        attemptsLeft: result.attemptsLeft
      };
    }

    // Login exitoso
    this.resetAttempts(emailKey);
    this.currentUser = user;
    this._saveSession(user);
    return { ok: true, user };
  }

  // ── Logout ────────────────────────────────

  logout() {
    this.currentUser = null;
    this._clearSession();
  }

  // ── Recuperar contraseña (simulado) ──────

  /**
   * Genera un token de recuperación de contraseña.
   * Simula el envío de un email con un enlace.
   * @param {string} email
   * @returns {{ ok: boolean, error?: string, token?: string, message?: string }}
   */
  recoverPassword(email) {
    const emailKey = email.toLowerCase().trim();

    if (!this._isValidEmail(emailKey)) {
      return { ok: false, error: 'Ingresá un correo electrónico válido.' };
    }

    // Generar token de recuperación (16 caracteres aleatorios)
    const token = Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
    const expiresAt = Date.now() + (15 * 60 * 1000); // Válido por 15 minutos

    this.recoveryTokens[token] = {
      email: emailKey,
      expiresAt,
      usedAt: null
    };

    // En producción, aquí se enviaría un email real con el token
    // Para demo, simulamos el email mostrando el enlace en la UI
    console.log(`📧 EMAIL SIMULADO: Enlace de recuperación enviado a ${emailKey}`);
    console.log(`🔗 Token: ${token}`);

    return {
      ok: true,
      token,
      message: `✅ Si existe una cuenta con ${emailKey}, recibiste un email con el enlace de recuperación.`
    };
  }

  /**
   * Valida un token de recuperación.
   * @param {string} token
   * @returns {{ valid: boolean, email?: string, error?: string }}
   */
  validateRecoveryToken(token) {
    const recovery = this.recoveryTokens[token];

    if (!recovery) {
      return { valid: false, error: 'El token es inválido.' };
    }

    if (recovery.usedAt) {
      return { valid: false, error: 'Este enlace ya fue utilizado.' };
    }

    if (Date.now() > recovery.expiresAt) {
      delete this.recoveryTokens[token];
      return { valid: false, error: 'El enlace expiró. Solicita uno nuevo.' };
    }

    return { valid: true, email: recovery.email };
  }

  /**
   * Cambia la contraseña usando un token de recuperación válido.
   * @param {string} token
   * @param {string} newPassword
   * @returns {{ ok: boolean, error?: string, message?: string }}
   */
  resetPassword(token, newPassword) {
    const validation = this.validateRecoveryToken(token);

    if (!validation.valid) {
      return { ok: false, error: validation.error };
    }

    const { valid, failed } = this.validatePassword(newPassword);
    if (!valid) {
      const failedNames = {
        'len': 'mínimo 8 caracteres',
        'upper': 'una mayúscula',
        'num': 'un número',
        'spec': 'un carácter especial'
      };
      const missing = failed.map(f => failedNames[f]).join(', ');
      return { ok: false, error: `La contraseña debe tener: ${missing}.` };
    }

    const email = validation.email;
    if (!this.users[email]) {
      return { ok: false, error: 'La cuenta no existe.' };
    }

    // Actualizar contraseña
    this.users[email].passwordHash = this._hash(newPassword);
    this._saveUsers();

    // Marcar token como usado
    this.recoveryTokens[token].usedAt = Date.now();

    return { ok: true, message: '✅ Tu contraseña fue actualizada correctamente.' };
  }

  // ── Helpers ───────────────────────────────

  _isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isLoggedIn() { return this.currentUser !== null; }
}


// ════════════════════════════════════════════
//  HELPERS — Funciones puras reutilizables
// ════════════════════════════════════════════

function buildPriceHtml(game) {
  if (game.price === 0) return `<span class="game-price free">GRATIS</span>`;
  if (game.oldPrice) {
    const pct = Math.round((1 - game.price / game.oldPrice) * 100);
    return `
      <span class="game-price discount">
        <span class="price-old">$${game.oldPrice.toFixed(2)}</span>
        <span>$${game.price.toFixed(2)}</span>
        <span class="discount-badge">-${pct}%</span>
      </span>`;
  }
  return `<span class="game-price">$${game.price.toFixed(2)}</span>`;
}

function buildStarsHtml(rating) {
  const full  = Math.round(rating);
  const empty = 5 - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
}


// ════════════════════════════════════════════
//  MODAL DE DETALLE DEL JUEGO
// ════════════════════════════════════════════
let modalInstance = null;

function openModal(id) {
  const game = catalog.games.find(g => g.id === id);
  if (!game) return;

  document.getElementById('modalTitle').textContent  = game.title;
  document.getElementById('modalThumb').innerHTML =
    `<img class="modal-thumb-image" src="${game.img}" alt="Imagen de ${game.title}" onerror="this.src='https://via.placeholder.com/760x220/1a1f2e/ffffff?text=Imagen+no+disponible'" />`;
  document.getElementById('modalDesc').textContent   = game.desc;
  document.getElementById('modalRating').textContent =
    buildStarsHtml(game.rating) + ' ' + game.rating;

  const priceText = game.price === 0
    ? 'GRATIS'
    : game.oldPrice ? `$${game.price.toFixed(2)} (antes $${game.oldPrice.toFixed(2)})`
    : `$${game.price.toFixed(2)}`;
  document.getElementById('modalPrice').textContent = priceText;

  document.getElementById('modalTags').innerHTML =
    game.tags.map(t =>
      `<span class="game-tag" style="font-size:.8rem;padding:.2rem .6rem;">${t}</span>`
    ).join('');

  const addBtn = document.getElementById('modalAddBtn');
  const inCart = cart.has(id);
  addBtn.textContent = inCart ? '✓ Ya en el carrito' : game.price === 0 ? 'Agregar gratis' : 'Agregar al carrito';
  addBtn.disabled    = inCart;

  addBtn.onclick = () => {
    addToCart(id);
    addBtn.textContent = '✓ Ya en el carrito';
    addBtn.disabled    = true;
  };

  if (!modalInstance) {
    modalInstance = new bootstrap.Modal(document.getElementById('gameModal'));
  }
  modalInstance.show();
}


// ════════════════════════════════════════════
//  AUTH UI — Funciones del modal de auth
// ════════════════════════════════════════════

/**
 * Abre el modal de autenticación en el panel indicado.
 * @param {'login'|'register'|'recover'} panel
 */
function openAuthModal(panel = 'login') {
  document.getElementById('authOverlay').classList.add('open');
  document.getElementById('authModal').classList.add('open');
  resetAuthForms();
  switchPanel(panel, false);
}

/** Cierra el modal de autenticación */
function closeAuthModal() {
  document.getElementById('authOverlay').classList.remove('open');
  document.getElementById('authModal').classList.remove('open');
  if (auth._lockTimer) {
    clearInterval(auth._lockTimer);
    auth._lockTimer = null;
  }
}

/** Cambia el panel visible dentro del modal */
function switchPanel(name, resetForms = true) {
  ['panelLogin', 'panelRegister', 'panelRecover'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  document.getElementById('panel' + name.charAt(0).toUpperCase() + name.slice(1)).style.display = 'block';
  if (resetForms) resetAuthForms();
}

/** Limpia errores y campos del modal */
function resetAuthForms() {
  ['loginError', 'loginLockedMsg', 'regError', 'recoverError', 'recoverSuccess'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.textContent = ''; }
  });
  // Limpiar intentos UI
  document.getElementById('attemptsBar').style.display = 'none';
  ['dot1','dot2','dot3'].forEach(d => document.getElementById(d).classList.remove('used'));
}

/**
 * Alterna visibilidad del campo de contraseña.
 * @param {string} inputId
 * @param {HTMLElement} btn
 */
function togglePwdVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

/**
 * Actualiza el indicador de fuerza y reglas de la contraseña.
 * @param {string} pwd
 */
function checkPasswordStrength(pwd) {
  const rules = {
    len:   pwd.length >= 8,
    upper: /[A-Z]/.test(pwd),
    num:   /[0-9]/.test(pwd),
    spec:  /[!@#$%^&*()_+\-=\[\]{}|;':",.<>?/\\`~]/.test(pwd),
  };

  const passed = Object.values(rules).filter(Boolean).length;

  // Actualizar cada regla en la UI
  Object.entries(rules).forEach(([key, ok]) => {
    const li   = document.getElementById('rule-' + key);
    const icon = li.querySelector('.rule-icon');
    if (ok) {
      li.classList.add('ok');
      icon.textContent = '✓';
    } else {
      li.classList.remove('ok');
      icon.textContent = '✗';
    }
  });

  // Barra de fuerza
  const fill = document.getElementById('pwdStrengthFill');
  const pct  = (passed / 4) * 100;
  fill.style.width = pct + '%';

  const colors = ['', '#ff3c6e', '#f59e0b', '#22d3ee', '#4ade80'];
  fill.style.background = colors[passed] || 'transparent';

  // Validar confirmación de contraseña si existe
  const confirmInput = document.getElementById('regConfirm');
  if (confirmInput && confirmInput.value) {
    validatePasswordMatch();
  }
}

function validatePasswordMatch() {
  const pwd = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  const confirmInput = document.getElementById('regConfirm');
  
  if (confirm === '') {
    confirmInput.classList.remove('match', 'mismatch');
    return;
  }
  
  if (pwd === confirm) {
    confirmInput.classList.add('match');
    confirmInput.classList.remove('mismatch');
  } else {
    confirmInput.classList.add('mismatch');
    confirmInput.classList.remove('match');
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateUsername(username) {
  return username.length >= 3 && username.length <= 20;
}

/** Actualiza la barra de intentos fallidos en el UI */
function updateAttemptsUI(email) {
  const used = auth.usedAttempts(email);
  if (used === 0) {
    document.getElementById('attemptsBar').style.display = 'none';
    return;
  }

  document.getElementById('attemptsBar').style.display = 'flex';
  document.getElementById('attemptsLabel').textContent = `Intentos restantes: ${3 - used}`;

  ['dot1','dot2','dot3'].forEach((id, i) => {
    document.getElementById(id).classList.toggle('used', i < used);
  });
}

/** Inicia el countdown de bloqueo y lo muestra en la UI */
function startLockCountdown(email) {
  const lockedMsg  = document.getElementById('loginLockedMsg');
  const countdown  = document.getElementById('lockCountdown');
  const loginError = document.getElementById('loginError');
  const submitBtn  = document.getElementById('loginSubmitBtn');

  loginError.style.display = 'none';
  lockedMsg.style.display  = 'block';
  submitBtn.disabled        = true;
  document.getElementById('loginPassword').disabled = true;
  document.getElementById('loginEmail').disabled    = true;

  if (auth._lockTimer) clearInterval(auth._lockTimer);

  auth._lockTimer = setInterval(() => {
    const secs = auth.lockSecondsLeft(email);
    if (secs <= 0) {
      clearInterval(auth._lockTimer);
      auth._lockTimer = null;
      lockedMsg.style.display = 'none';
      submitBtn.disabled = false;
      document.getElementById('loginPassword').disabled = false;
      document.getElementById('loginEmail').disabled    = false;
      document.getElementById('loginPassword').value    = '';
      resetAuthForms();
      return;
    }
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    countdown.textContent = `Tiempo restante: ${min}:${sec.toString().padStart(2,'0')}`;
  }, 1000);
}


// ════════════════════════════════════════════
//  HANDLERS DE AUTH
// ════════════════════════════════════════════

/** Maneja el intento de login */
function handleLogin() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl  = document.getElementById('loginError');

  errorEl.style.display = 'none';

  // Validaciones
  if (!email || !password) {
    errorEl.textContent  = '⚠️ Completa todos los campos.';
    errorEl.style.display = 'block';
    return;
  }

  if (!validateEmail(email)) {
    errorEl.textContent  = '⚠️ Ingresa un email válido.';
    errorEl.style.display = 'block';
    return;
  }

  const result = auth.login({ email, password });

  if (result.ok) {
    closeAuthModal();
    renderNavAuth();
    catalog.render();
    // Si existe un backup de biblioteca para este usuario, ofrecer restaurarlo
    const backupKey = `nexus_library_backup_${result.user.email}`;
    const backup = sessionStorage.getItem(backupKey);
    if (backup) {
      try {
        const parsed = JSON.parse(backup);
        if (confirm('Se encontró una copia de seguridad de tu biblioteca guardada localmente. ¿Deseas restaurarla ahora?')) {
          restoreLibraryBackup(result.user.email);
        } else {
          showToast('⚠️ Respaldo disponible pero no restaurado.');
        }
      } catch (e) {
        // si falla el parseo, aún ofrecer restaurar
        if (confirm('Se encontró una copia de seguridad de tu biblioteca. ¿Deseas restaurarla?')) {
          restoreLibraryBackup(result.user.email);
        }
      }
    }
    showToast(`👋 ¡Bienvenido, ${result.user.username}!`);
    return;
  }

  if (result.locked) {
    startLockCountdown(email.toLowerCase());
    return;
  }

  // Error con intentos restantes
  errorEl.textContent  = result.error || 'Email o contraseña incorrectos.';
  errorEl.style.display = 'block';
  updateAttemptsUI(email.toLowerCase());
}

/** Maneja el registro de un nuevo usuario */
function handleRegister() {
  const username = document.getElementById('regUsername').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm  = document.getElementById('regConfirm').value;
  const errorEl  = document.getElementById('regError');

  errorEl.style.display = 'none';

  // Validaciones
  if (!username || !email || !password || !confirm) {
    errorEl.textContent  = '⚠️ Completa todos los campos.';
    errorEl.style.display = 'block';
    return;
  }

  if (!validateUsername(username)) {
    errorEl.textContent  = '⚠️ El usuario debe tener entre 3 y 20 caracteres.';
    errorEl.style.display = 'block';
    return;
  }

  if (!validateEmail(email)) {
    errorEl.textContent  = '⚠️ Ingresa un email válido.';
    errorEl.style.display = 'block';
    return;
  }

  if (password !== confirm) {
    errorEl.textContent  = '⚠️ Las contraseñas no coinciden.';
    errorEl.style.display = 'block';
    document.getElementById('regConfirm').classList.add('mismatch');
    return;
  }

  const { valid, failed } = auth.validatePassword(password);
  if (!valid) {
    const failedNames = {
      'len': 'mínimo 8 caracteres',
      'upper': 'una mayúscula',
      'num': 'un número',
      'spec': 'un carácter especial'
    };
    const missing = failed.map(f => failedNames[f]).join(', ');
    errorEl.textContent  = `⚠️ La contraseña debe tener: ${missing}.`;
    errorEl.style.display = 'block';
    return;
  }

  document.getElementById('regConfirm').classList.remove('mismatch');

  const result = auth.register({ username, email, password });

  if (!result.ok) {
    errorEl.textContent  = result.error;
    errorEl.style.display = 'block';
    return;
  }

  // Registro exitoso → auto-login
  const loginResult = auth.login({ email, password });
  if (loginResult.ok) {
    closeAuthModal();
    renderNavAuth();
    catalog.render();
    // Ofrecer restaurar backup tras registro+auto-login
    const backupKeyR = `nexus_library_backup_${loginResult.user.email}`;
    if (sessionStorage.getItem(backupKeyR)) {
      if (confirm('Se encontró una copia de seguridad de tu biblioteca. ¿Restaurarla ahora?')) {
        restoreLibraryBackup(loginResult.user.email);
      }
    }
    showToast(`🎮 ¡Cuenta creada! Bienvenido, ${loginResult.user.username}!`);
  }
}

/** Maneja la solicitud de recuperación de contraseña */
function handleRecover() {
  const email    = document.getElementById('recoverEmail').value.trim();
  const errorEl  = document.getElementById('recoverError');
  const successEl = document.getElementById('recoverSuccess');

  errorEl.style.display   = 'none';
  successEl.style.display = 'none';

  // Validaciones
  if (!email) {
    errorEl.textContent  = '⚠️ Ingresa tu email.';
    errorEl.style.display = 'block';
    return;
  }

  if (!validateEmail(email)) {
    errorEl.textContent  = '⚠️ Ingresa un email válido.';
    errorEl.style.display = 'block';
    return;
  }

  const result = auth.recoverPassword(email);

  if (!result.ok) {
    errorEl.textContent  = result.error;
    errorEl.style.display = 'block';
    return;
  }

  // Mostrar mensaje de éxito con enlace simulado
  successEl.innerHTML = `
    ✅ ${result.message}
    <br><br>
    <strong>Para demostración:</strong>
    <button class="auth-submit-btn" id="resetPasswordLinkBtn" style="width:100%;margin-top:1rem;">
      Cambiar contraseña
    </button>
  `;
  successEl.style.display = 'block';
  document.getElementById('recoverEmail').value = '';

  const resetBtn = document.getElementById('resetPasswordLinkBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => openResetPasswordModal(result.token));
  }
}

/** Maneja el cierre de sesión */
function handleLogout() {
  const username = auth.currentUser?.username;
  // Eliminar únicamente la biblioteca asociada al usuario actualmente logueado
  const userEmail = auth.currentUser?.email;
  if (userEmail) {
    const key = `nexus_library_${userEmail}`;
    const lib = sessionStorage.getItem(key);
    if (lib) {
      // Guardar una copia de seguridad antes de eliminar
      const backupKey = `nexus_library_backup_${userEmail}`;
      try {
        const parsed = JSON.parse(lib);
        const payload = { savedAt: Date.now(), data: parsed };
        sessionStorage.setItem(backupKey, JSON.stringify(payload));
      } catch (e) {
        // Si no es JSON válido, guardar el string crudo
        sessionStorage.setItem(backupKey, JSON.stringify({ savedAt: Date.now(), data: lib }));
      }
      sessionStorage.removeItem(key);
      showToast('📦 Biblioteca respaldada localmente antes de cerrar sesión.');
    }
  }

  auth.logout();
  renderNavAuth();
  catalog.render();
  showToast(`👋 Hasta luego, ${username}! (tu biblioteca local fue borrada)`);
}

/** Abre el modal para cambiar contraseña durante recuperación */
function openResetPasswordModal(token) {
  console.log('openResetPasswordModal called', { token });
  // Guardar token temporalmente en la ventana
  window._resetPasswordToken = token;

  // Limpiar formulario
  document.getElementById('resetPwdError').style.display = 'none';
  document.getElementById('resetNewPassword').value = '';
  document.getElementById('resetConfirmPassword').value = '';
  document.getElementById('resetNewPassword').classList.remove('match', 'mismatch');
  document.getElementById('resetConfirmPassword').classList.remove('match', 'mismatch');

  // Limpiar indicador de contraseña
  document.getElementById('resetPwdStrengthFill').style.width = '0%';
  document.querySelectorAll('#resetPwdRules .pwd-rule').forEach(el => {
    el.classList.remove('ok');
  });

  // Mostrar modal
  document.getElementById('resetPasswordOverlay').style.display = 'flex';
  document.getElementById('resetPasswordModal').style.display = 'block';
}

/** Cierra el modal de cambio de contraseña */
function closeResetPasswordModal() {
  window._resetPasswordToken = null;
  document.getElementById('resetPasswordOverlay').style.display = 'none';
  document.getElementById('resetPasswordModal').style.display = 'none';
}

/** Maneja el envío del formulario de cambio de contraseña */
function handleResetPassword() {
  const token = window._resetPasswordToken;
  console.log('handleResetPassword called', { token });
  const newPwd = document.getElementById('resetNewPassword').value;
  const confirmPwd = document.getElementById('resetConfirmPassword').value;
  const errorEl = document.getElementById('resetPwdError');

  errorEl.style.display = 'none';

  // Validaciones
  if (!newPwd || !confirmPwd) {
    errorEl.textContent = '⚠️ Completa ambas contraseñas.';
    errorEl.style.display = 'block';
    return;
  }

  if (newPwd !== confirmPwd) {
    errorEl.textContent = '⚠️ Las contraseñas no coinciden.';
    errorEl.style.display = 'block';
    document.getElementById('resetConfirmPassword').classList.add('mismatch');
    return;
  }

  document.getElementById('resetConfirmPassword').classList.remove('mismatch');

  // Procesar reset de contraseña
  if (!token) {
    errorEl.textContent = '⚠️ Token inválido o expirado. Solicita un nuevo enlace.';
    errorEl.style.display = 'block';
    return;
  }

  const result = auth.resetPassword(token, newPwd);

  if (!result.ok) {
    errorEl.textContent = result.error;
    errorEl.style.display = 'block';
    return;
  }

  // Éxito
  showToast(result.message);
  closeResetPasswordModal();

  // Volver al panel de login
  setTimeout(() => {
    closeAuthModal();
  }, 1000);
}

/** Valida la contraseña nueva en tiempo real durante el reset */
function checkResetPasswordStrength(pwd) {
  if (!pwd) {
    document.getElementById('resetPwdStrengthFill').style.width = '0%';
    document.querySelectorAll('#resetPwdRules .pwd-rule').forEach(el => {
      el.classList.remove('ok');
    });
    return;
  }

  const rules = ['len', 'upper', 'num', 'spec'];
  let passedCount = 0;

  rules.forEach(rule => {
    const el = document.getElementById(`reset-rule-${rule}`);
    const passed = auth.pwdRules[rule](pwd);
    if (passed) {
      el.classList.add('ok');
      passedCount++;
    } else {
      el.classList.remove('ok');
    }
  });

  const fill = document.getElementById('resetPwdStrengthFill');
  fill.style.width = (passedCount * 25) + '%';
  fill.style.background = passedCount === 4 ? '#4ade80' : passedCount >= 3 ? '#fbbf24' : '#ff3c6e';

  // Validar concordancia también
  validateResetPasswordMatch();
}

/** Valida que las dos contraseñas coincidan en tiempo real */
function validateResetPasswordMatch() {
  const pwd = document.getElementById('resetNewPassword').value;
  const confirm = document.getElementById('resetConfirmPassword').value;
  const confirmInput = document.getElementById('resetConfirmPassword');

  if (confirm === '') {
    confirmInput.classList.remove('match', 'mismatch');
    return;
  }

  if (pwd === confirm) {
    confirmInput.classList.add('match');
    confirmInput.classList.remove('mismatch');
  } else {
    confirmInput.classList.add('mismatch');
    confirmInput.classList.remove('match');
  }
}

/**
 * Actualiza el área de autenticación en la navbar
 * según si el usuario está logueado o no.
 */
function renderNavAuth() {
  const area = document.getElementById('authNavArea');
  if (auth.isLoggedIn()) {
    area.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <div class="user-nav-btn">
          <span>👤</span>
          <span>${auth.currentUser.username}</span>
        </div>
        <button class="user-logout-btn" onclick="handleLogout()" title="Cerrar sesión">Cerrar sesión ⏻</button>
      </div>`;
  } else {
    area.innerHTML = `
      <button class="auth-nav-btn" onclick="openAuthModal('login')">
        <span>👤</span> Iniciar Sesión
      </button>`;
  }
}


// ════════════════════════════════════════════
//  ACCIONES GLOBALES
// ════════════════════════════════════════════

function addToCart(id) {
  const game = catalog.games.find(g => g.id === id);
  if (!game) return;

  // Debug: log attempts to add to cart
  try {
    console.log('addToCart called', { id, authLogged: auth.isLoggedIn(), cartHas: cart.has(id) });
  } catch (e) { /* ignore */ }

  if (auth.isLoggedIn()) {
    const purchased = getUserLibrary().some(p => p.id === id);
    if (purchased) {
      showToast('⚠️ Ya tienes este juego en tu biblioteca.');
      return;
    }
  }
  const added = cart.add(game);
  if (!added) return;
  cart.render();
  catalog.render();
  showToast(`🎮 ${game.title} agregado al carrito`);
}

function applyFilter(filter) {
  switchView('store');
  catalog.applyFilter(filter);
}

function scrollToGames() {
  switchView('store');
  document.getElementById('gamesSection').scrollIntoView({ behavior: 'smooth' });
}

function toggleCart() { cart.toggle(); }

function checkout() {
  if (cart.getCount() === 0) {
    showToast('El carrito está vacío');
    return;
  }
  if (!auth.isLoggedIn()) {
    showToast('⚠️ Inicia sesión para poder pagar.');
    openAuthModal('login');
    return;
  }
  openPaymentModal();
}


// ════════════════════════════════════════════
//  PAYMENT MODAL
// ════════════════════════════════════════════

function openPaymentModal() {
  const total = cart.getTotal().toFixed(2);
  document.getElementById('paymentAmount').textContent = '$' + total;
  document.getElementById('paymentOverlay').classList.add('open');
  document.getElementById('paymentModal').classList.add('open');
  updateCardFormVisibility();
}

function closePaymentModal() {
  document.getElementById('paymentOverlay').classList.remove('open');
  document.getElementById('paymentModal').classList.remove('open');
}

function updateCardFormVisibility() {
  const method = document.querySelector('input[name="paymentMethod"]:checked').value;
  const cardForm = document.getElementById('cardDetailsForm');
  cardForm.style.display = method === 'credit_card' ? 'flex' : 'none';
}

// Mostrar/ocultar formulario de tarjeta según el método seleccionado
function setupPaymentListeners() {
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
  paymentMethods.forEach(method => {
    method.addEventListener('change', updateCardFormVisibility);
  });
}

function processPayment() {
  if (!auth.isLoggedIn()) {
    closePaymentModal();
    showToast('⚠️ Debes iniciar sesión antes de procesar el pago.');
    openAuthModal('login');
    return;
  }
  const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  const total = cart.getTotal().toFixed(2);
  
  // Validar campos si es tarjeta
  if (selectedMethod === 'credit_card') {
    const cardInputs = document.querySelectorAll('.card-details-form input');
    if ([...cardInputs].some(input => !input.value.trim())) {
      showToast('⚠️ Completa todos los datos de la tarjeta');
      return;
    }
  }
  
  // Simular procesamiento de pago
  closePaymentModal();
  showToast('⏳ Procesando pago...');
  
  setTimeout(() => {
    // Agregar juegos a la biblioteca del usuario
    if (auth.isLoggedIn()) {
      cart.items.forEach(game => {
        addToLibrary(game.id);
      });
    }

    // Limpiar carrito y completar compra
    cart.items = [];
    cart.render();
    catalog.render();
    
    const methodText = {
      'credit_card': 'Tarjeta de Crédito',
      'paypal': 'PayPal',
      'bank_transfer': 'Transferencia Bancaria'
    }[selectedMethod];
    
    showToast(`✅ ¡Pago exitoso! ($${total} - ${methodText})`);
  }, 1500);
}


// ════════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════════

function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const toast     = document.createElement('div');
  toast.className   = 'nexus-toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}


// ════════════════════════════════════════════
//  INSTANCIAS GLOBALES
// ════════════════════════════════════════════
const cart    = new Cart();
const catalog = new GameCatalog(games);
const auth    = new AuthManager();

// ════════════════════════════════════════════
//  NAVEGACIÓN ENTRE VISTAS
// ════════════════════════════════════════════

/** Vista actual: 'store', 'library', 'community', 'news' */
let currentView = 'store';

/** Cambia entre vistas principales */
function switchView(view) {
  // Ocultar todas las secciones
  document.getElementById('gamesSection').style.display = 'none';
  document.getElementById('librarySection').style.display = 'none';
  document.getElementById('communitySection').style.display = 'none';
  document.getElementById('newsSection').style.display = 'none';

  // Actualizar nav links
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Mostrar vista seleccionada
  currentView = view;

  switch(view) {
    case 'store':
      document.getElementById('gamesSection').style.display = 'block';
      document.querySelectorAll('.navbar-nav .nav-link')[0].classList.add('active');
      break;
    case 'library':
      document.getElementById('librarySection').style.display = 'block';
      document.querySelectorAll('.navbar-nav .nav-link')[1].classList.add('active');
      renderLibrary();
      break;
    case 'community':
      document.getElementById('communitySection').style.display = 'block';
      document.querySelectorAll('.navbar-nav .nav-link')[2].classList.add('active');
      break;
    case 'news':
      document.getElementById('newsSection').style.display = 'block';
      document.querySelectorAll('.navbar-nav .nav-link')[3].classList.add('active');
      break;
  }

  // Cerrar carrito si está abierto
  if (document.getElementById('cartSidebar').classList.contains('open')) {
    toggleCart();
  }
}

/** Renderiza la biblioteca del usuario */
function renderLibrary() {
  const libraryContent = document.getElementById('libraryContent');

  if (!auth.isLoggedIn()) {
    libraryContent.innerHTML = `
      <div class="alert alert-info" style="background:rgba(0,229,255,.1);border:1px solid var(--accent);color:var(--text-main);">
        <p style="margin:0;">📌 <strong>Inicia sesión</strong> para ver tus juegos comprados aquí.</p>
      </div>
    `;
    return;
  }

  // Obtener juegos comprados del usuario
  const userLibrary = getUserLibrary();

  if (userLibrary.length === 0) {
    libraryContent.innerHTML = `
      <div class="alert alert-warning" style="background:rgba(251,191,36,.1);border:1px solid #fbbf24;color:var(--text-main);">
        <p style="margin:0;">📚 <strong>Tu biblioteca está vacía</strong> — ¡Compra juegos en la tienda!</p>
      </div>
    `;
    return;
  }

  const html = `
    <div style="margin-bottom:1.5rem;">
      <p style="color:var(--text-muted);margin:0;">Tienes <strong style="color:var(--accent);">${userLibrary.length}</strong> juego(s) en tu biblioteca</p>
    </div>
    <div class="row g-3">
      ${userLibrary.map(game => `
        <div class="col-6 col-md-4 col-lg-3">
          <div class="game-card" onclick="openModal(${game.id})" style="cursor:pointer;">
            <img class="game-thumb" src="${game.img}" alt="Imagen de ${game.title}" 
                 onerror="this.src='https://via.placeholder.com/320x180/1a1f2e/ffffff?text=Imagen+no+disponible'" />
            <div class="game-body">
              <div class="game-title">${game.title}</div>
              <div class="game-tags">
                ${game.tags.map(t => `<span class="game-tag">${t}</span>`).join('')}
              </div>
              <div class="game-rating">${buildStarsHtml(game.rating)} ${game.rating}</div>
              <div class="game-footer">
                <span style="color:var(--accent);font-weight:600;">✓ En tu biblioteca</span>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  libraryContent.innerHTML = html;
}

/** Obtiene la lista de juegos comprados del usuario actual */
function getUserLibrary() {
  if (!auth.isLoggedIn()) return [];

  const userLibrary = sessionStorage.getItem(`nexus_library_${auth.currentUser.email}`);
  if (!userLibrary) return [];

  try {
    const gameIds = JSON.parse(userLibrary);
    return games.filter(g => gameIds.includes(g.id));
  } catch {
    return [];
  }
}

/** Agrega un juego a la biblioteca del usuario */
function addToLibrary(gameId) {
  if (!auth.isLoggedIn()) {
    openAuthModal('login');
    return;
  }

  const key = `nexus_library_${auth.currentUser.email}`;
  const libraryStr = sessionStorage.getItem(key) || '[]';
  const library = JSON.parse(libraryStr);

  if (!library.includes(gameId)) {
    library.push(gameId);
    sessionStorage.setItem(key, JSON.stringify(library));
  }
}

/** Restaura la biblioteca desde un backup creado al hacer logout (si existe) */
function restoreLibraryBackup(email) {
  if (!email) return false;
  const backupKey = `nexus_library_backup_${email}`;
  const key = `nexus_library_${email}`;
  const raw = sessionStorage.getItem(backupKey);
  if (!raw) return false;
  try {
    const payload = JSON.parse(raw);
    const data = payload && payload.data ? payload.data : payload;
    sessionStorage.setItem(key, JSON.stringify(data));
    sessionStorage.removeItem(backupKey);
    showToast('✅ Biblioteca restaurada desde el respaldo.');
    // Si el usuario está logueado, refrescar la UI
    if (auth.isLoggedIn() && auth.currentUser?.email === email) {
      catalog.render();
      renderLibrary();
    }
    return true;
  } catch (e) {
    // si el contenido no es JSON válido, intentar restaurarlo como string
    try {
      sessionStorage.setItem(key, raw);
      sessionStorage.removeItem(backupKey);
      showToast('✅ Biblioteca restaurada (formato crudo).');
      if (auth.isLoggedIn() && auth.currentUser?.email === email) {
        catalog.render();
        renderLibrary();
      }
      return true;
    } catch (e2) {
      showToast('❌ No fue posible restaurar el respaldo.');
      return false;
    }
  }
}

/** Muestra un alerta simple */
function showAlert(message) {
  showToast(message);
}

// ════════════════════════════════════════════
//  INICIALIZACIÓN
// ════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  catalog.render();
  cart.render();
  renderNavAuth();
  setupPaymentListeners();

  // Búsqueda en tiempo real
  document.getElementById('searchInput').addEventListener('input', e => {
    catalog.setSearch(e.target.value);
  });

  // Cerrar modal auth con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('authModal').classList.contains('open')) {
      closeAuthModal();
    }
    if (e.key === 'Escape' && document.getElementById('paymentModal').classList.contains('open')) {
      closePaymentModal();
    }
  });

  // Submit con Enter en campos de login
  ['loginEmail', 'loginPassword'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') handleLogin();
    });
  });

  // Submit con Enter en recuperar contraseña
  document.getElementById('recoverEmail').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleRecover();
  });
});
