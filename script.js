document.addEventListener('DOMContentLoaded', () => {
    const fuelCards = document.querySelectorAll('.fuel-card');
    const litersInput = document.getElementById('liters');
    const distanceInput = document.getElementById('distance');
    const calculateBtn = document.getElementById('calculateBtn');

    // Panels
    const resultsPlaceholder = document.getElementById('resultsPlaceholder');
    const resultsDashboard = document.getElementById('resultsDashboard');
    const resetBtn = document.getElementById('resetBtn');

    const resTotalCost = document.getElementById('resTotalCost');
    const resCostPerKm = document.getElementById('resCostPerKm');
    const resPer100km = document.getElementById('resPer100km');
    const efficiencyFill = document.getElementById('efficiencyFill');
    const efficiencyStatus = document.getElementById('efficiencyStatus');

    let selectedPrice = parseFloat(document.querySelector('.fuel-card.active').dataset.price);

    fuelCards.forEach(card => {
        card.addEventListener('click', () => {
            fuelCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedPrice = parseFloat(card.dataset.price);

            card.style.transform = 'scale(0.95)';
            setTimeout(() => card.style.transform = '', 150);
        });
    });

    function animateValue(obj, start, end, duration, isCurrency = false) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - (1 - progress) * (1 - progress);

            const currentVal = start + easeProgress * (end - start);

            obj.innerHTML = currentVal.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    calculateBtn.addEventListener('click', () => {
        const liters = parseFloat(litersInput.value);
        const distance = parseFloat(distanceInput.value);

        if (isNaN(liters) || isNaN(distance) || liters <= 0 || distance <= 0) {
            calculateBtn.style.animation = 'none';
            calculateBtn.offsetHeight;
            calculateBtn.style.animation = 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both';

            if (!document.getElementById('shake-style')) {
                const style = document.createElement('style');
                style.id = 'shake-style';
                style.innerHTML = `
                    @keyframes shake {
                        10%, 90% { transform: translate3d(-1px, 0, 0); }
                        20%, 80% { transform: translate3d(2px, 0, 0); }
                        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                        40%, 60% { transform: translate3d(4px, 0, 0); }
                    }
                `;
                document.head.appendChild(style);
            }
            return;
        }

        const totalCost = liters * selectedPrice;
        const costPerKm = totalCost / distance;
        const per100Km = (liters / distance) * 100;

        // Hide Placeholder, Show Dashboard
        resultsPlaceholder.classList.add('hidden');
        resultsDashboard.classList.remove('hidden');

        // Masaüstünde scroll'a gerek yok ama küçük ekrana düşerse offsetlesin:
        if (window.innerWidth < 1100) {
            setTimeout(() => {
                resultsDashboard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }

        animateValue(resTotalCost, 0, totalCost, 1500, true);
        animateValue(resCostPerKm, 0, costPerKm, 1500, true);
        animateValue(resPer100km, 0, per100Km, 1500, false);

        let fillPercentage = Math.min((per100Km / 15) * 100, 100);
        let statusText = '';
        let statusColor = '';

        setTimeout(() => {
            efficiencyFill.style.width = `${fillPercentage}%`;

            if (per100Km < 5.5) {
                statusText = 'Ekonomik Tüketim Seviyesi';
                statusColor = '#10b981';
            } else if (per100Km < 8) {
                statusText = 'Normal Tüketim Seviyesi';
                statusColor = '#eab308';
            } else {
                statusText = 'Yüksek Yakıt Tüketimi';
                statusColor = '#ef4444';
            }

            efficiencyStatus.innerText = statusText;
            efficiencyStatus.style.color = statusColor;
            efficiencyStatus.style.opacity = '0';
            efficiencyStatus.style.transition = 'opacity 0.5s';

            setTimeout(() => {
                efficiencyStatus.style.opacity = '1';
            }, 300);

        }, 500);
    });

    resetBtn.addEventListener('click', () => {
        litersInput.value = '';
        distanceInput.value = '';

        // Sadece paneli değiştir
        resultsDashboard.classList.add('hidden');
        resultsPlaceholder.classList.remove('hidden');

        efficiencyFill.style.width = '0%';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
