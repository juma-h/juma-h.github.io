document.addEventListener('DOMContentLoaded', function () {
    const texts = ["Error 404", "Hi there, I am Michelle Juma", "Creative . Efficient . Ever learning."];
    let textIndex = 0;
    let index = 0;
    const logoElement = document.getElementById('logo');
    const cursorElement = document.getElementById('cursor');

    function type() {
        const currentText = texts[textIndex];
        logoElement.textContent = currentText.slice(0, index);

        // Show blinking cursor after each word
        if (index === currentText.length) {
            cursorBlink();
        } else {
            index++;
            setTimeout(type, 100);
        }
    }

    function cursorBlink() {
        cursorElement.style.display = 'inline';

        setTimeout(function () {
            cursorElement.style.display = 'none';
            setTimeout(backspace, 500); // Delay before starting the backspace animation
        }, 500);
    }

    function backspace() {
        const currentText = texts[textIndex];
        logoElement.textContent = currentText.slice(0, index);

        if (index > 0) {
            index--;
            setTimeout(backspace, 50);
        } else {
            // Move to the next text
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 1000); // Delay before starting the next text
        }
    }

    type();
});