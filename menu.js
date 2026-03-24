document.addEventListener("DOMContentLoaded", function() {
    const menus = document.querySelectorAll("nav ul");
    const menuHTML = `
        <li><a href="index.html">HOME</a></li>
        <li><a href="mods.html">MODS</a></li>
        <li><a href="recursos.html">RECURSOS</a></li>
        <li><a href="quests.html">MISSÕES</a></li>
        <li><a href="classe.html">CLASSES</a></li>
        <li><a href="status.html">PLAYERS</a></li>
        <li><a href="store.html">STORE</a></li>
    `;
    
    menus.forEach(menu => {
        menu.innerHTML = menuHTML;
    });
});