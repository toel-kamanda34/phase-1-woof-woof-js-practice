
let allDogs = [];
let isFilterOn = false;

document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');

    // function that fetches all dogs from the pups API
    function fetchDogs() {
        fetch('http://localhost:3000/pups')
            .then(response => response.json())
            .then(dogs => {
                allDogs = dogs;
                renderDogBar(dogs);
            });
    }

    // function that will render dog spans in the dog bar
    function renderDogBar(dogs) {
        dogBar.innerHTML = '';
        dogs.forEach(dog => {
            const span = document.createElement('span');
            span.textContent = dog.name;
            span.addEventListener('click', () => showDogInfo(dog));
            dogBar.appendChild(span);
        });
    }

    // function that will display dog info when clicked
    function showDogInfo(dog) {
        dogInfo.innerHTML = `
            <img src="${dog.image}" alt="${dog.name}">
            <h2>${dog.name}</h2>
            <button onclick="toggleGoodDog(${dog.id})">${dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
        `;
    }

    // Toggle good/bad dog status
    window.toggleGoodDog = function(id) {
        const dog = allDogs.find(dog => dog.id === id);
        dog.isGoodDog = !dog.isGoodDog;

        fetch(`http://localhost:3000/pups/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isGoodDog: dog.isGoodDog }),
        })
            .then(response => response.json())
            .then(() => {
                showDogInfo(dog);
                if (isFilterOn) {
                    renderDogBar(allDogs.filter(dog => dog.isGoodDog));
                }
            });
    }

    //  function  used to Filter good dogs
    function filterGoodDogs() {
        isFilterOn = !isFilterOn;
        filterButton.textContent = `Filter good dogs: ${isFilterOn ? 'ON' : 'OFF'}`;
        
        if (isFilterOn) {
            renderDogBar(allDogs.filter(dog => dog.isGoodDog));
        } else {
            renderDogBar(allDogs);
        }
    }

    // click Event listeners
    filterButton.addEventListener('click', filterGoodDogs);

    // Initialize 
    fetchDogs();
});