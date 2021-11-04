# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Add new todos to the list
- Mark todos as complete
- Delete todos from the list
- Filter by all/active/complete todos
- Clear all completed todos
- Toggle light and dark mode
- **Bonus**: Drag and drop to reorder items on the list

### Screenshot

![screenshot](./desktop.png)
![screenshot](./mobile.png)

### Links

- [Solution URL](https://github.com/jmgisele/todo-app-main)
- [Live Site URL](https://jmgisele.github.io/todo-app-main/)

## My process

### Built with

- Flexbox
- Mobile-first workflow
- Sortable.js

### What I learned
First time designing an app where I needed getters to access arrays/nodelists that might change (eg, all the todo list items, since adding/removing items would not automatically update the reference of a const in JS.) The custom CSS hover+checkbox took a long time, but I have a much better handle on pseudoselectors now that I did it!
### Useful resources

- [abhik-b's solution](https://github.com/abhik-b/frontend-challenge-3) - was very helpful in figuring out Sortable.js, which I'd never used before!
- [Here is SortableJS](https://sortablejs.github.io/Sortable/), which is what I used to create the drag-and-drop functionality.

## Author

- Github - [@jmgisele](https://github.com/jmgisele)
- Frontend Mentor - [@jmgisele](https://www.frontendmentor.io/profile/jmgisele)