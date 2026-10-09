/* =========================================================
   KEYPAD & PASSCODE LOGIC
   ========================================================= */
let currentInput = "";
const correctPin = "10102009"; // Password: 10/10/2009

function pressKey(val) {
    if (currentInput.length < 8) {
        currentInput += val;
        updateDisplay();
    }
}

function clearKey() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    const display = document.getElementById("passDisplay");
    const errorMsg = document.getElementById("errorMsg");
    if (errorMsg) errorMsg.classList.add("display-none");

    if (currentInput.length === 0) {
        display.innerHTML = `<span class="placeholder-text">DD / MM / YYYY</span>`;
        return;
    }

    let formatted = "";
    for (let i = 0; i < currentInput.length; i++) {
        if (i === 2 || i === 4) {
            formatted += " / ";
        }
        formatted += currentInput[i];
    }
    display.innerText = formatted;
}

function checkPassword() {
    if (currentInput === correctPin) {
        triggerConfetti();
        const modalEl = document.getElementById('unlockModal');
        if (modalEl) {
            const unlockModal = new bootstrap.Modal(modalEl);
            unlockModal.show();
        }
    } else {
        const errorMsg = document.getElementById("errorMsg");
        if (errorMsg) errorMsg.classList.remove("display-none");
        currentInput = "";
        setTimeout(updateDisplay, 1000);
    }
}

function triggerConfetti() {
    if (typeof confetti === "function") {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }
}

/* =========================================================
   CELEBRATE NOW: SLOW CURTAIN + SEQUENTIAL TIMELINE
   ========================================================= */
function startGrandCelebration() {
    const modalEl = document.getElementById('unlockModal');
    if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();
    }

    const passcodePage = document.getElementById("passcodePage");
    const celebPage = document.getElementById("celebrationPage");
    
    if (passcodePage) passcodePage.classList.add("display-none");
    if (celebPage) celebPage.classList.remove("display-none");

    const curtainWrapper = document.getElementById("curtainWrapper");

    if (curtainWrapper) {
        curtainWrapper.classList.add("open");
    }

    runVideoTimeline();
}

function runVideoTimeline() {
    const stepTarget = document.getElementById("stepTarget");
    const stepBanner = document.getElementById("stepBanner");
    const stepTree = document.getElementById("stepTree");
    const nextBtn = document.getElementById("nextMatrixBtn");

    if (stepTarget) {
        stepTarget.classList.remove("hidden-frame");
        stepTarget.classList.add("active-frame");
    }
    if (stepBanner) {
        stepBanner.classList.remove("active-frame");
        stepBanner.classList.add("hidden-frame");
    }
    if (stepTree) {
        stepTree.classList.remove("active-frame");
        stepTree.classList.add("hidden-frame");
    }

    // Step 1 -> Step 2 after 3 Seconds
    setTimeout(() => {
        if (stepTarget) {
            stepTarget.classList.remove("active-frame");
            stepTarget.classList.add("hidden-frame");
        }
        if (stepBanner) {
            stepBanner.classList.remove("hidden-frame");
            stepBanner.classList.add("active-frame");
        }
    }, 3000);

    // Step 2 -> Step 3 (Tree Bloom) after 6 Seconds Total
    setTimeout(() => {
        if (stepBanner) {
            stepBanner.classList.remove("active-frame");
            stepBanner.classList.add("hidden-frame");
        }
        if (stepTree) {
            stepTree.classList.remove("hidden-frame");
            stepTree.classList.add("active-frame");
        }

        if (typeof confetti === "function") {
            confetti({
                particleCount: 90,
                spread: 100,
                origin: { y: 0.65 },
                colors: ['#ff4d6d', '#ff85a1', '#ffd700']
            });
        }

        setTimeout(() => {
            if (nextBtn) {
                nextBtn.classList.remove("display-none");
                nextBtn.style.display = "block";
            }
        }, 1000);

    }, 6000);
}

/* =========================================================
   SCENE 4: MATRIX TERMINAL & RAIN
   ========================================================= */
let matrixInterval;

function openMatrixScene() {
    const stepTree = document.getElementById("stepTree");
    const stepMatrix = document.getElementById("stepMatrix");
    const nextBtn = document.getElementById("nextMatrixBtn");

    if (nextBtn) nextBtn.style.display = "none";
    
    if (stepTree) {
        stepTree.classList.remove("active-frame");
        stepTree.classList.add("hidden-frame");
    }
    
    if (stepMatrix) {
        stepMatrix.classList.remove("hidden-frame");
        stepMatrix.classList.add("active-frame");
    }

    setTimeout(() => {
        startMatrixRain();
        runSparkleSequence();
    }, 50);
}

