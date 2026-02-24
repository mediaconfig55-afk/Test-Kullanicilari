document.addEventListener('DOMContentLoaded', () => {
    // CollectAPI Token (Kullanıcı kendi anahtarını buraya koymalı)
    // Örnek: 'apikey 1xxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxx'
    const API_KEY = 'apikey 6ZfFqTRDcJdBHr5I8KZ6Sz:5BHpzMCWqqqIG7pDzNhojz';

    const cityInput = document.getElementById('cityInput');
    const districtInput = document.getElementById('districtInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const statusMessage = document.getElementById('statusMessage');
    const apiKeyWarning = document.getElementById('apiKeyWarning');

    // Eğer token değiştirilmemişse kullanıcıyı uyar
    if (API_KEY === 'apikey your_token') {
        apiKeyWarning.classList.remove('hidden');
    }

    // Arama İşlemi
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        const district = districtInput.value.trim();

        if (!city || !district) {
            showStatus("Lütfen il ve ilçe alanlarını doldurun.", true);
            return;
        }

        fetchPharmacies(city, district);
    });

    // Enter tuşu ile arama
    districtInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBtn.click();
    });
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') districtInput.focus();
    });

    async function fetchPharmacies(city, district) {
        // Form verilerini temizle
        resultsContainer.innerHTML = '';
        showStatus('<i class="fa-solid fa-circle-notch fa-spin"></i> Eczaneler aranıyor...', false);

        try {
            const url = `https://api.collectapi.com/health/dutyPharmacy?il=${encodeURIComponent(city)}&ilce=${encodeURIComponent(district)}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'authorization': API_KEY
                }
            });

            const data = await response.json();

            if (!data.success) {
                // CollectAPI hata dönerse (örn API KEY hatası)
                showStatus(`Hata: ${data.message || 'Veriler alınamadı. Lütfen API yetkinizi kontrol edin.'}`, true);
                return;
            }

            const pharmacies = data.result;

            if (!pharmacies || pharmacies.length === 0) {
                showStatus(`${city} - ${district} bölgesinde nöbetçi eczane bulunamadı.`, false);
                return;
            }

            // Başarılı, durum mesajını gizle ve listele
            statusMessage.classList.add('hidden');
            renderPharmacies(pharmacies);

        } catch (error) {
            console.error("Fetch Hatası: ", error);
            showStatus('Bağlantı hatası oluştu. Lütfen konsolu kontrol edin veya API Key bilginizin doğru formatta ("apikey YOUR_TOKEN") olduğundan emin olun.', true);
        }
    }

    function renderPharmacies(pharmacies) {
        pharmacies.forEach(pharmacy => {
            const card = document.createElement('div');
            card.className = 'pharmacy-card fade-in-up';

            card.innerHTML = `
                <div class="ph-header">
                    <div class="ph-name">${pharmacy.name}</div>
                </div>
                <div class="ph-address">${pharmacy.address} ${pharmacy.dist || ''}</div>
                <div class="ph-footer">
                    <a href="tel:${pharmacy.phone}" class="ph-phone">
                        <i class="fa-solid fa-phone"></i> ${pharmacy.phone}
                    </a>
                    ${pharmacy.loc ? `
                        <a href="https://www.google.com/maps/search/?api=1&query=${pharmacy.loc}" target="_blank" class="ph-map">
                            <i class="fa-solid fa-location-arrow"></i> Haritada Gör
                        </a>
                    ` : ''}
                </div>
            `;

            resultsContainer.appendChild(card);
        });
    }

    function showStatus(text, isError) {
        statusMessage.innerHTML = text;
        statusMessage.style.color = isError ? '#e11d48' : '#64748b';
        statusMessage.classList.remove('hidden');
    }

    // Uygulama açılışında Ankara Yenimahalle'yi otomatik getir
    if (API_KEY !== 'apikey your_token') {
        fetchPharmacies(cityInput.value, districtInput.value);
    }
});
