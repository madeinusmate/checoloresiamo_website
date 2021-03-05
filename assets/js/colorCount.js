 var countGialloURL="https://docs.google.com/spreadsheets/d/e/2PACX-1vSd6CxCmC3PaTTL2FPgqNMyUl3iWbY8zLd3NlsbQ1KDMe3ria8qj6UjRhf7HjObBbZ2mBNBPWcSt3gJ/pub?output=csv&range=G1"
 var countArancioURL="https://docs.google.com/spreadsheets/d/e/2PACX-1vSd6CxCmC3PaTTL2FPgqNMyUl3iWbY8zLd3NlsbQ1KDMe3ria8qj6UjRhf7HjObBbZ2mBNBPWcSt3gJ/pub?output=csv&range=G2"
 var countRossoURL="https://docs.google.com/spreadsheets/d/e/2PACX-1vSd6CxCmC3PaTTL2FPgqNMyUl3iWbY8zLd3NlsbQ1KDMe3ria8qj6UjRhf7HjObBbZ2mBNBPWcSt3gJ/pub?output=csv&range=G3"
 var countBiancoURL="https://docs.google.com/spreadsheets/d/e/2PACX-1vSd6CxCmC3PaTTL2FPgqNMyUl3iWbY8zLd3NlsbQ1KDMe3ria8qj6UjRhf7HjObBbZ2mBNBPWcSt3gJ/pub?output=csv&range=G4"

function colorCount(){
        $.ajax(countGialloURL).done(function(result){
               document.getElementById('countGiallo').innerHTML = result;
           });

        $.ajax(countArancioURL).done(function(result){
               document.getElementById('countArancio').innerHTML = result;
           });

       $.ajax(countRossoURL).done(function(result){
               document.getElementById('countRosso').innerHTML = result;
           });

       $.ajax(countBiancoURL).done(function(result){
               document.getElementById('countBianco').innerHTML = result;
           });
           }