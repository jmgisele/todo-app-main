////////////Global vars /////////////

//"getter" functions so it re-counts from the DOM every time 
//since new todos can be added
let todoAllInputs = () => document.querySelectorAll(".checkbox-container input");
let todoCheckedInputs = () => document.querySelectorAll(".checkbox-container input:checked");
let todoUncheckedInputs = () => document.querySelectorAll(".checkbox-container input:not(:checked)");

//these don't change, no need to recompute
const todoInput = document.querySelector("#input-text");
const todoBox = document.querySelector("#todo-list-box");
const submitForm = document.querySelector("#input-text-form");

//for local storage
let db;
let id; //for keeping track of todos by id/key more easily

//////////On Load Events////////

window.onload = () => {
    //create and seed database
    createDB();

    //calcs items left unchecked
    itemsLeft();

    //when form is submitted, content is added to DB
    submitForm.onsubmit = addData;
};



//////////// Callbacks ////////////
//creating DB
const createDB = async () => {
    const dbName = 'todos_db';
    const version = 1;

    db = await idb.openDB(dbName, version, {
        upgrade(db, oldVersion, newVersion, transaction) {
            const store = db.createObjectStore('todos');
        }
    });

    //putting initial values in if none are there on load as placeholder
    const initial_items = await db.transaction('todos').objectStore('todos').getAll();
    const initial_keys = await db.transaction('todos').objectStore('todos').getAllKeys();
    id = initial_keys.length > 0 ? Math.max(...initial_keys, 1) + 1 : 1; //making sure we don't duplicate ids
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
            let transaction = db.transaction('todos', 'readwrite');
            let store = await transaction.objectStore('todos');
            let newEntry = { id: id, body: entry, isChecked: false };
            if (entry === "Complete Todo app on Front End Mentor") newEntry = { id: id, body: entry, isChecked: true }; //cute detail
            let placed_val = await store.put(newEntry, id);
            await transaction.done;
            displayNewItem(newEntry);
            id++;
        }
    } else { //refresh!
        for (let item of initial_items) {
            displayNewItem(item);
        }
    }
}

//adds todo to database
let addData = async (e) => {
    e.preventDefault(); //no http thx!
    let newItem = { id: id, body: todoInput.value, isChecked: false };

    let transaction = db.transaction('todos', 'readwrite');
    let store = await transaction.objectStore('todos');
    
    const placed_val = await store.put(newItem, id);
    await transaction.done;
    displayNewItem(newItem);
    e.srcElement[0].value = "";
    id++;
}

//displays new todo at top of list
let displayNewItem = (data) => {
    let value = data.body;
    let thisID = data.id;
    const newItem = document.createElement("label");
    newItem.classList.add("checkbox-container");
    newItem.innerHTML = `${value}
                <input type="checkbox" aria-label="mark item as completed" id="item${thisID}">
                <span class="checkmark"></span>
                <button class="remove" aria-label="remove item" id="removebtn${thisID}" ></button>
        `;
    todoBox.prepend(newItem);


    //add event listeners
    newItem.querySelector('button').addEventListener("click", removeData);
    newItem.addEventListener("change", crossThrough);

    //and re-calc the number of todos not crossed off
    itemsLeft();

    //if you're currently viewing only completed todos, hide todo
    newItem.style.display = completedButton.classList.contains('toggle-selected') ? "none" : "block";

    // and if it's checked (only happens on a reload), display that 
    if (data.isChecked) {
        document.querySelector(`#item${thisID}`).checked = true;
        crossStyling(document.querySelector(`#item${thisID}`));
    }
}


//deletes item from database and removes it from the DOM 
let removeData = async (param) => {
    //if the param is an event (remove button) vs when the param is an input (clear completed button)
    let key = param.target ? parseInt(param.target.id.replace('removebtn', '')) : parseInt(param.id.replace('item', ''));

    const transaction = await db.transaction('todos', 'readwrite');
    const store = await transaction.objectStore('todos');

    await store.delete(key);
    await transaction.done;

    param.target ? param.target.parentElement.remove() : param.parentElement.remove();
    itemsLeft();
}





// display items left in control box
let itemsLeft = () => {
    let itemsLeftText = document.querySelector("#items-left");
    itemsLeftText.innerText = `${todoUncheckedInputs().length} items left`;
}

// when checkbox is checked, update database to reflect + style
let crossThrough = async (e) => {
    let key = parseInt(e.target.id.replace('item', ''));

    const transaction = await db.transaction('todos', 'readwrite');
    const store = await transaction.objectStore('todos');

    const thisEntry = await store.get(key);
    await store.put({ id: key, body: thisEntry.body, isChecked: !thisEntry.isChecked }, key);
    await transaction.done;

    //styling
    crossStyling(e.target);
}


let crossStyling = (input) => {
    if (input.checked) {
        input.parentElement.classList.add("crossed-out");
        input.parentElement.classList.remove("not-crossed");
    } else { //it's unchecked
        input.parentElement.classList.add("not-crossed");
        input.parentElement.classList.remove("crossed-out");
    }
    itemsLeft();
}


///////// Bottom Control Box Functionality /////////

// when clear button is pressed, clear completed
document.querySelector("#clear-completed-button").addEventListener("click", () => {
    todoCheckedInputs().forEach(input =>  removeData(input));
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
    target.classList.add("toggle-selected");
    target.classList.remove("toggle-unselected");
    Array.from(toggleButtons).filter((btn) => btn !== target)
        .forEach((btn) => {
            btn.classList.remove("toggle-selected");
            btn.classList.add("toggle-unselected");
        })
};

// changing views on toggle button click
allButton.addEventListener("click", (e) => {
    toggleButtonStyles(e);
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
        document.querySelector("#color-toggle").src = "images/icon-moon.svg";
    } else {
        toggle = "darkTheme";
        document.querySelector("body").classList.remove("light-theme");
        document.querySelector("#color-toggle").src = "images/icon-sun.svg";
    }
})