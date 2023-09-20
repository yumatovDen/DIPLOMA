let paymentInfo = localStorage.getItem('seance-data');
let parsedselectedChairs = JSON.parse(paymentInfo)
// console.log(parsedselectedChairs);

let ticketTitle = document.querySelector('.ticket__title');
ticketTitle.innerText = `${parsedselectedChairs.filmName}`;
let ticketChairs = document.querySelector('.ticket__chairs');
let ticketHall = document.querySelector('.ticket__hall');
ticketHall.innerText = `${parsedselectedChairs.hallName}`;
let seanceDate = new Date(+`${parsedselectedChairs.seanceTimeStamp * 1000}`);
let fulldate = seanceDate.toLocaleString("ru-RU",
    {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });;
let ticketStart = document.querySelector('.ticket__start');
ticketStart.innerText = `${parsedselectedChairs.seanceTime}, ${fulldate}`;

let places = parsedselectedChairs.selectedPlaces;
let takenChairs = places.map(place => `${place.row}/${place.place}`).join(', ');
ticketChairs.innerText = takenChairs;

let price = 0;

for (let place of places) {
    if (place.type === 'standart') {
        price += +parsedselectedChairs.hallPriceStandart;
    } else if (place.type === 'vip') {
        price += +parsedselectedChairs.hallPriceVip;
    }

}

let ticketCost = document.querySelector('.ticket__cost');
ticketCost.innerText = `${price}`;

let newHallConfig = parsedselectedChairs.hallConfig.replace(/selected/g, "taken");
parsedselectedChairs.hallConfig = newHallConfig;
parsedselectedChairs.takenChairs = takenChairs;
// console.log(newHallConfig);
localStorage.setItem('seance-data', JSON.stringify(parsedselectedChairs));
document.querySelector(".acceptin-button").addEventListener("click", (event) => {
    event.preventDefault();
    fetch("https://jscp-diplom.netoserver.ru/", {
        method: "POST",
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        body: `event=sale_add&timestamp=${parsedselectedChairs.seanceTimeStamp}&hallId=${parsedselectedChairs.hallId}&seanceId=${parsedselectedChairs.seanceId}&hallConfiguration=${newHallConfig}`,
    });
});
