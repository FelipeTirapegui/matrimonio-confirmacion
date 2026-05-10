386
/* ======================================
   CONFIGURACIÓN INICIAL
   ====================================== */

// URL del Google Apps Script (actualizada 10 may 2026 - Con CORS headers)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjOfyhEzW1mIqgTOjm5WyUtqti3wCjF8UqpGsACHzJKed8CjpeRbJ6KaNoDPefIRSX/exec';

// Fecha del matrimonio
const WEDDING_DATE = new Date('2026-07-17T00:00:00').getTime();

/* ======================================
   INICIALIZACIÓN
   ====================================== */

document.addEventListener('DOMContentLoaded', () => {
    initializeParticles();
    initializeCountdown();
    initializeAudio();
    initializeDarkMode();
    initializeFormValidation();
    initializeScrollAnimations();
});

/* ======================================
   PARTÍCULAS DINÁMICAS
   ====================================== */

function initializeParticles() {
    const container = document.getElementById('particlesContainer');
    const particleCount = window.innerWidth < 768 ? 20 : 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        container.appendChild(particle);
    }
}

/* ======================================
   COUNTDOWN ELEGANTE
   ====================================== */

function initializeCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE - now;

    if (distance < 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

/* ======================================
   CONTROL DE AUDIO
   ====================================== */

function initializeAudio() {
    const audioToggle = document.getElementById('audioToggle');
    const bgMusic = document.getElementById('bgMusic');

    // Intentar reproducir automáticamente (muchos navegadores lo bloquean)
    bgMusic.volume = 0.3;
    // bgMusic.play().catch(() => {});

    audioToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().catch((error) => {
                console.log('Auto-play bloqueado por el navegador:', error);
            });
            audioToggle.classList.remove('muted');
        } else {
            bgMusic.pause();
            audioToggle.classList.add('muted');
        }
    });
}

/* ======================================
   MODO OSCURO AUTOMÁTICO
   ====================================== */

function initializeDarkMode() {
    const modeIndicator = document.getElementById('modeIndicator');

    // Detectar hora actual
    const hour = new Date().getHours();
    const isDarkTime = hour >= 20 || hour < 6; // 20:00 - 06:00

    if (isDarkTime && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.style.colorScheme = 'dark';
        modeIndicator.textContent = '🌙';
    } else {
        modeIndicator.textContent = '☀️';
    }

    // Escuchar cambios en preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (e.matches) {
            modeIndicator.textContent = '🌙';
        } else {
            modeIndicator.textContent = '☀️';
        }
    });
}

/* ======================================
   VALIDACIÓN Y FORMULARIO
   ====================================== */

function initializeFormValidation() {
    const form = document.getElementById('confirmationForm');
    const restriccionSi = document.getElementById('restriccionSi');
    const restriccionNo = document.getElementById('restriccionNo');
    const detalleGroup = document.getElementById('detalleGroup');
    const detalleRestriccion = document.getElementById('detalleRestriccion');
    const charCount = document.getElementById('charCount');

    // Elementos de acompañante
    const tipoAsistenciaGroup = document.getElementById('tipoAsistenciaGroup');
    const acompananteGroup = document.getElementById('acompananteGroup');
    const nombreAcompananteGroup = document.getElementById('nombreAcompananteGroup');
    const asisteSolo = document.getElementById('asisteSolo');
    const asisteAcompanante = document.getElementById('asisteAcompanante');

    // Mostrar/ocultar tipo de asistencia según confirmación
    document.querySelectorAll('input[name="asistencia"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'si') {
                tipoAsistenciaGroup.style.display = 'block';
            } else {
                // Ocultar y limpiar todo lo de acompañante
                tipoAsistenciaGroup.style.display = 'none';
                acompananteGroup.style.display = 'none';
                nombreAcompananteGroup.style.display = 'none';
                if (asisteSolo.checked) asisteSolo.checked = false;
                if (asisteAcompanante.checked) asisteAcompanante.checked = false;
                clearCompanionFields();
            }
        });
    });

    // Mostrar/ocultar campos de acompañante
    asisteSolo.addEventListener('change', () => {
        acompananteGroup.style.display = 'none';
        nombreAcompananteGroup.style.display = 'none';
        clearCompanionFields();
    });

    asisteAcompanante.addEventListener('change', () => {
        acompananteGroup.style.display = 'block';
        nombreAcompananteGroup.style.display = 'block';
    });

    // Mostrar/ocultar campo de detalle
    restriccionSi.addEventListener('change', () => {
        detalleGroup.style.display = 'block';
        detalleRestriccion.focus();
    });

    restriccionNo.addEventListener('change', () => {
        detalleGroup.style.display = 'none';
        detalleRestriccion.value = '';
        charCount.textContent = '0';
    });

    // Contador de caracteres
    detalleRestriccion.addEventListener('input', (e) => {
        charCount.textContent = e.target.value.length;
    });

    // Submit del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(form);
    });

    // Validación en tiempo real
    document.getElementById('rut').addEventListener('blur', validateRUT);
    document.getElementById('nombre').addEventListener('blur', validateNombre);
    document.getElementById('rutAcompanante').addEventListener('blur', validateRUTAcompanante);
    document.getElementById('nombreAcompanante').addEventListener('blur', validateNombreAcompanante);
}

