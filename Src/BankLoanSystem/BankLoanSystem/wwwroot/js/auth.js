let currentUser = null;
const API_URL = '/api';
function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginError').textContent = '';
}

async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showError('Введите логин и пароль');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/Auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            updateUIForUser(user);
            closeLogin();
            loadStatistics();
        } else {
            showError('Неверный логин или пароль');
        }
    } catch (error) {
        showError('Ошибка подключения к серверу');
    }
}

function logout() {
    currentUser = null;
    updateUIForUser(null);
}

function updateUIForUser(user) {
    const userInfo = document.getElementById('userInfo');
    const nav = document.getElementById('mainNav');

    if (user) {
        const firstLetter = user.fullName ? user.fullName.charAt(0) : user.username.charAt(0);

        userInfo.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar" title="${user.fullName}">
                    ${firstLetter}
                </div>
                <div class="user-info">
                    <div class="user-name">${user.fullName}</div>
                    <div class="user-role">${getRoleDisplayName(user.role)}</div>
                </div>
                <button onclick="logout()" class="btn-logout">
                    <i class="fas fa-sign-out-alt"></i> Выйти
                </button>
            </div>
        `;

        updateNavigation(user.role);
    } else {
        userInfo.innerHTML = `
            <button onclick="showLogin()" class="btn-primary" style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-sign-in-alt"></i> Войти
            </button>
        `;

        nav.innerHTML = `
            <a href="#" class="nav-link" onclick="loadPage('dashboard')">
                <i class="fas fa-home"></i> Главная
            </a>
            <a href="#" class="nav-link" onclick="showLogin()">
                <i class="fas fa-info-circle"></i> О системе
            </a>
        `;
    }
}

function getRoleDisplayName(role) {
    const roles = {
        'Admin': 'Администратор',
        'Manager': 'Менеджер',
        'Operator': 'Оператор',
        'Client': 'Клиент'
    };
    return roles[role] || role;
}
function updateNavigation(role) {
    const nav = document.getElementById('mainNav');
    let navItems = '';

    const commonItems = `
        <div class="nav-section">
            <div class="nav-section-title">Основное</div>
            <a href="#" class="nav-item" onclick="loadPage('dashboard')">
                <i class="fas fa-home"></i>
                <span>Главная</span>
            </a>
            <a href="#" class="nav-item" onclick="loadPage('clients')">
                <i class="fas fa-users"></i>
                <span>Клиенты</span>
            </a>
            <a href="#" class="nav-item" onclick="loadPage('accounts')">
                <i class="fas fa-credit-card"></i>
                <span>Счета</span>
            </a>
        </div>
        
        <div class="nav-section">
            <div class="nav-section-title">Операции</div>
            <a href="#" class="nav-item" onclick="loadPage('loans')">
                <i class="fas fa-hand-holding-usd"></i>
                <span>Кредиты</span>
            </a>
            <a href="#" class="nav-item" onclick="loadPage('deposits')">
                <i class="fas fa-piggy-bank"></i>
                <span>Вклады</span>
            </a>
            <a href="#" class="nav-item" onclick="loadPage('transactions')">
                <i class="fas fa-exchange-alt"></i>
                <span>Транзакции</span>
            </a>
        </div>
    `;

    const adminItems = `
        <div class="nav-section">
            <div class="nav-section-title">Администрирование</div>
            <a href="#" class="nav-item" onclick="loadPage('users')">
                <i class="fas fa-user-cog"></i>
                <span>Пользователи</span>
            </a>
            <a href="#" class="nav-item" onclick="loadPage('reports')">
                <i class="fas fa-chart-bar"></i>
                <span>Отчеты</span>
            </a>
            <a href="#" class="nav-item" onclick="loadPage('settings')">
                <i class="fas fa-cog"></i>
                <span>Настройки</span>
            </a>
        </div>
    `;

    const managerItems = `
        <div class="nav-section">
            <div class="nav-section-title">Менеджмент</div>
            <a href="#" class="nav-item" onclick="loadPage('reports')">
                <i class="fas fa-chart-bar"></i>
                <span>Отчеты</span>
            </a>
        </div>
    `;

    const clientItems = `
        <div class="nav-section">
            <div class="nav-section-title">Личный кабинет</div>
            <a href="#" class="nav-item" onclick="loadPage('my-accounts')">
                <i class="fas fa-credit-card"></i>
                <span>Мои счета</span>
            </a>
            <a href="#" class="nav-item" onclick="loadPage('my-loans')">
                <i class="fas fa-hand-holding-usd"></i>
                <span>Мои кредиты</span>
            </a>
            <a href="#" class="nav-item" onclick="loadPage('my-deposits')">
                <i class="fas fa-piggy-bank"></i>
                <span>Мои вклады</span>
            </a>
            <a href="#" class="nav-item" onclick="loadPage('my-transactions')">
                <i class="fas fa-exchange-alt"></i>
                <span>Мои транзакции</span>
            </a>
        </div>
    `;

    switch (role) {
        case 'Admin':
            navItems = commonItems + adminItems;
            break;
        case 'Manager':
            navItems = commonItems + managerItems;
            break;
        case 'Operator':
            navItems = `
                <div class="nav-section">
                    <div class="nav-section-title">Операционная работа</div>
                    <a href="#" class="nav-item" onclick="loadPage('dashboard')">
                        <i class="fas fa-home"></i>
                        <span>Главная</span>
                    </a>
                    <a href="#" class="nav-item" onclick="loadPage('clients')">
                        <i class="fas fa-users"></i>
                        <span>Клиенты</span>
                    </a>
                    <a href="#" class="nav-item" onclick="loadPage('accounts')">
                        <i class="fas fa-credit-card"></i>
                        <span>Счета</span>
                    </a>
                    <a href="#" class="nav-item" onclick="loadPage('transactions')">
                        <i class="fas fa-exchange-alt"></i>
                        <span>Транзакции</span>
                    </a>
                </div>
            `;
            break;
        case 'Client':
            navItems = clientItems;
            break;
        default:
            navItems = `
                <div class="nav-section">
                    <a href="#" class="nav-item" onclick="loadPage('dashboard')">
                        <i class="fas fa-home"></i>
                        <span>Главная</span>
                    </a>
                    <a href="#" class="nav-item" onclick="showLogin()">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>Войти в систему</span>
                    </a>
                </div>
            `;
    }

    nav.innerHTML = navItems;

    setTimeout(() => {
        const currentPage = window.location.hash.replace('#', '') || 'dashboard';
        const navLinks = nav.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick')?.includes(`loadPage('${currentPage}')`)) {
                link.classList.add('active');
            }
        });
    }, 100);
}

function showError(message) {
    document.getElementById('loginError').textContent = message;
}

window.onclick = function (event) {
    const modal = document.getElementById('loginModal');
    if (event.target == modal) {
        closeLogin();
    }
}
