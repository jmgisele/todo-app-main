////////////Global vars /////////////

//functions so it re-counts every time 
//since new todos can be added
let todoContainers = () => document.querySelectorAll(".checkbox-container");
let todoAllInputs = () => document.querySelectorAll(".checkbox-container input");
let todoCheckedInputs = () => document.querySelectorAll(".checkbox-container input:checked");
let todoUncheckedInputs = () => document.querySelectorAll(".checkbox-container input:not(:checked)");
let removeButtonsList = () => document.querySelectorAll(".remove");

//these don't change, no need to recompute
const todoInput = document.querySelector("#input-text");
const todoBox = document.querySelector("#todo-list-box");
const submitForm = document.querySelector("#input-text-form")

//for local storage
let db;

//////////On Load Events////////

window.onload = () => {
    //when window reloads, make sure all the "checked" inputs remain crossed through
    todoCheckedInputs().forEach(input => {
        input.parentElement.style.textDecoration = "line-through";
        input.parentElement.style.color = "hsl(234, 11%, 52%)";
        itemsLeft();
    });

    //calcs items left unchecked
    itemsLeft();


    //adding event handlers 
    removeButtonsList().forEach((button) =>
        button.addEventListener("click", (e) => {
            e.target.parentElement.remove()
            itemsLeft()
        }))

    todoAllInputs().forEach(input => input.addEventListener("change", crossThrough));

    todoInput.addEventListener("keyup", (e) => {
        if ((e.key === "Enter" || e.keyCode === 13) && e.target.value.length > 0) {
            newCheckboxTodo(e.target.value);
            todoInput.value = "";
        }
    });




    //creating + opening client side database
    let request = indexedDB.open('todo_db', 1)
    request.onerror = () => console.log('Database failed to open');
    request.onsuccess = () => {
        console.log('Database open!')
        db = request.result;
    }

    //if this is the first time page has been loaded
    //or database needs upgrade, initialize + re-seed
    request.onupgradeneeded = (e) => {
        let db = e.target.result;

        //creating objectStore 
        let objectStore = db.createObjectStore('todos_os', { keyPath: 'id', autoIncrement: true });

        //schema
        objectStore.createIndex('body', 'body', { unique: false });
        objectStore.createIndex('isChecked', 'isChecked', { unique: false });

        console.log('Database has been made!')

        //populating with initial values 
        let initial_todos = [
            "Complete online Javascript course",
            "Jog around the park 3x",
            "Ten minutes meditation",
            "Read for 1 hour",
            "Pick up groceries",
            "Complete Todo app on Front End Mentor"
        ]
        // for (let entry of initial_todos) {
        //     let newItem = { body: entry, isChecked: false };
        //     let transaction = db.transaction(['todos_os'], 'readwrite');
        //     let objectStore = transaction.objectStore('todos_os');
        //     let request = objectStore.add(newItem);
        //     request.onsuccess = () => console.log('added item')
        //     transaction.oncomplete = () => {
        //         displayNewItem(newItem);
        //     };
        // }


    }

    //writing to client side database for initial view

    //when form is submitted, content is added to DB
    submitForm.onsubmit = addData;

};



//////////// Callbacks ////////////


let addData = (e) => {
    e.preventDefault(); //no http thx!

    let newItem = { body: todoInput.value, isChecked: false };

    let transaction = db.transaction(['todos_os'], 'readwrite');
    let objectStore = transaction.objectStore('todos_os');
    let request = objectStore.add(newItem);
    request.onsuccess = () => { todoInput.value = ''; }; //clear form

    transaction.oncomplete = () => {
        console.log('Transaction completed: database modification finished.');
        displayNewItem(newItem);
    };

    transaction.onerror = () => { console.log('Transaction not opened due to error'); };
}

//would be more performant to batch initial DOM updates
//but this is a literal todo list app with 6 initial items
//so this is used for initial render + subsequent updates both

let idNumber = todoAllInputs().length; //is always incremented by one so todo items have unique ids
let displayNewItem = (data) => {
    let value = data.body;
    const newItem = document.createElement("label");
    newItem.classList.add("checkbox-container");
    idNumber++;
    newItem.id = `item${idNumber}`
    newItem.innerHTML = `${value}
                <input type="checkbox" aria-label="mark item ${idNumber} as completed" >
                <span class="checkmark"></span>
                <button class="remove" aria-label="remove item ${idNumber}" ></button>
        `;
    todoBox.prepend(newItem);

    //add event listeners
    newItem.querySelector('button').addEventListener("click", function (e) {
        e.target.parentElement.remove();
        itemsLeft();
    });
    newItem.addEventListener("change", crossThrough);

    //and re-calc the number of todos not crossed off
    itemsLeft();

    //if you're currently viewing only completed todos, hide todo
    newItem.style.display = completedButton.classList.contains('toggle-selected') ? "none" : "block";
}

























// display items left in control box
let itemsLeft = () => {
    let itemsLeftText = document.querySelector("#items-left");
    itemsLeftText.innerText = `${todoUncheckedInputs().length} items left`
}

// when checkbox is checked, crossthrough text and change its color
let crossThrough = (e) => {
    input = e.target
    if (input.checked) {
        input.parentElement.style.textDecoration = "line-through";
        input.parentElement.style.color = "hsl(234, 11%, 52%)";
        itemsLeft();
    } else { //it's unchecked
        input.parentElement.style.textDecoration = "none";
        input.parentElement.style.color = "var(--foreground)";
        itemsLeft();
    }

}



///////// Bottom Control Box Functionality /////////

// when clear button is pressed, clear completed
document.querySelector("#clear-completed-button").addEventListener("click", () => {
    todoCheckedInputs().forEach(input => {
        input.parentElement.remove();
    })
    itemsLeft(); //shouldn't change - fallback
})


// when a view toggle button is pressed, unpress the other two, change color
const toggleButtons = document.querySelectorAll(".toggle-view-button");
const allButton = toggleButtons[0];
const activeButton = toggleButtons[1];
const completedButton = toggleButtons[2];

//toggles the correct styles
function toggleButtonStyles(e) {
    let target = e.target;
    target.classList.add("toggle-selected")
    target.classList.remove("toggle-unselected")
    Array.from(toggleButtons).filter((btn) => btn !== target)
        .forEach((btn) => {
            btn.classList.remove("toggle-selected")
            btn.classList.add("toggle-unselected")
        })
};

// changing views on toggle button click
allButton.addEventListener("click", (e) => {
    toggleButtonStyles(e)
    todoAllInputs().forEach(input => {
        input.parentElement.style.display = "block";
    });
});
activeButton.addEventListener("click", (e) => {
    toggleButtonStyles(e)
    todoAllInputs().forEach((input) => {
        input.parentElement.style.display = input.checked ? "none" : "block";
    })
});
completedButton.addEventListener("click", (e) => {
    toggleButtonStyles(e)
    todoAllInputs().forEach((input) => {
        input.parentElement.style.display = input.checked ? "block" : "none";
    })
});



/////// Misc Functionality ////////

// when a box is dragged, reorder list
new Sortable(todoBox, {
    animation: 150,
    ghostClass: 'blue-background-class'
});

//toggle the color scheme
let toggle = "darkTheme";
document.querySelector("#color-toggle").addEventListener("click", () => {
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

