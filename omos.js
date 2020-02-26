/***************************
VARIABLER
***************************/
let alleOs;
const sheet3 = "https://spreadsheets.google.com/feeds/list/1Z7tSa0z9rOrASbBgI6iaUnulzGBZXfdntih4nNE-jn8/3/public/values?alt=json";




document.addEventListener("DOMContentLoaded", start);


document.querySelector("#burger_menu").addEventListener("touched", menuOpenClose);
document.querySelector("#burger_menu").addEventListener("click", menuOpenClose);


function menuOpenClose() {
    console.log("menu pressed");
    this.classList.toggle("burger_kryds");

    const bMenu = document.querySelector("#my_links");
    if (bMenu.style.display === "block") {
        bMenu.style.display = "none";

        document.querySelector("#burger_menu").textContent = "☰";
        document.querySelector(".menu_wrapper").classList.remove("fadein");


    } else {
        bMenu.style.display = "block";
        document.querySelector("#burger_menu").textContent = "X";




    }
}

document.querySelector(".menu_wrapper").addEventListener("animationend", menuFlow);

function menuFlow() {


    document.querySelector("#menu1").classList.add("fade1");
    document.querySelector("#menu2").classList.add("fade2");
    document.querySelector("#menu3").classList.add("fade3");

}


function start() {
    hentOs();
    logoOmOs();
    document.querySelector("#my_links").style.opacity = "1";
}

async function hentOs() {
    const response = await fetch(sheet3);
    console.log(response);
    alleOs = await response.json();
    console.log(alleOs);
    visOs();
}

function visOs() {
    console.log(alleOs)
    const container = document.querySelector("#omos");
    container.innerHTML = "";
    const osTemplate = document.querySelector("template");
    alleOs.feed.entry.forEach(person => {

        let klon = osTemplate.cloneNode(true).content;
        klon.querySelector("img").src = `billeder/small/${person.gsx$billede.$t}.jpg`;
        klon.querySelector("h2").textContent = `${person.gsx$navn.$t}`;
        klon.querySelector("p").textContent += `${person.gsx$tekst.$t}`;
        //        klon.querySelector("article").addEventListener("click", () => visDetail(kaffe))
        //        klon.querySelector("article").addEventListener("click", fjernClass);

        container.appendChild(klon);

    })
}

function logoOmOs() {
    console.log("animation go home");
    document.querySelector(".logo svg").style.fill = "#A68B6A";
    document.querySelector(".logo circle").style.strokeDashoffset = "0";
    document.querySelector(".name").style.transform = "scale(1)";
    document.querySelector(".capulus_sprite1").style.transform = "translateX(232px)";
    document.querySelector(".clava_sprite1").style.transform = "translateX(169px)";
    document.querySelector(".capulus_container2").style.display = "none";
    document.querySelector(".clava_container2").style.display = "none";
    document.querySelector(".logo").style.top = "35px";
    document.querySelector(".logo").style.transform = "scale(0.55)";
    document.querySelector(".logo").style.position = "fixed";
}
