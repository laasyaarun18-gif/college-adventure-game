import Phaser from "phaser";


/* =========================================================
   GAME SETTINGS
========================================================= */

const GAME_WIDTH = 1600;
const GAME_HEIGHT = 900;

let playerName = "";
let selectedCharacter = "girl";
let currentLocation = null;


/* =========================================================
   LOCATION INFORMATION
========================================================= */

const LOCATIONS = {

    mainblock: {
        name: "MAIN BLOCK",
        description: "Classes. Faculties. A brighter future.",
        crop: {
            x: 0,
            y: 0,
            width: 512,
            height: 490
        }
    },

    library: {
        name: "LIBRARY",
        description: "Books. Ideas. A better you.",
        crop: {
            x: 512,
            y: 0,
            width: 512,
            height: 490
        }
    },

    lab: {
        name: "LAB",
        description: "Experiment. Learn. Create.",
        crop: {
            x: 1024,
            y: 0,
            width: 512,
            height: 490
        }
    },

    studenthub: {
        name: "STUDENT HUB",
        description: "People. Clubs. Conversations.",
        crop: {
            x: 0,
            y: 490,
            width: 512,
            height: 475
        }
    },

    canteen: {
        name: "CANTEEN",
        description: "Good food. Better days.",
        crop: {
            x: 512,
            y: 490,
            width: 512,
            height: 475
        }
    },

    sports: {
        name: "SPORTS GROUND",
        description: "Play. Practice. Progress.",
        crop: {
            x: 1024,
            y: 490,
            width: 512,
            height: 475
        }
    }

};


/* =========================================================
   PHASER CAMPUS SCENE
========================================================= */

class CampusScene extends Phaser.Scene {

    constructor() {

        super("CampusScene");

    }


    preload() {

        /*
            ACTUAL CAMPUS
        */

        this.load.image(
            "campus",
            "/assests/campus.png"
        );


        /*
            LOCATION MAP
        */

        this.load.image(
            "campusLocation",
            "/assests/campus-location.png"
        );


        /*
            CHARACTERS
        */

        this.load.image(
            "boy",
            "/assests/boy.png"
        );

        this.load.image(
            "girl",
            "/assests/girl.png"
        );

    }


    create() {

        /*
            Actual campus image.

            NO markers.
            NO player.
            NO green paths.
        */

        this.campus =
            this.add.image(
                GAME_WIDTH / 2,
                GAME_HEIGHT / 2,
                "campus"
            );

        this.campus.setDisplaySize(
            GAME_WIDTH,
            GAME_HEIGHT
        );

        this.campus.setDepth(0);

    }

}


/* =========================================================
   PHASER LOCATION SCENE
========================================================= */

class LocationScene extends Phaser.Scene {

    constructor() {

        super("LocationScene");

    }


