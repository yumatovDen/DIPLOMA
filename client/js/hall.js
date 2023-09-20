let seanceData = localStorage.getItem('seance-data');
let parsedSeances = JSON.parse(seanceData);
// console.log(parsedSeances);

let confStepWrapper = document.querySelector('.conf-step__wrapper');
let movieTitle = document.querySelector('.buying__info-title');
movieTitle.innerText = `${parsedSeances.filmName}`;
let movieSeanceStart = document.querySelector('.buying__info-start');
movieSeanceStart.innerText = `Начало сеанса:  ${parsedSeances.seanceTime}`;
let hallName = document.querySelector('.buying__info-hall');
hallName.innerText = `${parsedSeances.hallName}`;
let acceptinButton = document.querySelector('.acceptin-button');
let priceStandart = document.querySelector('.price-standart');
priceStandart.innerText = `${parsedSeances.hallPriceStandart}`;
let priceVip = document.querySelector('.price-vip');
priceVip.innerText = `${parsedSeances.hallPriceVip}`;

createRequest('POST', 'https://jscp-diplom.netoserver.ru/', `event=get_hallConfig&timestamp=${parsedSeances.seanceTimeStamp}&hallId=${parsedSeances.hallId}&seanceId=${parsedSeances.seanceId}`, function (response) {
    // console.log(response);

    if (response) {
        parsedSeances.hallConfig = response;
    } else {
        console.log('Нет купленных билетов');
    }

    confStepWrapper.innerHTML = parsedSeances.hallConfig;
    let chairs = document.querySelectorAll('.conf-step__chair');
    let arrSelectedChairs = document.querySelectorAll('.conf-step__row .conf-step__chair_selected');


    if (arrSelectedChairs.length > 0) {
        acceptinButton.removeAttribute('disabled');
    } else {
        acceptinButton.setAttribute('disabled', 'disabled');
    }

    // console.log(arrSelectedChairs)

    chairs.forEach((chair) => {
        chair.addEventListener('click', function (event) {
            if (event.target.classList.contains('conf-step__chair_taken')) {
                return;
            }
            event.target.classList.toggle('conf-step__chair_selected');
            arrSelectedChairs = document.querySelectorAll('.conf-step__row .conf-step__chair_selected');
            if (arrSelectedChairs.length > 0) {
                acceptinButton.removeAttribute('disabled');
            } else {
                acceptinButton.setAttribute('disabled', 'disabled');
            }

        });
    })


    acceptinButton.addEventListener('click', function () {
        let selectedChairs = [];
        arrSelectedChairs.forEach((selectedChair) => {
            let rowElement = selectedChair.closest('.conf-step__row');
            let rowIndex = Array.from(rowElement.parentNode.children).indexOf(rowElement) + 1;
            let placeIndex = Array.from(rowElement.children).indexOf(selectedChair) + 1;
            let typePlace;
            if (selectedChair.classList.contains('conf-step__chair_standart')) {
                typePlace = 'standart';
            } else if (selectedChair.classList.contains('conf-step__chair_vip')) {
                typePlace = 'vip';
            }
            selectedChairs.push({ row: rowIndex, place: placeIndex, type: typePlace });

            // console.log(selectedChairs);
        });

        parsedSeances.hallConfig = confStepWrapper.innerHTML;
        parsedSeances.selectedPlaces = selectedChairs;
        localStorage.setItem('seance-data', JSON.stringify(parsedSeances));
        window.location.href = "payment.html";
    });
});
