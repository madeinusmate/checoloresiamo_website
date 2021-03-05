    var BaseURL="https://docs.google.com/spreadsheets/d/e/2PACX-1vSd6CxCmC3PaTTL2FPgqNMyUl3iWbY8zLd3NlsbQ1KDMe3ria8qj6UjRhf7HjObBbZ2mBNBPWcSt3gJ/pub?output=csv&range=";
    var backgroundURL= BaseURL + backgroundCell

$.ajax(backgroundURL).done(function(result){
document.getElementById('body').style.backgroundColor = result;
              });