    create() {

        /*
            Get selected location.
        */

        const location =
            LOCATIONS[currentLocation];


        if (!location) {

            return;

        }


        /*
            Get the location image.
        */

        const texture =
            this.textures.get(
                "campusLocation"
            );


        /*
            Create cropped location visual.
        */

        this.locationImage =
            this.add.image(
                GAME_WIDTH / 2,
                GAME_HEIGHT / 2,
                "campusLocation"
            );


        this.locationImage.setCrop(
            location.crop.x,
            location.crop.y,
            location.crop.width,
            location.crop.height
        );


        this.locationImage.setDisplaySize(
            GAME_WIDTH,
            GAME_HEIGHT
        );


        this.locationImage.setDepth(0);


        /*
            Slight dark overlay.
        */

        this.add.rectangle(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            GAME_WIDTH,
            GAME_HEIGHT,
            0x07130f,
            0.08
        );


        /*
            PLAYER
        */

        this.player =
            this.add.image(
                GAME_WIDTH / 2,
                GAME_HEIGHT - 210,
                selectedCharacter
            );


        this.player.setDisplaySize(
            95,
            125
        );


        this.player.setDepth(10);


        /*
            Player shadow.
        */

        this.shadow =
            this.add.ellipse(
                this.player.x,
                this.player.y + 54,
                65,
                22,
                0x000000,
                0.35
            );

        this.shadow.setDepth(9);


        /*
            Movement.
        */

        this.cursors =
            this.input.keyboard.createCursorKeys();


        this.keys =
            this.input.keyboard.addKeys(
                {
                    W: Phaser.Input.Keyboard.KeyCodes.W,
                    A: Phaser.Input.Keyboard.KeyCodes.A,
                    S: Phaser.Input.Keyboard.KeyCodes.S,
                    D: Phaser.Input.Keyboard.KeyCodes.D
                }
            );


        /*
            ESC returns to map.
        */

        this.input.keyboard.on(
            "keydown-ESC",
            () => {

                returnToMap();

            }
        );


        /*
            Location title.
        */

        this.add.text(
            GAME_WIDTH / 2,
            38,
            location.name,
            {
                fontFamily: "Arial",
                fontSize: "26px",
                fontStyle: "bold",
                color: "#ffffff",
                backgroundColor:
                    "#061b15",
                padding: {
                    left: 22,
                    right: 22,
                    top: 12,
                    bottom: 12
                }
            }
        )
        .setOrigin(0.5)
        .setDepth(20);


        /*
            Small objective.
        */

        this.add.text(
            GAME_WIDTH / 2,
            100,
            "EXPLORE THE LOCATION",
            {
                fontFamily: "Arial",
                fontSize: "12px",
                fontStyle: "bold",
                color: "#d1e8d5",
                letterSpacing: 2
            }
        )
        .setOrigin(0.5)
        .setDepth(20);


        /*
            Controls.
        */

        this.add.text(
            28,
            GAME_HEIGHT - 35,
            "W A S D  /  ARROW KEYS  •  ESC TO MAP",
            {
                fontFamily: "Arial",
                fontSize: "12px",
                fontStyle: "bold",
                color: "#ffffff",
                backgroundColor:
                    "#061b15",
                padding: {
                    left: 13,
                    right: 13,
                    top: 8,
                    bottom: 8
                }
            }
        )
        .setDepth(20);

    }


    update() {

        if (!this.player) {

            return;

        }


        const speed = 4;

        let dx = 0;
        let dy = 0;


        /*
            LEFT
        */

        if (
            this.cursors.left.isDown ||
            this.keys.A.isDown
        ) {

            dx = -speed;

        }


        /*
            RIGHT
        */

        if (
            this.cursors.right.isDown ||
            this.keys.D.isDown
        ) {

            dx = speed;

        }


        /*
            UP
        */

        if (
            this.cursors.up.isDown ||
            this.keys.W.isDown
        ) {

            dy = -speed;

        }


        /*
            DOWN
        */

        if (
            this.cursors.down.isDown ||
            this.keys.S.isDown
        ) {

            dy = speed;

        }


        /*
            Move.
        */

        this.player.x += dx;
        this.player.y += dy;


        /*
            Keep player inside screen.
        */

        this.player.x =
            Phaser.Math.Clamp(
                this.player.x,
                70,
                GAME_WIDTH - 70
            );


        this.player.y =
            Phaser.Math.Clamp(
                this.player.y,
                180,
                GAME_HEIGHT - 90
            );


        /*
            Move shadow with player.
        */

        this.shadow.x =
            this.player.x;

        this.shadow.y =
            this.player.y + 54;

    }

}


/* =========================================================
   PHASER CONFIG
========================================================= */

const config = {

    type: Phaser.AUTO,

    parent: "game",

    width: GAME_WIDTH,

    height: GAME_HEIGHT,

    backgroundColor: "#061510",

    scale: {

        mode: Phaser.Scale.FIT,

        autoCenter:
            Phaser.Scale.CENTER_BOTH

    },

    render: {

        pixelArt: true,

        antialias: false

    },

    scene: [
        CampusScene,
        LocationScene
    ]

};


const game =
    new Phaser.Game(config);


/* =========================================================
   HTML UI
========================================================= */

const ui =
document.createElement("div");


ui.id =
    "game-ui";


