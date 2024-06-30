// Função para verificar o status de login
function checkLoginStatus() {
    fetch('/auth/checkLoginStatus') // Rota para verificar o status de login
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao verificar o status do login');
            }
            return response.json();
        })
        .then(data => {
            const isLoggedIn = data.isLoggedIn;

            const hideIfLogged = document.querySelectorAll('.hide-if-logged');
            const hideIfNotLogged = document.querySelectorAll('.hide-if-not-logged');
            const logoutButton = document.getElementById('logoutButton');
            const findPsycho = document.getElementById('findPsycho');

            if (isLoggedIn) {
                hideIfLogged.forEach(item => item.style.display = 'none');
                hideIfNotLogged.forEach(item => item.style.display = 'block');
                logoutButton.classList.remove('hide');
                findPsycho.classList.remove('hide');
            } else {
                hideIfLogged.forEach(item => item.style.display = 'block');
                hideIfNotLogged.forEach(item => item.style.display = 'none');
                logoutButton.classList.add('hide');
                findPsycho.classList.add('hide');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Chame a função para verificar o status de login quando a página carregar
document.addEventListener('DOMContentLoaded', checkLoginStatus);
