import re
import sys

def main():
    file_path = r'd:\PelayananDigitalDesa\vercel-frontend\index.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    pattern = re.compile(
        r'(<!-- LANDING PAGE LOGIN ADMIN -->\s*)<div id="view-admin-login".*?(?=<!-- ========================================== -->\s*<!-- 2\. ANTARMUKA ADMIN DASHBOARD)', 
        re.DOTALL
    )
    
    match = pattern.search(content)
    if not match:
        print("Could not find the target block.")
        sys.exit(1)
        
    new_html = r"""<!-- LANDING PAGE LOGIN ADMIN -->
    <div id="view-admin-login" class="hidden flex flex-col lg:flex-row w-full min-h-screen bg-white z-50 fixed top-0 left-0 overflow-hidden">
        <!-- ===== Panel Kiri (Hero) ===== -->
        <div class="login-hero-panel w-full lg:w-1/2 text-white flex flex-col justify-between p-8 lg:px-16 lg:py-10 relative overflow-hidden min-h-[50vh] lg:min-h-screen">
            <!-- Background: gradient hijau terang-ke-gelap -->
            <div class="absolute inset-0 bg-gradient-to-br from-[#0D9E6E] via-[#059669] to-[#065F46] z-0"></div>
            
            <!-- Glow besar kanan-atas (efek pencahayaan teal) -->
            <div class="absolute -top-40 -right-40 w-[500px] h-[500px] bg-white opacity-[0.12] rounded-full blur-[120px] z-0"></div>
            <!-- Mesh gradients -->
            <div class="absolute -top-32 -left-32 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl z-0 animate-mesh-1"></div>
            <div class="absolute top-1/4 right-0 w-64 h-64 border-[30px] border-emerald-400/10 rounded-full z-0 blur-sm"></div>
            <div class="absolute top-1/2 right-10 w-48 h-48 bg-emerald-400 opacity-10 rounded-full blur-2xl z-0 animate-mesh-2"></div>
            <div class="absolute -bottom-32 -left-20 w-96 h-96 border-[40px] border-emerald-300/10 rounded-full z-0 blur-sm"></div>
            <!-- Blur drift -->
            <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-white opacity-10 rounded-full blur-xl z-0 blur-drift-1"></div>
            <!-- Dot grid -->
            <div class="absolute inset-0 z-0 opacity-10 dot-grid-pattern"></div>
            <!-- Glow orbs & particles -->
            <div class="absolute top-10 right-20 w-8 h-8 rounded-full bg-white opacity-50 blur-md glow-orb" style="animation-delay:0s"></div>
            <div class="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-40 floating-particle" style="animation-delay:0s"></div>
            <div class="absolute bottom-1/3 left-1/4 w-2 h-2 bg-white rounded-full opacity-50 floating-particle" style="animation-delay:-7s"></div>

            <!-- SVG Orbital Ring -->
            <svg class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] max-w-3xl opacity-20 pointer-events-none z-0" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                <circle cx="250" cy="250" r="200" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="4 8" class="orbital-ring"/>
                <path id="orbitPath" d="M250,50 A200,200 0 1,1 249.9,50" fill="none"/>
                <circle r="4" fill="#ffffff" filter="blur(1px)">
                    <animateMotion dur="12s" repeatCount="indefinite"><mpath href="#orbitPath"/></animateMotion>
                </circle>
            </svg>

            <!-- Hero Content -->
            <div class="relative z-10 flex flex-col h-full">
                <!-- Logo + Nama Desa (dengan container putih) -->
                <div class="flex items-center gap-4 mb-8 lg:mb-14 hero-logo-float">
                    <div class="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg p-1.5 shrink-0">
                        <img id="admin-login-logo" src="" alt="Logo" class="w-10 h-10 object-contain">
                    </div>
                    <div>
                        <h1 class="text-sm lg:text-base font-bold leading-tight">Pemerintah Desa Narmada</h1>
                        <p class="text-xs lg:text-sm text-emerald-100">Kabupaten Lombok Barat</p>
                    </div>
                </div>
                
                <!-- Heading Area -->
                <div class="flex-grow flex flex-col justify-center max-w-lg relative z-20">
                    <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-md leading-[1.1] text-white">Sistem<br>Pelayanan Digital</h2>
                    <h3 class="text-xl md:text-2xl font-bold text-[#6EE7B7] mb-6 drop-shadow-sm">Portal Administrasi Digital</h3>
                    <p class="text-emerald-50/90 text-sm md:text-base font-medium drop-shadow-sm leading-relaxed mb-10 max-w-md">Kelola pelayanan administrasi desa secara cepat, aman, transparan, dan terintegrasi.</p>
                    
                    <!-- Fitur Unggulan (italic label) -->
                    <div class="hidden lg:block">
                        <p class="text-lg font-bold text-white mb-5 italic">Fitur Unggulan</p>
                        <div class="grid grid-cols-5 gap-3 max-w-[480px]">
                            <div class="flex flex-col items-center text-center gap-2.5 group">
                                <div class="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-narmadaGreen transition-all duration-300 shadow-sm backdrop-blur-sm">
                                    <i class="fa-solid fa-file-signature text-lg"></i>
                                </div>
                                <span class="text-[11px] font-medium text-emerald-50 leading-tight">Verifikasi<br>Berkas</span>
                            </div>
                            <div class="flex flex-col items-center text-center gap-2.5 group">
                                <div class="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-narmadaGreen transition-all duration-300 shadow-sm backdrop-blur-sm">
                                    <i class="fa-solid fa-file-lines text-lg"></i>
                                </div>
                                <span class="text-[11px] font-medium text-emerald-50 leading-tight">Surat<br>Online</span>
                            </div>
                            <div class="flex flex-col items-center text-center gap-2.5 group">
                                <div class="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-narmadaGreen transition-all duration-300 shadow-sm backdrop-blur-sm">
                                    <i class="fa-solid fa-chart-simple text-lg"></i>
                                </div>
                                <span class="text-[11px] font-medium text-emerald-50 leading-tight">Statistik<br>Real Time</span>
                            </div>
                            <div class="flex flex-col items-center text-center gap-2.5 group">
                                <div class="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-narmadaGreen transition-all duration-300 shadow-sm backdrop-blur-sm">
                                    <i class="fa-solid fa-desktop text-lg"></i>
                                </div>
                                <span class="text-[11px] font-medium text-emerald-50 leading-tight">Monitoring<br>Pelayanan</span>
                            </div>
                            <div class="flex flex-col items-center text-center gap-2.5 group">
                                <div class="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-narmadaGreen transition-all duration-300 shadow-sm backdrop-blur-sm">
                                    <i class="fa-solid fa-shield-halved text-lg"></i>
                                </div>
                                <span class="text-[11px] font-medium text-emerald-50 leading-tight">Aman &amp;<br>Terpercaya</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Kiri: copyright + 3 info blocks -->
                <div class="hidden lg:block mt-auto pt-6 border-t border-white/10">
                    <div class="grid grid-cols-3 gap-5 mb-4">
                        <div class="flex items-start gap-2.5">
                            <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5"><i class="fa-solid fa-window-maximize text-xs text-emerald-100"></i></div>
                            <div>
                                <h4 class="text-[11px] font-bold text-emerald-50 mb-0.5">Browser yang Disarankan</h4>
                                <p class="text-[10px] text-emerald-100/70 leading-relaxed">Gunakan Google Chrome atau Microsoft Edge terbaru untuk pengalaman terbaik.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-2.5">
                            <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5"><i class="fa-solid fa-headset text-xs text-emerald-100"></i></div>
                            <div>
                                <h4 class="text-[11px] font-bold text-emerald-50 mb-0.5">Mengalami Kendala?</h4>
                                <p class="text-[10px] text-emerald-100/70 leading-relaxed">Hubungi Operator Desa 0812-3456-7890 (08:00 - 16:00 WIB)</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-2.5">
                            <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5"><i class="fa-solid fa-shield-check text-xs text-emerald-100"></i></div>
                            <div>
                                <h4 class="text-[11px] font-bold text-emerald-50 mb-0.5">Keamanan Terjamin</h4>
                                <p class="text-[10px] text-emerald-100/70 leading-relaxed">Sistem kami menggunakan enkripsi data dan protokol keamanan berlapis.</p>
                            </div>
                        </div>
                    </div>
                    <p class="text-xs font-medium text-emerald-100/60">&#169; 2026 Pemerintah Desa Narmada &nbsp;|&nbsp; Versi 2.0.0</p>
                </div>
            </div>
        </div>
        
        <!-- ===== Panel Kanan (Form) ===== -->
        <div class="login-form-panel w-full lg:w-1/2 flex flex-col items-center p-6 lg:px-12 lg:py-8 bg-white relative overflow-y-auto min-h-[50vh] lg:min-h-screen">
            <!-- Subtle bg -->
            <div class="absolute top-0 right-0 w-96 h-96 bg-slate-50 rounded-full blur-[100px] pointer-events-none z-0"></div>
            
            <!-- Top Right Badges (tanpa border box — teks polos) -->
            <div class="w-full flex justify-end items-center gap-5 text-xs font-medium text-slate-500 relative z-10 mb-4">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span>Server Online</span>
                </div>
                <div class="flex items-center gap-2">
                    <i class="fa-regular fa-calendar text-slate-400"></i>
                    <span>Last Update</span>
                    <span>4 Agustus 2026</span>
                </div>
                <span class="text-slate-400">v2.0.0</span>
            </div>

            <!-- Center Content -->
            <div class="w-full max-w-[420px] flex flex-col gap-5 relative z-10 flex-grow justify-center">
                
                <!-- Login Card -->
                <div class="login-card-wrapper bg-white p-8 lg:p-10 rounded-[28px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] border border-slate-100">
                    <div class="text-center mb-8">
                        <h3 class="text-3xl font-extrabold text-slate-900 mb-2">Selamat Datang</h3>
                        <p class="text-base font-bold text-narmadaGreen">Portal Administrator</p>
                        <p class="text-sm text-slate-500 mt-4 leading-relaxed px-2">Silakan masuk menggunakan akun resmi administrator untuk mengakses dashboard.</p>
                    </div>
                    
                    <form id="ev-bind-9" class="space-y-5">
                        <!-- USERNAME (tanpa ikon, sesuai referensi) -->
                        <div class="group">
                            <label class="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide group-focus-within:text-narmadaGreen transition-colors">Username</label>
                            <input type="text" id="login-username" required="" placeholder="Masukkan username" class="login-input-focus w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 transition-all outline-none">
                        </div>
                        <!-- PASSWORD (dengan ikon lock + eye) -->
                        <div class="group">
                            <label class="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide group-focus-within:text-narmadaGreen transition-colors">Password</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-narmadaGreen transition-colors">
                                    <i class="fa-solid fa-lock text-sm"></i>
                                </div>
                                <input type="password" id="login-password" required="" placeholder="Masukkan password" class="login-input-focus w-full pl-11 pr-11 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 transition-all outline-none">
                                <button id="ev-bind-10" type="button" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-narmadaGreen transition-colors">
                                    <i class="fa-regular fa-eye" id="eye-icon-login"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Ingat Saya + Lupa Kata Sandi -->
                        <div class="flex items-center justify-between pt-1">
                            <label class="flex items-center gap-2 cursor-pointer group/cb">
                                <div class="relative w-4 h-4 rounded border border-slate-300 bg-white group-hover/cb:border-narmadaGreen transition-colors flex items-center justify-center">
                                    <input type="checkbox" class="peer sr-only">
                                    <i class="fa-solid fa-check text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity z-10"></i>
                                    <div class="absolute inset-0 bg-narmadaGreen rounded opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                </div>
                                <span class="text-sm text-slate-600">Ingat Saya</span>
                            </label>
                            <button type="button" id="btn-show-forgot-password" class="text-sm font-semibold text-narmadaGreen hover:text-emerald-700 transition-colors">Lupa Kata Sandi?</button>
                        </div>
                        
                        <!-- Tombol Login -->
                        <button type="submit" id="btn-submit-login" class="login-btn-submit w-full py-4 mt-4 bg-[#059669] hover:bg-[#047857] text-white font-bold text-[15px] rounded-xl flex justify-center items-center gap-2 overflow-hidden relative group/btn">
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                            <i class="fa-solid fa-lock text-sm"></i>
                            <span>Masuk ke Dashboard</span>
                        </button>
                    </form>
                    
                    <!-- Form Lupa Sandi -->
                    <form id="form-forgot-password" class="hidden space-y-5">
                        <div class="text-center mb-6">
                            <button type="button" id="btn-back-to-login" class="text-sm text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1 mx-auto mb-4">
                                <i class="fa-solid fa-arrow-left"></i> Kembali ke Login
                            </button>
                            <h3 class="text-xl font-bold text-slate-900 mb-2">Pemulihan Sandi</h3>
                            <p class="text-xs text-slate-500 px-2">Masukkan Username atau Email Anda untuk mendapatkan kode OTP reset sandi.</p>
                        </div>
                        <div id="forgot-step-1">
                            <div>
                                <label class="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Username / Email</label>
                                <input type="text" id="forgot-identifier" required="" placeholder="Ketik username atau email" class="login-input-focus w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 transition-all outline-none">
                            </div>
                            <div class="mt-4">
                                <label class="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Metode Pengiriman OTP</label>
                                <div class="flex gap-3">
                                    <label class="flex-1 cursor-pointer">
                                        <input type="radio" name="forgot_method" value="email" class="peer sr-only" checked>
                                        <div class="px-3 py-2.5 rounded-xl border border-slate-200 peer-checked:border-narmadaGreen peer-checked:bg-emerald-50 text-center transition-all bg-white">
                                            <i class="fa-solid fa-envelope text-slate-400 peer-checked:text-narmadaGreen text-lg mb-1 block"></i>
                                            <span class="text-xs font-bold text-slate-600 peer-checked:text-narmadaGreen uppercase">Email</span>
                                        </div>
                                    </label>
                                    <label class="flex-1 cursor-pointer opacity-50" title="Belum didukung">
                                        <input type="radio" name="forgot_method" value="wa" class="peer sr-only" disabled>
                                        <div class="px-3 py-2.5 rounded-xl border border-slate-200 peer-checked:border-narmadaGreen peer-checked:bg-emerald-50 text-center transition-all bg-white">
                                            <i class="fa-brands fa-whatsapp text-slate-400 peer-checked:text-narmadaGreen text-lg mb-1 block"></i>
                                            <span class="text-xs font-bold text-slate-600 peer-checked:text-narmadaGreen uppercase">WhatsApp</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <button type="submit" id="btn-submit-forgot" class="login-btn-submit w-full py-4 bg-slate-800 text-white font-bold text-[15px] rounded-xl mt-6 group/btn overflow-hidden relative">
                                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                                <span>Kirim Kode OTP</span>
                            </button>
                        </div>
                        <div id="forgot-step-2" class="hidden">
                            <div class="flex justify-center gap-2 md:gap-3 mb-6">
                                <input type="text" maxlength="1" class="forgot-otp-input w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-black text-slate-800 bg-white border border-slate-200 rounded-xl login-input-focus outline-none transition-all" autocomplete="off">
                                <input type="text" maxlength="1" class="forgot-otp-input w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-black text-slate-800 bg-white border border-slate-200 rounded-xl login-input-focus outline-none transition-all" autocomplete="off">
                                <input type="text" maxlength="1" class="forgot-otp-input w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-black text-slate-800 bg-white border border-slate-200 rounded-xl login-input-focus outline-none transition-all" autocomplete="off">
                                <input type="text" maxlength="1" class="forgot-otp-input w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-black text-slate-800 bg-white border border-slate-200 rounded-xl login-input-focus outline-none transition-all" autocomplete="off">
                                <input type="text" maxlength="1" class="forgot-otp-input w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-black text-slate-800 bg-white border border-slate-200 rounded-xl login-input-focus outline-none transition-all" autocomplete="off">
                                <input type="text" maxlength="1" class="forgot-otp-input w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-black text-slate-800 bg-white border border-slate-200 rounded-xl login-input-focus outline-none transition-all" autocomplete="off">
                            </div>
                            <button type="button" id="btn-verify-forgot-otp" class="login-btn-submit w-full py-4 bg-slate-800 text-white font-bold text-[15px] rounded-xl mb-3 group/btn overflow-hidden relative">
                                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                                <span>Verifikasi OTP</span>
                            </button>
                            <p class="text-[11px] text-center text-slate-500">Sisa waktu: <span id="forgot-otp-timer" class="font-bold text-slate-700">03:00</span></p>
                        </div>
                        <div id="forgot-step-3" class="hidden space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Kata Sandi Baru</label>
                                <input type="password" id="forgot-new-password" required="" placeholder="Minimal 6 karakter" class="login-input-focus w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 transition-all outline-none">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Konfirmasi Sandi Baru</label>
                                <input type="password" id="forgot-confirm-password" required="" placeholder="Ulangi kata sandi" class="login-input-focus w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 transition-all outline-none">
                            </div>
                            <button type="button" id="btn-save-new-password" class="login-btn-submit w-full py-4 mt-4 bg-narmadaGreen text-white font-bold text-[15px] rounded-xl group/btn overflow-hidden relative">
                                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                                <span>Simpan Sandi Baru</span>
                            </button>
                        </div>
                    </form>
                    
                    <!-- Security Notice (di dalam card, tanpa border-t, flat) -->
                    <div class="mt-6 pt-4 security-card flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <p class="text-xs text-slate-500 leading-relaxed">
                            Akses hanya diperuntukkan bagi administrator resmi. Seluruh aktivitas login dicatat demi keamanan sistem.
                        </p>
                    </div>

                    <!-- Kembali ke Portal Warga (di dalam card) -->
                    <div class="text-center mt-5 portal-warga-link">
                        <button id="ev-bind-11" type="button" class="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-2 py-1">
                            <i class="fa-solid fa-arrow-left text-xs"></i> Kembali ke Portal Warga
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
"""
    
    updated_content = content[:match.start()] + new_html + content[match.end():]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
        
    print("HTML replacement successful - pixel-perfect version applied.")

if __name__ == '__main__':
    main()
