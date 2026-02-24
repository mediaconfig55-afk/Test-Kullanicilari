document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('betaForm');
    const emailInput = document.getElementById('email');
    const errorMsg = document.getElementById('emailError');
    const submitBtn = document.getElementById('submitBtn');

    // Email Validation Pattern (must end with @gmail.com)
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    // Real-time validation
    emailInput.addEventListener('input', () => {
        if (emailInput.value.length > 0 && !gmailPattern.test(emailInput.value.toLowerCase())) {
            errorMsg.style.display = 'block';
            submitBtn.style.opacity = '0.5';
            submitBtn.style.pointerEvents = 'none';
        } else {
            errorMsg.style.display = 'none';
            submitBtn.style.opacity = '1';
            submitBtn.style.pointerEvents = 'auto';
        }
    });

    // Form Submission Handling
    form.addEventListener('submit', (e) => {
        const emailValue = emailInput.value.toLowerCase();

        // Final check before submission
        if (!gmailPattern.test(emailValue)) {
            e.preventDefault(); // Prevent submission
            errorMsg.style.display = 'block';
            emailInput.focus();

            // Add shake animation
            emailInput.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                emailInput.style.animation = '';
            }, 500);
            return false;
        }

        // If valid, change button state (Assuming Web3Forms will handle the actual POST)
        const btnText = submitBtn.querySelector('span');
        const btnIcon = submitBtn.querySelector('i');

        submitBtn.style.background = '#00d2ff'; // Change to secondary color
        btnText.textContent = 'İşleniyor...';
        btnIcon.className = 'fa-solid fa-spinner fa-spin';

        // Web3Forms returns user to success page automatically if redirect is set.
        // Or you can handle it via AJAX for a no-refresh experience.
    });

    // Add optional cursor glow effect for desktop
    if (window.matchMedia("(min-width: 768px)").matches) {
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.feature-card');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });

        // Add this CSS variable effect physically via JS
        const style = document.createElement('style');
        style.innerHTML = `
            .feature-card::before {
                content: "";
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(
                    800px circle at var(--mouse-x) var(--mouse-y), 
                    rgba(255, 255, 255, 0.06),
                    transparent 40%
                );
                z-index: -1;
                border-radius: inherit;
                opacity: 0;
                transition: opacity 0.3s;
            }
            .feature-card:hover::before {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
});

// Add CSS keyframes for shake error dynamically
const shakeStyle = document.createElement('style');
shakeStyle.innerHTML = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;
document.head.appendChild(shakeStyle);
