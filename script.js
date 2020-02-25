/***************************
VARIABLER
***************************/

let alleKaffer;
let alleQuotes;
let filter = "alle";
const sheet1 = "https://spreadsheets.google.com/feeds/list/1Z7tSa0z9rOrASbBgI6iaUnulzGBZXfdntih4nNE-jn8/1/public/values?alt=json";
const sheet2 = "https://spreadsheets.google.com/feeds/list/1Z7tSa0z9rOrASbBgI6iaUnulzGBZXfdntih4nNE-jn8/2/public/values?alt=json";

/***************************************************************************************************************************************
Kalder funktionen start() når alt content er loaded
***************************************************************************************************************************************/

document.addEventListener("DOMContentLoaded", start);

/***************************************************************************************************************************************
Tilføjer eventlisteners burgermenuen og lytter til om der klikkes på den, dette kalder funktionen menuOpenClose().
***************************************************************************************************************************************/

document.querySelector("#burger_menu").addEventListener("touched", menuOpenClose);
document.querySelector("#burger_menu").addEventListener("click", menuOpenClose);

/***************************************************************************************************************************************
Funktionen der styrer om burgermenuen er åben eller lukket. Burgermenuen laves om til en konstant (bMenu) og hvis den er sat til display: block (synlig) så skal den lukkes når der klikkes, og hvis den er sat til display: none (lukket) så skal den åbnes. Samtidigt tilføjes der animationer der blurrer baggrunden når menuen er fremme, samt fjerner blurren når menuen er skjult.
***************************************************************************************************************************************/


function menuOpenClose() {
    console.log("menu pressed");
    this.classList.toggle("burger_kryds");

    const bMenu = document.querySelector("#mylinks");
    if (bMenu.style.display === "block") {
        bMenu.style.display = "none";

        document.querySelector("#burger_menu").textContent = "☰";
        document.querySelector(".menu_wrapper").classList.remove("fadein");
        document.querySelector(".quotes").classList.remove("blur");
        document.querySelector(".quotes").classList.add("blurback");

    } else {
        bMenu.style.display = "block";
        document.querySelector("#burger_menu").textContent = "X";
        document.querySelector(".menu_wrapper").classList.add("fadein");
        document.querySelector(".quotes").classList.remove("blurback");



    }
}

/***************************************************************************************************************************************
Tilføjer eventlistener til burgermenuen og animerer menuens links med en kort delay så de ikke kommer frem på samme tid. Samtidigt blurrer/fader den baggrundens quotes imens menuen er åben.
***************************************************************************************************************************************/

document.querySelector(".menu_wrapper").addEventListener("animationend", menuFlow);

function menuFlow() {


    document.querySelector("#menu1").classList.add("fade1");
    document.querySelector("#menu2").classList.add("fade2");
    document.querySelector("#menu3").classList.add("fade3");
    document.querySelector(".quotes").classList.add("blur");
}

/***************************************************************************************************************************************
Funktionen start() som henter json data som inkluderer begge sider på vores google sheet. (Både kaffe og quotes). Funktionen starter også animationen på logoet.
***************************************************************************************************************************************/

function start() {
    hentKaffer(sheet1);
    hentQuotes(sheet2);
    logoAnimation();

}

/***************************
JSON
***************************/

/***************************************************************************************************************************************
Funktionen der henter dataen fra google sheet (json). Kalder funktionen visKaffer().
***************************************************************************************************************************************/


async function hentKaffer() {
    const response = await fetch(sheet1);
    console.log(response);
    alleKaffer = await response.json();
    console.log(alleKaffer);
    visKaffer();
}

/***************************************************************************************************************************************
Funktionen der henter dataen fra google sheet (json). Kalder funktionen visQuotes().
***************************************************************************************************************************************/

async function hentQuotes() {
    const response = await fetch(sheet2);
    console.log(response);
    let quotesJson = await response.json();
    alleQuotes = quotesJson.feed.entry;
    console.log(alleQuotes.length);
    visQuotes();
}

/***************************
GOOGLE SHEET - TEMPLATE
***************************/

/***************************************************************************************************************************************
Funktionen der indsætter dataen fra google sheet til vores HTML. Den kloner vores template tag og gentager det for hver gang vi har indtastet informationen i google sheet. På den her måde kan vi printe billeder og tekst ud i det specifikke element vi ønsker. Vi har lavet informationen om til et array som indeholder al dataen og man kan derefter henvise til et specifikt sted i vores sheet (vha. forEach).

Her tilføjer vi også en eventlistener som lytter til om der klikkes på et billede. Når der klikkes på et billede kaldes der en funktion der skal vise detaljer om produktet.
***************************************************************************************************************************************/

function visKaffer() {
    console.log(alleKaffer)
    const container = document.querySelector("#index");
    container.innerHTML = "";
    const kafferTemplate = document.querySelector("template");
    alleKaffer.feed.entry.forEach(kaffe => {
        if (filter == "alle" || filter == kaffe.gsx$kategori.$t) {
            let klon = kafferTemplate.cloneNode(true).content;
            klon.querySelector("img").src = `billeder/small/${kaffe.gsx$billede.$t}-sm.jpg`;
            klon.querySelector("h2").textContent = `${kaffe.gsx$navn.$t}`;
            klon.querySelector("p").textContent += `${kaffe.gsx$kort.$t}`;
            klon.querySelector("article").addEventListener("click", () => visDetail(kaffe))
            klon.querySelector("article").addEventListener("click", fjernClass);

            container.appendChild(klon);
        }
    })
}

/***************************
FILTRERING
***************************/

