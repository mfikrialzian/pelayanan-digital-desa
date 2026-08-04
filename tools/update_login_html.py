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
        
    new_html = """<!-- LANDING PAGE LOGIN ADMIN -->
    <div id="view-admin-login" class="hidden flex flex-col lg:flex-row w-full min-h-screen bg-slate-50 z-50 fixed top-0 left-0 overflow-hidden">
        <!-- Visual Side (Panel Kiri - Hero) -->
        <div class="login-hero-panel w-full lg:w-1/2 bg-narmadaGreen text-white flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden min-h-[50vh] lg:min-h-screen">
            <!-- Background Layers -->
            <div class="absolute inset-0 bg-gradient-to-br from-narmadaGreen to-narmadaGreen-dark z-0 opacity-90"></div>
            
            <!-- Mesh Gradients -->
            <div class="absolute -top-24 -left-24 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl z-0 animate-mesh-1"></div>
            <div class="absolute top-1/2 right-10 w-48 h-48 bg-emerald-400 opacity-10 rounded-full blur-2xl z-0 animate-mesh-2"></div>
            <div class="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-300 opacity-10 rounded-full blur-3xl z-0 animate-mesh-1" style="animation-delay: -5s;"></div>
            
            <!-- Gradient Blur Circle (Drift) -->
            <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-white opacity-10 rounded-full blur-xl z-0 blur-drift-1"></div>
            <div class="absolute bottom-1/4 right-1/4 w-40 h-40 bg-emerald-200 opacity-10 rounded-full blur-2xl z-0 blur-drift-2"></div>
            
            <!-- Dot Grid Pattern -->
            <div class="absolute inset-0 z-0 opacity-5 dot-grid-pattern"></div>
            
            <!-- Glow Orbs -->
            <div class="absolute top-10 right-20 w-8 h-8 rounded-full bg-white opacity-50 blur-md glow-orb" style="animation-delay: 0s;"></div>
            <div class="absolute bottom-40 left-10 w-12 h-12 rounded-full bg-emerald-300 opacity-40 blur-lg glow-orb" style="animation-delay: -2s;"></div>
            <div class="absolute top-1/2 left-20 w-6 h-6 rounded-full bg-white opacity-60 blur-sm glow-orb" style="animation-delay: -4s;"></div>
            
            <!-- Floating Particles -->
            <div class="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-40 floating-particle" style="animation-delay: 0s;"></div>
            <div class="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full opacity-30 floating-particle" style="animation-delay: -3s;"></div>
            <div class="absolute bottom-1/3 left-1/4 w-2 h-2 bg-white rounded-full opacity-50 floating-particle" style="animation-delay: -7s;"></div>
            <div class="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-emerald-200 rounded-full opacity-60 floating-particle" style="animation-delay: -5s;"></div>
            <div class="absolute bottom-1/4 right-1/5 w-1 h-1 bg-white rounded-full opacity-40 floating-particle" style="animation-delay: -9s;"></div>
            <div class="absolute top-10 left-1/2 w-2 h-2 bg-emerald-100 rounded-full opacity-50 floating-particle" style="animation-delay: -2s;"></div>
            <div class="absolute bottom-10 left-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-30 floating-particle" style="animation-delay: -8s;"></div>
            <div class="absolute top-3/4 right-10 w-1 h-1 bg-emerald-300 rounded-full opacity-70 floating-particle" style="animation-delay: -4s;"></div>

            <!-- SVG Orbital Ring (Putih Transparan) -->
            <svg class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] max-w-3xl opacity-20 pointer-events-none z-0" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                <circle cx="250" cy="250" r="200" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="4 8" class="orbital-ring" />
                <path id="orbitPath" d="M250,50 A200,200 0 1,1 249.9,50" fill="none" />
                <circle r="4" fill="#ffffff" filter="blur(1px)">
                    <animateMotion dur="12s" repeatCount="indefinite">
                        <mpath href="#orbitPath" />
                    </animateMotion>
                </circle>
                <circle r="2" fill="#ffffff">
                    <animateMotion dur="8s" repeatCount="indefinite" begin="-4s">
                        <mpath href="#orbitPath" />
                    </animateMotion>
                </circle>
            </svg>
            
            <!-- Curved Wave SVG -->
            <svg class="absolute bottom-0 left-0 w-full h-auto opacity-10 pointer-events-none z-0" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" stroke="#ffffff" stroke-width="2" class="wave-stroke" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224"></path>
            </svg>

            <!-- Hero Content -->
            <div class="relative z-10 flex flex-col h-full">
                <div class="flex items-center gap-3 mb-8 lg:mb-12 hero-logo-float">
                    <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <img id="admin-login-logo" src="" alt="Logo" class="w-8 h-8 object-contain">
                    </div>
                    <div>
                        <h1 class="text-sm font-bold leading-tight">Pemerintah Desa Narmada</h1>
                        <p class="text-xs text-emerald-100">Kabupaten Lombok Barat</p>
                    </div>
                    <div class="hidden md:flex ml-auto items-center gap-4 text-[10px] font-semibold">
                        <div class="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                            <div class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span>Server Online</span>
                        </div>
                        <div class="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                            <i class="fa-regular fa-calendar-check"></i>
                            <span id="lbl-last-update">Last Update: Hari ini</span>
                        </div>
                        <span class="bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">v3.6.1</span>
                    </div>
                </div>
                
                <div class="flex-grow flex flex-col justify-center">
                    <h2 class="text-3xl md:text-5xl font-black tracking-tight mb-3 drop-shadow-md leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-emerald-100">Sistem<br>Pelayanan Digital</h2>
                    <h3 class="text-lg md:text-xl font-bold text-emerald-200 mb-4 drop-shadow-sm">Portal Administrasi Digital</h3>
                    <p class="text-emerald-50 text-sm md:text-base font-medium drop-shadow-sm max-w-md leading-relaxed mb-8 lg:mb-12">Kelola pelayanan administrasi desa secara cepat, aman, transparan, dan terintegrasi.</p>
                    
                    <div class="hidden lg:block mt-auto">
                        <p class="text-xs font-bold text-emerald-100 uppercase tracking-widest mb-4">Fitur Unggulan</p>
                        <div class="grid grid-cols-5 gap-3 max-w-xl">
                            <div class="flex flex-col items-center text-center gap-2 group">
                                <div class="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-narmadaGreen transition-all duration-300">
                                    <i class="fa-solid fa-file-signature text-sm"></i>
                                </div>
                                <span class="text-[10px] font-semibold text-emerald-100 leading-tight">Verifikasi<br>Berkas</span>
                            </div>
                            <div class="flex flex-col items-center text-center gap-2 group">
                                <div class="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-narmadaGreen transition-all duration-300">
                                    <i class="fa-solid fa-envelope-open-text text-sm"></i>
                                </div>
                                <span class="text-[10px] font-semibold text-emerald-100 leading-tight">Surat<br>Online</span>
                            </div>
                            <div class="flex flex-col items-center text-center gap-2 group">
                                <div class="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-narmadaGreen transition-all duration-300">
                                    <i class="fa-solid fa-chart-line text-sm"></i>
                                </div>
                                <span class="text-[10px] font-semibold text-emerald-100 leading-tight">Statistik<br>Real Time</span>
                            </div>
                            <div class="flex flex-col items-center text-center gap-2 group">
                                <div class="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-narmadaGreen transition-all duration-300">
                                    <i class="fa-solid fa-desktop text-sm"></i>
                                </div>
                                <span class="text-[10px] font-semibold text-emerald-100 leading-tight">Monitoring<br>Pelayanan</span>
                            </div>
                            <div class="flex flex-col items-center text-center gap-2 group">
                                <div class="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-narmadaGreen transition-all duration-300">
                                    <i class="fa-solid fa-shield-halved text-sm"></i>
                                </div>
                                <span class="text-[10px] font-semibold text-emerald-100 leading-tight">Aman &<br>Terpercaya</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="hidden lg:flex items-center gap-6 mt-8 pt-6 border-t border-white/10 text-[10px] font-medium text-emerald-100/80">
                    <p>© 2026 Pemerintah Desa Narmada</p>
                    <div class="flex items-center gap-2">
                        <i class="fa-brands fa-chrome"></i>
                        <span>Gunakan Chrome untuk pengalaman terbaik</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-headset"></i>
                        <span>Kendala? Hubungi 0812-3456-7890</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Form Side (Panel Kanan) -->
        <div class="login-form-panel w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-y-auto min-h-[50vh] lg:min-h-screen">
            <!-- Background blur decorations -->
            <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div class="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/30 rounded-full blur-[80px] pointer-events-none z-0"></div>
            
            <div class="w-full max-w-md flex flex-col gap-6 relative z-10">
                <!-- Login Card -->
                <div class="login-card-wrapper bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white">
                    <div class="text-center mb-8">
                        <h3 class="text-2xl font-bold text-slate-900 mb-1">Selamat Datang</h3>
                        <p class="text-sm font-bold text-narmadaGreen uppercase tracking-wide">Portal Administrator</p>
                        <p class="text-xs text-slate-500 mt-2">Silakan masuk menggunakan akun resmi administrator untuk mengakses dashboard.</p>
                    </div>
                    
                    <form id="ev-bind-9" class="space-y-5">
                        <div class="group">
                            <label class="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider group-focus-within:text-narmadaGreen transition-colors">Username</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-narmadaGreen transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <input type="text" id="login-username" required="" placeholder="Masukkan username" class="login-input-focus w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 transition-all outline-none">
                            </div>
                        </div>
                        <div class="group">
                            <label class="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider group-focus-within:text-narmadaGreen transition-colors">Password</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-narmadaGreen transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </div>
                                <input type="password" id="login-password" required="" placeholder="Masukkan password" class="login-input-focus w-full pl-11 pr-11 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 transition-all outline-none">
                                <button id="ev-bind-10" type="button" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-narmadaGreen transition-colors">
                                    <i class="fa-solid fa-eye" id="eye-icon-login"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between mt-2">
                            <label class="flex items-center gap-2 cursor-pointer group/cb">
                                <div class="relative w-4 h-4 rounded border border-slate-300 bg-white group-hover/cb:border-narmadaGreen transition-colors flex items-center justify-center">
                                    <input type="checkbox" class="peer sr-only">
                                    <i class="fa-solid fa-check text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity z-10"></i>
                                    <div class="absolute inset-0 bg-narmadaGreen rounded opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                </div>
                                <span class="text-[11px] font-semibold text-slate-500 group-hover/cb:text-slate-700 transition-colors">Ingat Saya</span>
                            </label>
                            <button type="button" id="btn-show-forgot-password" class="text-[11px] font-semibold text-narmadaGreen hover:text-emerald-700 transition-colors">Lupa Kata Sandi?</button>
                        </div>
                        
                        <button type="submit" id="btn-submit-login" class="login-btn-submit w-full py-3.5 mt-4 bg-narmadaGreen text-white font-bold text-sm rounded-xl flex justify-center items-center gap-2 overflow-hidden relative group/btn">
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                            <i class="fa-solid fa-lock text-xs"></i>
                            <span>Masuk ke Dashboard</span>
                        </button>
                    </form>
                    
                    <!-- Form Lupa Sandi (TETAP) -->
                    <form id="form-forgot-password" class="hidden space-y-5">
                        <div class="text-center mb-6">
                            <button type="button" id="btn-back-to-login" class="text-xs text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1 mx-auto mb-4">
                                <i class="fa-solid fa-arrow-left"></i> Kembali ke Login
                            </button>
                            <h3 class="text-xl font-bold text-slate-900 mb-2">Pemulihan Sandi</h3>
                            <p class="text-[11px] text-slate-500 px-2">Masukkan Username atau Email Anda untuk mendapatkan kode OTP reset sandi.</p>
                        </div>
                        
                        <div id="forgot-step-1">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">Username / Email</label>
                                <input type="text" id="forgot-identifier" required="" placeholder="Ketik username atau email" class="login-input-focus w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 transition-all outline-none">
                            </div>
                            <div class="mt-4">
                                <label class="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">Metode Pengiriman OTP</label>
                                <div class="flex gap-3">
                                    <label class="flex-1 cursor-pointer">
                                        <input type="radio" name="forgot_method" value="email" class="peer sr-only" checked>
                                        <div class="px-3 py-2.5 rounded-xl border border-slate-200 peer-checked:border-narmadaGreen peer-checked:bg-emerald-50 text-center transition-all bg-slate-50">
                                            <i class="fa-solid fa-envelope text-slate-400 peer-checked:text-narmadaGreen text-lg mb-1 block"></i>
                                            <span class="text-[10px] font-bold text-slate-600 peer-checked:text-narmadaGreen uppercase">Email</span>
                                        </div>
                                    </label>
                                    <label class="flex-1 cursor-pointer opacity-50" title="Belum didukung">
                                        <input type="radio" name="forgot_method" value="wa" class="peer sr-only" disabled>
                                        <div class="px-3 py-2.5 rounded-xl border border-slate-200 peer-checked:border-narmadaGreen peer-checked:bg-emerald-50 text-center transition-all bg-slate-50">
                                            <i class="fa-brands fa-whatsapp text-slate-400 peer-checked:text-narmadaGreen text-lg mb-1 block"></i>
                                            <span class="text-[10px] font-bold text-slate-600 peer-checked:text-narmadaGreen uppercase">WhatsApp</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <button type="submit" id="btn-submit-forgot" class="login-btn-submit w-full py-3.5 bg-slate-800 text-white font-bold text-sm rounded-xl mt-6 group/btn overflow-hidden relative">
                                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                                <span>Kirim Kode OTP</span>
                            </button>
                        </div>
                        
                        <div id="forgot-step-2" class="hidden">
                            <div class="flex justify-center gap-2 md:gap-3 mb-6">
                                <input type="text" maxlength="1" class="forgot-otp-input w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-black text-slate-800 bg-slate-50 border border-slate-200 rounded-xl login-input-focus outline-none transition-all" autocomplete="off">
                                <input type="text" maxlength="1" class="forgot-otp-input w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-black text-slate-800 bg-slate-50 border border-slate-200 rounded-xl login-input-focus outline-none transition-all" autocomplete="off">
                                <input type="text" maxlength="1" class="forgot-otp-input w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-black text-slate-800 bg-slate-50 border border-slate-200 rounded-xl login-input-focus outline-none transition-all" autocomplete="off">
                                <input type="text" maxlength="1" class="forgot-otp-input w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-black text-slate-800 bg-slate-50 border border-slate-200 rounded-xl login-input-focus outline-none transition-all" autocomplete="off">
                                <input type="text" maxlength="1" class="forgot-otp-input w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-black text-slate-800 bg-slate-50 border border-slate-200 rounded-xl login-input-focus outline-none transition-all" autocomplete="off">
                                <input type="text" maxlength="1" class="forgot-otp-input w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-black text-slate-800 bg-slate-50 border border-slate-200 rounded-xl login-input-focus outline-none transition-all" autocomplete="off">
                            </div>
                            <button type="button" id="btn-verify-forgot-otp" class="login-btn-submit w-full py-3.5 bg-slate-800 text-white font-bold text-sm rounded-xl mb-3 group/btn overflow-hidden relative">
                                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                                <span>Verifikasi OTP</span>
                            </button>
                            <p class="text-[10px] text-center text-slate-500">Sisa waktu: <span id="forgot-otp-timer" class="font-bold text-slate-700">03:00</span></p>
                        </div>
                        
                        <div id="forgot-step-3" class="hidden space-y-4">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">Kata Sandi Baru</label>
                                <input type="password" id="forgot-new-password" required="" placeholder="Minimal 6 karakter" class="login-input-focus w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 transition-all outline-none">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">Konfirmasi Sandi Baru</label>
                                <input type="password" id="forgot-confirm-password" required="" placeholder="Ulangi kata sandi" class="login-input-focus w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 transition-all outline-none">
                            </div>
                            <button type="button" id="btn-save-new-password" class="login-btn-submit w-full py-3.5 mt-4 bg-narmadaGreen text-white font-bold text-sm rounded-xl group/btn overflow-hidden relative">
                                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                                <span>Simpan Sandi Baru</span>
                            </button>
                        </div>
                    </form>
                </div>
                
                <!-- Security Notice -->
                <div class="security-card bg-emerald-50/80 backdrop-blur border border-emerald-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                    <div class="w-8 h-8 rounded-full bg-emerald-100 text-narmadaGreen flex items-center justify-center shrink-0">
                        <i class="fa-solid fa-shield-check"></i>
                    </div>
                    <div>
                        <p class="text-[11px] text-slate-600 leading-relaxed font-medium">
                            <span class="font-bold text-slate-800">Keamanan Terjamin.</span> Akses hanya diperuntukkan bagi administrator resmi. Seluruh aktivitas login dicatat demi keamanan sistem.
                        </p>
                    </div>
                </div>

                <!-- Link Kembali -->
                <div class="text-center mt-2 portal-warga-link">
                    <button id="ev-bind-11" type="button" class="text-xs font-semibold text-slate-500 hover:text-narmadaGreen transition-colors inline-flex items-center gap-1.5 py-2 px-4 rounded-lg hover:bg-slate-200/50">
                        <i class="fa-solid fa-arrow-left"></i> Kembali ke Portal Warga
                    </button>
                </div>
            </div>
        </div>
    </div>\n"""
    
    updated_content = content[:match.start()] + new_html + content[match.end():]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
        
    print("HTML replacement successful.")

if __name__ == '__main__':
    main()
