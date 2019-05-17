// Configuracoes de busca
const DESIRED_DATES_RANGE={'min' : '18 May, 2019', 'max': '28 May, 2019'};
const DESIRED_LOCATION='Bison Service Centre'
const SEARCH_DATES_LOOP=['18 May, 2019', '25 May, 2019'];

// Evita a sessao cair
clearInterval(_viewSessionInterval);

// Iterador infinito
class InfiniteLoop {
  constructor(list){
     this.items = list;
     this.i = 0;
     return this;
  }
  
  next(){
    let c = this.i;
    this.i = (this.i >= this.items.length-1)? 0 : this.i+1;
    
    return this.items[c]
  }
}

// Preenche o formulario e clica no botao
function checkDates(){
    var mpiLocation = jQuery('#SelectedLocationId');
    mpiLocation.val(jQuery("option:contains('"+DESIRED_LOCATION+"')", mpiLocation).val());
    mpiLocation.change();

    mpiAppointmentDate = jQuery('#AppointmentDate');
    mpiAppointmentDate.attr("value", loopDates.next())
    mpiAppointmentDate.val(mpiAppointmentDate.attr("value"));
    mpiAppointmentDate.change();
    
    jQuery('.input-group-addon:has(.fa-calendar)').click().click();

   document.getElementById('search-submit').click();
};

// Captura a requisicao
$(document).ajaxComplete(function(event,request, settings){
    event.preventDefault();
    jQuery('#search-submit').removeAttr('disabled');

    try {

        JSON.parse(request.responseText).some((data) => {
            let desiredDateMin = new Date(DESIRED_DATES_RANGE.min);
            let desiredDateMax = new Date(DESIRED_DATES_RANGE.max);
            let availableDate = new Date(data.Date);

            if(availableDate >= desiredDateMin && availableDate <= desiredDateMax){
                alert('Vejas essa data '+data.Date);

                if(!confirm('Deseja continuar procurando?')) return true;
            }
        })
    }catch(e){ console.error(e)}

    setTimeout(checkDates, 5000);
});
const loopDates = new InfiniteLoop(SEARCH_DATES_LOOP);
checkDates();