function clearCompanionFields() {
    const rutAcomp = document.getElementById('rutAcompanante');
    const nombreAcomp = document.getElementById('nombreAcompanante');
    rutAcomp.value = '';
    nombreAcomp.value = '';
    clearError(rutAcomp, document.getElementById('rutAcompananteError'));
    clearError(nombreAcomp, document.getElementById('nombreAcompananteError'));
}

/* ======================================
   VALIDACIONES DE CAMPOS
   ====================================== */

function validateRUT() {
    const rutInput = document.getElementById('rut');
    const rutError = document.getElementById('rutError');
    const rut = rutInput.value.trim();

    if (!rut) {
        showError(rutInput, rutError, 'RUT es requerido');
        return false;
    }

    if (!isValidChileanRUT(rut)) {
        showError(rutInput, rutError, 'RUT inválido. Formato: 12345678-9');
        return false;
    }

    clearError(rutInput, rutError);
    return true;
}

function validateNombre() {
    const nombreInput = document.getElementById('nombre');
    const nombreError = document.getElementById('nombreError');
    const nombre = nombreInput.value.trim();

    if (!nombre) {
        showError(nombreInput, nombreError, 'Nombre es requerido');
        return false;
    }

    if (nombre.length < 3) {
        showError(nombreInput, nombreError, 'Nombre debe tener al menos 3 caracteres');
        return false;
    }

    clearError(nombreInput, nombreError);
    return true;
}

function validateRUTAcompanante() {
    const rutInput = document.getElementById('rutAcompanante');
    const rutError = document.getElementById('rutAcompananteError');
    const rut = rutInput.value.trim();

    if (!rut) {
        showError(rutInput, rutError, 'RUT del acompañante es requerido');
        return false;
    }

    if (!isValidChileanRUT(rut)) {
        showError(rutInput, rutError, 'RUT inválido. Formato: 12345678-9');
        return false;
    }

    clearError(rutInput, rutError);
    return true;
}

function validateNombreAcompanante() {
    const nombreInput = document.getElementById('nombreAcompanante');
    const nombreError = document.getElementById('nombreAcompananteError');
    const nombre = nombreInput.value.trim();

    if (!nombre) {
        showError(nombreInput, nombreError, 'Nombre del acompañante es requerido');
        return false;
    }

    if (nombre.length < 3) {
        showError(nombreInput, nombreError, 'Nombre debe tener al menos 3 caracteres');
        return false;
    }

    clearError(nombreInput, nombreError);
    return true;
}

function isValidChileanRUT(rut) {
    // Formato: XXXXXXXX-X (sin puntos)
    const rutRegex = /^\d{7,8}-[\dkK]$/;

    if (!rutRegex.test(rut)) return false;

    // Validar dígito verificador
    const cleanRUT = rut.replace('-', '');
    const body = cleanRUT.slice(0, -1);
    const dv = cleanRUT.slice(-1).toUpperCase();

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier++;
        if (multiplier > 7) multiplier = 2;
    }

    const calculatedDV = 11 - (sum % 11);
    const expectedDV = calculatedDV === 11 ? '0' : calculatedDV === 10 ? 'K' : String(calculatedDV);

    return dv === expectedDV;
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

/* ======================================
   ENVÍO DEL FORMULARIO
   ====================================== */

