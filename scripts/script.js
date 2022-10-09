const form = document.getElementById('form');
const message = document.getElementById('message');
const searchInput = document.getElementById('searchInput');
const list = document.getElementById('list');
const deleteButton = document.createElement('button');
const deleteIcon = document.createElement('img');
let inputValue;
let markup;
const apiKey = '818a8035fcf142c168c15d0f1d89529a';


async function getFetchRequest() {
    inputValue = searchInput.value;
    if (!inputValue) {
        message.textContent = "Name of the city cannot be an empty string!";
        return;
    }
    if (!isNaN(inputValue)) {
        message.textContent = "Name of the city cannot be a number!";
        return;
    }

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&units=metric`);
    const data = await handelError(response);
    console.log(data);
    return data;
}

function handelError(response) {
    if (!response.ok) {
        message.textContent = "Please search for valid city";
        return;
    }
    return response.json();
}

function addCity(data) {
    const { main, name, sys, weather } = data;
    const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;
    li = document.createElement("li");
    li.classList.add("city");
    markup = `
            <h2 class="city-name" data-name="${name},${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup>
            </div>
            <figure>
            <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
            <figcaption>${weather[0]["description"]}</figcaption>
            </figure>`;
    li.innerHTML = markup;
    list.appendChild(li);
}

function clearForm() {
    setTimeout(() => {
        message.textContent = '';
    }, 4000);
    form.reset();
    searchInput.focus();
}

async function checkDublicats() {
    let data = await getFetchRequest();
    if (!data) return;
    const cityNames = list.querySelectorAll(' .city-name span');
    const cityNamesArr = Array.from(cityNames);
    let result = cityNamesArr.map(name => name.innerHTML);
    if (result.includes(data.name)) {
        message.textContent = `You already know the weather for city ${data.name}`;
        return;
    } else {
        addCity(data);
    }
}

form.addEventListener("submit", event => {
    event.preventDefault();
    checkDublicats();
    clearForm();
});


//** Find a way to get li */

// list.addEventListener('click', event => {
//     let target = event.target;
//     const li = document.querySelector('.city');
//     console.log(li);

//     if (target !== li) return;

//     li.classList.toggle('rotate');
//     if (li.classList.contains('rotate')) {
//         deleteIcon.src = './images/trash-bin.png';
//         deleteButton.classList.add('delete-btn');
//         deleteButton.append(deleteIcon);
//         li.innerHTML = '';
//         li.append(deleteButton);
//     } else {
//         setTimeout(() => {
//             li.innerHTML = markup;
//         }, 500);

//     }
// });

// deleteButton.addEventListener('click', event => { });