    var BaseURL="https://docs.google.com/spreadsheets/d/e/2PACX-1vSd6CxCmC3PaTTL2FPgqNMyUl3iWbY8zLd3NlsbQ1KDMe3ria8qj6UjRhf7HjObBbZ2mBNBPWcSt3gJ/pub?output=csv&range=";
    var coloreURL= BaseURL + coloreCell
    var restrizione

$.ajax(coloreURL).done(function(result){
               document.getElementById('colore').innerHTML = result;
               restrizione = result;
               switch (restrizione){
    case "GIALLO":
        document.getElementById('restrictions_yellow').style.display = "inline";
        break;
    case "ARANCIO":
        document.getElementById('restrictions_orange').style.display = "inline";
        break;
    case "ROSSO":
        document.getElementById('restrictions_red').style.display = "inline";
        break;
    case "BIANCO":
        document.getElementById('restrictions_white').style.display = "inline";
        document.getElementById("colore").classList.add("text-black");
        document.getElementById("regione").classList.add("text-black");
        document.getElementById("restrizioni-header").classList.add("text-black");
        document.getElementById("logo").src = "../assets/img/brand/logo_black.png"
        document.getElementById("navbar-main").classList.remove("navbar-transparent");
        document.getElementById("navbar-main").classList.add(".bg-white");
        document.getElementById('navbar-dropdown').style.color = "black";
        break;
    default:
    console.log("error, no color defined, restrictions not displayed");
    };
      });


