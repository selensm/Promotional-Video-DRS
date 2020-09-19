
let options = {
    "controls": true,
    "autoplay": false,
    "preload": "auto",
    "muted": false
};

videojs('video', options);



// Source: 

const fps = 30;     // ## adjust this to set the frames per second precision on the hotspot appearance (lower = less cpu used)
const debug = true; // ## set to true to get console.log output, use   video.log('text')
// ## SETTINGS END

const msInterval = Math.floor(1000 / fps); // calculate how many ms per loop to match desired FPS. Rounded down
let engine; // declare a variable that will be used for the interval loop

let video = {
    log: (message = 'Missing log text') => {
        if (debug) {
            console.log(message);
        }
    },
    hotspots: {
        running: false,
        init: () => {
            video.log('video hotspot engine: init');
            const elmsVideo = document.querySelectorAll('video');   // grab all videos on the page
            elmsVideo.forEach((elmVideo) => {                       // loop through the parents of the video elements
                elmVideo.parentElement.classList.add('videoHotspotsParent');
                elmVideo.addEventListener('play', (event) => {      // add eventlistener play on videos
                    if (!video.hotspots.running) {                   // start engine, if it is not running already
                        video.hotspots.on();
                    }
                });
                elmVideo.addEventListener('seeked', (event) => {      // add eventlistener play on videos
                    if (!video.hotspots.running) {                   // start engine, if it is not running already
                        video.hotspots.on(true);
                    }
                });
                elmVideo.addEventListener('pause', (event) => {         // add eventlistener stop/pause on videos
                    if (video.hotspots.running) {       // if engine is running
                        let videoPlaying = false;       // check if all videos are stopped/paused
                        elmsVideo.forEach((elmVideo) => {
                            if (!elmVideo.paused) {
                                videoPlaying = true;
                            }
                        });
                        if (!videoPlaying) {
                            video.hotspots.off();   // if all videos are NOT playing we can turn off the loop engine
                        }
                    }
                });
            });
        },
        on: (isSeeked = false) => {
            // start the interval loop
            video.log('video hotspot engine: on');
            if (!video.hotspots.running) {       // only start it if it isn't already running
                video.hotspots.running = true;  // make sure to tell our boolean that we are turning on the engine
            }
            engine = setInterval(() => {        // start the interval engine
                video.log('engine loop');
                video.hotspots.update(isSeeked);
            }, msInterval);
        },
        off: () => {
            // kill the interval var
            video.log('video hotspot engine: off');
            video.hotspots.running = false;     // make sure to tell our boolean that the engine is being stopped
            clearInterval(engine);              // stop the engine
        },
        update: () => {
            hotspots.forEach((hotspot, index) => {
                if (hotspot.active) {
                    // get video element for hotspot
                    const video = document.querySelector(`#${hotspot.videoId}>video`);
                    if (video) {
                        const now = video.currentTime;
                        const elmHotspotCheck = document.querySelector(`#hotspotId${index}`);


                        if (hotspot.markIn > now || hotspot.markOut <= now) {
                            // check to see if element with the current hotspot id exists
                            if (elmHotspotCheck) {
                                // remove hotspot element
                                const elmHotspot = document.querySelector(`#hotspotId${index}`);
                                elmHotspot.parentElement.removeChild(elmHotspot);
                                hotspot.onscreen = false; // clear on-screen flag for the current hotspot
                            }
                        } else if (hotspot.markIn <= now && hotspot.markOut > now) {
                            if (!elmHotspotCheck) { // only draw new hotspot if it isn't already drawn
                                let elmHotspot = document.createElement('a');
                                elmHotspot.id = `hotspotId${index}`;
                                elmHotspot.className = 'hotspot';
                                if (hotspot.ui.title) {
                                    elmHotspot.title = hotspot.ui.title;
                                }
                                if (hotspot.ui.text && hotspot.ui.text != "") {
                                    elmHotspot.innerHTML = hotspot.ui.text;
                                }
                                let css = "";
                                css += `width: ${hotspot.sizeX}%;`;
                                css += `height: ${hotspot.sizeY}%;`;
                                css += `left: ${hotspot.posX}%;`;
                                css += `top: ${hotspot.posY}%;`;
                                css += `${hotspot.ui.style};`;
                                if (hotspot.ui.type == 'image') {
                                    // insert image css
                                    css += `background-image: url(${hotspot.ui.image});`;
                                    elmHotspot.classList.add('image');
                                }
                                elmHotspot.style = css;
                                if (hotspot.hotspot.type == 'link') {
                                    // it's a link, set target and href
                                    elmHotspot.href = hotspot.hotspot.url;
                                    elmHotspot.target = hotspot.hotspot.target;
                                } else {
                                    // it's a function, set an eventlistener for click
                                    elmHotspot.addEventListener('click', (event) => {
                                        event.preventDefault(); // prevent the normal action when clicking on an <a> tag
                                        hotspot.hotspot.func(); // run the function that the hotspot JSON contains for this hotspot
                                    });
                                }
                                video.parentElement.appendChild(elmHotspot);
                                video.pause();
                            }
                        }
                    }
                }
            });
        },
        remove: () => {
            // kill all hotspot related functions, json feed and DOM elements - use  video.hotspots.remove()  to do this
            video.log('video hotspot engine: cleanup');
            video.hotspots.off();                                               // turn off engine
            const elmsHotspots = document.querySelectorAll('a.hotspot');        // find all hotspot DOM elements
            elmsHotspots.forEach((elmHotspot) => {                              // loop through hotspots
                elmHotspot.parentElement.removeChild(elmHotspot);              // remove current hotspot
            });
            video.play();
            delete video;                                                       // remove the variable from memory
            delete hotspots;                                                    // remove the variable from memory
        }

    }
}
// end