ui.innerHTML = `

<style>

/* =====================================================
   GLOBAL
===================================================== */

* {
    box-sizing: border-box;
}


#game-ui {

    position: fixed;

    inset: 0;

    z-index: 100;

    pointer-events: none;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    color: white;

}


button,
input {

    font-family: inherit;

}


.hidden {

    display: none !important;

}


/* =====================================================
   FADE
===================================================== */

#fade-layer {

    position: fixed;

    inset: 0;

    background: #020907;

    opacity: 0;

    pointer-events: none;

    z-index: 2000;

    transition:
        opacity 0.55s ease;

}


/* =====================================================
   WELCOME SCREEN
===================================================== */

#welcome-screen {

    position: fixed;

    inset: 0;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    text-align: center;

    padding: 40px;

    pointer-events: auto;

    background:
        linear-gradient(
            rgba(2,15,12,0.55),
            rgba(2,15,12,0.75)
        );

}


.eyebrow {

    color: #b8e3c0;

    font-size: 15px;

    font-weight: 700;

    letter-spacing: 4px;

    margin-bottom: 18px;

}


.game-title {

    margin: 0;

    font-size:
        clamp(70px, 9vw, 150px);

    line-height: 0.84;

    font-weight: 900;

    letter-spacing: -7px;

}


.game-title span {

    display: block;

    color: #a9dba9;

}


.subtitle {

    margin-top: 35px;

    font-size: 25px;

}


.subtitle-small {

    margin-top: 8px;

    font-size: 16px;

    color: #bfc8c2;

}


.name-area {

    width:
        min(600px, 90vw);

    margin-top: 45px;

    text-align: left;

}


.name-area label {

    display: block;

    margin-bottom: 12px;

    font-size: 15px;

}


.name-input {

    width: 100%;

    height: 70px;

    padding: 0 25px;

    border-radius: 16px;

    border:
        1px solid
        rgba(255,255,255,0.18);

    outline: none;

    background:
        rgba(15,32,27,0.78);

    color: white;

    font-size: 18px;

}


.name-input::placeholder {

    color:
        rgba(255,255,255,0.42);

}


.primary-button {

    margin-top: 25px;

    padding:
        18px 30px;

    border: none;

    border-radius: 14px;

    background: #f4f7f2;

    color: #071711;

    font-weight: 900;

    font-size: 15px;

    letter-spacing: 1px;

    cursor: pointer;

    transition:
        transform 0.2s ease,
        background 0.2s ease;

}


.primary-button:hover {

    transform:
        translateY(-3px);

    background: #c9e8cc;

}


/* =====================================================
   CHARACTER SELECT
===================================================== */

#character-screen {

    position: fixed;

    inset: 0;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    text-align: center;

    pointer-events: auto;

    background:
        linear-gradient(
            rgba(2,15,12,0.63),
            rgba(2,15,12,0.82)
        );

}


.chapter {

    color: #9ed4a9;

    font-size: 13px;

    font-weight: 800;

    letter-spacing: 4px;

    margin-bottom: 15px;

}


.select-title {

    margin: 0;

    font-size: 58px;

    font-weight: 900;

}


.select-subtitle {

    color: #c3cbc6;

    margin-top: 12px;

    font-size: 17px;

}


.character-cards {

    display: flex;

    gap: 25px;

    margin-top: 35px;

}


.character-card {

    width: 230px;

    height: 300px;

    border-radius: 22px;

    border:
        1px solid
        rgba(255,255,255,0.15);

    background:
        rgba(7,25,20,0.82);

    cursor: pointer;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: space-between;

    padding: 20px;

    transition:
        transform 0.2s ease,
        border 0.2s ease;

}


.character-card:hover {

    transform:
        translateY(-8px);

}


.character-card.selected {

    border:
        2px solid
        #a9dba9;

    background:
        rgba(33,66,51,0.82);

}


.character-card img {

    width: 145px;

    height: 190px;

    object-fit: contain;

    image-rendering: pixelated;

}


.character-name {

    font-size: 18px;

    font-weight: 900;

}


.character-hint {

    color: #9daaa3;

    font-size: 12px;

    letter-spacing: 1px;

}


/* =====================================================
   WELCOME DIALOGUE
===================================================== */

#dialogue-screen {

    position: fixed;

    inset: 0;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 40px;

    pointer-events: auto;

    background:
        rgba(2,15,12,0.58);

}


.dialogue-box {

    width:
        min(820px, 90vw);

    padding: 55px;

    border-radius: 28px;

    border:
        1px solid
        rgba(180,220,190,0.18);

    background:
        rgba(5,25,19,0.93);

    box-shadow:
        0 30px 80px
        rgba(0,0,0,0.45);

}


.dialogue-day {

    color: #a9dba9;

    font-size: 14px;

    font-weight: 800;

    letter-spacing: 3px;

}


.dialogue-title {

    margin-top: 35px;

    font-size:
        clamp(42px, 5vw, 65px);

    font-weight: 900;

}


.dialogue-text {

    margin-top: 28px;

    color: #bfc9c3;

    font-size: 18px;

    line-height: 1.7;

}


/* =====================================================
   CAMPUS GUIDE
===================================================== */

#guide-screen {

    position: fixed;

    inset: 0;

    pointer-events: auto;

    display: flex;

    align-items: center;

    justify-content: center;

    overflow: hidden;

}


.guide-background {

    position: absolute;

    inset: -20px;

    width: calc(100% + 40px);

    height: calc(100% + 40px);

    object-fit: cover;

    filter:
        blur(7px)
        brightness(0.45);

    transform: scale(1.04);

}


.guide-overlay {

    position: absolute;

    inset: 0;

    background:
        rgba(3,18,14,0.28);

}


.guide-box {

    position: relative;

    z-index: 2;

    width:
        min(820px, 90vw);

    padding: 52px;

    border-radius: 27px;

    background:
        rgba(4,23,18,0.92);

    border:
        1px solid
        rgba(190,225,198,0.2);

    box-shadow:
        0 30px 90px
        rgba(0,0,0,0.5);

}


.guide-small {

    color: #a9dba9;

    font-size: 13px;

    font-weight: 800;

    letter-spacing: 4px;

}


.guide-title {

    margin-top: 20px;

    font-size:
        clamp(40px, 5vw, 62px);

    font-weight: 900;

}


.guide-text {

    margin-top: 22px;

    color: #c3cec8;

    font-size: 18px;

    line-height: 1.7;

}


.guide-button {

    margin-top: 30px;

    padding:
        17px 27px;

    border: none;

    border-radius: 13px;

    background: #f4f7f2;

    color: #071711;

    font-weight: 900;

    cursor: pointer;

}


/* =====================================================
   MAP SCREEN
===================================================== */

#map-screen {

    position: fixed;

    inset: 0;

    pointer-events: auto;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    background:
        #07130f;

    padding:
        20px 30px;

}


.map-header {

    text-align: center;

    margin-bottom: 14px;

}


.map-eyebrow {

    color: #9ed4a9;

    font-size: 11px;

    letter-spacing: 4px;

    font-weight: 800;

}


.map-title {

    margin-top: 5px;

    font-size: 31px;

    font-weight: 900;

}


.map-subtitle {

    color: #aebbb4;

    margin-top: 5px;

    font-size: 13px;

}


.map-container {

    position: relative;

    width:
        min(1100px, 94vw);

    aspect-ratio:
        1536 / 1024;

    border:
        1px solid
        rgba(180,220,190,0.2);

    border-radius: 18px;

    overflow: hidden;

    box-shadow:
        0 25px 70px
        rgba(0,0,0,0.55);

}


.map-image {

    position: absolute;

    inset: 0;

    width: 100%;

    height: 100%;

    object-fit: cover;

}


.map-hotspot {

    position: absolute;

    border: none;

    background:
        rgba(169,219,169,0);

    cursor: pointer;

    transition:
        background 0.2s ease;

}


.map-hotspot:hover {

    background:
        rgba(169,219,169,0.13);

}


.map-hotspot::after {

    content: "EXPLORE →";

    position: absolute;

    left: 50%;

    bottom: 8px;

    transform:
        translateX(-50%);

    white-space: nowrap;

    padding:
        7px 11px;

    border-radius: 9px;

    background:
        rgba(4,23,18,0.92);

    color: white;

    font-size: 10px;

    font-weight: 800;

    opacity: 0;

    transition:
        opacity 0.2s ease;

}


.map-hotspot:hover::after {

    opacity: 1;

}


/*
   Exact 3 × 2 areas of the uploaded map.
*/

.hotspot-mainblock {

    left: 0%;

    top: 0%;

    width: 33.333%;

    height: 47.8%;

}


.hotspot-library {

    left: 33.333%;

    top: 0%;

    width: 33.333%;

    height: 47.8%;

}


.hotspot-lab {

    left: 66.666%;

    top: 0%;

    width: 33.333%;

    height: 47.8%;

}


.hotspot-hub {

    left: 0%;

    top: 48%;

    width: 33.333%;

    height: 45.5%;

}


.hotspot-canteen {

    left: 33.333%;

    top: 48%;

    width: 33.333%;

    height: 45.5%;

}


.hotspot-sports {

    left: 66.666%;

    top: 48%;

    width: 33.333%;

    height: 45.5%;

}


.map-footer {

    margin-top: 13px;

    color: #8f9d96;

    font-size: 11px;

}


/* =====================================================
   MOBILE
===================================================== */

@media
(max-width: 700px) {

    .game-title {

        font-size: 70px;

        letter-spacing: -4px;

    }


    .character-cards {

        gap: 10px;

    }


    .character-card {

        width: 155px;

        height: 230px;

    }


    .character-card img {

        width: 95px;

        height: 145px;

    }


    .dialogue-box,
    .guide-box {

        padding: 30px;

    }


    .map-screen {

        padding: 10px;

    }

}

</style>


<!-- =====================================================
     FADE
===================================================== -->

<div id="fade-layer"></div>


<!-- =====================================================
     WELCOME
===================================================== -->

<section id="welcome-screen">

    <div class="eyebrow">
        ✦ COLLEGE ADVENTURE
    </div>


    <h1 class="game-title">

        CAMPUS

        <span>
            BOUND
        </span>

    </h1>


    <div class="subtitle">
        A new campus. A new journey.
    </div>


    <div class="subtitle-small">
        Your adventure starts here.
    </div>


    <div class="name-area">

        <label>
            Before we begin... what's your name?
        </label>


        <input
            id="name-input"
            class="name-input"
            type="text"
            maxlength="25"
            placeholder="Enter your name"
            autocomplete="off"
        >

    </div>


    <button
        id="begin-button"
        class="primary-button"
    >

        BEGIN ADVENTURE
        &nbsp;&nbsp; →

    </button>

</section>


<!-- =====================================================
     CHARACTER SELECT
===================================================== -->

<section
    id="character-screen"
    class="hidden"
>

    <div class="chapter">
        CHAPTER 01
    </div>


    <h2 class="select-title">
        Choose Your Character
    </h2>


    <div class="select-subtitle">

        Nice to meet you,
        <span id="character-name"></span>!
        Now choose your character.

    </div>


    <div class="character-cards">


        <div
            id="boy-card"
            class="character-card"
        >

            <img
                src="/assests/boy.png"
            >

            <div class="character-name">
                Boy
            </div>

            <div class="character-hint">
                SELECT
            </div>

        </div>


        <div
            id="girl-card"
            class="character-card selected"
        >

            <img
                src="/assests/girl.png"
            >

            <div class="character-name">
                Girl
            </div>

            <div class="character-hint">
                SELECT
            </div>

        </div>


    </div>


    <button
        id="character-continue"
        class="primary-button"
    >

        CONTINUE
        &nbsp;&nbsp; →

    </button>

</section>


<!-- =====================================================
     WELCOME DIALOGUE
===================================================== -->

<section
    id="dialogue-screen"
    class="hidden"
>

    <div class="dialogue-box">

        <div class="dialogue-day">
            DAY 01 · FIRST DAY
        </div>


        <div
            id="dialogue-title"
            class="dialogue-title"
        >
            WELCOME!
        </div>


        <div class="dialogue-text">

            It's your first day on campus.
            There are new places to discover,
            new people to meet and plenty of
            adventures waiting for you.

            <br><br>

            Let's explore your campus.

        </div>


        <button
            id="lets-go"
            class="primary-button"
        >

            LET'S GO
            &nbsp;&nbsp; →

        </button>

    </div>

</section>


<!-- =====================================================
     CAMPUS GUIDE
===================================================== -->

<section
    id="guide-screen"
    class="hidden"
>


    <img
        src="/assests/campus.png"
        class="guide-background"
    >


    <div class="guide-overlay"></div>


    <div class="guide-box">

        <div class="guide-small">
            CAMPUS GUIDE
        </div>


        <div class="guide-title">
            Let's explore your map destinations.
        </div>


        <div class="guide-text">

            Your campus has plenty of places waiting
            to be discovered.

            <br>

            Choose a destination from the map and
            begin exploring.

        </div>


        <button
            id="open-map"
            class="guide-button"
        >

            VIEW CAMPUS MAP
            &nbsp;&nbsp; →

        </button>

    </div>

</section>


<!-- =====================================================
     MAP
===================================================== -->

<section
    id="map-screen"
    class="hidden"
>


    <div class="map-header">

        <div class="map-eyebrow">
            CAMPUS GUIDE
        </div>


        <div class="map-title">
            Choose Your Destination
        </div>


        <div class="map-subtitle">
            Click a place to begin exploring.
        </div>

    </div>


    <div class="map-container">


        <img
            src="/assests/campus-location.png"
            class="map-image"
        >


        <!-- MAIN BLOCK -->

        <button
            class="
                map-hotspot
                hotspot-mainblock
            "
            data-location="mainblock"
            aria-label="Main Block"
        ></button>


        <!-- LIBRARY -->

        <button
            class="
                map-hotspot
                hotspot-library
            "
            data-location="library"
            aria-label="Library"
        ></button>


        <!-- LAB -->

        <button
            class="
                map-hotspot
                hotspot-lab
            "
            data-location="lab"
            aria-label="Lab"
        ></button>


        <!-- STUDENT HUB -->

        <button
            class="
                map-hotspot
                hotspot-hub
            "
            data-location="studenthub"
            aria-label="Student Hub"
        ></button>


        <!-- CANTEEN -->

        <button
            class="
                map-hotspot
                hotspot-canteen
            "
            data-location="canteen"
            aria-label="Canteen"
        ></button>


        <!-- SPORTS -->

        <button
            class="
                map-hotspot
                hotspot-sports
            "
            data-location="sports"
            aria-label="Sports Ground"
        ></button>


    </div>


    <div class="map-footer">
        Different places. A brighter you.
    </div>


</section>

`;


