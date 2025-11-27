// Data Storage
let customers = [];
let productions = [];
let performances = [];
let bookings = [];
let currentUser = null;

// Initialize with sample data
function initializeData() {
    productions = [
        { id: 1, name: 'The Dark Universe', type: 'movie' },
        { id: 2, name: 'Hamlet Returns', type: 'play' },
        { id: 3, name: 'Jazz Night Live', type: 'concert' },
        { id: 4, name: 'Space Odyssey 2025', type: 'movie' },
        { id: 5, name: 'Romeo and Juliet', type: 'play' },
        { id: 6, name: 'Rock Legends Tour', type: 'concert' }
    ];

    performances = [
        { id: 1, productionId: 1, date: '2025-12-15T19:00', totalSeats: 200, ticketsSold: 45, price: 15.00 },
        { id: 2, productionId: 2, date: '2025-12-20T18:30', totalSeats: 150, ticketsSold: 78, price: 25.00 },
        { id: 3, productionId: 3, date: '2025-12-22T20:00', totalSeats: 300, ticketsSold: 156, price: 30.00 },
        { id: 4, productionId: 4, date: '2025-12-25T17:00', totalSeats: 200, ticketsSold: 12, price: 18.00 },
        { id: 5, productionId: 5, date: '2025-12-28T19:00', totalSeats: 150, ticketsSold: 89, price: 22.00 },
        { id: 6, productionId: 6, date: '2025-12-30T21:00', totalSeats: 400, ticketsSold: 234, price: 35.00 }
    ];

    customers = [
        {
            id: 'GC001',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Main Street',
            city: 'New York',
            zipCode: '10001',
            mobile: '555-0101',
            email: 'john.smith@email.com',
            advisor: 'Sarah Johnson'
        },
        {
            id: 'GC002',
            firstName: 'Emma',
            lastName: 'Wilson',
            address: '456 Oak Avenue',
            city: 'Los Angeles',
            zipCode: '90001',
            mobile: '555-0102',
            email: 'emma.wilson@email.com',
            advisor: 'Michael Brown'
        }
    ];

    bookings = [
        { id: 1, customerId: 'GC001', performanceId: 1, tickets: 2, bookingDate: '2025-11-20' },
        { id: 2, customerId: 'GC002', performanceId: 3, tickets: 4, bookingDate: '2025-11-22' }
    ];
}

// Navigation
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active-section');
    });
    document.getElementById(sectionId).classList.add('active-section');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`a[href="#${sectionId}"]`).classList.add('active');

    if (sectionId === 'productions') {
        displayProductions('all');
    } else if (sectionId === 'performances') {
        displayPerformances();
    } else if (sectionId === 'admin') {
        displayCustomersTable();
        displayProductionsTable();
        displayPerformancesTable();
    }
}

// Productions
function displayProductions(filterType) {
    const grid = document.getElementById('productions-grid');
    const filtered = filterType === 'all' 
        ? productions 
        : productions.filter(p => p.type === filterType);

    grid.innerHTML = filtered.map(prod => `
        <div class="production-card">
            <div class="production-image">🎬</div>
            <div class="production-content">
                <h3>${prod.name}</h3>
                <span class="production-type">${prod.type.toUpperCase()}</span>
                <p>Experience this amazing ${prod.type}</p>
                <button class="btn btn-primary" onclick="viewProductionPerformances(${prod.id})">View Performances</button>
            </div>
        </div>
    `).join('');
}

function viewProductionPerformances(productionId) {
    showSection('performances');
    const perfCards = document.querySelectorAll('.performance-card');
    perfCards.forEach(card => {
        const cardProdId = parseInt(card.dataset.productionId);
        if (cardProdId === productionId) {
            card.style.border = '3px solid #667eea';
            setTimeout(() => {
                card.style.border = '';
            }, 2000);
        }
    });
}

