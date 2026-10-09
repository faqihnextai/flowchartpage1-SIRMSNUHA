// Data Struktur Halaman (Relative Path)
const pageRoutes = {
    registrasi: {
        title: "Menu Registrasi",
        items: [
            { name: "Triage", file: "Page/Registrasi/triege.html" },
            { name: "IGD", file: "Page/Registrasi/igd.html" },
            { name: "Rawat Jalan", file: "Page/Registrasi/rawat_jalan.html" },
            { name: "Rawat Inap", file: "Page/Registrasi/rawat_inap.html" }
        ]
    },
    perawat: {
        title: "Asesmen Perawat",
        items: [
            { name: "IGD", file: "Page/assesemen Perawat/igd.html" },
            { name: "Rawat Jalan", file: "Page/assesemen Perawat/rawat_jalan.html" },
            { name: "Rawat Inap", file: "Page/assesemen Perawat/rawat_inap.html" }
        ]
    },
    medis: {
        title: "Asesmen Medis",
        items: [
            { name: "IGD", file: "Page/assesemen Medis/igd.html" },
            { name: "Rawat Jalan", file: "Page/assesemen Medis/rawat_jalan.html" },
            { name: "Rawat Inap", file: "Page/assesemen Medis/rawat_inap.html" }
        ]
    }
};

let currentCategory = 'registrasi';

// Pindah Kategori Utama
function switchCategory(category) {
    currentCategory = category;

    ['registrasi', 'perawat', 'medis'].forEach(cat => {
        const btn = document.getElementById(`btn-${cat}`);
        if (btn) {
            if (cat === category) {
                btn.className = "px-4 py-2 rounded-lg transition-all bg-teal-600 text-white shadow-lg";
            } else {
                btn.className = "px-4 py-2 rounded-lg transition-all hover:bg-slate-700 text-slate-300";
            }
        }
    });

    renderMenu();
}

// Render Menu Sidebar
function renderMenu() {
    const categoryData = pageRoutes[currentCategory];
    const categoryTitle = document.getElementById('category-title');
    if (categoryTitle) categoryTitle.innerText = categoryData.title;

    const menuList = document.getElementById('menu-list');
    if (!menuList) return;

    menuList.innerHTML = '';

    categoryData.items.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <button onclick="loadPage('${item.file}', '${item.name}')" 
                class="w-full text-left px-3.5 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-700/60 hover:text-white transition flex items-center justify-between border border-transparent hover:border-slate-600">
                <span>${item.name}</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-500"></i>
            </button>
        `;
        menuList.appendChild(li);

        if (index === 0) {
            loadPage(item.file, item.name);
        }
    });

    if (window.lucide) lucide.createIcons();
}

// Load Halaman ke dalam Iframe (Fetch / Render Page)
function loadPage(filePath, title) {
    const iframe = document.getElementById('flow-frame');
    if (!iframe) return;

    iframe.classList.add('loading-frame');
    iframe.src = filePath;

    const titleEl = document.getElementById('current-view-title');
    const pathEl = document.getElementById('current-path');

    if (titleEl) titleEl.innerText = `${pageRoutes[currentCategory].title} - ${title}`;
    if (pathEl) pathEl.innerText = filePath;

    iframe.onload = () => {
        iframe.classList.remove('loading-frame');
    };
}

// Inisialisasi Pertama
document.addEventListener('DOMContentLoaded', () => {
    switchCategory('registrasi');
    if (window.lucide) lucide.createIcons();
});

// ==========================================
// FUNGSI DOWNLOAD FLOWCHART KE PDF (FIX BLANK / BLACK SCREEN)
// ==========================================
function downloadPDF() {
    const flowContainer = document.getElementById('flow-container');
    if (!flowContainer) {
        alert('Elemen flowchart tidak ditemukan!');
        return;
    }

    if (typeof html2pdf === 'undefined') {
        alert('Library html2pdf belum dimuat.');
        return;
    }

    // 1. Simpan skala zoom saat ini & reset sementara
    let originalScale = 1;
    if (typeof UIExtension !== 'undefined') {
        originalScale = UIExtension.zoomScale;
        UIExtension.resetZoom();
    }

    // 2. Buat container sementara dengan style warna solid baku (hex)
    const printArea = document.createElement('div');
    printArea.style.position = 'fixed';
    printArea.style.top = '0';
    printArea.style.left = '0';
    printArea.style.zIndex = '-9999';
    printArea.style.backgroundColor = '#0f172a'; // Slate-900 solid
    printArea.style.color = '#ffffff';
    printArea.style.padding = '30px';
    printArea.style.fontFamily = 'Arial, sans-serif';
    printArea.style.width = 'max-content';

    // Header Dokumen
    const headerDoc = `
        <div style="margin-bottom: 20px; padding: 16px; background-color: #1e293b; border-radius: 8px; border: 1px solid #334155;">
            <h1 style="color: #2dd4bf; font-size: 20px; margin: 0 0 6px 0; font-weight: bold;">
                Alur Pelaksanaan Triage - SIRMS NUHA
            </h1>
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                Dokumen Flowchart Pelayanan Medis IGD | Tanggal: ${new Date().toLocaleDateString('id-ID')}
            </p>
        </div>
    `;

    // Kloning elemen flowchart
    const clonedFlow = flowContainer.cloneNode(true);
    clonedFlow.style.transform = 'none';
    clonedFlow.style.display = 'flex';
    clonedFlow.style.gap = '20px';

    // Hilangkan animasi/efek blur pada elemen terkloning agar tidak membuat canvas hitam
    const stepCards = clonedFlow.querySelectorAll('.flow-step-card');
    stepCards.forEach(card => {
        card.style.backgroundColor = '#1e293b';
        card.style.borderColor = '#0d9488';
        card.style.backdropFilter = 'none';
        card.style.boxShadow = 'none';
    });

    printArea.innerHTML = headerDoc;
    printArea.appendChild(clonedFlow);
    document.body.appendChild(printArea);

    // Hitung ukuran piksel sebenarnya
    const contentWidth = printArea.scrollWidth;
    const contentHeight = printArea.scrollHeight;

    // 3. Opsi Konversi PDF
    const opt = {
        margin:       10,
        filename:     `Flowchart_Triage_SIRMS_NUHA_${Date.now()}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: '#0f172a',
            width: contentWidth,
            height: contentHeight,
            scrollX: 0,
            scrollY: 0
        },
        jsPDF:        { 
            unit: 'px', 
            format: [contentWidth + 40, contentHeight + 40],
            orientation: 'landscape' 
        }
    };

    // 4. Proses Ekspor
    html2pdf().set(opt).from(printArea).save().then(() => {
        document.body.removeChild(printArea);
        if (typeof UIExtension !== 'undefined') {
            UIExtension.zoomScale = originalScale;
            UIExtension.updateZoom();
        }
    }).catch(err => {
        console.error('Gagal mengunduh PDF:', err);
        if (document.body.contains(printArea)) {
            document.body.removeChild(printArea);
        }
        if (typeof UIExtension !== 'undefined') {
            UIExtension.zoomScale = originalScale;
            UIExtension.updateZoom();
        }
    });
}