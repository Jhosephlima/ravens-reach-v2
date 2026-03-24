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

document.addEventListener("DOMContentLoaded", function() {
    const menus = document.querySelectorAll("nav ul");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const menuItems = [
        { name: "HOME", link: "index.html" },
        { name: "MODS", link: "mods.html" },
        { name: "RECURSOS", link: "recursos.html" },
        { name: "MISSÕES", link: "quests.html" },
        { name: "CLASSES", link: "classe.html" },
        { name: "PLAYERS", link: "status.html" },
        { name: "STORE", link: "store.html" }
    ];

    const menuHTML = menuItems.map(item => {
        // Verifica se o link é a página atual para adicionar a classe 'active'
        const isActive = (item.link === currentPage) ? 'class="active"' : '';
        return `<li><a href="${item.link}" ${isActive}>${item.name}</a></li>`;
    }).join('');

    menus.forEach(menu => {
        menu.innerHTML = menuHTML;
    });
});

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
    window.location.href = "index.html";
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
    event.preventDefault();
    const username = localStorage.getItem('loggedUser');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', document.getElementById('email')?.value || "");
    formData.append('phone', document.getElementById('phone')?.value || "");
    formData.append('nickname', document.getElementById('nickname')?.value || "");
    const fileInput = document.getElementById('file-input');
    if (fileInput && fileInput.files[0]) {
        formData.append('profile_img', fileInput.files[0]);
    }
    try {
        const response = await fetch('https://ravens-reach-v2.onrender.com/update-profile', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            alert("✅ Alterações salvas!");
            location.reload();
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
            if (response.ok) {
                alert("✅ Cadastro realizado!");
                closeAuth('registerModal');
                openAuth('loginModal');
            }
        } catch (error) {
            alert("Erro de conexão.");
        }
    });
}

// --- 7. DELETAR CONTA ---
function solicitarExclusao() {
    const senha = document.getElementById('senhaConfirmacao').value;
    const username = localStorage.getItem('loggedUser');
    if (!username || !senha) {
        alert("Preencha os dados para confirmar!");
        return;
    }
    if (confirm("TEM CERTEZA?")) {
        fetch('https://ravens-reach-v2.onrender.com/deletar-conta', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, senha })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                localStorage.removeItem('loggedUser');
                window.location.href = "index.html";
            }
        });
    }
}

// --- 8. STATUS DO MINECRAFT (UNIFICADO) ---
async function checkMinecraftStatus() {
    try {
        const response = await fetch('https://ravens-reach-v2.onrender.com/status-mine');
        const data = await response.json();

        // 1. Atualiza a Home (ID: status-servidor)
        const statusDivHome = document.getElementById('status-servidor');
        if (statusDivHome) {
            if (data.online) {
                statusDivHome.innerHTML = `<span style="color: #00ff00; font-weight: bold;">● Online</span> <p>${data.players} / ${data.maxPlayers}</p>`;
            } else {
                statusDivHome.innerHTML = `<span style="color: #ff0000; font-weight: bold;">● Offline</span>`;
            }
        }

        // 2. Atualiza o Portal de Status (IDs: server-status, player-count, player-list)
        const reinoStatus = document.getElementById('server-status');
        const countEl = document.getElementById('player-count');
        const listEl = document.getElementById('player-list');

        if (reinoStatus) {
            if (data.online) {
                reinoStatus.innerText = "ONLINE";
                reinoStatus.style.color = "#55FF55";
                if (countEl) countEl.innerText = `${data.players} / ${data.maxPlayers}`;
                
                // Preenche a tabela sem o erro de 'undefined'
                if (listEl) {
                    if (data.playerList && data.playerList.length > 0) {
                        listEl.innerHTML = data.playerList.map(player => {
                            const nickname = typeof player === 'string' ? player : (player.name || "Aventureiro");
                            return `
                                <tr>
                                    <td><img src="https://mc-heads.net/avatar/${nickname}/32" class="avatar-img"></td>
                                    <td style="color: #fff; font-weight: bold;">${nickname}</td>
                                    <td><small>24ms</small></td>
                                    <td><span class="status-badge online">EM JOGO</span></td>
                                </tr>`;
                        }).join('');
                    } else {
                        listEl.innerHTML = '<tr><td colspan="4">Nenhum herói online.</td></tr>';
                    }
                }
            } else {
                reinoStatus.innerText = "OFFLINE";
                reinoStatus.style.color = "#ff4444";
                if (countEl) countEl.innerText = "0 / 0";
                if (listEl) listEl.innerHTML = '<tr><td colspan="4">Servidor desligado.</td></tr>';
            }
        }
    } catch (err) {
        console.log("Erro ao buscar status do servidor.");
    }
}

// Inicializa o status e atualiza a cada 30 segundos
checkMinecraftStatus();
setInterval(checkMinecraftStatus, 30000);
