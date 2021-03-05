let coloreCell = ['B1', 'B2', 'B3','B4','B5','B6','B7','B8','B9','B10','B11','B12','B13','B14','B15','B16','B17','B18','B19','B20','B21']
let regioneID = ['abruzzo', 'basilicata','calabria','campania','emilia-romagna','friuli-venezia-giulia', 'lazio', 'liguria', 'lombardia', 'marche', 'molise','piemonte', 'puglia', 'sardegna', 'sicilia', 'toscana','trentino-alto-adige-bolzano','umbria','valle-d-aosta', 'veneto' , 'trentino-alto-adige-trento']
let BaseURL= "https://docs.google.com/spreadsheets/d/e/2PACX-1vSd6CxCmC3PaTTL2FPgqNMyUl3iWbY8zLd3NlsbQ1KDMe3ria8qj6UjRhf7HjObBbZ2mBNBPWcSt3gJ/pub?output=csv&range=";

function getMap() {
coloreCell.forEach((cell, index) => {
  const regione = regioneID[index];
  var coloreURL= BaseURL + cell;
  $.ajax(coloreURL).done(function(result){
               document.getElementById(regione).classList.add(result);;
});
})

}