import * as tasks from './js/tasks.js'
import * as clock from './js/clock.js'
document.addEventListener('DOMContentLoaded', () => {

    const widgets = document.querySelectorAll('.widget');
    const body = document.querySelector('body');
    const toggleButton = document.getElementById('toggleDrag');
    let dragEnabled = false;

    widgets.forEach(widget => {
        let  isDragging = false;

        //Load widget's position, saved LocalStorage or default
        if (!widget.style.left || !widget.style.top) { //default position
            widget.style.left = '100px';
            widget.style.top = '100px';
        }
        let savedPosition = JSON.parse(localStorage.getItem(widget.id + 'Position')); //localStorage
        if (savedPosition) {
            widget.style.left = `${savedPosition.left}px`;
            widget.style.top = `${savedPosition.top}px`;
        }
        body.style.display = "block" //display after loading widgets positions
        //---------------------------------------------------------


        widget.addEventListener('mousedown', (e) => {
            if (!dragEnabled) return;

            isDragging = true;
            widget.classList.add('bouncing');
            widget.style.cursor = 'grabbing';

            const offsetX = e.clientX - widget.getBoundingClientRect().left;
            const offsetY = e.clientY - widget.getBoundingClientRect().top;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);


            function onMouseMove(event) {
                if (!isDragging) return;

                let left = event.clientX - offsetX;
                let top = event.clientY - offsetY;

                if (left < 0) left = 0;
                if (top < 0) top = 0;

                if (left + widget.offsetWidth > window.innerWidth) 
                    left = window.innerWidth - widget.offsetWidth;
                if (top + widget.offsetHeight > window.innerHeight) 
                    top = window.innerHeight - widget.offsetHeight;

                widget.style.left = `${left}px`;
                widget.style.top = `${top}px`;
            }

            function onMouseUp() {
                isDragging = false;
                widget.classList.remove('bouncing');
                widget.style.cursor = 'pointer';

                // Save the widget's position in localStorage
                const position = {
                    left: widget.getBoundingClientRect().left,
                    top: widget.getBoundingClientRect().top
                };
                localStorage.setItem(widget.id + 'Position', JSON.stringify(position));

                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        });

        widget.addEventListener('click', (e) => { //stops interaction with widgest while dragging
            if (dragEnabled) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });

    //toggle drag button
    toggleButton.addEventListener('click', () => {
        dragEnabled = !dragEnabled;
        toggleButton.textContent = dragEnabled ? "Enabled" : "Disabled";
        widgets.forEach(widget => {
            widget.style.cursor = dragEnabled ? 'grab' : 'default';
            widget.classList.remove('bouncing');
        });
    });

    // Disable other functionalities if dragging is enabled
    document.addEventListener('click', (e) => {
        if (dragEnabled && !e.target.classList.contains('drag')) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    // Tasks
    tasks.getRandom_Task_Message();

    document.getElementById('task-input').onkeydown = function(e) {
        if (!dragEnabled && (e.key === 'Enter' || e.keyCode === 13)) {
            tasks.addNewTask();
        }
    };

    document.querySelector(".addBtn").addEventListener("click", () => {
        if (!dragEnabled) {
            tasks.addNewTask();
        }
    });

    document.querySelector(".tasks ul").addEventListener("click", (event) => {
        if (!dragEnabled) {
            tasks.CheckmarkDelete(event);
        }
    });


    // Clock 
    const clockElement = document.querySelector('.clock');
    setInterval(() => clock.updateClock(clockElement), 1000);
    clock.updateClock(clockElement);
});