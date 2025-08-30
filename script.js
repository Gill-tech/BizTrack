// --- Global variables ---
let currentStep = 1;
let selectedPlan = 'Professional';
let formData = {};
let currentDate = new Date();

// --- Mock Data ---
const experts = [
    { name: 'Asha Patel', specialization: 'Tax Advisor', rating: 4.9, avatar: 'AP' },
    { name: 'James Kariuki', specialization: 'Accountant', rating: 4.8, avatar: 'JK' },
    { name: 'Fatima Ali', specialization: 'Legal Expert', rating: 4.9, avatar: 'FA' },
    { name: 'David Omondi', specialization: 'Business Consultant', rating: 4.7, avatar: 'DO' },
    { name: 'Grace Wanjiru', specialization: 'Tax Advisor', rating: 5.0, avatar: 'GW' },
    { name: 'Samuel Kimani', specialization: 'Accountant', rating: 4.6, avatar: 'SK' },
];

const complianceEvents = {
    8: { type: 'nssf', title: 'NSSF Due' }, // NSSF due on the 9th
    19: { type: 'kra', title: 'VAT Due' }, // KRA VAT due on the 20th
};

let notifications = [
    { id: 1, message: "Your VAT return for July is due in 3 days.", time: "1h ago", read: false },
    { id: 2, message: "New regulation update for the retail sector has been published.", time: "5h ago", read: false },
    { id: 3, message: "Welcome to BizTrack! Let's get you set up.", time: "1d ago", read: true },
    { id: 4, message: "Your NSSF payment for June was successful.", time: "2d ago", read: true },
];

// --- Navigation & Page Switching ---
function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('open');
    document.getElementById('mobile-overlay').classList.toggle('open');
}

function showGetStarted(plan = 'Professional') {
    selectedPlan = plan;
    document.getElementById('main-site').style.display = 'none';
    document.getElementById('get-started-page').style.display = 'block';
    document.getElementById('selected-plan-badge').textContent = `${plan} Plan Selected`;
    document.getElementById('plan-summary').textContent = `${plan} Plan - 14 Day Free Trial`;
    window.scrollTo(0, 0);
}

function showMainSite() {
    document.getElementById('main-site').style.display = 'block';
    document.getElementById('get-started-page').style.display = 'none';
    window.scrollTo(0, 0);
}

// --- Dashboard Tabs ---
function showTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.currentTarget.classList.add('active');
    if (tabName === 'calendar') {
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    }
}

// --- Calendar ---
function generateCalendar(year, month) {
    const grid = document.getElementById('calendar-grid');
    const monthYear = document.getElementById('month-year');
    grid.innerHTML = '';
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYear.textContent = `${monthNames[month]} ${year}`;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        grid.insertAdjacentHTML('beforeend', `<div class="day-cell header">${day}</div>`);
    });
    for (let i = 0; i < startingDay; i++) {
        grid.insertAdjacentHTML('beforeend', '<div class="day-cell other-month"></div>');
    }
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const thisDate = new Date(year, month, day);
        const isToday = thisDate.getTime() === today.getTime() ? 'today' : '';
        let eventHTML = '';
        if (complianceEvents[day - 1]) {
            const event = complianceEvents[day - 1];
            eventHTML = `<div class="event-dot ${event.type}" title="${event.title}"></div>`;
        }
        grid.insertAdjacentHTML('beforeend', `<div class="day-cell ${isToday}">${day}${eventHTML}</div>`);
    }
}

// --- Modals ---
function openModal(title, bodyContent) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyContent;
    document.getElementById('app-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('app-modal').classList.add('hidden');
    document.getElementById('modal-body').innerHTML = '';
}

function openDemoModal() {
    const videoId = 'dQw4w9WgXcQ'; 
    const demoHTML = `
        <div class="video-responsive">
            <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
        </div>`;
    openModal('BizTrack.ke Product Demo', demoHTML);
}

function openExpertsModal() {
    const expertsHTML = `<div class="space-y-4">${experts.map(expert => `
        <div class="expert-card">
            <div class="expert-avatar">${expert.avatar}</div>
            <div class="expert-info">
                <h4 class="font-semibold text-gray-900">${expert.name}</h4>
                <p class="text-sm text-gray-600">${expert.specialization}</p>
                <div class="rating text-sm"><i class="fa-solid fa-star"></i><span>${expert.rating}</span></div>
            </div>
            <button class="btn btn-secondary btn-sm">Contact</button>
        </div>`).join('')}</div>`;
    openModal('Verified Compliance Experts', expertsHTML);
}