function startMatrixRain() {
    const canvas = document.getElementById("matrixCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01101001011011000110111101110100❤️💖✨";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    if (matrixInterval) clearInterval(matrixInterval);

    matrixInterval = setInterval(() => {
        ctx.fillStyle = "rgba(5, 1, 10, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ff4d6d";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }, 33);
}

function runSparkleSequence() {
    const display = document.getElementById("matrixDisplay");
    const surpriseBtn = document.getElementById("surpriseBtn");
    if (!display) return;

    const sequence = ["3", "2", "1", "You", "Are", "My", "Love"];
    let index = 0;

    display.innerHTML = "";

    const seqTimer = setInterval(() => {
        if (index < sequence.length) {
            display.innerHTML = sequence[index];
            index++;
        } else {
            clearInterval(seqTimer);
            
            display.innerHTML = `<div class="final-heart-box">💖 I Love You Hurain 💖</div>`;
            
            if (typeof confetti === "function") {
                confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
            }

            if (surpriseBtn) {
                surpriseBtn.classList.remove("display-none");
                surpriseBtn.style.display = "block";
            }
        }
    }, 1000);
}

/* =========================================================
   SCENE 5 & 6 LOGIC (SLOW 6-SEC HOLD, AUDIO, 30-SEC BUBU)
   ========================================================= */
let slideIndex = 0;
let slideInterval = null;
let bubuTimer = null;

function openSurpriseScene() {
    // 1. Hide Matrix Screen
    const stepMatrix = document.getElementById("stepMatrix");
    if (stepMatrix) {
        stepMatrix.classList.remove("active-frame");
        stepMatrix.classList.add("hidden-frame");
        stepMatrix.style.display = "none";
    }

    // 2. Show Surprise Screen
    const stepSurprise = document.getElementById("stepSurprise");
    if (stepSurprise) {
        stepSurprise.classList.remove("hidden-frame");
        stepSurprise.classList.add("active-frame");
        stepSurprise.style.display = "flex";
    }

    // 3. START MUSIC ON SURPRISE BUTTON CLICK
    const surpriseMusic = document.getElementById("surpriseMusic");
    if (surpriseMusic) {
        surpriseMusic.currentTime = 0;
        surpriseMusic.muted = false;

        let playPromise = surpriseMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Surprise music started successfully!");
            }).catch(error => {
                console.log("Direct play blocked, forcing play:", error);
                surpriseMusic.play();
            });
        }
    }

    // 4. Start Slow 6-Second Slideshow Loop
    slideIndex = 0;
    startSlideshow();

    // 5. Trigger Bubu Button EXACTLY 30 Seconds Later
    const bubuBtn = document.getElementById("bubuBtn");
    if (bubuBtn) {
        bubuBtn.classList.add("display-none");
        bubuBtn.style.display = "none";

        if (bubuTimer) clearTimeout(bubuTimer);

        bubuTimer = setTimeout(() => {
            bubuBtn.classList.remove("display-none");
            bubuBtn.style.display = "block";
        }, 30000); // 30 Seconds
    }
}

function startSlideshow() {
    const slides = document.querySelectorAll("#stepSurprise .slide");
    if (!slides.length) return;

    if (slideInterval) clearInterval(slideInterval);

    slides.forEach(slide => slide.classList.remove("active-slide"));
    
    slideIndex = 0;
    slides[0].classList.add("active-slide");

    // EXACT 6 SECONDS HOLD PER SLIDE WITH SLOW MOTION CROSSFADE
    slideInterval = setInterval(() => {
        slides[slideIndex].classList.remove("active-slide");
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add("active-slide");
    }, 6000); // 6 Seconds
}
function openFinalShowcase() {
    const stepSurprise = document.getElementById("stepSurprise");
    if (stepSurprise) {
        stepSurprise.classList.remove("active-frame");
        stepSurprise.classList.add("hidden-frame");
        stepSurprise.style.display = "none";
    }

    if (slideInterval) clearInterval(slideInterval);

    // Stop Surprise Page Song
    const surpriseMusic = document.getElementById("surpriseMusic");
    if (surpriseMusic) surpriseMusic.pause();

    // Show Final Video Scene
    const stepFinal = document.getElementById("stepFinalShowcase");
    if (stepFinal) {
        stepFinal.classList.remove("hidden-frame");
        stepFinal.classList.add("active-frame");
        stepFinal.style.display = "flex";
    }

    // AUTOMATICALLY PLAY FINAL VIDEO
    const finalVideo = document.getElementById("finalBubuVideo");
    if (finalVideo) {
        finalVideo.currentTime = 0;
        let videoPlayPromise = finalVideo.play();
        if (videoPlayPromise !== undefined) {
            videoPlayPromise.then(() => {
                console.log("Final video playing automatically!");
            }).catch(error => {
                console.log("Video autoplay retry:", error);
                finalVideo.play();
            });
        }
    }
}