// Helper fungsi tambahan
const AppExtension = {
    // Membuka iframe ke tab baru
    openInNewTab: function() {
        const currentPath = document.getElementById('current-path').innerText;
        if (currentPath) {
            window.open(currentPath, '_blank');
        }
    },

    // Inisialisasi shortcut keyboard
    initShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            // Tekan ESC untuk reset fokus iframe jika diperlukan
            if (e.key === 'Escape') {
                document.activeElement.blur();
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AppExtension.initShortcuts();
});

/// Helper fungsi tambahan & UI Extension
const UIExtension = {
    zoomScale: 1,
    zoomStep: 0.1,
    minScale: 0.5,
    maxScale: 1.5,
    isDragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,

    // Membuka Modal Card Flowchart (Expand ke Fullscreen)
    openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        }
    },

    // Menutup Modal Card Flowchart
    closeModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    },

    // Menutup modal dengan mengklik overlay di luar konten
    closeOnOverlay: function(event, modalId) {
        if (event.target.id === modalId) {
            this.closeModal(modalId);
        }
    },

    // Zoom Handling
    initZoom: function() {
        const container = document.getElementById('flow-container');
        const workspace = document.getElementById('flow-workspace');
        if (!container || !workspace) return;

        // Terapkan Zoom Scale Default
        container.style.transform = `scale(${this.zoomScale})`;

        // Implementasi Drag to Scroll (Pan)
        workspace.addEventListener('mousedown', (e) => {
            if (e.target.closest('.flow-step-card') || e.target.closest('button')) return;
            this.isDragging = true;
            this.startX = e.pageX - workspace.offsetLeft;
            this.startY = e.pageY - workspace.offsetTop;
            this.scrollLeft = workspace.scrollLeft;
            this.scrollTop = workspace.scrollTop;
        });

        workspace.addEventListener('mouseleave', () => { this.isDragging = false; });
        workspace.addEventListener('mouseup', () => { this.isDragging = false; });

        workspace.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            const x = e.pageX - workspace.offsetLeft;
            const y = e.pageY - workspace.offsetTop;
            const walkX = (x - this.startX) * 1.5;
            const walkY = (y - this.startY) * 1.5;
            workspace.scrollLeft = this.scrollLeft - walkX;
            workspace.scrollTop = this.scrollTop - walkY;
        });
    },

    zoomIn: function() {
        if (this.zoomScale < this.maxScale) {
            this.zoomScale += this.zoomStep;
            this.updateZoom();
        }
    },

    zoomOut: function() {
        if (this.zoomScale > this.minScale) {
            this.zoomScale -= this.zoomStep;
            this.updateZoom();
        }
    },

    resetZoom: function() {
        this.zoomScale = 1;
        this.updateZoom();
    },

    updateZoom: function() {
        const container = document.getElementById('flow-container');
        if (container) {
            container.style.transform = `scale(${this.zoomScale})`;
        }
    },

    // Membuka iframe ke tab baru
    openInNewTab: function() {
        const currentPath = document.getElementById('current-path')?.innerText;
        if (currentPath) {
            window.open(currentPath, '_blank');
        }
    },

    // Inisialisasi shortcut keyboard
    initShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            // Tekan ESC untuk menutup semua modal
            if (e.key === 'Escape') {
                document.querySelectorAll('.flow-modal').forEach(modal => {
                    modal.classList.add('hidden');
                });
                document.body.classList.remove('overflow-hidden');
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    UIExtension.initShortcuts();
});