async function handleFormSubmit(form) {
    // Validar todos los campos
    const isRUTValid = validateRUT();
    const isNombreValid = validateNombre();

    if (!isRUTValid || !isNombreValid) return;

    // Validar campos de acompañante si corresponde
    const tipoAsistencia = form.querySelector('input[name="tipoAsistencia"]:checked');
    const asistencia = form.querySelector('input[name="asistencia"]:checked');

    if (asistencia && asistencia.value === 'si' && tipoAsistencia && tipoAsistencia.value === 'con_acompanante') {
        const isRUTAcompValid = validateRUTAcompanante();
        const isNombreAcompValid = validateNombreAcompanante();
        if (!isRUTAcompValid || !isNombreAcompValid) return;
    }

    // Obtener datos del formulario
    const formData = new FormData(form);
    const data = {
        timestamp: new Date().toISOString(),
        rut: formData.get('rut'),
        nombre: formData.get('nombre'),
        asistencia: formData.get('asistencia'),
        tipoAsistencia: formData.get('tipoAsistencia') || '',
        rutAcompanante: formData.get('rutAcompanante') || '',
        nombreAcompanante: formData.get('nombreAcompanante') || '',
        restriccion: formData.get('restriccion'),
        detalleRestriccion: formData.get('detalleRestriccion') || '',
        userAgent: navigator.userAgent.substring(0, 100)
    };

    // Mostrar loading
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    try {
        // Enviar datos a Google Apps Script
        // Usar no-cors mode (esto es necesario para archivos locales)
        // Google Apps Script procesará la solicitud aunque no podamos leer la respuesta
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'  // Cambiar a text/plain para evitar preflight CORS
            },
            body: JSON.stringify(data)
        });

        // Con no-cors, siempre mostrar éxito (Google Apps Script procesará la solicitud)
        showSuccessMessage(form);

        // Reset del formulario
        setTimeout(() => {
            form.reset();
            document.getElementById('detalleGroup').style.display = 'none';
            document.getElementById('charCount').textContent = '0';
            document.getElementById('tipoAsistenciaGroup').style.display = 'none';
            document.getElementById('acompananteGroup').style.display = 'none';
            document.getElementById('nombreAcompananteGroup').style.display = 'none';
        }, 2000);

    } catch (error) {
        console.error('Error al enviar:', error);
        alert('Error al enviar la respuesta. Por favor, intenta de nuevo.');
    } finally {
        // Ocultar loading
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
    }
}

function showSuccessMessage(form) {
    const formContent = form.parentElement;
    const successMessage = formContent.querySelector('.success-message');

    // Animar desaparición del formulario
    form.style.opacity = '0';
    form.style.pointerEvents = 'none';

    // Mostrar mensaje de éxito
    setTimeout(() => {
        successMessage.style.display = 'flex';
    }, 300);
}

/* ======================================
   AGREGAR AL CALENDARIO
   ====================================== */

document.addEventListener('DOMContentLoaded', () => {
    const addToCalendarBtn = document.getElementById('addToCalendar');

    if (addToCalendarBtn) {
        addToCalendarBtn.addEventListener('click', addToCalendar);
    }
});

function addToCalendar() {
    // Crear evento en formato iCal
    const eventTitle = 'Matrimonio de Camila & Felipe';
    const eventDate = '20260717'; // YYYYMMDD
    const eventTime = 'T123000'; // Hora de inicio: 12:30
    const eventDuration = 'PT5H'; // Duración: 5 horas

    const eventData = {
        title: eventTitle,
        description: 'Matrimonio de Camila & Felipe. Confirma tu asistencia en nuestra página.',
        start: '2026-07-17T12:30:00',
        end: '2026-07-17T17:30:00',
        location: 'Registro Civil Lo Barnechea & Mirador Gourmet, Santiago'
    };

    // Crear URL de Google Calendar
    const googleCalendarURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${eventDate}T123000/${eventDate}T173000&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}`;

    // Abrir en nueva ventana
    window.open(googleCalendarURL, '_blank');
}

/* ======================================
   ANIMACIONES DE SCROLL
   ====================================== */

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos con animación
    document.querySelectorAll('.section-title').forEach(el => {
        observer.observe(el);
    });
}

/* ======================================
   EFECTOS ADICIONALES
   ====================================== */

// Smooth scroll al hacer clic en links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Detectar cambios en orientación del dispositivo
window.addEventListener('orientationchange', () => {
    initializeParticles();
});

// Prevenir zoom en inputs en móvil
document.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('focus', () => {
        document.body.style.zoom = 1;
    });
});
