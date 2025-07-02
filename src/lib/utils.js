const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => context.querySelectorAll(selector);

/**
 * Debounce function to optimize frequent events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}



/**
 * Show an message to the user
 */
function showMessage(message, { type = 'info', duration = 5000 }) {
    // Create element if not exists
    let errorDiv = document.getElementById('state-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'state-message';
        const colors = {
            info: '#00ff88',
            warning: '#ffcc00',
            error: '#ff4444',
        };
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type]}22;
            border: 1px solid ${colors[type]};
            color: ${colors[type]};
            padding: 12px 24px;
            border-radius: 2px;
            font-family: 'Work Sans', sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(errorDiv);
    }

    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    // Hidden after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.display = 'none';
        }
    }, 5000);
}