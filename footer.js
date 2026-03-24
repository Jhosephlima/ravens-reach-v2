// Função para injetar o rodapé em todas as páginas
document.addEventListener("DOMContentLoaded", function () {
    const footerHTML = `
        <footer class="site-footer">
            <div class="footer-divider"></div>
            <p class="copyright-text">&copy; 2026 Ravens Reach RPG. Todos os direitos reservados.</p>
            <p class="credits-text">
                Desenvolvido por <span class="author-name">Jhoseph Lima</span> & <span class="author-name">Eduardo Alexandre</span>
            </p>
            <p class="institute-tag">Estudantes do IFNMG - Campus Pirapora MG</p>
        </footer>
        <style>
            .site-footer {
                background: #0a0a0a;
                padding: 30px 20px;
                text-align: center;
                border-top: 2px solid #333;
                font-family: 'Courier New', monospace;
                margin-top: auto;
            }
            .footer-divider {
                width: 60px;
                height: 3px;
                background: #55FF55;
                margin: 0 auto 15px auto;
                box-shadow: 0 0 8px #55FF55;
            }
            .credits-text { color: #fff; font-size: 15px; }
            .author-name { color: #FFD700; font-weight: bold; }
            .copyright-text { color: #666; font-size: 12px; margin-bottom: 5px; }
            .institute-tag { color: #444; font-size: 11px; margin-top: 10px; }
        </style>
    `;

    // Insere o rodapé no final do body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
});


