const form = document.getElementById('controlsForm');
const message = document.getElementById('message');
const searchInput = document.getElementById('searchInput');
const list = document.getElementById('list');
const li = document.createElement("li");
const deleteButton = document.createElement('button');
const deleteIcon = document.createElement('img');

let markup;
const apiKey = '818a8035fcf142c168c15d0f1d89529a';



async function getFetchRequest(url) {
    const response = await fetch(url);
    return await response.json();
}

form.addEventListener("submit", event => {
    event.preventDefault();
    const inputValue = searchInput.value;
    getFetchRequest(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&units=metric`)
        .then(data => {
            console.log(data);
            const { main, name, sys, weather } = data;
            const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;
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
        })
        .catch(() => {
            message.textContent = "Please search for valid city";
        });
    message.textContent = '';
    form.reset();
    searchInput.focus();
});


list.addEventListener('click', event => {
    let target = event.target;

    if (target !== li) return;

    li.classList.toggle('rotate');
    if (li.classList.contains('rotate')) {
        deleteIcon.src = './images/trash-bin.png';
        deleteButton.classList.add('delete-btn');
        deleteButton.append(deleteIcon);
        li.innerHTML = '';
        li.append(deleteButton);
    } else {
        setTimeout(() => {
            li.innerHTML = markup;
        }, 500);

    }
});

// deleteButton.addEventListener('click', event => { });