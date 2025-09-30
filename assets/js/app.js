const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const moodInput = document.getElementById('mood-input');
const applyBtn = document.getElementById('apply-btn');
const resetBtn = document.getElementById('reset-btn');

let currentEffect = 'normal';

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
        video.srcObject = stream;
        video.addEventListener('play', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            drawFrame();
        });
    });

applyBtn.addEventListener('click', () => {
    const mood = moodInput.value.toLowerCase().trim();
    switch(mood) {
        case 'angry':
            currentEffect = 'red-glitch';
            break;
        case 'calm':
            currentEffect = 'blue-blur';
            break;
        case 'funny':
            currentEffect = 'rgb-split';
            break;
        case 'pixel':
            currentEffect = 'pixelate';
            break;
        default:
            currentEffect = 'normal';
    }
});

resetBtn.addEventListener('click', () => {
    currentEffect = 'normal';
    moodInput.value = '';
});

function drawFrame() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    switch(currentEffect) {
        case 'red-glitch':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = data[i] + 50;
            }
            break;
        case 'blue-blur':
            ctx.globalAlpha = 0.6;
            ctx.filter = 'blur(8px)';
            break;
        case 'rgb-split':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = data[i+0];     // R
                data[i+1] = data[i+2];   // G
                data[i+2] = data[i+1];   // B
            }
            break;
        case 'pixelate':
            let size = 10;
            for (let y = 0; y < canvas.height; y += size) {
                for (let x = 0; x < canvas.width; x += size) {
                    let px = ctx.getImageData(x, y, 1, 1).data;
                    ctx.fillStyle = `rgb(${px[0]},${px[1]},${px[2]})`;
                    ctx.fillRect(x, y, size, size);
                }
            }
            break;
        default:
            ctx.globalAlpha = 1;
            ctx.filter = 'none';
    }

    if(currentEffect === 'red-glitch' || currentEffect === 'rgb-split') {
        ctx.putImageData(imageData, 0, 0);
    }

    requestAnimationFrame(drawFrame);
}