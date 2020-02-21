    let alleKaffer;
    let alleQuotes;
    let filter = "alle";
    const sheet1 = "https://spreadsheets.google.com/feeds/list/1Z7tSa0z9rOrASbBgI6iaUnulzGBZXfdntih4nNE-jn8/1/public/values?alt=json";
    const sheet2 = "https://spreadsheets.google.com/feeds/list/1Z7tSa0z9rOrASbBgI6iaUnulzGBZXfdntih4nNE-jn8/2/public/values?alt=json";

    document.addEventListener("DOMContentLoaded", start);

    function start() {

    }
    document.querySelector("#burger_menu").addEventListener("touched", menuOpenClose);
    document.querySelector("#burger_menu").addEventListener("click", menuOpenClose);
    const burgz = document.querySelector("#menu_burger_bar");


    function menuOpenClose() {
        console.log("menu pressed");
        this.classList.toggle("burger_kryds");

        let x = document.querySelector("#mylinks");
        if (x.style.display === "block") {
            x.style.display = "none";

            document.querySelector("#burger_menu").textContent = "☰";
            document.querySelector(".menu_wrapper").classList.remove("fadein");
            document.querySelector(".quotes").classList.remove("blur");
            document.querySelector(".quotes").classList.add("blurback");






        } else {
            x.style.display = "block";
            document.querySelector("#burger_menu").textContent = "X";
            document.querySelector(".menu_wrapper").classList.add("fadein");
            document.querySelector(".quotes").classList.remove("blurback");



        }
    }


    // Animation til at få burgermenuens links til at animere med delay.
    document.querySelector(".menu_wrapper").addEventListener("animationend", menuFlow);

    function menuFlow() {


        document.querySelector("#menu1").classList.add("fade1");
        document.querySelector("#menu2").classList.add("fade2");
        document.querySelector("#menu3").classList.add("fade3");
        document.querySelector(".quotes").classList.add("blur");
    }


    function start() {
        hentKaffer(sheet1);
        hentQuotes(sheet2);




    }

    // Dynamisk


    async function hentKaffer() {
        const response = await fetch(sheet1);
        console.log(response);
        alleKaffer = await response.json();
        console.log(alleKaffer);
        visKaffer();
    }
    async function hentQuotes() {
        const response = await fetch(sheet2);
        console.log(response);
        alleQuotes = await response.json();
        console.log(alleQuotes);
        visQuotes();
    }

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



    function klikListeners() {
        document.querySelectorAll(".filter").forEach(elm => {
            elm.addEventListener("click", filtrering);

        })


    }

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

    function fjernClass() {
        detail.classList.remove("skjul");
    }


    function visDetail(kaffe) {

        detail.querySelector("button").addEventListener("click", () => detail.classList.add("skjul"));
        detail.querySelector("img").src = `billeder/large/${kaffe.gsx$billede.$t}.jpg`;
        detail.querySelector("h1").textContent = kaffe.gsx$navn.$t;
        detail.querySelector("p").textContent += kaffe.gsx$lang.$t;
        detail.querySelector("p + p").textContent += kaffe.gsx$oprindelse.$t;
        detail.querySelector("img").addEventListener("click", () => detail.classList.add("skjul"));
        document.querySelector("#detail").addEventListener("click", () => detail.classList.add("skjul"));

    }

    const quoteSpeed = 10000;

    setInterval(visQuotes, quoteSpeed);

    function visQuotes() {
        const antal = alleQuotes.feed.entry.length;
        const ranTal = Math.floor(Math.random() * antal);
        //console.log(ranTal)
        alleQuotes.feed.entry.forEach((quote, i) => {
            console.log(i)
            if (i == ranTal) {
                console.log(quote.gsx$quote.$t)
                document.querySelector(".quote").textContent = quote.gsx$quote.$t;
                document.querySelector(".author").textContent = "- " + quote.gsx$author.$t;
            }
        })
    }
