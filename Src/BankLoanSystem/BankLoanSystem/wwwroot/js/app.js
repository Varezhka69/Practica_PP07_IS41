async function loadStatistics() {
    try {
        const clientsResponse = await fetch(`${API_URL}/Clients/statistics`);
        const loansResponse = await fetch(`${API_URL}/Loans/statistics`);

        if (clientsResponse.ok && loansResponse.ok) {
            const clientsData = await clientsResponse.json();
            const loansData = await loansResponse.json();

            document.getElementById('statClients').textContent = clientsData.totalClients;
            document.getElementById('statLoans').textContent = clientsData.activeLoans;
            document.getElementById('statDeposits').textContent = clientsData.activeDeposits;
            document.getElementById('statBalance').textContent =
                formatCurrency(clientsData.totalBalance);
        }
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
    }
}

async function loadPage(pageName) {
    window.location.hash = pageName;

    const content = document.getElementById('content');
    content.innerHTML = '<div class="content-loading"><div class="loading"></div><p>Загрузка страницы...</p></div>';

    try {
        setTimeout(() => {
            const navLinks = document.querySelectorAll('.nav-item');
            navLinks.forEach(link => {
                link.classList.remove('active');
                const onclick = link.getAttribute('onclick');
                if (onclick && onclick.includes(`loadPage('${pageName}')`)) {
                    link.classList.add('active');
                }
            });
        }, 100);

        switch (pageName) {
            case 'dashboard':
                await loadDashboard();
                break;
            case 'clients':
                await loadClientsPage();
                break;
            case 'accounts':
                await loadAccountsPage();
                break;
            case 'loans':
                await loadLoansPage();
                break;
            case 'deposits':
                await loadDepositsPage();
                break;
            case 'transactions':
                await loadTransactionsPage();
                break;
            case 'users':
                await loadUsersPage();
                break;
            case 'reports':
                await loadReportsPage();
                break;
            case 'settings':
                await loadSettingsPage();
                break;
            case 'my-accounts':
                await loadMyAccountsPage();
                break;
            case 'my-loans':
                await loadMyLoansPage();
                break;
            case 'my-deposits':
                await loadMyDepositsPage();
                break;
            case 'my-transactions':
                await loadMyTransactionsPage();
                break;
            default:
                content.innerHTML = `
                    <div class="welcome-section">
                        <h2>Страница "${pageName}"</h2>
                        <p>Эта функциональность будет доступна в ближайшее время</p>
                        <button onclick="loadPage('dashboard')" class="btn-primary" style="margin-top: 1rem;">
                            <i class="fas fa-home"></i> Вернуться на главную
                        </button>
                    </div>
                `;
        }
    } catch (error) {
        console.error('Ошибка загрузки страницы:', error);
        content.innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--danger-color); margin-bottom: 1rem;"></i>
                <h2>Ошибка загрузки страницы</h2>
                <p>${error.message}</p>
                <button onclick="loadPage('dashboard')" class="btn-primary" style="margin-top: 1rem;">
                    <i class="fas fa-home"></i> Вернуться на главную
                </button>
            </div>
        `;
    }
}
async function loadSettingsPage() {
    const content = document.getElementById('content');

    content.innerHTML = `
        <div class="page-header">
            <h2>Настройки системы</h2>
        </div>
        
        <div class="settings-grid">
            <div class="settings-card">
                <h3><i class="fas fa-cog"></i> Основные настройки</h3>
                <div class="settings-content">
                    <div class="form-group">
                        <label>Название банка:</label>
                        <input type="text" class="form-control" value="ПАО Сбербанк" readonly>
                    </div>
                    <div class="form-group">
                        <label>Валюта по умолчанию:</label>
                        <select class="form-control">
                            <option selected>RUB (Российский рубль)</option>
                            <option>USD (Доллар США)</option>
                            <option>EUR (Евро)</option>
                        </select>
                    </div>
                    <button class="btn-primary" style="margin-top: 1rem;">
                        <i class="fas fa-save"></i> Сохранить настройки
                    </button>
                </div>
            </div>
            
            <div class="settings-card">
                <h3><i class="fas fa-shield-alt"></i> Безопасность</h3>
                <div class="settings-content">
                    <div class="form-group">
                        <label>Требовать сложный пароль:</label>
                        <input type="checkbox" checked>
                    </div>
                    <div class="form-group">
                        <label>Автоматический выход (минут):</label>
                        <input type="number" class="form-control" value="30">
                    </div>
                    <button class="btn-primary" style="margin-top: 1rem;">
                        <i class="fas fa-lock"></i> Применить
                    </button>
                </div>
            </div>
            
            <div class="settings-card">
                <h3><i class="fas fa-database"></i> База данных</h3>
                <div class="settings-content">
                    <div class="info-item">
                        <strong>Статус:</strong> <span class="badge badge-success">Online</span>
                    </div>
                    <div class="info-item">
                        <strong>Размер базы:</strong> 5.2 MB
                    </div>
                    <div class="info-item">
                        <strong>Последнее резервное копирование:</strong> Сегодня, 10:30
                    </div>
                    <button class="btn-primary" style="margin-top: 1rem;">
                        <i class="fas fa-download"></i> Создать резервную копию
                    </button>
                </div>
            </div>
            
            <div class="settings-card">
                <h3><i class="fas fa-bell"></i> Уведомления</h3>
                <div class="settings-content">
                    <div class="form-group">
                        <label>Email уведомления:</label>
                        <input type="checkbox" checked>
                    </div>
                    <div class="form-group">
                        <label>Уведомлять о новых клиентах:</label>
                        <input type="checkbox" checked>
                    </div>
                    <div class="form-group">
                        <label>Уведомлять о крупных операциях:</label>
                        <input type="checkbox" checked>
                    </div>
                    <button class="btn-primary" style="margin-top: 1rem;">
                        <i class="fas fa-bell"></i> Сохранить
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function loadDashboard() {
    const content = document.getElementById('content');

    const html = `
        <div class="dashboard">
            <!-- Приветственная карточка -->
            <div class="welcome-card">
                <div class="welcome-content">
                    <h2>Добро пожаловать в панель управления</h2>
                    <p>Управляйте кредитами, вкладами и клиентами в единой современной системе ПАО Сбербанк</p>
                </div>
            </div>

            <!-- Статистика в реальном времени -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Клиенты</h3>
                        <div class="value" id="statClients">0</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-hand-holding-usd"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Активные кредиты</h3>
                        <div class="value" id="statLoans">0</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-piggy-bank"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Активные вклады</h3>
                        <div class="value" id="statDeposits">0</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Общий баланс</h3>
                        <div class="value" id="statBalance">0 ₽</div>
                    </div>
                </div>
            </div>

            <!-- Быстрые действия -->
            <div class="quick-actions">
                <h2 style="margin-bottom: 1.5rem; color: var(--text-primary);">Быстрые действия</h2>
                <div class="actions-grid">
                    <a href="#" class="action-btn" onclick="loadPage('clients'); return false;">
                        <i class="fas fa-user-plus"></i>
                        <span>Добавить клиента</span>
                    </a>
                    <a href="#" class="action-btn" onclick="loadPage('loans'); return false;">
                        <i class="fas fa-file-contract"></i>
                        <span>Оформить кредит</span>
                    </a>
                    <a href="#" class="action-btn" onclick="loadPage('deposits'); return false;">
                        <i class="fas fa-piggy-bank"></i>
                        <span>Открыть вклад</span>
                    </a>
                    <a href="#" class="action-btn" onclick="loadPage('transactions'); return false;">
                        <i class="fas fa-exchange-alt"></i>
                        <span>Выполнить перевод</span>
                    </a>
                </div>
            </div>

            <!-- Последние операции -->
            <div class="table-container">
                <div class="table-header">
                    <h3>Последние операции</h3>
                    <button onclick="loadPage('transactions')" class="btn-primary">
                        <i class="fas fa-history"></i> Вся история
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Тип операции</th>
                            <th>Сумма</th>
                            <th>Дата</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody id="recentTransactions">
                        <tr>
                            <td colspan="5" style="text-align: center; padding: 2rem;">
                                <div class="loading" style="margin: 0 auto;"></div>
                                <p style="margin-top: 1rem; color: var(--text-secondary);">Загрузка данных...</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Быстрые ссылки -->
            <div class="quick-actions" style="margin-top: 2rem;">
                <h2 style="margin-bottom: 1.5rem; color: var(--text-primary);">Популярные разделы</h2>
                <div class="actions-grid">
                    <a href="#" class="feature-card" onclick="loadPage('reports'); return false;">
                        <div class="feature-icon">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                        <h4>Аналитика</h4>
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">Статистика и отчеты</p>
                    </a>
                    <a href="#" class="feature-card" onclick="loadPage('users'); return false;">
                        <div class="feature-icon">
                            <i class="fas fa-user-cog"></i>
                        </div>
                        <h4>Пользователи</h4>
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">Управление доступом</p>
                    </a>
                    <a href="#" class="feature-card" onclick="loadPage('accounts'); return false;">
                        <div class="feature-icon">
                            <i class="fas fa-credit-card"></i>
                        </div>
                        <h4>Счета</h4>
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">Управление счетами</p>
                    </a>
                    <a href="#" class="feature-card" onclick="loadPage('clients'); return false;">
                        <div class="feature-icon">
                            <i class="fas fa-address-book"></i>
                        </div>
                        <h4>Клиенты</h4>
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">База клиентов</p>
                    </a>
                </div>
            </div>
        </div>
    `;

    content.innerHTML = html;

    await loadStatistics();

    await loadRecentTransactions();
}

async function loadRecentTransactions() {
    try {
        const response = await fetch(`${API_URL}/Transactions`);
        const transactions = await response.json();

        const recentTransactions = document.getElementById('recentTransactions');
        if (!recentTransactions) return;

        if (transactions && transactions.length > 0) {
            const recent = transactions.slice(0, 5);
            recentTransactions.innerHTML = recent.map(trans => `
                <tr>
                    <td>#${trans.transactionId}</td>
                    <td>${trans.transactionType}</td>
                    <td class="${trans.amount >= 0 ? 'positive' : 'negative'}">
                        ${formatCurrency(trans.amount)}
                    </td>
                    <td>${formatDate(trans.transactionDate)}</td>
                    <td><span class="badge badge-success">Завершено</span></td>
                </tr>
            `).join('');
        } else {
            recentTransactions.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                        <p>Нет данных о транзакциях</p>
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Ошибка загрузки транзакций:', error);
    }
}

async function loadClientsPage() {
    const content = document.getElementById('content');

    try {
        const response = await fetch(`${API_URL}/Clients`);
        const clients = await response.json();

        let clientsHtml = '';
        if (clients && clients.length > 0) {
            clientsHtml = clients.map(client => `
                <tr>
                    <td>${client.clientId}</td>
                    <td>${client.lastName} ${client.firstName} ${client.middleName || ''}</td>
                    <td>${client.phoneNumber || '-'}</td>
                    <td>${client.email || '-'}</td>
                    <td>${formatDate(client.registrationDate)}</td>
                    <td>
                        <button onclick="viewClient(${client.clientId})" class="btn-small">Просмотр</button>
                        <button onclick="editClient(${client.clientId})" class="btn-small">Изменить</button>
                    </td>
                </tr>
            `).join('');
        } else {
            clientsHtml = '<tr><td colspan="6">Нет данных о клиентах</td></tr>';
        }

        content.innerHTML = `
            <div class="page-header">
                <h2>Управление клиентами</h2>
                <button onclick="showAddClientForm()" class="btn-primary">
                    <i class="fas fa-plus"></i> Добавить клиента
                </button>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ФИО</th>
                            <th>Телефон</th>
                            <th>Email</th>
                            <th>Дата регистрации</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${clientsHtml}
                    </tbody>
                </table>
            </div>
            
            <!-- Форма добавления клиента -->
            <div id="addClientForm" style="display: none;" class="form-container">
                <h3>Добавление нового клиента</h3>
                <div class="form-group">
                    <label>Фамилия:</label>
                    <input type="text" id="clientLastName" required>
                </div>
                <div class="form-group">
                    <label>Имя:</label>
                    <input type="text" id="clientFirstName" required>
                </div>
                <div class="form-group">
                    <label>Отчество:</label>
                    <input type="text" id="clientMiddleName">
                </div>
                <div class="form-group">
                    <label>Телефон:</label>
                    <input type="tel" id="clientPhone">
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" id="clientEmail">
                </div>
                <div class="form-group">
                    <label>Адрес:</label>
                    <textarea id="clientAddress"></textarea>
                </div>
                <button onclick="addClient()" class="btn-primary">Добавить</button>
                <button onclick="hideAddClientForm()" class="btn-secondary">Отмена</button>
            </div>
        `;
    } catch (error) {
        content.innerHTML = `<p class="error-message">Ошибка загрузки клиентов: ${error.message}</p>`;
    }
}

async function addClient() {
    const client = {
        lastName: document.getElementById('clientLastName').value,
        firstName: document.getElementById('clientFirstName').value,
        middleName: document.getElementById('clientMiddleName').value || null,
        phoneNumber: document.getElementById('clientPhone').value || null,
        email: document.getElementById('clientEmail').value || null,
        address: document.getElementById('clientAddress').value || null
    };

    try {
        const response = await fetch(`${API_URL}/Clients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(client)
        });

        if (response.ok) {
            alert('Клиент успешно добавлен');
            hideAddClientForm();
            loadClientsPage();
        } else {
            alert('Ошибка при добавлении клиента');
        }
    } catch (error) {
        alert('Ошибка подключения к серверу');
    }
}

async function loadAccountsPage() {
    const content = document.getElementById('content');

    try {
        const response = await fetch(`${API_URL}/Accounts`);
        const accounts = await response.json();

        let accountsHtml = '';
        if (accounts && accounts.length > 0) {
            accountsHtml = accounts.map(account => `
                <tr>
                    <td>${account.accountNumber}</td>
                    <td>${account.accountType}</td>
                    <td class="positive">${formatCurrency(account.balance)}</td>
                    <td>${account.currency}</td>
                    <td>${formatDate(account.openingDate)}</td>
                    <td><span class="badge ${account.isActive ? 'badge-success' : 'badge-warning'}">
                        ${account.isActive ? 'Активен' : 'Неактивен'}
                    </span></td>
                    <td>
                        <button onclick="viewAccount(${account.accountId})" class="btn-small">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="editAccount(${account.accountId})" class="btn-small">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            accountsHtml = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Нет данных о счетах</td></tr>';
        }

        content.innerHTML = `
            <div class="page-header">
                <h2>Управление счетами</h2>
                <button onclick="showAddAccountForm()" class="btn-primary">
                    <i class="fas fa-plus"></i> Добавить счет
                </button>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-credit-card"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Всего счетов</h3>
                        <div class="value">${accounts?.length || 0}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Общий баланс</h3>
                        <div class="value">${formatCurrency(accounts?.reduce((sum, a) => sum + a.balance, 0) || 0)}</div>
                    </div>
                </div>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Номер счета</th>
                            <th>Тип счета</th>
                            <th>Баланс</th>
                            <th>Валюта</th>
                            <th>Дата открытия</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${accountsHtml}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        content.innerHTML = `<div class="error-message">Ошибка загрузки счетов: ${error.message}</div>`;
    }
}
async function loadLoansPage() {
    const content = document.getElementById('content');

    try {
        const response = await fetch(`${API_URL}/Loans`);
        const loans = await response.json();

        let loansHtml = '';
        if (loans && loans.length > 0) {
            loansHtml = loans.map(loan => `
                <tr>
                    <td>${loan.loanNumber || 'N/A'}</td>
                    <td>${loan.loanType || 'Не указан'}</td>
                    <td class="positive">${formatCurrency(loan.loanAmount || 0)}</td>
                    <td>${loan.interestRate || 0}%</td>
                    <td>${loan.termMonths || 0} мес.</td>
                    <td class="negative">${formatCurrency(loan.remainingAmount || loan.loanAmount || 0)}</td>
                    <td>
                        <span class="badge ${loan.status === 'Активный' ? 'badge-success' :
                    loan.status === 'Закрыт' ? 'badge-info' : 'badge-warning'}">
                            ${loan.status || 'Неизвестно'}
                        </span>
                    </td>
                </tr>
            `).join('');
        } else {
            loansHtml = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Нет данных о кредитах</td></tr>';
        }

        content.innerHTML = `
            <div class="page-header">
                <h2>Управление кредитами</h2>
                <button onclick="showAddLoanForm()" class="btn-primary">
                    <i class="fas fa-plus"></i> Добавить кредит
                </button>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-hand-holding-usd"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Всего кредитов</h3>
                        <div class="value">${loans?.length || 0}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Активные</h3>
                        <div class="value">${loans?.filter(l => l.status === 'Активный').length || 0}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Закрытые</h3>
                        <div class="value">${loans?.filter(l => l.status === 'Закрыт').length || 0}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Общая сумма</h3>
                        <div class="value">${formatCurrency(loans?.reduce((sum, l) => sum + (l.loanAmount || 0), 0) || 0)}</div>
                    </div>
                </div>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Номер кредита</th>
                            <th>Тип кредита</th>
                            <th>Сумма</th>
                            <th>Ставка</th>
                            <th>Срок</th>
                            <th>Остаток</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${loansHtml}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        content.innerHTML = `<div class="error-message">Ошибка загрузки кредитов: ${error.message}</div>`;
    }
}

async function loadDepositsPage() {
    const content = document.getElementById('content');

    try {
        const response = await fetch(`${API_URL}/Deposits`);
        const deposits = await response.json();

        let depositsHtml = '';
        if (deposits && deposits.length > 0) {
            depositsHtml = deposits.map(deposit => `
                <tr>
                    <td>${deposit.depositNumber || 'N/A'}</td>
                    <td>${deposit.depositType || 'Не указан'}</td>
                    <td class="positive">${formatCurrency(deposit.currentAmount || 0)}</td>
                    <td>${deposit.interestRate || 0}%</td>
                    <td>${deposit.termMonths || 'Не указан'}</td>
                    <td>${deposit.status || 'Неизвестно'}</td>
                    <td>${formatDate(deposit.startDate)}</td>
                </tr>
            `).join('');
        } else {
            depositsHtml = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Нет данных о вкладах</td></tr>';
        }

        content.innerHTML = `
            <div class="page-header">
                <h2>Управление вкладами</h2>
                <button onclick="showAddDepositForm()" class="btn-primary">
                    <i class="fas fa-plus"></i> Открыть вклад
                </button>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-piggy-bank"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Всего вкладов</h3>
                        <div class="value">${deposits?.length || 0}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Общая сумма</h3>
                        <div class="value">${formatCurrency(deposits?.reduce((sum, d) => sum + (d.currentAmount || 0), 0) || 0)}</div>
                    </div>
                </div>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Номер вклада</th>
                            <th>Тип вклада</th>
                            <th>Текущая сумма</th>
                            <th>Ставка</th>
                            <th>Срок</th>
                            <th>Статус</th>
                            <th>Дата открытия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${depositsHtml}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        content.innerHTML = `<div class="error-message">Ошибка загрузки вкладов: ${error.message}</div>`;
    }
}

async function loadTransactionsPage() {
    const content = document.getElementById('content');

    try {
        const response = await fetch(`${API_URL}/Transactions`);
        const transactions = await response.json();

        let transactionsHtml = '';
        if (transactions && transactions.length > 0) {
            transactionsHtml = transactions.map(trans => `
                <tr>
                    <td>${trans.transactionId || 'N/A'}</td>
                    <td>${trans.transactionType || 'Неизвестно'}</td>
                    <td class="${(trans.amount || 0) >= 0 ? 'positive' : 'negative'}">
                        ${formatCurrency(trans.amount || 0)}
                    </td>
                    <td>${formatDate(trans.transactionDate)}</td>
                    <td>${trans.description || '-'}</td>
                    <td>
                        <button onclick="viewTransaction(${trans.transactionId})" class="btn-small">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            transactionsHtml = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Нет данных о транзакциях</td></tr>';
        }

        content.innerHTML = `
            <div class="page-header">
                <h2>История транзакций</h2>
                <button onclick="showNewTransactionForm()" class="btn-primary">
                    <i class="fas fa-plus"></i> Новая транзакция
                </button>
            </div>
            
            <div class="filters">
                <input type="date" id="dateFrom" class="form-control" placeholder="С даты">
                <input type="date" id="dateTo" class="form-control" placeholder="По дату">
                <select id="transactionType" class="form-control">
                    <option value="">Все типы</option>
                    <option value="Пополнение">Пополнение</option>
                    <option value="Снятие">Снятие</option>
                    <option value="Перевод">Перевод</option>
                </select>
                <button onclick="filterTransactions()" class="btn-primary">
                    <i class="fas fa-filter"></i> Фильтровать
                </button>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Тип операции</th>
                            <th>Сумма</th>
                            <th>Дата</th>
                            <th>Описание</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transactionsHtml}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        content.innerHTML = `<div class="error-message">Ошибка загрузки транзакций: ${error.message}</div>`;
    }
}
async function loadUsersPage() {
    const content = document.getElementById('content');

    try {
        const response = await fetch(`${API_URL}/SystemUsers`);
        const users = await response.json();

        let usersHtml = '';
        if (users && users.length > 0) {
            usersHtml = users.map(user => `
                <tr>
                    <td>${user.username || 'N/A'}</td>
                    <td>${user.fullName || 'Не указано'}</td>
                    <td>${user.email || '-'}</td>
                    <td>
                        <span class="badge ${user.role === 'Admin' ? 'badge-danger' :
                    user.role === 'Manager' ? 'badge-warning' :
                        user.role === 'Operator' ? 'badge-info' : 'badge-success'}">
                            ${user.role || 'Неизвестно'}
                        </span>
                    </td>
                    <td>${formatDate(user.createdDate)}</td>
                    <td>
                        <span class="badge ${user.isActive ? 'badge-success' : 'badge-warning'}">
                            ${user.isActive ? 'Активен' : 'Неактивен'}
                        </span>
                    </td>
                    <td>
                        <button onclick="editUser(${user.userId})" class="btn-small">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            usersHtml = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Нет данных о пользователях</td></tr>';
        }

        content.innerHTML = `
            <div class="page-header">
                <h2>Управление пользователями</h2>
                <button onclick="showAddUserForm()" class="btn-primary">
                    <i class="fas fa-plus"></i> Добавить пользователя
                </button>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Всего пользователей</h3>
                        <div class="value">${users?.length || 0}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Администраторов</h3>
                        <div class="value">${users?.filter(u => u.role === 'Admin').length || 0}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Менеджеров</h3>
                        <div class="value">${users?.filter(u => u.role === 'Manager').length || 0}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-user-check"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Активных</h3>
                        <div class="value">${users?.filter(u => u.isActive).length || 0}</div>
                    </div>
                </div>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Логин</th>
                            <th>ФИО</th>
                            <th>Email</th>
                            <th>Роль</th>
                            <th>Дата создания</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${usersHtml}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        content.innerHTML = `<div class="error-message">Ошибка загрузки пользователей: ${error.message}</div>`;
    }
}
async function loadReportsPage() {
    const content = document.getElementById('content');

    try {
        // Загружаем данные для отчетов
        const clientsResponse = await fetch(`${API_URL}/Clients/statistics`);
        const loansResponse = await fetch(`${API_URL}/Loans/statistics`);

        const clientsStats = await clientsResponse.json();
        const loansStats = await loansResponse.json();

        content.innerHTML = `
            <div class="page-header">
                <h2>Отчеты и аналитика</h2>
                <div style="display: flex; gap: 1rem;">
                    <button onclick="generateReport()" class="btn-primary">
                        <i class="fas fa-download"></i> Скачать отчет
                    </button>
                    <button onclick="printReport()" class="btn-secondary">
                        <i class="fas fa-print"></i> Печать
                    </button>
                </div>
            </div>
            
            <div class="reports-grid">
                <div class="report-card">
                    <h3><i class="fas fa-chart-pie"></i> Общая статистика</h3>
                    <div class="report-content">
                        <div class="stat-item">
                            <span>Клиентов:</span>
                            <strong>${clientsStats?.totalClients || 0}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Активных кредитов:</span>
                            <strong>${clientsStats?.activeLoans || 0}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Активных вкладов:</span>
                            <strong>${clientsStats?.activeDeposits || 0}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Общий баланс:</span>
                            <strong>${formatCurrency(clientsStats?.totalBalance || 0)}</strong>
                        </div>
                    </div>
                </div>
                
                <div class="report-card">
                    <h3><i class="fas fa-money-bill-wave"></i> Кредитный портфель</h3>
                    <div class="report-content">
                        <div class="stat-item">
                            <span>Всего кредитов:</span>
                            <strong>${loansStats?.totalLoans || 0}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Общая сумма:</span>
                            <strong>${formatCurrency(loansStats?.totalLoanAmount || 0)}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Остаток к погашению:</span>
                            <strong>${formatCurrency(loansStats?.totalRemaining || 0)}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Выплачено:</span>
                            <strong>${formatCurrency(loansStats?.paidAmount || 0)}</strong>
                        </div>
                    </div>
                </div>
                
                <div class="report-card">
                    <h3><i class="fas fa-calendar-alt"></i> Отчеты по периодам</h3>
                    <div class="report-content" style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button onclick="showDailyReport()" class="btn-secondary">
                            <i class="fas fa-calendar-day"></i> Дневной отчет
                        </button>
                        <button onclick="showMonthlyReport()" class="btn-secondary">
                            <i class="fas fa-calendar-week"></i> Месячный отчет
                        </button>
                        <button onclick="showYearlyReport()" class="btn-secondary">
                            <i class="fas fa-calendar"></i> Годовой отчет
                        </button>
                    </div>
                </div>
                
                <div class="report-card">
                    <h3><i class="fas fa-file-excel"></i> Экспорт данных</h3>
                    <div class="report-content" style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button onclick="exportClients()" class="btn-secondary">
                            <i class="fas fa-users"></i> Клиенты (Excel)
                        </button>
                        <button onclick="exportLoans()" class="btn-secondary">
                            <i class="fas fa-hand-holding-usd"></i> Кредиты (Excel)
                        </button>
                        <button onclick="exportTransactions()" class="btn-secondary">
                            <i class="fas fa-exchange-alt"></i> Транзакции (Excel)
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="chart-container">
                <h3><i class="fas fa-chart-line"></i> Динамика операций</h3>
                <div id="balanceChart" class="chart-placeholder">
                    <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <i class="fas fa-chart-bar" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                        <p>Здесь будет отображаться график операций</p>
                        <p style="font-size: 0.9rem;">Для отображения графика подключите библиотеку Charts.js</p>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        content.innerHTML = `<div class="error-message">Ошибка загрузки отчетов: ${error.message}</div>`;
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function showAddClientForm() {
    document.getElementById('addClientForm').style.display = 'block';
}

