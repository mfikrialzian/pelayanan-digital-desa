import sys

def main():
    file_path = r'd:\PelayananDigitalDesa\vercel-frontend\style.css'
    
    css_content = """
/* ======== ADMIN LOGIN ANIMATIONS ======== */

/* Glow Orb */
@keyframes glowFloat {
    0% { transform: translateY(0) scale(1); opacity: 0.4; }
    50% { transform: translateY(-15px) scale(1.1); opacity: 0.8; }
    100% { transform: translateY(0) scale(1); opacity: 0.4; }
}
.glow-orb {
    animation: glowFloat 5s ease-in-out infinite alternate;
}

/* Orbital Ring */
@keyframes orbitSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.orbital-ring {
    animation: orbitSpin 20s linear infinite;
    transform-origin: center;
}

/* Mesh Color Shift (assuming we just add hue-rotate to existing meshes or new ones) */
@keyframes meshColorShift {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(30deg); }
}
.animate-mesh-1, .animate-mesh-2 {
    animation-composition: add;
    animation: floatMesh1 15s ease-in-out infinite alternate, meshColorShift 20s linear infinite alternate;
}
.animate-mesh-2 {
    animation: floatMesh2 18s ease-in-out infinite alternate, meshColorShift 20s linear infinite alternate;
}

/* Gradient Blur Drift */
@keyframes blurDrift1 {
    0% { transform: translate(0, 0); }
    33% { transform: translate(30px, -20px); }
    66% { transform: translate(-20px, 30px); }
    100% { transform: translate(0, 0); }
}
@keyframes blurDrift2 {
    0% { transform: translate(0, 0); }
    33% { transform: translate(-30px, 20px); }
    66% { transform: translate(20px, -30px); }
    100% { transform: translate(0, 0); }
}
.blur-drift-1 { animation: blurDrift1 20s ease-in-out infinite; }
.blur-drift-2 { animation: blurDrift2 25s ease-in-out infinite; }

/* Dot Grid */
@keyframes dotFade {
    0%, 100% { opacity: 0.03; }
    50% { opacity: 0.08; }
}
.dot-grid-pattern {
    background-image: radial-gradient(circle, #ffffff 1px, transparent 1px);
    background-size: 20px 20px;
    animation: dotFade 6s ease-in-out infinite;
}

/* Wave Flow */
@keyframes waveStroke {
    to { stroke-dashoffset: -1000; }
}
.wave-stroke {
    stroke-dasharray: 50 100;
    animation: waveStroke 15s linear infinite;
}

/* Floating Particles */
@keyframes particleDrift {
    0% { transform: translate(0, 0); opacity: 0.2; }
    50% { transform: translate(15px, -15px); opacity: 0.6; }
    100% { transform: translate(0, 0); opacity: 0.2; }
}
.floating-particle {
    animation: particleDrift 8s ease-in-out infinite;
}

/* Logo Float */
@keyframes logoFloat {
    0% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-5px) rotate(1deg); }
    100% { transform: translateY(0) rotate(0deg); }
}
.hero-logo-float {
    animation: logoFloat 5s ease-in-out infinite alternate;
}

/* Login Card Entrance */
@keyframes cardEntrance {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
.login-card-wrapper {
    opacity: 0;
    animation: cardEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation-delay: 0.2s;
}

/* Security Card Entrance */
@keyframes securityFadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}
.security-card {
    opacity: 0;
    animation: securityFadeIn 0.5s ease-out forwards;
    animation-delay: 0.5s;
}

/* Portal Warga Link */
.portal-warga-link {
    opacity: 0;
    animation: securityFadeIn 0.5s ease-out forwards;
    animation-delay: 0.7s;
}

/* Button Enhancements */
.login-btn-submit {
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}
.login-btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.4);
}
.login-btn-submit:active {
    transform: scale(0.97);
}

/* Input Focus Glow */
.login-input-focus:focus {
    border-color: #059669;
    box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15);
}

@keyframes shimmer {
    100% { transform: translateX(100%); }
}

@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "/* ======== ADMIN LOGIN ANIMATIONS ======== */" not in content:
        with open(file_path, 'a', encoding='utf-8') as f:
            f.write(css_content)
        print("CSS appended successfully.")
    else:
        print("CSS already appended.")

if __name__ == '__main__':
    main()
