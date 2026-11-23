const toastEl = document.getElementById('glassToast');
let toastTimer = null;

function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toastEl.classList.remove('is-visible');
    }, 1800);
}

async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
}

function setIconHref(svgUseParent, symbolId) {
    const useEl = svgUseParent.querySelector('use');
    if (useEl) {
        useEl.setAttribute('href', symbolId);
    }
}

// Share page button
const shareBtn = document.getElementById('sharePageBtn');
const shareLabel = document.getElementById('sharePageLabel');
let shareTimer = null;

if (shareBtn && shareLabel) {
    shareBtn.addEventListener('click', async () => {
        try {
            await copyToClipboard(window.location.href);
            shareLabel.textContent = 'Tersalin!';
            showToast('Tautan halaman disalin');
            clearTimeout(shareTimer);
            shareTimer = setTimeout(() => {
                shareLabel.textContent = 'Bagikan';
            }, 1800);
        } catch {
            showToast('Gagal menyalin tautan');
        }
    });
}

// Copy individual embedded link buttons
document.querySelectorAll('.copy-btn').forEach((btn) => {
    let timer = null;

    btn.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const url = btn.getAttribute('data-copy-url');
        if (!url) return;

        try {
            await copyToClipboard(url);
            setIconHref(btn, '#icon-check');
            btn.classList.add('copied');
            showToast('Tautan disalin');
            clearTimeout(timer);
            timer = setTimeout(() => {
                setIconHref(btn, '#icon-copy');
                btn.classList.remove('copied');
            }, 1800);
        } catch {
            showToast('Gagal menyalin tautan');
        }
    });
});

// Category filter dock
const filterTabs = document.querySelectorAll('.filter-tab');
const sections = document.querySelectorAll('.hub-section');

filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const selected = tab.getAttribute('data-filter') || 'all';

        filterTabs.forEach((item) => {
            const isActive = item === tab;
            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-pressed', String(isActive));
        });

        sections.forEach((section) => {
            const category = section.getAttribute('data-section');
            const shouldShow = selected === 'all' || category === selected;
            section.classList.toggle('is-hidden', !shouldShow);
        });
    });
});

// Interactive glass highlight tracking pointer position
document.querySelectorAll('.link-pill').forEach((pill) => {
    pill.addEventListener('pointermove', (event) => {
        const rect = pill.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        pill.style.setProperty('--mx', `${x.toFixed(1)}%`);
        pill.style.setProperty('--my', `${y.toFixed(1)}%`);
    });
});
