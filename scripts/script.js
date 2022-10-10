const form = document.getElementById('form');
const message = document.getElementById('message');
const searchInput = document.getElementById('searchInput');
const list = document.getElementById('list');
const deleteButton = document.createElement('button');
const deleteIcon = document.createElement('img');
let inputValue;
let markup;
let LS = localStorage;
let citiesArr = [];
const apiKey = '818a8035fcf142c168c15d0f1d89529a';


async function getFetchData() {
    inputValue = searchInput.value;

    if (!validateInput(inputValue)) return;

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&units=metric`);
    const data = await handleResponseError(response);
    if (!data) return;

    const { main, name, sys, weather } = data;
    const cityObj = {
        name,
        country: sys.country,
        temperature: Math.round(main.temp),
        weather: weather[0]
    };

    console.log(cityObj);
    return cityObj;
}

function validateInput(value) {
    if (!value) {
        message.textContent = "Name of the city cannot be an empty string!";
        return;
    }
    if (!isNaN(value)) {
        message.textContent = "Name of the city cannot be a number!";
        return;
    }
    return value;
}

function handleResponseError(response) {
    if (!response.ok) {
        message.textContent = "Please search for valid city";
        return;
    }
    return response.json();
}

function addCityToLS(data) {
    if (!data) return;
    citiesArr = JSON.parse(LS.getItem('Cities'));
    if (citiesArr === null) citiesArr = [];
    LS.setItem('city', JSON.stringify(data));
    citiesArr.push(data);
    LS.setItem('Cities', JSON.stringify(citiesArr));
}

function addCity(data) {
    const icon = `https://openweathermap.org/img/wn/${data.weather["icon"]}@2x.png`;
    li = document.createElement("li");
    li.classList.add("city");
    markup = `
            <h2 class="city-name">
            <span>${data.name}</span>
            <sup>${data.country}</sup>
            </h2>
            <div class="city-temp">${data.temperature}<sup>°C</sup>
            </div>
            <figure>
            <img class="city-icon" src=${icon} alt=${data.weather.main}>
            <figcaption>${data.weather.description}</figcaption>
            </figure>`;
    li.innerHTML = markup;
    list.appendChild(li);
    addCityToLS(data);
}

function clearForm() {
    setTimeout(() => {
        message.textContent = '';
    }, 4000);
    form.reset();
    searchInput.focus();
}

async function checkDublicates() {
    let data = await getFetchData();
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
    checkDublicates();
    clearForm();
});

list.addEventListener('click', event => {
    const target = event.target;
    if (target.classList.contains('city')) {
        target.classList.toggle('rotate');
        if (target.classList.contains('rotate')) {
            setTimeout(() => {
                deleteIcon.src = './images/trash-bin.png';
                deleteButton.classList.add('delete-btn');
                deleteButton.append(deleteIcon);
                target.innerHTML = '';
                target.append(deleteButton);
            }, 380);
        } else {
            setTimeout(() => {
                event.target.innerHTML = markup;
            }, 380);
        }
    }
});

// deleteButton.addEventListener('click', () => {
//     const cities = document.querySelectorAll('.city');
//     const citiesArr = Array.from(cities);
//     console.log(citiesArr);
//     citiesArr.forEach(city => {
//         if (city.classList.contains('rotate')) {
//             city.remove();
//         }
//     });
// });