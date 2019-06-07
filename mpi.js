// Configuracoes de busca
const DESIRED_DATES_RANGE = { 'min': '11 Jun, 2019', 'max': '22 Jun, 2019' };
const DESIRED_LOCATION = 'Bison Service Centre'
const SEARCH_DATES_LOOP = ['11 Jun, 2019', '15 Jun, 2019', '22 Jun, 2019', '29 Jun, 2019'];

// Evita a sessao cair
clearInterval(_viewSessionInterval);

// Alerta sonoro 
let beep = new Audio("https://www.soundjay.com/button/beep-01a.mp3");

// Iterador infinito
class InfiniteLoop {
    constructor(list) {
        this.items = list;
        this.i = 0;
        return this;
    }

    next() {
        let c = this.i;
        this.i = (this.i >= this.items.length - 1) ? 0 : this.i + 1;

        return this.items[c]
    }
}

function notifyMe(message) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support system notifications");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(message);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(message);
            }
        });
    }
}

// Preenche o formulario e clica no botao
function checkDates() {
    var mpiLocation = jQuery('#SelectedLocationId');
    mpiLocation.val(jQuery("option:contains('" + DESIRED_LOCATION + "')", mpiLocation).val());
    mpiLocation.change();

    mpiAppointmentDate = jQuery('#AppointmentDate');
    mpiAppointmentDate.attr("value", loopDates.next())
    mpiAppointmentDate.val(mpiAppointmentDate.attr("value"));
    mpiAppointmentDate.change();

    jQuery('.input-group-addon:has(.fa-calendar)').click().click();

    document.getElementById('search-submit').click();
};

// Captura a requisicao
$(document).ajaxComplete(function (event, request, settings) {
    event.preventDefault();
    jQuery('#search-submit').removeAttr('disabled');

    try {

        JSON.parse(request.responseText).some((data) => {
            let desiredDateMin = new Date(DESIRED_DATES_RANGE.min);
            let desiredDateMax = new Date(DESIRED_DATES_RANGE.max);
            let availableDate = new Date(data.Date);

            if (availableDate >= desiredDateMin && availableDate <= desiredDateMax) {
                beep.play();
                notifyMe('Veja essa data ' + data.Date);
                beep.pause();

                if (!confirm('Deseja continuar procurando?')) return true;
            }
        })
    } catch (e) { console.error(e) }

    setTimeout(checkDates, 5000);
});
const loopDates = new InfiniteLoop(SEARCH_DATES_LOOP);
notifyMe("Ola, estamos testando sua janela de notificacoes");
checkDates();