function startKRAFiling() {
    const bodyContent = `<div id="filing-step-1" class="filing-step active">
        <h4 class="font-semibold mb-4">Step 1: Select Filing Type</h4>
        <select class="select mb-4"><option>VAT</option><option>PAYE</option><option>Income Tax</option></select>
        <p class="text-sm text-gray-600 mb-6">Select the return you wish to file. We will guide you.</p>
        <div class="flex justify-end"><button class="btn btn-primary" onclick="showFilingStep(2)">Continue</button></div>
    </div>
    <div id="filing-step-2" class="filing-step">
        <h4 class="font-semibold mb-4">Step 2: Upload Documents</h4>
        <p class="text-sm text-gray-600 mb-4">Upload sales invoices or payroll. Our system will auto-populate the return.</p>
        <input type="file" class="input mb-6">
        <div class="flex justify-between"><button class="btn btn-secondary" onclick="showFilingStep(1)">Back</button><button class="btn btn-primary" onclick="showFilingStep(3)">Review & Submit</button></div>
    </div>
    <div id="filing-step-3" class="filing-step">
        <h4 class="font-semibold mb-4">Step 3: Filing Complete</h4>
        <p class="text-sm text-gray-600 mb-6">Your return has been submitted to KRA. A receipt has been sent to your email.</p>
        <div class="flex justify-end"><button class="btn btn-primary" onclick="closeModal()">Done</button></div>
    </div>`;
    openModal('KRA iTax Filing Assistant', bodyContent);
}

function startNSSFContribution() {
    const bodyContent = `<div id="filing-step-1" class="filing-step active">
        <h4 class="font-semibold mb-4">Step 1: Contribution Details</h4>
        <p class="text-sm text-gray-600 mb-4">Calculated NSSF contributions for your 5 employees for August 2024.</p>
        <div class="p-4 bg-gray-100 rounded-lg mb-6">
            <p><strong>Total Tier I:</strong> KSh 1,800</p><p><strong>Total Tier II:</strong> KSh 5,400</p>
            <p class="font-bold mt-2">Total Payable: KSh 7,200</p>
        </div>
        <div class="flex justify-end"><button class="btn btn-primary" onclick="showFilingStep(2)">Proceed to Payment</button></div>
    </div>
    <div id="filing-step-2" class="filing-step">
        <h4 class="font-semibold mb-4">Step 2: Payment</h4>
        <p class="text-sm text-gray-600 mb-6">Confirm payment of KSh 7,200. A prompt will be sent to your phone.</p>
        <div class="flex justify-between"><button class="btn btn-secondary" onclick="showFilingStep(1)">Back</button><button class="btn btn-primary" onclick="showFilingStep(3)">Confirm Payment</button></div>
    </div>
    <div id="filing-step-3" class="filing-step">
        <h4 class="font-semibold mb-4">Step 3: Contribution Complete</h4>
        <p class="text-sm text-gray-600 mb-6">Payment received. Your NSSF contributions have been successfully remitted.</p>
        <div class="flex justify-end"><button class="btn btn-primary" onclick="closeModal()">Done</button></div>
    </div>`;
    openModal('NSSF Contribution Payment', bodyContent);
}

function showFilingStep(stepNumber) {
    document.querySelectorAll('.filing-step').forEach(step => step.classList.remove('active'));
    document.getElementById(`filing-step-${stepNumber}`).classList.add('active');
}

// --- Notifications ---
function renderNotifications() {
    const list = document.getElementById('notification-list');
    const countBadge = document.getElementById('notification-count');
    list.innerHTML = '';
    
    if (notifications.length === 0) {
        list.innerHTML = '<p class="text-center text-gray-500 p-4 text-sm">No new notifications.</p>';
    } else {
        notifications.forEach(n => {
            const readClass = n.read ? 'read' : '';
            list.insertAdjacentHTML('beforeend', `
                <div class="notification-item ${readClass}" data-id="${n.id}">
                    <div class="unread-dot"></div>
                    <div class="notification-content">
                        <p>${n.message}</p>
                        <span class="time">${n.time}</span>
                    </div>
                    ${!n.read ? `<button class="mark-read-btn" aria-label="Mark as read" onclick="markNotificationAsRead(${n.id}, event)"><i class="fa-solid fa-check"></i></button>` : ''}
                </div>`);
        });
    }

    const unreadCount = notifications.filter(n => !n.read).length;
    countBadge.textContent = unreadCount;
    countBadge.classList.toggle('hidden', unreadCount === 0);
}

