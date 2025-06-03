(function() {
    'use strict';
    
    // Prevent multiple initializations
    if (window.fontSizeControlLoaded) return;
    window.fontSizeControlLoaded = true;

    // CSS Styles
    const css = `
        .font-size-controls {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            text-align: center;
            z-index: 9999;
            font-family: Arial, sans-serif;
        }

        .font-size-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            background: #ddd;
            border-radius: 5px;
            outline: none;
            margin: 10px 0;
        }

        .font-size-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            background: #007bff;
            border-radius: 50%;
            cursor: pointer;
        }

        .font-size-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #007bff;
            border-radius: 50%;
            cursor: pointer;
            border: none;
        }

        .font-size-label {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin: 0;
        }

        @media (min-width: 768px) {
            .font-size-controls {
                left: auto;
                right: 20px;
                width: 300px;
            }
        }
    `;

    // HTML Structure
    const html = `
        <div class="font-size-controls">
            <label class="font-size-label">Font Size: <span id="fontSizeDisplay">16px</span></label>
            <input type="range" min="12" max="24" value="16" class="font-size-slider" id="fontSizeSlider">
        </div>
    `;

    // Initialize the font size control
    function init() {
        // Inject CSS
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        // Inject HTML
        const controlsDiv = document.createElement('div');
        controlsDiv.innerHTML = html;
        document.body.appendChild(controlsDiv);

        // Add JavaScript functionality
        const slider = document.getElementById('fontSizeSlider');
        const sizeDisplay = document.getElementById('fontSizeDisplay');
        const body = document.body;

        // Get initial font size or set default
        const initialSize = window.getComputedStyle(body).fontSize;
        const initialValue = parseInt(initialSize) || 16;
        slider.value = Math.min(Math.max(initialValue, 12), 24);
        sizeDisplay.textContent = slider.value + 'px';

        // Handle slider changes
        slider.addEventListener('input', function() {
            const size = this.value + 'px';
            body.style.fontSize = size;
            sizeDisplay.textContent = size;
        });

        // Handle touch events for better mobile experience
        slider.addEventListener('touchstart', function() {
            this.style.transform = 'scale(1.02)';
        });

        slider.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
