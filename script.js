const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatDisplay = document.getElementById('chat-display');
const miru = document.getElementById('miru-character');
const mouth = document.getElementById('mouth');

// --- Simulasi Database Respon Tsundere ---
const responses = {
    "halo": ["Hmph! Halo juga. T-tapi jangan pikir aku senang ya!", "Apa liat-liat?! Oh, cuma mau menyapa..."],
    "siapa kamu": ["Aku Miru-chan! AI paling pintar yang pernah ada. Jangan lupakan itu, baka!"],
    "cantik": ["B-baka! Jangan bicara sembarangan! *blush*", "Sudah tahu! Tidak perlu diingatkan!"],
    "default": ["Aku tidak mengerti maksudmu, tapi karena aku baik, aku akan mendengarkan...", "Hah? Ngomong apa sih? Coba yang jelas!"]
};

// --- Fungsi Utama ---
function getResponse(text) {
    text = text.toLowerCase();
    if (text.includes("halo")) return { text: responses["halo"][Math.floor(Math.random()*2)], mood: "normal" };
    if (text.includes("siapa")) return { text: responses["siapa kamu"][0], mood: "jutek" };
    if (text.includes("cantik") || text.includes("sayang")) return { text: responses["cantik"][0], mood: "shy" };
    return { text: responses["default"][0], mood: "jutek" };
}

function updateMood(mood) {
    miru.className = "miru-head " + mood;
    setTimeout(() => { miru.className = "miru-head normal"; }, 3000);
}

function typeWriter(text, element) {
    let i = 0;
    element.innerHTML = "";
    miru.classList.add('talking');
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 50);
        } else {
            miru.classList.remove('talking');
        }
    }
    type();
}

async function handleChat() {
    const text = userInput.value;
    if (!text) return;

    // Tambah chat user
    const userDiv = document.createElement('div');
    userDiv.className = "message user-msg";
    userDiv.innerText = text;
    chatDisplay.appendChild(userDiv);
    userInput.value = "";

    // Loading Miru
    const miruDiv = document.createElement('div');
    miruDiv.className = "message miru-msg";
    miruDiv.innerText = "Miru sedang berpikir...";
    chatDisplay.appendChild(miruDiv);

    // Simulasi Delay AI
    setTimeout(() => {
        const res = getResponse(text);
        updateMood(res.mood);
        typeWriter(res.text, miruDiv);
    }, 1000);
}

// --- Kamera API ---
const btnCam = document.getElementById('btn-camera');
const video = document.getElementById('webcam');

btnCam.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = 'block';
        btnCam.innerText = "Kamera Aktif!";
        
        // Respon Miru saat kamera aktif
        updateMood("shy");
        const camDiv = document.createElement('div');
        camDiv.className = "message miru-msg";
        chatDisplay.appendChild(camDiv);
        typeWriter("N-ngapain liatin aku lewat kamera?! Dasar aneh!", camDiv);
        
    } catch (err) {
        alert("Gagal akses kamera: " + err);
    }
});

// Events
sendBtn.addEventListener('click', handleChat);
userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleChat(); });
