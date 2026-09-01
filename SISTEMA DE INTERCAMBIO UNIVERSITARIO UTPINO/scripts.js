document.addEventListener("DOMContentLoaded", () => {
    // Modo Oscuro
    const toggleBtn = document.getElementById('darkModeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            if (htmlElement.classList.contains('dark')) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }

    // Control del Modal Nativo Anticongelamiento
    const modal = document.getElementById('customLoginModal');
    const openBtn = document.getElementById('openLoginBtn');
    const closeBtn = document.getElementById('closeLoginBtn');
    const triggerBtns = document.querySelectorAll('.openLoginTrigger');

    function openModal(e) {
        if (e) e.preventDefault();
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    triggerBtns.forEach(btn => btn.addEventListener('click', openModal));

    // Cerrar si hace clic fuera del modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});

// Agregado 27/08 para articulos y flujo
document.addEventListener('DOMContentLoaded', () => {
    let activeCategory = 'all';
    let activeTab = 'all';

    const categoryBtns = document.querySelectorAll('.category-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const items = document.querySelectorAll('.item-card');
    const resultsCount = document.getElementById('results-count');

    function filterItems() {
        let visibleCount = 0;

        items.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            const itemType = item.getAttribute('data-type');

            const matchesCategory = activeCategory === 'all' || itemCategory === activeCategory;
            const matchesTab = activeTab === 'all' || itemType === activeTab;

            if (matchesCategory && matchesTab) {
                item.classList.remove('d-none'); // Muestra la tarjeta usando clase nativa Bootstrap
                visibleCount++;
            } else {
                item.classList.add('d-none'); // Oculta la tarjeta
            }
        });

        // Actualizar contador
        resultsCount.textContent = `${visibleCount} resultado${visibleCount !== 1 ? 's' : ''}`; //comillas invertidas alt + 96
    }

    // Eventos para Botones de Categorías
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => {
                b.classList.remove('category-btn-active', 'fw-bold');
                b.classList.add('fw-medium');
            });
            btn.classList.add('category-btn-active', 'fw-bold');
            btn.classList.remove('fw-medium');

            activeCategory = btn.getAttribute('data-category');
            filterItems();
        });
    });

    // Eventos para Pestañas (En venta / Intercambio)
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('tab-active', 'fw-bold');
                b.classList.add('tab-inactive', 'fw-semibold');
            });
            btn.classList.add('tab-active', 'fw-bold');
            btn.classList.remove('tab-inactive', 'fw-semibold');

            activeTab = btn.getAttribute('data-tab');
            filterItems();
        });
    });
});

    // ==========================================
    // CONTROL DEL MODAL
    // ==========================================

    const modal = document.getElementById('customLoginModal');
    const openBtn = document.getElementById('openLoginBtn');
    const closeBtn = document.getElementById('closeLoginBtn');
    const triggerBtns = document.querySelectorAll('.openLoginTrigger');

    function openModal(e) {

        if (e) e.preventDefault();

        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

    }


    function closeModal() {

        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

    }


    if (openBtn) {
        openBtn.addEventListener('click', openModal);
    }


    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }


    triggerBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });


    // Cerrar si hace clic fuera del modal
    window.addEventListener('click', (e) => {

        if (e.target === modal) {
            closeModal();
        }

    });


    // ==========================================
    // SISTEMA LOGIN / REGISTRO
    // ==========================================

    /*
        IMPORTANTE:

        Este sistema guarda los usuarios en localStorage.
        Sirve para una DEMOSTRACIÓN / PROTOTIPO.

        Para producción necesitarás:
        - Backend
        - Base de datos
        - Contraseñas cifradas/hasheadas
        - Sistema de autenticación real
    */


    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');

    const authTitle = document.getElementById('authTitle');
    const authDescription = document.getElementById('authDescription');


    // ==========================================
    // CAMBIAR A REGISTRO
    // ==========================================

    if (showRegisterBtn) {

        showRegisterBtn.addEventListener('click', () => {

            if (loginForm) {
                loginForm.classList.add('d-none');
            }

            if (registerForm) {
                registerForm.classList.remove('d-none');
            }

            if (authTitle) {
                authTitle.innerHTML = 'Crear cuenta';
            }

            if (authDescription) {
                authDescription.textContent =
                    'Regístrate para formar parte de la comunidad UTPINO COMPARTE.';
            }

            limpiarMensajes();

        });

    }


    // ==========================================
    // CAMBIAR A LOGIN
    // ==========================================

    if (showLoginBtn) {

        showLoginBtn.addEventListener('click', () => {

            if (registerForm) {
                registerForm.classList.add('d-none');
            }

            if (loginForm) {
                loginForm.classList.remove('d-none');
            }

            if (authTitle) {
                authTitle.innerHTML =
                    'Bienvenido a UTPINO<br>COMPARTE';
            }

            if (authDescription) {
                authDescription.textContent =
                    'Inicia sesión para comprar, vender e intercambiar con la comunidad UTP.';
            }

            limpiarMensajes();

        });

    }


    // ==========================================
    // REGISTRO DE USUARIO
    // ==========================================

    if (registerForm) {

        registerForm.addEventListener('submit', (e) => {

            e.preventDefault();


            const name =
                document.getElementById('registerName').value.trim();

            const email =
                document.getElementById('registerEmail').value.trim().toLowerCase();

            const password =
                document.getElementById('registerPassword').value;

            const passwordConfirm =
                document.getElementById('registerPasswordConfirm').value;

            const message =
                document.getElementById('registerMessage');


            // --------------------------------------
            // VALIDAR NOMBRE
            // --------------------------------------

            if (name.length < 3) {

                mostrarMensaje(
                    message,
                    'Ingresa tu nombre completo.',
                    'danger'
                );

                return;
            }


            // --------------------------------------
            // VALIDAR CORREO UTP
            // --------------------------------------

            if (!email.endsWith('@utp.edu.pe')) {

                mostrarMensaje(
                    message,
                    'Debes utilizar un correo institucional @utp.edu.pe.',
                    'danger'
                );

                return;
            }


            // --------------------------------------
            // VALIDAR CONTRASEÑA
            // --------------------------------------

            if (password.length < 6) {

                mostrarMensaje(
                    message,
                    'La contraseña debe tener al menos 6 caracteres.',
                    'danger'
                );

                return;
            }


            // --------------------------------------
            // CONFIRMAR CONTRASEÑA
            // --------------------------------------

            if (password !== passwordConfirm) {

                mostrarMensaje(
                    message,
                    'Las contraseñas no coinciden.',
                    'danger'
                );

                return;
            }


            // --------------------------------------
            // OBTENER USUARIOS
            // --------------------------------------

            let users = JSON.parse(
                localStorage.getItem('utpinoUsuarios')
            ) || [];


            // --------------------------------------
            // COMPROBAR SI YA EXISTE
            // --------------------------------------

            const usuarioExiste = users.some(
                user => user.email === email
            );


            if (usuarioExiste) {

                mostrarMensaje(
                    message,
                    'Este correo ya está registrado. Inicia sesión.',
                    'danger'
                );

                return;
            }


            // --------------------------------------
            // CREAR NUEVO USUARIO
            // --------------------------------------

            const nuevoUsuario = {

                id: Date.now(),

                name: name,

                email: email,

                password: password,

                fechaRegistro: new Date().toISOString()

            };


            // --------------------------------------
            // GUARDAR USUARIO
            // --------------------------------------

            users.push(nuevoUsuario);

            localStorage.setItem(
                'utpinoUsuarios',
                JSON.stringify(users)
            );


            // --------------------------------------
            // MENSAJE DE ÉXITO
            // --------------------------------------

            mostrarMensaje(
                message,
                '¡Cuenta creada correctamente! Ahora puedes iniciar sesión.',
                'success'
            );


            // Limpiar formulario
            registerForm.reset();


            // --------------------------------------
            // CAMBIAR AUTOMÁTICAMENTE A LOGIN
            // --------------------------------------

            setTimeout(() => {

                if (showLoginBtn) {
                    showLoginBtn.click();
                }

                const loginEmail =
                    document.getElementById('loginEmail');

                if (loginEmail) {
                    loginEmail.value = email;
                }

            }, 1500);

        });

    }


    // ==========================================
    // INICIAR SESIÓN
    // ==========================================

    if (loginForm) {

        loginForm.addEventListener('submit', (e) => {

            e.preventDefault();


            const email =
                document.getElementById('loginEmail').value.trim().toLowerCase();

            const password =
                document.getElementById('loginPassword').value;

            const message =
                document.getElementById('loginMessage');


            // --------------------------------------
            // OBTENER USUARIOS
            // --------------------------------------

            const users = JSON.parse(
                localStorage.getItem('utpinoUsuarios')
            ) || [];


            // --------------------------------------
            // BUSCAR USUARIO
            // --------------------------------------

            const usuarioEncontrado = users.find(
                user =>
                    user.email === email &&
                    user.password === password
            );


            // --------------------------------------
            // USUARIO NO ENCONTRADO
            // --------------------------------------

            if (!usuarioEncontrado) {

                mostrarMensaje(
                    message,
                    'Correo o contraseña incorrectos.',
                    'danger'
                );

                return;
            }


            // --------------------------------------
            // CREAR SESIÓN
            // --------------------------------------

            const sesion = {

                id: usuarioEncontrado.id,

                name: usuarioEncontrado.name,

                email: usuarioEncontrado.email

            };


            localStorage.setItem(
                'utpinoSesion',
                JSON.stringify(sesion)
            );


            // --------------------------------------
            // MENSAJE
            // --------------------------------------

            mostrarMensaje(
                message,
                `¡Bienvenido, ${usuarioEncontrado.name}!`,
                'success'
            );


            // --------------------------------------
            // ACTUALIZAR BOTÓN
            // --------------------------------------

            actualizarBotonUsuario(usuarioEncontrado);


            // --------------------------------------
            // CERRAR MODAL
            // --------------------------------------

            setTimeout(() => {

                closeModal();

                loginForm.reset();

            }, 1200);

        });

    }


    // ==========================================
    // VERIFICAR SI YA HAY UNA SESIÓN
    // ==========================================

    const sesionGuardada =
        JSON.parse(
            localStorage.getItem('utpinoSesion')
        );


    if (sesionGuardada) {

        actualizarBotonUsuario(sesionGuardada);

    }


    // ==========================================
    // ACTUALIZAR BOTÓN DE LOGIN
    // ==========================================

    function actualizarBotonUsuario(usuario) {

        if (!openBtn) return;


        openBtn.innerHTML =
            `<i class="fa-solid fa-user me-2"></i>${usuario.name}`;

        openBtn.classList.add('user-logged');

    }


    // ==========================================
    // MOSTRAR / OCULTAR CONTRASEÑA
    // ==========================================

    window.togglePassword = function(inputId, button) {

        const input =
            document.getElementById(inputId);

        if (!input) return;


        const icon =
            button.querySelector('i');


        if (input.type === 'password') {

            input.type = 'text';

            icon.classList.remove('fa-eye');

            icon.classList.add('fa-eye-slash');

        } else {

            input.type = 'password';

            icon.classList.remove('fa-eye-slash');

            icon.classList.add('fa-eye');

        }

    };


    // ==========================================
    // MOSTRAR MENSAJES
    // ==========================================

    function mostrarMensaje(elemento, texto, tipo) {

        if (!elemento) return;


        elemento.className =
            `small mb-3 text-${tipo}`;

        elemento.textContent = texto;

    }


    // ==========================================
    // LIMPIAR MENSAJES
    // ==========================================

    function limpiarMensajes() {

        const loginMessage =
            document.getElementById('loginMessage');

        const registerMessage =
            document.getElementById('registerMessage');


        if (loginMessage) {
            loginMessage.textContent = '';
        }


        if (registerMessage) {
            registerMessage.textContent = '';
        }

    }
