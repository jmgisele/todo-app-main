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
    //calcs items left unchecked
    itemsLeft();

    //create and seed database
    createDB();

    //when form is submitted, content is added to DB
    submitForm.onsubmit = addData;
};



//////////// Callbacks ////////////
let createDB = async () => {
    //creating DB
    const dbName = 'todos_db';
    const storeName = 'todos';
    const version = 1;

    db = await idb.openDB(dbName, version, {
        upgrade(db, oldVersion, newVersion, transaction) {
            const store = db.createObjectStore(storeName, { autoIncrement: true })
        }
    });

    //putting initial values in if none are there on load as placeholder
    const initial_items = await db.transaction(storeName).objectStore(storeName).getAll();
    console.log(initial_items)
    if (initial_items.length === 0) { //initial seed
        let initial_todos = [
            "Complete online Javascript course",
            "Jog around the park 3x",
            "Ten minutes meditation",
            "Read for 1 hour",
            "Pick up groceries",
            "Complete Todo app on Front End Mentor"
        ]
        for (let entry of initial_todos) {
            let transaction = db.transaction('todos', 'readwrite')
            let store = await transaction.objectStore('todos')
            let newEntry = { body: entry, isChecked: false };
            let placed_val = await store.put(newEntry);

            await transaction.done
        }
    } else { //refresh!
        for (let item of initial_items) {
            displayNewItem(item)
        }
    }
}

//adds todo to database
let addData = async (e) => {
    e.preventDefault(); //no http thx!
    let newItem = { body: todoInput.value, isChecked: false };

    let transaction = db.transaction('todos', 'readwrite');
    let store = await transaction.objectStore('todos');

    const placed_val = await store.put(newItem);
    await transaction.done;
    displayNewItem(newItem);
    e.originalTarget[0].value = ""
}

//deletes item from database and removes it from the DOM 
function removeData(e) {
}

//displays new todo at top of list
let displayNewItem = (data) => {
    let value = data.body;
    const newItem = document.createElement("label");
    newItem.classList.add("checkbox-container");
    newItem.innerHTML = `${value}
                <input type="checkbox" aria-label="mark item as completed">
                <span class="checkmark"></span>
                <button class="remove" aria-label="remove item" ></button>
        `;
    todoBox.prepend(newItem);

    //add event listeners
    newItem.querySelector('button').addEventListener("click", async (e) => {
        console.log(e.target)
        // const db = await openDB('todos_db', 1)

        let transaction = db.transaction('todos', 'readwrite');
        const store = await transaction.objectStore('todos')

        const key = 1
        await store.delete(key)
        await transaction.done

    });
    // newItem.addEventListener("change", crossThrough);

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