document.body.appendChild(ui);


/* =========================================================
   ELEMENTS
========================================================= */

const welcomeScreen =
    document.getElementById(
        "welcome-screen"
    );


const characterScreen =
    document.getElementById(
        "character-screen"
    );


const dialogueScreen =
    document.getElementById(
        "dialogue-screen"
    );


const guideScreen =
    document.getElementById(
        "guide-screen"
    );


const mapScreen =
    document.getElementById(
        "map-screen"
    );


const fadeLayer =
    document.getElementById(
        "fade-layer"
    );


const nameInput =
    document.getElementById(
        "name-input"
    );


/* =========================================================
   INPUT FIX
========================================================= */

[
    "keydown",
    "keyup",
    "keypress"
].forEach(
    eventName => {

        nameInput.addEventListener(
            eventName,
            event => {

                event.stopPropagation();

            }
        );

    }
);


/* =========================================================
   BEGIN ADVENTURE
========================================================= */

document
    .getElementById(
        "begin-button"
    )
    .addEventListener(
        "click",
        () => {

            playerName =
                nameInput.value.trim();


            if (!playerName) {

                nameInput.focus();

                nameInput.style.borderColor =
                    "#e19b9b";

                setTimeout(
                    () => {

                        nameInput.style.borderColor =
                            "rgba(255,255,255,0.18)";

                    },
                    700
                );

                return;

            }


            document
                .getElementById(
                    "character-name"
                )
                .textContent =
                playerName;


            fadeTo(
                "character"
            );

        }
    );


