export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
    hideAlert();
    const iconSvg = type === 'success'
        ? '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM7.5 11.793l-3.5-3.5a.5.5 0 1 1 .707-.707l3.5 3.5 6.5-6.5a.5.5 0 1 1 .707.707l-7 7a.5.5 0 0 1-.707 0z"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM8 3a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5z"/></svg>';

    const markup = `
        <div class="alert alert--${type}">
            <span class="alert-icon">${iconSvg}</span>
            <span>${msg}</span>
        </div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
};
