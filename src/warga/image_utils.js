export function analyzeImageSharpnessLocal(imgElement, callback) {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = 100;
            canvas.height = 75;
            ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

            let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imgData.data;
            let width = imgData.width;
            let height = imgData.height;
            let score = 0;
            let count = 0;

            for (let y = 1; y < height - 1; y += 3) {
                for (let x = 1; x < width - 1; x += 3) {
                    let idx = (y * width + x) * 4;
                    let h = data[idx] - data[idx + 4];
                    let v = data[idx] - data[idx + width * 4];
                    score += (h * h + v * v);
                    count++;
                }
            }
            let avgVariance = Math.sqrt(score / count);
            callback(avgVariance);
        }

export function handleFileSelectImageAndCompress(event, slotId) {
            let file = event.target.files[0];
            if (!file) return;

            pushToast("Membaca & Memproses Gambar...", "info");

            let reader = new FileReader();
            reader.onload = function (e) {
                let img = new Image();
                img.onload = function () {
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');

                    let maxWidth = 1024;
                    let maxHeight = 768;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    let compressedBase64 = canvas.toDataURL("image/jpeg", 0.70);

                    analyzeImageSharpnessLocal(img, function (score) {
                        let pBox = document.getElementById("preview_box_" + slotId);
                        if (!pBox) return;

                        if (score < 9.0) {
                            pushToast("Foto terlalu buram. Silakan gunakan kamera stabil dan pencahayaan terang!", "error");
                            pBox.className = "preview-box rounded-lg p-2 text-center text-red-600 border border-red-500 bg-red-50 flex flex-col items-center justify-center min-h-[60px] text-[9px] font-extrabold";
                            pBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-base mb-0.5 animate-bounce"></i> File Foto Terlalu Buram!';
                            delete uploadDataStore[slotId];
                        } else {
                            uploadDataStore[slotId] = compressedBase64;
                            pBox.className = "preview-box has-image rounded-lg overflow-hidden relative aspect-[4/3] flex items-center justify-center shadow-xl";
                            pBox.innerHTML = '<img id="img_preview_' + slotId + '" src="' + compressedBase64 + '" class="w-full h-full object-cover">' +
                                '<div class="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] py-0.5 font-bold text-center"><i class="fa-solid fa-circle-check text-emerald-400"></i> Berkas Layak (Sharpness: ' + Math.round(score) + ')</div>';
                            pushToast("Foto berhasil dilampirkan.", "success");
                        }
                        validateCurrentWizardStep();
                    });
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