/* =========================================================
   CHARACTER SELECTION
========================================================= */

const boyCard =
    document.getElementById(
        "boy-card"
    );


const girlCard =
    document.getElementById(
        "girl-card"
    );


boyCard.addEventListener(
    "click",
    () => {

        selectedCharacter =
            "boy";


        boyCard.classList.add(
            "selected"
        );


        girlCard.classList.remove(
            "selected"
        );

    }
);


girlCard.addEventListener(
    "click",
    () => {

        selectedCharacter =
            "girl";


        girlCard.classList.add(
            "selected"
        );


        boyCard.classList.remove(
            "selected"
        );

    }
);


/* =========================================================
   CHARACTER → WELCOME
========================================================= */

document
    .getElementById(
        "character-continue"
    )
    .addEventListener(
        "click",
        () => {

            fadeTo(
                "dialogue"
            );

        }
    );


/* =========================================================
   WELCOME → CAMPUS GUIDE
========================================================= */

document
    .getElementById(
        "lets-go"
    )
    .addEventListener(
        "click",
        () => {

            fadeTo(
                "guide"
            );

        }
    );


/* =========================================================
   GUIDE → MAP
========================================================= */

document
    .getElementById(
        "open-map"
    )
    .addEventListener(
        "click",
        () => {

            fadeTo(
                "map"
            );

        }
    );