function toggleNotifications(event) {
    event.stopPropagation();
    document.getElementById('notification-panel').classList.toggle('hidden');
}

function markNotificationAsRead(id, event) {
    if (event) event.stopPropagation();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        renderNotifications();
    }
}

function markAllAsRead() {
    notifications.forEach(n => n.read = true);
    renderNotifications();
}

// --- Chat Functionality ---
function getBotResponse(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes('kebs')) {
        return `Of course. Getting KEBS approval for a food product involves a few key steps. Here is a general guide:
        <ul class='list-disc pl-5 mt-2'>
            <li><strong>Application:</strong> You must submit an application for a Standardization Mark (SM) permit through the KEBS portal.</li>
            <li><strong>Product Testing:</strong> KEBS will require samples of your product for laboratory testing to ensure it meets Kenyan standards for safety and quality.</li>
            <li><strong>Factory Inspection:</strong> An inspector will visit your production facility to ensure it meets hygiene and manufacturing practice standards.</li>
            <li><strong>Approval & Permit:</strong> If your product and facility pass, you will be issued an SM permit, and you can use the KEBS mark on your packaging.</li>
        </ul>
        <p class='mt-2'>Would you like me to help you find the link to the KEBS application portal?</p>`;
    } else if (lowerCaseMessage.includes('vat')) {
        return `Filing your VAT return on iTax is straightforward with our guidance. Here’s the process simplified:
        <ul class='list-disc pl-5 mt-2'>
            <li><strong>Prepare Your Records:</strong> Gather all your sales invoices and purchase invoices for the month.</li>
            <li><strong>Log into BizTrack:</strong> Go to the "Filings" tab in your dashboard.</li>
            <li><strong>Upload Documents:</strong> You can upload your records, and we will auto-fill the KRA VAT form for you.</li>
            <li><strong>Review & Submit:</strong> We'll show you a summary of the VAT payable or refundable. Once you confirm, we submit it directly to iTax for you.</li>
        </ul>
        <p class='mt-2'>The deadline is the 20th of the following month. Don't worry, I'll remind you!</p>`;
    } else if (lowerCaseMessage.includes('nssf')) {
        return `Certainly. NSSF contributions are mandatory for employers. The rates under the NSSF Act 2013 are tiered:
        <ul class='list-disc pl-5 mt-2'>
            <li><strong>Tier I:</strong> 6% of the employee's pensionable earnings up to a maximum of KSh 6,000 (i.e., max KSh 360 from employee and KSh 360 from employer). This is remitted to the NSSF.</li>
            <li><strong>Tier II:</strong> 6% of earnings between KSh 6,001 and KSh 18,000. This can be remitted to the NSSF or a registered private pension scheme.</li>
        </ul>
        <p class='mt-2'>Our platform automatically calculates both tiers for your payroll and helps you remit them before the 9th of the following month.</p>`;
    }
    return `I can help with questions about KRA, NSSF, NHIF, and business permits. Could you please rephrase your question?`;
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        addChatMessage(message, 'user');
        input.value = '';
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            addChatMessage(botResponse, 'bot');
        }, 1200);
    }
}

function addChatMessage(message, type) {
    const container = document.getElementById('chat-container');
    const iconHTML = type === 'bot' 
        ? '<i class="fa-solid fa-robot text-purple-600"></i>' 
        : '<i class="fa-solid fa-user text-white"></i>';
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    messageDiv.innerHTML = `<div class="chat-bubble ${type}"><div class="flex items-start space-x-2">
        ${iconHTML}<div>${message}</div></div></div>`;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function askQuestion(question) {
    addChatMessage(question, 'user');
    setTimeout(() => {
        const botResponse = getBotResponse(question);
        addChatMessage(botResponse, 'bot');
    }, 1200);
}

// --- Multi-Step Form Logic ---
function updateStepIndicator() {
    document.querySelectorAll('.step-number').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < currentStep) step.classList.add('completed');
        else if (index + 1 === currentStep) step.classList.add('active');
    });
    document.querySelectorAll('.step-connector').forEach((connector, index) => {
        connector.style.backgroundColor = (index + 1 < currentStep) ? 'var(--green-600)' : 'var(--gray-300)';
    });
}