/***************************************************************************************************************************************
Funktionen der tilføjer eventlisteners på alle filterknapper som er der for at vi kan filtrere vores content.
***************************************************************************************************************************************/

function klikListeners() {
    document.querySelectorAll(".filter").forEach(elm => {
        elm.addEventListener("click", filtrering);

    })


}

/***************************************************************************************************************************************
Funktionen der filtrerer vores kategorier når der klikkes på de forskellige filtre.
***************************************************************************************************************************************/

function filtrering() {
    console.log("FILTER");
    filter = this.dataset.kategorier;
    visKaffer();
    document.querySelector("h2").textContent = this.textContent;
    document.querySelectorAll(".filter").forEach(elm => {
        elm.classList.remove("valgt");

    })
    this.classList.add("valgt");

};

/***************************************************************************************************************************************
Funktionen der fjerner classen "skjul" så detaljevinduet kan lukkes.
***************************************************************************************************************************************/

function fjernClass() {
    detail.classList.remove("skjul");
}

/***************************************************************************************************************************************
Funktionen der henter dataen fra google sheet når der vises detaljer (altså klikkes på et billede).
***************************************************************************************************************************************/

function visDetail(kaffe) {

    detail.querySelector("button").addEventListener("click", () => detail.classList.add("skjul"));
    detail.querySelector("img").src = `billeder/large/${kaffe.gsx$billede.$t}.jpg`;
    detail.querySelector("h1").textContent = kaffe.gsx$navn.$t;
    detail.querySelector("p").textContent = kaffe.gsx$lang.$t;

    detail.querySelector("p + p").textContent = kaffe.gsx$oprindelse.$t;

    detail.querySelector("p + p").textContent += kaffe.gsx$oprindelse.$t;

    detail.querySelector("img").addEventListener("click", () => detail.classList.add("skjul"));
    document.querySelector("#detail").addEventListener("click", () => detail.classList.add("skjul"));
}

/***************************
LOGO ANIMATION
***************************/


/***************************************************************************************************************************************
KRISTINA UDFYLDE DE HER.
***************************************************************************************************************************************/

function logoAnimation() {
    let circle = document.querySelector(".logo circle");
    let svg = document.querySelector(".logo svg");

    circle.classList.add("stroke");
    circle.addEventListener("animationend", () => {
        console.log(svg);
        svg.classList.add("fill");
        svg.addEventListener("animationend", () => {
            document.querySelector(".name").classList.add("scale_in");
        })
        document.querySelector(".name").addEventListener("animationend", () => {
            setTimeout(nameAnimation, 300);
        })
    })
}


function nameAnimation() {
    document.querySelector(".capulus_container1").classList.add("move_lr");
    document.querySelector(".clava_container1").classList.add("move_rl");
    document.querySelector(".capulus_sprite1").classList.add("rotate");
    document.querySelector(".clava_sprite1").classList.add("rotate");
    document.querySelector(".capulus_container2").classList.add("hide_capulus_container2");
    document.querySelector(".capulus_container2 p").classList.add("hide_capulus_sprite2");
    document.querySelector(".clava_container2").classList.add("hide_clava_container2");
    document.querySelector(".clava_container2 p").classList.add("hide_clava_sprite2");
    document.querySelector(".clava_container2").addEventListener("animationend", () => {
        document.querySelector(".logo").classList.add("move_logo");
    })
    document.querySelector(".logo").addEventListener("animationend", () => {
        document.querySelector(".logo").style.position = "fixed";

    })
}



window.addEventListener("scroll", stopAnimation);

function stopAnimation() {
    document.querySelector(".capulus_container1").classList.remove("move_lr");
    document.querySelector(".clava_container1").classList.remove("move_rl");
    document.querySelector(".capulus_sprite1").classList.remove("rotate");
    document.querySelector(".clava_sprite1").classList.remove("rotate");
    document.querySelector(".capulus_container2").classList.remove("hide_capulus_container2");
    document.querySelector(".capulus_container2 p").classList.remove("hide_capulus_sprite2");
    document.querySelector(".clava_container2").classList.remove("hide_clava_container2");
    document.querySelector(".clava_container2 p").classList.remove("hide_clava_sprite2");
    document.querySelector(".logo").classList.remove("move_logo");
    document.querySelector(".logo").classList.add("end");



}


/***************************
QUOTES
***************************/

/***************************************************************************************************************************************
Sætter quotes til at være synlige i 9 sekunder og skifte hvert 10. sekund
***************************************************************************************************************************************/

const quoteSpeed = 9000;

setInterval(visQuotes, quoteSpeed);


/***************************************************************************************************************************************
Funktionen der tjekker efter hvilken quote der skal printes. Vores random quote generator skriver både author og quote som hører sammen med et ID fra google sheet.
***************************************************************************************************************************************/

function visQuotes() {
    let antal = alleQuotes.length;
    const ranTal = Math.floor(Math.random() * (antal - 1));
    //console.log(ranTal)
    alleQuotes.forEach((quote, i) => {
        //        console.log(i)
        if (i == ranTal) {
            console.log(quote.gsx$quote.$t)
            document.querySelector(".quote").textContent = quote.gsx$quote.$t;
            document.querySelector(".author").textContent = "- " + quote.gsx$author.$t;
            document.querySelector(".quote").classList.add("fade");
            document.querySelector(".author").classList.add("fade");
        }
    })
    setTimeout(fadeUd, 8000);
}

function fadeUd() {
    document.querySelector(".quote").classList.remove("fade");
    document.querySelector(".author").classList.remove("fade");
}
