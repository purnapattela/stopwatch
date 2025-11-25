(function() {
    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval;
    let isRunning = false;

    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const millisecondsDisplay = document.getElementById('milliseconds');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const startIcon = startBtn.querySelector('.material-icons-round');
    
    const infoCard = document.getElementById('infoCard');
    const closeInfoBtn = document.getElementById('closeInfoBtn');
    
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const onboardingOverlay = document.getElementById('onboardingOverlay');

    closeInfoBtn.addEventListener('click', () => {
        infoCard.classList.add('hidden');
    });

    // Full Screen Logic
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            fullscreenBtn.querySelector('.material-icons-round').textContent = 'fullscreen_exit';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fullscreenBtn.querySelector('.material-icons-round').textContent = 'fullscreen';
            }
        }
    });

    // Onboarding Logic
    function showOnboarding() {
        onboardingOverlay.classList.remove('hidden');
        document.body.classList.add('onboarding-active');
    }

    function dismissOnboarding() {
        onboardingOverlay.classList.add('hidden');
        document.body.classList.remove('onboarding-active');
        // Optional: Save to localStorage so it doesn't show again
        // localStorage.setItem('onboardingShown', 'true');
    }

    // Initial show (if not hidden by default in HTML, but good to be explicit or check localStorage)
    // Currently HTML has it visible by default, so we just need to add the class on load
    document.body.classList.add('onboarding-active');

    onboardingOverlay.addEventListener('click', dismissOnboarding);
    
    // Also dismiss on any key press
    document.addEventListener('keydown', (e) => {
        if (!onboardingOverlay.classList.contains('hidden')) {
            dismissOnboarding();
        }
        // ... existing keydown logic ...
    });

    function formatTime(time) {
        const date = new Date(time);
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
        return { minutes, seconds, milliseconds };
    }

    function updateDisplay() {
        const { minutes, seconds, milliseconds } = formatTime(elapsedTime);
        minutesDisplay.textContent = minutes;
        secondsDisplay.textContent = seconds;
        millisecondsDisplay.textContent = milliseconds;
    }

    function startTimer() {
        if (!isRunning) {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(() => {
                elapsedTime = Date.now() - startTime;
                updateDisplay();
            }, 10);
            isRunning = true;
            
            // UI Updates
            startBtn.classList.add('running');
            startIcon.textContent = 'pause'; 
            
            // startBtn.style.display = 'none'; // Removed to fix visibility issue
            
            startBtn.disabled = true;
            startBtn.style.opacity = '0'; // Fade out center start button
            startBtn.style.pointerEvents = 'none';
            
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
        }
    }

    function pauseTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            
            // UI Updates
            startBtn.disabled = false;
            startBtn.style.opacity = '1';
            startBtn.style.pointerEvents = 'auto';
            startIcon.textContent = 'play_arrow';
            
            pauseBtn.disabled = true;
        }
    }

    function stopTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        elapsedTime = 0;
        updateDisplay();
        
        // UI Updates
        startBtn.disabled = false;
        startBtn.style.opacity = '1';
        startBtn.style.pointerEvents = 'auto';
        startIcon.textContent = 'play_arrow';
        
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    stopBtn.addEventListener('click', stopTimer);

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
            if (isRunning) {
                stopTimer();
            } else {
                startTimer();
            }
        } else if (e.code === 'Space') {
            e.preventDefault(); // Prevent scrolling
            if (isRunning) {
                pauseTimer();
            } else if (elapsedTime > 0) {
                startTimer(); // Resume
            }
        }
    });
})();
