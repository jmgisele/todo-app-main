//global vars and objects
let todoListItems = {
    //returns object of LABEL CONTAINERS
    get all() {
        return document.querySelectorAll(".checkbox-container");
    },
    //returns object of INPUTS
    get allInputs() {
        return document.querySelectorAll(".checkbox-container input");
    },
    //returns object of INPUTS
    get checked() {
        return document.querySelectorAll(".checkbox-container input:checked");
    },
    //returns object of INPUTS
    get unchecked() {
        return document.querySelectorAll(".checkbox-container input:not(:checked)");
    },

};

const todoInput = document.querySelector("#input-text");
const todoBox = document.querySelector("#todo-list-box");
let checkedInputs;
let thisInput;
const todos = [];
let removeButtonsList = {
    get all() {
        return document.querySelectorAll(".remove");
    }
};

//when window loads, add all the event handlers and calculate necessary values
function onLoad() {
    //when window reloads, make sure all the "checked" inputs remain crossed through
    todoListItems.checked.forEach(input => {
        input.parentElement.style.textDecoration = "line-through";
        input.parentElement.style.color = "hsl(234, 11%, 52%)";
        itemsLeft();
    });
    removeButtons();
    itemsLeft();
    crossthroughText();
}
window.onload = onLoad();

// When the checkbox is checked, crossthrough text and change its color
function crossthroughText() {
    todoListItems.allInputs.forEach(input => {
        input.addEventListener("change", function () {
            checkedInputs = Array.from(todoListItems.checked);
            if (checkedInputs.includes(input) == true) {
                //it's checked
                input.parentElement.style.textDecoration = "line-through";
                input.parentElement.style.color = "hsl(234, 11%, 52%)";
                itemsLeft();
            } else {
                //it's unchecked
                input.parentElement.style.textDecoration = "none";
                input.parentElement.style.color = "var(--foreground)";
                itemsLeft();
            }
        });
    });
}


//When x button is clicked, remove todo 
function removeButtons() {
    for (let i = 0; i < removeButtonsList.all.length; i++) {
        removeButtonsList.all[i].addEventListener("click", function (click) {
            click.target.parentElement.remove();
        });
    }
}



// Display number of todo items unchecked in p #items-left
function itemsLeft() {
    let itemsLeftText = document.querySelector("#items-left");
    itemsLeftText.innerText = `${todoListItems.unchecked.length} items left`
}


// When input text is entered, append a box to the top of the todo-list-box containing its info
//and re-evaluate inputs
todoInput.addEventListener("keyup", function (entry) {
    if ((entry.key === "Enter" || entry.keyCode === 13) && entry.target.value.length > 0) {
        todos.push(entry.target.value);
        newCheckboxTodo(entry.target.value);
        todoInput.value = "";
        crossthroughText();
        removeButtons();
        itemsLeft();
    }
});

let idNumber = todoListItems.all.length;

function newCheckboxTodo(value) {
    const newItem = document.createElement("label");
    newItem.classList.add("checkbox-container");
    // newItem.setAttribute('draggable', true)
    idNumber++;
    newItem.id = `item${idNumber}`
    newItem.innerHTML = `${value}
            <input type="checkbox">
            <span class="checkmark"></span>
            <img class="remove" src="images/icon-cross.svg"></img>
        `;
    todoBox.prepend(newItem);
    removeButtonsList.all[0].addEventListener("click", function (click) {
        click.target.parentElement.remove();
    });
};


// When clear completed is pressed, clear completed
document.querySelector("#clear-completed-button").addEventListener("click", function () {
    todoListItems.checked.forEach(input => {
        input.parentElement.remove();
        itemsLeft();
    })
})


// When a view toggle button is pressed, unpress the other two, change color
const toggleButtons = document.querySelectorAll(".toggle-view-button");
const allButton = toggleButtons[0];
const activeButton = toggleButtons[1];
const completedButton = toggleButtons[2];


for (let i = 0; i < toggleButtons.length; i++) {
    toggleButtons[i].addEventListener("click", toggleButton);
};

function toggleButton() {
    this.value = "on";
    this.style.color = "hsl(220, 98%, 61%)";
    this.addEventListener("mouseenter", function () {
        this.style.color = "hsl(220, 98%, 61%)";
    });
    this.addEventListener("mouseout", function () {
        this.style.color = "hsl(220, 98%, 61%)";
    });
    for (let i = 0; i < toggleButtons.length; i++) {
        if (toggleButtons[i] !== this) {
            toggleButtons[i].value = "off";
            toggleButtons[i].style.color = "hsl(234, 11%, 52%)";
            toggleButtons[i].addEventListener("mouseenter", function () {
                this.style.color = "var(--foreground)";
            });
            toggleButtons[i].addEventListener("mouseout", function () {
                this.style.color = "hsl(234, 11%, 52%)";
            });












        }
    }
};

// and change view
allButton.addEventListener("click", function () {
    todoListItems.allInputs.forEach(input => {
        input.parentElement.style.display = "block";
    });
});
activeButton.addEventListener("click", function () {
    todoListItems.unchecked.forEach(input => {
        input.parentElement.style.display = "block";
    });
    todoListItems.checked.forEach(input => {
        input.parentElement.style.display = "none";
    });
});
completedButton.addEventListener("click", function () {
    todoListItems.unchecked.forEach(input => {
        input.parentElement.style.display = "none";
    });
    todoListItems.checked.forEach(input => {
        input.parentElement.style.display = "block";
    });
});

// When a box is dragged, reorder list
new Sortable(todoBox, {
    animation: 150,
    ghostClass: 'blue-background-class'
});

//toggle the color scheme
let toggle = "darkTheme";
document.querySelector("#color-toggle").addEventListener("click", function () {
    if (toggle == "darkTheme") {
        toggle = "lightTheme";
        document.querySelector("body").classList.add("light-theme");
        document.querySelector("#color-toggle").src = "images/icon-moon.svg"
    } else {
        toggle = "darkTheme";
        document.querySelector("body").classList.remove("light-theme");
        document.querySelector("#color-toggle").src = "images/icon-sun.svg"

    }
})

