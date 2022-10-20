const form = document.getElementById("form");
const message = document.getElementById("message");
const searchInput = document.getElementById("searchInput");
const list = document.getElementById("list");
const deleteButton = document.createElement("button");
const deleteIcon = document.createElement("img");
let LS = localStorage;
let citiesArr = [];
const apiKey = "818a8035fcf142c168c15d0f1d89529a";

async function getFetchData(value) {
  if (!validateInput(value)) return;

  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${apiKey}&units=metric`);
  const data = await handleResponseError(response);
  if (!data) return;

  const { main, name, sys, weather } = data;
  const cityObj = {
    name,
    country: sys.country,
    temperature: Math.round(main.temp),
    weather: weather[0],
  };

  return cityObj;
}

async function getData() {
  const inputValue = searchInput.value;
  const data = await getFetchData(inputValue);
  return data;
}

window.onload = updateData();

function updateData() {
  const citiesArr = JSON.parse(LS.getItem("Cities"));
  if (citiesArr) {
    citiesArr.forEach(async (city) => {
      const data = await getFetchData(city.name);
      citiesArr.length = 0;
      updateLS(data);
      updateDOM(data);
    });
  }
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

function updateLS(data) {
  if (!data) return;
  if (!citiesArr) citiesArr = [];
  citiesArr.push(data);
  LS.setItem("Cities", JSON.stringify(citiesArr));
}

function updateDOM(data) {
  const icon = `https://openweathermap.org/img/wn/${data.weather["icon"]}@2x.png`;;
  li = document.createElement("li");
  li.classList.add("city");
  markup = `
            <div class ="content">
            <h2 class="city-name">
            <span>${data.name}</span>
            <sup>${data.country}</sup>
            </h2>
            <div class="city-temp">${data.temperature}<sup>°C</sup>
            </div>
            <figure>
            <img class="city-icon" src=${icon} alt=${data.weather.main}>
            <figcaption>${data.weather.description}</figcaption>
            </figure>
            </div>`;
  li.innerHTML = markup;
  list.appendChild(li);
}

async function checkDublicates() {
  let data = await getData();
  if (!data) return;
  const cityNames = list.querySelectorAll(" .city-name span");
  const cityNamesArr = Array.from(cityNames);
  let result = cityNamesArr.map((name) => name.innerHTML);
  if (result.includes(data.name)) {
    message.textContent = `You already know the weather for city ${data.name}`;
    return;
  } else {
    updateDOM(data);
    updateLS(data);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  checkDublicates();
  clearForm();

});

list.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("city")) {
    target.classList.toggle("rotate");
    if (target.classList.contains("rotate")) {
      resetElements(target);
      rotateElement(target);
    } else {
      resetElements(target);
      resetContent();
    }
  }
});

deleteButton.addEventListener("click", deleteElement);

function clearForm() {
  setTimeout(() => {
    message.textContent = "";
  }, 4000);
  form.reset();
  searchInput.focus();
}

function resetElements(target) {
  const cities = list.querySelectorAll(".city");
  cities.forEach((city) => {
    if (city !== target) {
      city.classList.remove("rotate");
      resetContent();
    }
  });
}

function rotateElement(target) {
  setTimeout(() => {
    deleteIcon.src = "./images/trash-bin.png";
    deleteButton.classList.add("delete-btn");
    deleteButton.append(deleteIcon);
    target.querySelector(".content").classList.add("hide");
    target.append(deleteButton);
    deleteButton.style.display = "block";
  }, 380);
}

function resetContent() {
  setTimeout(() => {
    const contents = document.querySelectorAll(".city .content");
    contents.forEach((content) => {
      content.classList.remove("hide");
    });
    deleteButton.style.display = "none";
  }, 380);
}

function deleteElement() {
  let rotatedCity = list.querySelector(".rotate");
  if (rotatedCity) {
    let cityName = rotatedCity.querySelector("h2 span").innerHTML;
    citiesArr = citiesArr.filter((city) => city.name !== cityName);
    LS.setItem("Cities", JSON.stringify(citiesArr));
    rotatedCity.remove();
  }
}