function hideAddClientForm() {
    document.getElementById('addClientForm').style.display = 'none';
}
function filterTransactions() {
    alert('Функция фильтрации в разработке');
}

function generateReport() {
    alert('Функция генерации отчетов в разработке');
}

function showDailyReport() {
    alert('Дневной отчет в разработке');
}

function showMonthlyReport() {
    alert('Месячный отчет в разработке');
}

function showYearlyReport() {
    alert('Годовой отчет в разработке');
}

function exportClients() {
    alert('Экспорт клиентов в разработке');
}

function exportLoans() {
    alert('Экспорт кредитов в разработке');
}

function exportTransactions() {
    alert('Экспорт транзакций в разработке');
}

function showAddLoanForm() {
    alert('Форма добавления кредита в разработке');
}

function showAddDepositForm() {
    alert('Форма добавления вклада в разработке');
}

function showAddUserForm() {
    alert('Форма добавления пользователя в разработке');
}

async function loadMyAccountsPage() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="welcome-section">
            <h2>Мои счета</h2>
            <p>Просмотр ваших банковских счетов</p>
            <div class="info-message">
                <i class="fas fa-info-circle"></i>
                Здесь будет отображаться информация о ваших счетах
            </div>
        </div>
    `;
}

async function loadMyLoansPage() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="welcome-section">
            <h2>Мои кредиты</h2>
            <p>Информация о ваших кредитных обязательствах</p>
            <div class="info-message">
                <i class="fas fa-info-circle"></i>
                Здесь будет отображаться информация о ваших кредитах
            </div>
        </div>
    `;
}

async function loadMyDepositsPage() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="welcome-section">
            <h2>Мои вклады</h2>
            <p>Информация о ваших депозитных счетах</p>
            <div class="info-message">
                <i class="fas fa-info-circle"></i>
                Здесь будет отображаться информация о ваших вкладах
            </div>
        </div>
    `;
}

async function loadMyTransactionsPage() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="welcome-section">
            <h2>Мои транзакции</h2>
            <p>История ваших операций</p>
            <div class="info-message">
                <i class="fas fa-info-circle"></i>
                Здесь будет отображаться история ваших транзакций
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function () {
    loadStatistics();
    const savedUser = localStorage.getItem('bankUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForUser(currentUser);
    }
});