let closeBtn;

const hotspots = [
    {
        active: true,
        videoId: "video",
        markIn: 7,
        markOut: 7.1,
        sizeX: 5,
        sizeY: 5,
        posX: 20,
        posY: 20,
        ui: {
            type: "box",
            image: "",
            style: "border-radius: 50%; background-color: var(--blue); padding: 2rem;",
        },
        hotspot: {
            type: "function",
            onHover: true,
            func: () => {
                document.getElementById("hotspotId0").innerHTML = hotspotInfo.hotspot1;
                document.querySelector('#hotspotOffBtn').addEventListener('click', ()=>{
                    videojs('video', options).play();
                })
            }
        }
    },
    {
        active: true,
        videoId: "video",
        markIn: 10,
        markOut: 10.1,
        sizeX: 5,
        sizeY: 5,
        posX: 20,
        posY: 20,
        ui: {
            type: "box",
            image: "",
            style: "border-radius: 50%; background-color: var(--blue); padding: 2rem;",
        },
        hotspot: {
            type: "function",
            onHover: true,
            func: () => {
                document.getElementById("hotspotId1").innerHTML = hotspotInfo.hotspot2;
                document.querySelector('#hotspotOffBtn').addEventListener('click', ()=>{
                    videojs('video', options).play();
                })
            }
        }
    },
    {
        active: true,
        videoId: "video",
        markIn: 12,
        markOut: 12.1,
        sizeX: 5,
        sizeY: 5,
        posX: 20,
        posY: 20,
        ui: {
            type: "box",
            image: "",
            style: "border-radius: 50%; background-color: var(--blue); padding: 2rem;",
        },
        hotspot: {
            type: "function",
            onHover: true,
            func: () => {
                document.getElementById("hotspotId2").innerHTML = hotspotInfo.hotspot3;
                document.querySelector('#hotspotOffBtn').addEventListener('click', ()=>{
                    videojs('video', options).play();
                })
            }
        }
    },
    {
        active: true,
        videoId: "video",
        markIn: 14,
        markOut: 14.1,
        sizeX: 5,
        sizeY: 5,
        posX: 20,
        posY: 20,
        ui: {
            type: "box",
            image: "",
            style: "border-radius: 50%; background-color: var(--blue); padding: 2rem;",
        },
        hotspot: {
            type: "function",
            onHover: true,
            func: () => {
                document.getElementById("hotspotId3").innerHTML = hotspotInfo.hotspot4;
                document.querySelector('#hotspotOffBtn').addEventListener('click', ()=>{
                    videojs('video', options).play();
                })
            }
        }
    },
    {
        active: true,
        videoId: "video",
        markIn: 18,
        markOut: 18.1,
        sizeX: 5,
        sizeY: 5,
        posX: 20,
        posY: 20,
        ui: {
            type: "box",
            image: "",
            style: "border-radius: 50%; background-color: var(--blue); padding: 2rem;",
        },
        hotspot: {
            type: "function",
            onHover: true,
            func: () => {
                document.getElementById("hotspotId4").innerHTML = hotspotInfo.hotspot5;
                document.querySelector('#hotspotOffBtn').addEventListener('click', ()=>{
                    videojs('video', options).play();
                })
            }
        }
    }
];

video.hotspots.init();

let hotspotInfo = {
    "hotspot1" : `<div class="text-box">
    <p>Bottles and cans with a deposit mark are disposable packaging that can be recycled, melted and turned into new bottles and cans.<br>
    <br>
    <b>Pant A = DKK 1.00</b><br>
    <b>Pant B = DKK 1.50</b><br>
    <b>Pant C = DKK 3.00</b></p>
    <button id="hotspotOffBtn">Okay</button> 
    </div>`,

    "hotspot2" : `<div class="text-box"><p>
    Danes excel at returning their empty bottles and cans. 92% of all bottles and cans return to the system so that the aluminum, plastic and glass can be melted and turned into new bottles and cans. </p>
    <button id="hotspotOffBtn">Okay</button> 
   </div>`,

    "hotspot3"  : `<div class="text-box"><p>
    Nearly 3000 stores throughout Denmark have reverse vending machines, where you can return all deposit-marked bottles and cans.</p>
    <button id="hotspotOffBtn">Okay</button> 
    </div>`,
    
    "hotspot4"  : `<div class="text-box"><p>
    After putting your bottles in the machine, you get an option to either get the money in a shape of a receipt, or to donate it. </p>
    <button id="hotspotOffBtn">Okay</button>  
   </div>`,

    "hotspot5" : `<div class="text-box"><p>
    The receipt can be used as means of payment or exchanged for money in the store which holds the specific reverse vending machine you used.  </p>
    <button id="hotspotOffBtn">Okay</button> 
  </div>`
}

