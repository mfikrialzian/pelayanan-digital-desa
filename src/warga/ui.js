export function toggleInfoDetail(id) {
            let detailEl = document.getElementById(id);
            let iconEl = document.getElementById(id + "-icon");
            if (detailEl && iconEl) {
                detailEl.classList.toggle('is-open');
                iconEl.classList.toggle('rotate-180');
            }
        }