function nextStep() {
    if (currentStep < 4) {
        document.querySelector('.form-step.active').classList.remove('active');
        currentStep++;
        document.querySelectorAll('.form-step')[currentStep - 1].classList.add('active');
        updateStepIndicator();
        if (currentStep === 4) populateReviewStep();
        window.scrollTo(0, 0);
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.querySelector('.form-step.active').classList.remove('active');
        currentStep--;
        document.querySelectorAll('.form-step')[currentStep - 1].classList.add('active');
        updateStepIndicator();
        window.scrollTo(0, 0);
    }
}

function populateReviewStep() {
    formData = {
        businessName: document.getElementById('businessName').value,
        businessType: getSelectText('businessType'),
        industry: getSelectText('industry'),
        county: getSelectText('county'),
    };
    document.getElementById('business-summary').innerHTML = `
        <div><strong class="text-gray-600">Business:</strong> ${formData.businessName || 'N/A'}</div>
        <div><strong class="text-gray-600">Type:</strong> ${formData.businessType || 'N/A'}</div>
        <div><strong class="text-gray-600">Industry:</strong> ${formData.industry || 'N/A'}</div>
        <div><strong class="text-gray-600">Location:</strong> ${formData.county || 'N/A'}</div>`;
    const complianceAreas = Array.from(document.querySelectorAll('#compliance-needs-step input:checked')).map(cb => cb.nextElementSibling.textContent);
    document.getElementById('compliance-summary').innerHTML = complianceAreas.map(area => `<span class="badge badge-secondary text-xs">${area}</span>`).join('');
}

function getSelectText(selectId) {
    const select = document.getElementById(selectId);
    return select.options[select.selectedIndex]?.text || '';
}

function checkFormCompletion() {
    const terms = document.getElementById('termsAccepted').checked;
    const privacy = document.getElementById('privacyAccepted').checked;
    document.getElementById('start-trial-btn').disabled = !(terms && privacy);
}

function startTrial() {
    alert(`Congratulations! Your free trial for the ${selectedPlan} plan has been activated. Check your email for next steps.`);
    showMainSite();
}

// --- Form Data and Population ---
const FORM_OPTIONS = {
    businessType: [{ value: 'sole', text: 'Sole Proprietorship' }, { value: 'partnership', text: 'Partnership' }, { value: 'private', text: 'Private Limited Company' }, { value: 'ngo', text: 'NGO/Non-Profit' }],
    industry: [{ value: 'agriculture', text: 'Agriculture & Food' }, { value: 'technology', text: 'Technology & Software' }, { value: 'retail', text: 'Retail & E-commerce' }, { value: 'professional', text: 'Professional Services' }],
    employees: [{ value: '1', text: 'Just me' }, { value: '2-5', text: '2-5 employees' }, { value: '6-20', text: '6-20 employees' }],
    county: [{ value: 'nairobi', text: 'Nairobi' }, { value: 'mombasa', text: 'Mombasa' }, { value: 'kiambu', text: 'Kiambu' }]
};

function populateSelect(selectId, options) {
    const select = document.getElementById(selectId);
    if (select) options.forEach(option => select.add(new Option(option.text, option.value)));
}

// --- DOMContentLoaded: Main Entry Point ---
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('get-started-page').style.display = 'none';

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    Object.keys(FORM_OPTIONS).forEach(key => populateSelect(key, FORM_OPTIONS[key]));

    // Event Listeners
    document.getElementById('chat-input')?.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
    document.getElementById('termsAccepted')?.addEventListener('change', checkFormCompletion);
    document.getElementById('privacyAccepted')?.addEventListener('change', checkFormCompletion);
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });
    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });
    document.getElementById('app-modal').addEventListener('click', (e) => {
        if (e.target.id === 'app-modal') closeModal();
    });

    document.getElementById('notification-btn').addEventListener('click', toggleNotifications);
    document.getElementById('mark-all-read-btn').addEventListener('click', markAllAsRead);
    document.addEventListener('click', (e) => {
        const panel = document.getElementById('notification-panel');
        const btn = document.getElementById('notification-btn');
        if (!panel.classList.contains('hidden') && !panel.contains(e.target) && !btn.contains(e.target)) {
            panel.classList.add('hidden');
        }
    });

    const sections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(section => observer.observe(section));
    
    // Initial Renders
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    renderNotifications();
});