/* =========================================================
   MAP LOCATION BUTTONS
========================================================= */

document
    .querySelectorAll(
        ".map-hotspot"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const location =
                        button.dataset.location;


                    enterLocation(
                        location
                    );

                }
            );

        }
    );


/* =========================================================
   ENTER LOCATION
========================================================= */

function enterLocation(
    locationId
) {

    currentLocation =
        locationId;


    /*
        Fade to black.
    */

    fadeLayer.style.opacity =
        "1";


    setTimeout(
        () => {

            /*
                Hide map.
            */

            mapScreen.classList.add(
                "hidden"
            );


            /*
                Start location scene.
            */

            game.scene.stop(
                "LocationScene"
            );


            game.scene.start(
                "LocationScene"
            );


            /*
                Fade back in.
            */

            setTimeout(
                () => {

                    fadeLayer.style.opacity =
                        "0";

                },
                250
            );

        },
        600
    );

}


/* =========================================================
   RETURN TO MAP
========================================================= */

function returnToMap() {

    fadeLayer.style.opacity =
        "1";


    setTimeout(
        () => {

            game.scene.stop(
                "LocationScene"
            );


            mapScreen.classList.remove(
                "hidden"
            );


            setTimeout(
                () => {

                    fadeLayer.style.opacity =
                        "0";

                },
                200
            );

        },
        550
    );

}


