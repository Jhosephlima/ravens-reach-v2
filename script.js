// --- 1. CONFIGURAÇÕES INICIAIS E MODAIS ---
function openAuth(modalId, closeCurrentId = null) {
    if (closeCurrentId) {
        const current = document.getElementById(closeCurrentId);
        if (current) current.style.display = "none";
    }
    const target = document.getElementById(modalId);
    if (target) target.style.display = "block";
}

function closeAuth(modalId) {
    const target = document.getElementById(modalId);
    if (target) target.style.display = "none";
}

window.onclick = function (event) {
    if (event.target.classList.contains('auth-modal')) {
        event.target.style.display = "none";
    }
    var mapModal = document.getElementById("myModal");
    if (event.target == mapModal) {
        mapModal.style.display = "none";
    }
}

// --- 2. INTERFACE DO USUÁRIO ---
function toggleDropdown() {
    const dropdown = document.getElementById("profile-dropdown");
    if (dropdown) {
        dropdown.style.display = (dropdown.style.display === "none" || dropdown.style.display === "") ? "block" : "none";
    }
}

function atualizarInterfaceUsuario(username) {
    if (!username) return;

    const loginLi = document.getElementById('btn-login-li');
    const regLi = document.getElementById('btn-reg-li');
    const userInfo = document.getElementById('user-logged-info');
    const navUser = document.getElementById('nav-username');

    if (loginLi) loginLi.style.display = 'none';
    if (regLi) regLi.style.display = 'none';
    if (userInfo) userInfo.style.display = 'block';
    if (navUser) navUser.innerText = username.toUpperCase();
}

function logout() {
    localStorage.removeItem('loggedUser');
    window.location.href = "index.html"; // Sai da pasta abs e volta pra home
}

// --- 3. LÓGICA DE LOGIN ---
const loginForm = document.getElementById('formLogin');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUser').value;
        const password = document.getElementById('loginPass').value;
        try {
            const response = await fetch('https://ravens-reach-v2.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                alert("✅ Login bem-sucedido!");
                localStorage.setItem('loggedUser', username);
                location.reload();
            } else {
                alert("❌ " + data.message);
            }
        } catch (error) {
            alert("Erro: O servidor está desligado!");
        }
    });
}

// --- 4. CARREGAMENTO UNIFICADO ---
window.onload = async () => {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
        atualizarInterfaceUsuario(loggedUser);

        // Elementos de perfil
        const usernameDisplay = document.getElementById('username-display');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');
        const nicknameField = document.getElementById('nickname');
        const navAvatar = document.getElementById('nav-avatar');
        const userAvatar = document.getElementById('user-avatar');

        if (usernameDisplay) usernameDisplay.innerText = loggedUser.toUpperCase();

        try {
            const response = await fetch(`https://ravens-reach-v2.onrender.com/get-profile/${loggedUser}`);
            const data = await response.json();

            if (response.ok) {
                // Como o html está em 'abs/', precisamos voltar uma pasta (../) para achar as imagens default
                const fotoUrl = data.profile_img || '../assets/default_steve.png';
                if (navAvatar) navAvatar.src = fotoUrl;
                if (userAvatar) userAvatar.src = fotoUrl;

                if (emailField) emailField.value = data.email || "";
                if (phoneField) phoneField.value = data.phone || "";
                if (nicknameField) nicknameField.value = data.nickname || "";
            }
        } catch (error) {
            console.error("Servidor offline.");
        }
    }
};

// --- 5. LÓGICA DE UPLOAD E PERFIL ---
const fileInput = document.getElementById('file-input');
if (fileInput) {
    fileInput.addEventListener('change', function (event) {
        const reader = new FileReader();
        reader.onload = function () {
            const output = document.getElementById('user-avatar');
            if (output) output.src = reader.result;
        };
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }
    });
}

const profileForm = document.getElementById('profile-form');
if (profileForm) profileForm.addEventListener('submit', async function(event) {
    if (event) event.preventDefault();
    const username = localStorage.getItem('loggedUser');
    const formData = new FormData();

    const emailVal = document.getElementById('email')?.value || "";
    const phoneVal = document.getElementById('phone')?.value || "";
    const nickVal = document.getElementById('nickname')?.value || "";

    formData.append('username', username);
    formData.append('email', emailVal);
    formData.append('phone', phoneVal);
    formData.append('nickname', nickVal);

    const fileInput = document.getElementById('file-input');

    if (fileInput && fileInput.files[0]) {
        formData.append('profile_img', fileInput.files[0]);
    } else {
        const currentSrc = document.getElementById('user-avatar')?.src || "";
        formData.append('profile_img', currentSrc);
    }

    try {
        const response = await fetch('https://ravens-reach-v2.onrender.com/update-profile', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            alert("✅ Alterações salvas!");
            location.reload();
        } else {
            alert("❌ Erro: " + data.message);
        }
    } catch (error) {
        alert("Erro de conexão.");
    }
});

// --- 6. LÓGICA DE CADASTRO ---
const registerForm = document.getElementById('formRegister');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUser').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPass').value;

        try {
            const response = await fetch('https://ravens-reach-v2.onrender.com/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();

            if (response.ok) {
                alert("✅ " + data.message);
                closeAuth('registerModal');
                openAuth('loginModal');
            } else {
                alert("❌ Erro: " + data.message);
            }
        } catch (error) {
            alert("Erro de conexão.");
        }
    });
}

// --- 7. DELETAR CONTA ---
function solicitarExclusao() {
    const senha = document.getElementById('senhaConfirmacao').value;
    const username = localStorage.getItem('loggedUser'); // Precisamos saber QUEM está logado

    if (!username) {
        alert("Você precisa estar logado para apagar a conta!");
        return;
    }

    if (!senha) {
        alert("Você precisa digitar sua senha para confirmar!");
        return;
    }

    if (confirm("TEM CERTEZA? Esta ação não pode ser desfeita e você será deslogado imediatamente.")) {
        
        // O LINK CORRIGIDO! Agora ele acha o servidor.
        fetch('https://ravens-reach-v2.onrender.com/deletar-conta', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, senha: senha })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Sua conta foi apagada. Até a próxima, aventureiro!");
                localStorage.removeItem('loggedUser'); // Limpa o login do navegador
                window.location.href = "index.html"; // Sai de /abs e volta pro inicio
            } else {
                alert("Erro: " + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Erro ao conectar com o servidor.");
        });
    }
}