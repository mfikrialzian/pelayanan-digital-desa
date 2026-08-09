// FUNGSI UTILITAS UNTUK MENCEGAH XSS
window.escapeHtml = function(str) {
    if (str === null || str === undefined) return '';
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
}

window.getTableSkeleton = function(cols, rows) {
            let html = '';
            for (let i = 0; i < rows; i++) {
                html += '<tr class="animate-pulse bg-slate-50 border-b border-slate-101">';
                for (let j = 0; j < cols; j++) {
                    html += '<td class="p-4"><div class="h-3 bg-slate-200 rounded-full"></div></td>';
                }
                html += '</tr>';
            }
            return html;
        }

window.getDirectDriveImageUrl = function(originalUrl) {
            if (!originalUrl) return "";
            try {
                let fileIdMatch = originalUrl.match(/\/d\/(.*?)\/view/);
                if (fileIdMatch && fileIdMatch[1]) {
                    return "https://drive.google.com/thumbnail?id=" + fileIdMatch[1] + "&sz=w1000";
                }
            } catch (e) {
                console.error("Gagal mengurai URL gambar Drive:", e);
            }
            return originalUrl;
        }

        // Ekstraksi Fungsi Utilitas (Phase 3)
window.parseLinkDokumen = function(fileUrl) {
            if (!fileUrl) return "";
            let previewUrl = fileUrl;
            if (fileUrl.includes('drive.google.com/open?id=')) {
                let idMatch = fileUrl.match(/id=([a-zA-Z0-9_-]+)/);
                if (idMatch) {
                    previewUrl = 'https://drive.google.com/uc?export=view&id=' + idMatch[1];
                }
            } else if (fileUrl.includes('drive.google.com/file/d/')) {
                let idMatch2 = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
                if (idMatch2) {
                    previewUrl = 'https://drive.google.com/uc?export=view&id=' + idMatch2[1];
                }
            }
            return previewUrl;
        }


window.parseQuestionMetadata = function(rawName) {
            let match = rawName.match(/^{(.*?);;(.*?)}\s*(.*)$/);
            if (match) {
                return {
                    keperluan: match[1] || "Wajib",
                    judul: match[2] || "",
                    cleanName: match[3]
                };
            }
            return { keperluan: "Wajib", judul: "", cleanName: rawName };
        }


window.askConfirmation = function(title, message, onConfirm, btnCancelText, btnOkText) {
            let modal = document.getElementById('modal-custom-confirm');
            document.getElementById('confirm-modal-title').innerText = title;
            document.getElementById('confirm-modal-message').innerText = message;
            
            document.getElementById('confirm-modal-btn-cancel').innerText = btnCancelText || "Batal";
            document.getElementById('confirm-modal-btn-ok').innerText = btnOkText || "Ya, Lanjutkan";
            
            modal.classList.remove('hidden');

            document.getElementById('confirm-modal-btn-cancel').onclick = function () {
                modal.classList.add('hidden');
            };

            document.getElementById('confirm-modal-btn-ok').onclick = function () {
                modal.classList.add('hidden');
                onConfirm();
            };
        }

window.formatWhatsAppToInternational = function(val) {
            val = val.replace(/\D/g, '');
            if (val.startsWith('0')) {
                val = '+62' + val.substring(1);
            } else if (val.startsWith('62') && !val.startsWith('+62')) {
                val = '+' + val;
            }
            return val;
        }


window.openLightbox = function(url, title) {
            let lightbox = document.getElementById('lightbox-modal');
            let img = document.getElementById('lightbox-img');
            let pTitle = document.getElementById('lightbox-title');
            let btnDownload = document.getElementById('lightbox-download');
            
            img.src = url;
            pTitle.innerText = title || 'Berkas';
            btnDownload.href = url;
            
            lightbox.classList.remove('hidden');
            // Sedikit delay agar transisi opacity & scale terlihat smooth
            setTimeout(function() {
                lightbox.classList.remove('opacity-0');
                img.classList.remove('scale-95');
                img.classList.add('scale-100');
            }, 10);
        }

window.closeLightbox = function() {
            let lightbox = document.getElementById('lightbox-modal');
            let img = document.getElementById('lightbox-img');
            
            lightbox.classList.add('opacity-0');
            img.classList.remove('scale-100');
            img.classList.add('scale-95');
            
            // Tunggu durasi transisi Tailwind (300ms) sebelum di-hidden sepenuhnya
            setTimeout(function() {
                lightbox.classList.add('hidden');
                img.src = '';
            }, 300);
        }


window.togglePasswordView = function(inputId, iconId) {
            let input = document.getElementById(inputId);
            let icon = document.getElementById(iconId);
            if (input.type === "password") {
                input.type = "text";
                icon.className = "fa-solid fa-eye-slash";
            } else {
                input.type = "password";
                icon.className = "fa-solid fa-eye";
            }
        }

window.setupInputRestrictions = function() {
            let nikInput = document.getElementById('warga-nik');
            let waInput = document.getElementById('warga-wa');

            let cleanerFunc = function (e, maxLen) {
                let val = e.target.value.replace(/\D/g, '');
                if (val.length > maxLen) val = val.substring(0, maxLen);
                e.target.value = val;

                if (e.target.id === 'warga-nik') {
                    let warningEl = document.getElementById('lbl-nik-warning');
                    if (val.length > 0 && val.length < 16) {
                        warningEl.classList.remove('hidden');
                    } else {
                        warningEl.classList.add('hidden');
                    }
                }
            };

            if (nikInput) {
                nikInput.oninput = function (e) { cleanerFunc(e, 16); };
            }
            if (waInput) {
                waInput.oninput = function (e) { cleanerFunc(e, 12); };
                waInput.onblur = function (e) {
                    let val = e.target.value.trim();
                    if (val.length >= 10) {
                        e.target.value = formatWhatsAppToInternational(val);
                    }
                };
            }
        }


window.pushToast = function(message, type) {
            let wrapper = document.getElementById('toast-wrapper');
            if (!wrapper) return;
            let toast = document.createElement('div');

            let bgStyle = type === "success" ? "bg-emerald-950 border-emerald-505/30 text-emerald-200" : "bg-red-950 border-red-505/30 text-red-200";
            if (type === "info") bgStyle = "bg-slate-900 border-slate-700 text-slate-200";

            let icon = "fa-circle-check text-emerald-400";
            if (type === "error") icon = "fa-circle-exclamation text-red-400";
            else if (type === "info") icon = "fa-circle-info text-blue-400";

            toast.className = 'flex items-center space-x-3 p-3 rounded-xl border shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0 text-[11px] font-bold light-glass-card pointer-events-auto w-72 md:w-80 ' + bgStyle;
            toast.innerHTML = '<i class="fa-solid ' + icon + ' text-sm"></i><div class="flex-grow">' + message + '</div>';

            wrapper.appendChild(toast);
            setTimeout(function () { toast.classList.remove('opacity-0', 'translate-y-2'); }, 50);
            setTimeout(function () {
                toast.classList.add('opacity-0', 'translate-y-[-10px]');
                setTimeout(function () { toast.remove(); }, 300);
            }, 3500);
        }