/* =========================================================
   GENERAL FADE NAVIGATION
========================================================= */

function fadeTo(
    destination
) {

    fadeLayer.style.opacity =
        "1";


    setTimeout(
        () => {

            /*
                Hide all screens.
            */

            welcomeScreen.classList.add(
                "hidden"
            );

            characterScreen.classList.add(
                "hidden"
            );

            dialogueScreen.classList.add(
                "hidden"
            );

            guideScreen.classList.add(
                "hidden"
            );

            mapScreen.classList.add(
                "hidden"
            );


            /*
                CHARACTER
            */

            if (
                destination ===
                "character"
            ) {

                characterScreen.classList.remove(
                    "hidden"
                );

            }


            /*
                WELCOME
            */

            if (
                destination ===
                "dialogue"
            ) {

                dialogueScreen.classList.remove(
                    "hidden"
                );


                document
                    .getElementById(
                        "dialogue-title"
                    )
                    .textContent =
                    `WELCOME, ${playerName.toUpperCase()}!`;

            }


            /*
                CAMPUS GUIDE
            */

            if (
                destination ===
                "guide"
            ) {

                guideScreen.classList.remove(
                    "hidden"
                );

            }


            /*
                MAP
            */

            if (
                destination ===
                "map"
            ) {

                mapScreen.classList.remove(
                    "hidden"
                );

            }


            /*
                Fade in.
            */

            setTimeout(
                () => {

                    fadeLayer.style.opacity =
                        "0";

                },
                120
            );

        },
        600
    );

}


/* =========================================================
   INITIAL STATE
========================================================= */

welcomeScreen.classList.remove(
    "hidden"
);

characterScreen.classList.add(
    "hidden"
);

dialogueScreen.classList.add(
    "hidden"
);

guideScreen.classList.add(
    "hidden"
);

mapScreen.classList.add(
    "hidden"
);

fadeLayer.style.opacity =
    "0";