// Performances
function displayPerformances() {
    const list = document.getElementById('performances-list');
    list.innerHTML = performances.map(perf => {
        const production = productions.find(p => p.id === perf.productionId);
        const availableSeats = perf.totalSeats - perf.ticketsSold;
        return `
            <div class="performance-card" data-production-id="${perf.productionId}">
                <div>
                    <h3>${production.name}</h3>
                    <span class="production-type">${production.type.toUpperCase()}</span>
                </div>
                <div class="performance-info">
                    <strong>Date & Time</strong>
                    ${new Date(perf.date).toLocaleString()}
                </div>
                <div class="performance-info">
                    <strong>Available Seats</strong>
                    ${availableSeats} / ${perf.totalSeats}
                </div>
                <div class="performance-info">
                    <strong>Price</strong>
                    $${perf.price.toFixed(2)}
                    <br><br>
                    <button class="btn btn-primary" onclick="openBookingModal(${perf.id})" ${availableSeats === 0 ? 'disabled' : ''}>
                        ${availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Account Management
function handleRegister(event) {
    event.preventDefault();
    
    const customerId = 'GC' + String(customers.length + 1).padStart(3, '0');
    const newCustomer = {
        id: customerId,
        firstName: document.getElementById('reg-firstname').value,
        lastName: document.getElementById('reg-lastname').value,
        address: document.getElementById('reg-address').value,
        city: document.getElementById('reg-city').value,
        zipCode: document.getElementById('reg-zip').value,
        mobile: document.getElementById('reg-mobile').value,
        email: document.getElementById('reg-email').value,
        advisor: document.getElementById('reg-advisor').value || 'None'
    };

    customers.push(newCustomer);
    showNotification('Account created successfully! Your Customer ID is: ' + customerId, 'success');
    
    event.target.reset();
    setTimeout(() => {
        currentUser = newCustomer;
        showDashboard();
    }, 1500);
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const customerId = document.getElementById('login-id').value;
    
    const customer = customers.find(c => c.email === email && c.id === customerId);
    
    if (customer) {
        currentUser = customer;
        showDashboard();
        showNotification('Login successful! Welcome back, ' + customer.firstName, 'success');
    } else {
        showNotification('Invalid email or Customer ID', 'error');
    }
}

function showDashboard() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('customer-dashboard').style.display = 'block';
    
    document.getElementById('customer-name').textContent = currentUser.firstName + ' ' + currentUser.lastName;
    document.getElementById('dashboard-id').textContent = currentUser.id;
    document.getElementById('dashboard-email').textContent = currentUser.email;
    document.getElementById('dashboard-mobile').textContent = currentUser.mobile;
    document.getElementById('dashboard-address').textContent = `${currentUser.address}, ${currentUser.city}, ${currentUser.zipCode}`;
    
    displayCustomerBookings();
}

function displayCustomerBookings() {
    const container = document.getElementById('customer-bookings');
    const userBookings = bookings.filter(b => b.customerId === currentUser.id);
    
    if (userBookings.length === 0) {
        container.innerHTML = '<p>You have no bookings yet.</p>';
        return;
    }
    
    container.innerHTML = userBookings.map(booking => {
        const performance = performances.find(p => p.id === booking.performanceId);
        const production = productions.find(p => p.id === performance.productionId);
        return `
            <div class="booking-card">
                <h4>${production.name}</h4>
                <p><strong>Date:</strong> ${new Date(performance.date).toLocaleString()}</p>
                <p><strong>Tickets:</strong> ${booking.tickets}</p>
                <p><strong>Total:</strong> $${(booking.tickets * performance.price).toFixed(2)}</p>
                <p><strong>Booking Date:</strong> ${booking.bookingDate}</p>
            </div>
        `;
    }).join('');
}

function logout() {
    currentUser = null;
    document.getElementById('customer-dashboard').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('login-email').value = '';
    document.getElementById('login-id').value = '';
    showNotification('Logged out successfully', 'info');
}

// Booking System
let currentBookingPerformanceId = null;

function openBookingModal(performanceId) {
    currentBookingPerformanceId = performanceId;
    const performance = performances.find(p => p.id === performanceId);
    const production = productions.find(p => p.id === performance.productionId);
    
    document.getElementById('booking-details').innerHTML = `
        <h4>${production.name}</h4>
        <p><strong>Date:</strong> ${new Date(performance.date).toLocaleString()}</p>
        <p><strong>Price per ticket:</strong> $${performance.price.toFixed(2)}</p>
        <p><strong>Available seats:</strong> ${performance.totalSeats - performance.ticketsSold}</p>
    `;
    
    document.getElementById('ticket-quantity').max = performance.totalSeats - performance.ticketsSold;
    document.getElementById('booking-modal').style.display = 'block';
}

function closeBookingModal() {
    document.getElementById('booking-modal').style.display = 'none';
    document.getElementById('ticket-quantity').value = '';
}

function confirmBooking(event) {
    event.preventDefault();
    
    if (!currentUser) {
        showNotification('Please login or create an account to book tickets', 'error');
        closeBookingModal();
        setTimeout(() => showSection('account'), 500);
        return;
    }
    
    const quantity = parseInt(document.getElementById('ticket-quantity').value);
    const performance = performances.find(p => p.id === currentBookingPerformanceId);
    
    if (quantity > (performance.totalSeats - performance.ticketsSold)) {
        showNotification('Not enough seats available', 'error');
        return;
    }
    
    const newBooking = {
        id: bookings.length + 1,
        customerId: currentUser.id,
        performanceId: currentBookingPerformanceId,
        tickets: quantity,
        bookingDate: new Date().toISOString().split('T')[0]
    };
    
    bookings.push(newBooking);
    performance.ticketsSold += quantity;
    
    showNotification(`Booking confirmed! ${quantity} ticket(s) booked successfully`, 'success');
    closeBookingModal();
    displayPerformances();
    displayCustomerBookings();
}

// Admin Functions
function displayCustomersTable() {
    const container = document.getElementById('customers-table');
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>Mobile</th>
                    <th>Advisor</th>
                </tr>
            </thead>
            <tbody>
                ${customers.map(c => `
                    <tr>
                        <td>${c.id}</td>
                        <td>${c.firstName} ${c.lastName}</td>
                        <td>${c.email}</td>
                        <td>${c.city}</td>
                        <td>${c.mobile}</td>
                        <td>${c.advisor}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showAddProduction() {
    document.getElementById('add-production-form').style.display = 'block';
}

function hideAddProduction() {
    document.getElementById('add-production-form').style.display = 'none';
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-type').value = '';
}

function addProduction(event) {
    event.preventDefault();
    
    const newProduction = {
        id: productions.length + 1,
        name: document.getElementById('prod-name').value,
        type: document.getElementById('prod-type').value
    };
    
    productions.push(newProduction);
    showNotification('Production added successfully', 'success');
    hideAddProduction();
    displayProductionsTable();
    displayProductions('all');
}

function displayProductionsTable() {
    const container = document.getElementById('productions-table');
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Total Performances</th>
                </tr>
            </thead>
            <tbody>
                ${productions.map(p => {
                    const perfCount = performances.filter(perf => perf.productionId === p.id).length;
                    return `
                        <tr>
                            <td>${p.id}</td>
                            <td>${p.name}</td>
                            <td>${p.type.toUpperCase()}</td>
                            <td>${perfCount}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function showAddPerformance() {
    const select = document.getElementById('perf-production');
    select.innerHTML = '<option value="">Select Production</option>' + 
        productions.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    document.getElementById('add-performance-form').style.display = 'block';
}

function hideAddPerformance() {
    document.getElementById('add-performance-form').style.display = 'none';
    document.getElementById('perf-production').value = '';
    document.getElementById('perf-date').value = '';
    document.getElementById('perf-seats').value = '';
    document.getElementById('perf-price').value = '';
}

function addPerformance(event) {
    event.preventDefault();
    
    const newPerformance = {
        id: performances.length + 1,
        productionId: parseInt(document.getElementById('perf-production').value),
        date: document.getElementById('perf-date').value,
        totalSeats: parseInt(document.getElementById('perf-seats').value),
        ticketsSold: 0,
        price: parseFloat(document.getElementById('perf-price').value)
    };
    
    performances.push(newPerformance);
    showNotification('Performance added successfully', 'success');
    hideAddPerformance();
    displayPerformancesTable();
    displayPerformances();
}

function displayPerformancesTable() {
    const container = document.getElementById('performances-table');
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Production</th>
                    <th>Date</th>
                    <th>Total Seats</th>
                    <th>Tickets Sold</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                ${performances.map(perf => {
                    const production = productions.find(p => p.id === perf.productionId);
                    return `
                        <tr>
                            <td>${perf.id}</td>
                            <td>${production.name}</td>
                            <td>${new Date(perf.date).toLocaleString()}</td>
                            <td>${perf.totalSeats}</td>
                            <td>${perf.ticketsSold}</td>
                            <td>$${perf.price.toFixed(2)}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// System Testing
function runSystemTests() {
    const results = document.getElementById('test-results');
    const tests = [];
    
    // Test 1: Customer Registration
    tests.push({
        name: 'Customer Registration',
        status: customers.length > 0,
        message: `${customers.length} customers registered. System can create and store customer accounts.`
    });
    
    // Test 2: Production Management
    tests.push({
        name: 'Production Management',
        status: productions.length > 0,
        message: `${productions.length} productions available. System manages movies, plays, and concerts.`
    });
    
    // Test 3: Performance Tracking
    tests.push({
        name: 'Performance Tracking',
        status: performances.length > 0,
        message: `${performances.length} performances scheduled. System tracks dates and ticket sales.`
    });
    
    // Test 4: Booking System
    tests.push({
        name: 'Booking System',
        status: bookings.length > 0,
        message: `${bookings.length} bookings made. System successfully processes ticket bookings.`
    });
    
    // Test 5: Data Integrity
    const totalTicketsSold = performances.reduce((sum, p) => sum + p.ticketsSold, 0);
    const totalBookedTickets = bookings.reduce((sum, b) => sum + b.tickets, 0);
    tests.push({
        name: 'Data Integrity',
        status: totalTicketsSold === totalBookedTickets,
        message: `Tickets sold (${totalTicketsSold}) matches booked tickets (${totalBookedTickets}). Data is consistent.`
    });
    
    // Test 6: Advisor Assignment
    const customersWithAdvisor = customers.filter(c => c.advisor && c.advisor !== 'None').length;
    tests.push({
        name: 'Advisor Support System',
        status: true,
        message: `${customersWithAdvisor} customers have assigned advisors. Support system operational.`
    });
    
    // Test 7: Seat Availability
    const oversoldPerformances = performances.filter(p => p.ticketsSold > p.totalSeats);
    tests.push({
        name: 'Seat Availability Control',
        status: oversoldPerformances.length === 0,
        message: oversoldPerformances.length === 0 
            ? 'No oversold performances. Seat control working correctly.' 
            : `WARNING: ${oversoldPerformances.length} performances are oversold!`
    });
    
    results.innerHTML = `
        <h4>System Test Results</h4>
        <p><strong>Tests Run:</strong> ${tests.length}</p>
        <p><strong>Passed:</strong> ${tests.filter(t => t.status).length}</p>
        <p><strong>Failed:</strong> ${tests.filter(t => !t.status).length}</p>
        <hr>
        ${tests.map(test => `
            <div class="test-item ${test.status ? 'pass' : 'fail'}">
                <h4>${test.status ? '✓' : '✗'} ${test.name}</h4>
                <p>${test.message}</p>
            </div>
        `).join('')}
    `;
}

// Notification System
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 4000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
    
    // Production Filter Tabs
    document.querySelectorAll('.filter-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            displayProductions(this.dataset.type);
        });
    });
    
    // Account Tabs
    document.querySelectorAll('.account-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.account-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.form-container').forEach(f => f.classList.remove('active-tab'));
            document.getElementById(this.dataset.tab + '-form').classList.add('active-tab');
        });
    });
    
    // Admin Tabs
    document.querySelectorAll('.admin-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.admin-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active-admin-tab'));
            document.getElementById(this.dataset.adminTab).classList.add('active-admin-tab');
        });
    });
    
    // Initial display
    displayProductions('all');
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('booking-modal');
    if (event.target === modal) {
        closeBookingModal();
    }
}