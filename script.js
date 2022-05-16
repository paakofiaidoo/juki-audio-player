

const btn = document.getElementById("btn");
const btnF = document.getElementById("btnF");
const aud = document.getElementById("aud");
const spinner = document.querySelector(".spinner");
const title = document.querySelector(".title");
const listBtn = document.querySelector(".listBtn");
const playlist = document.querySelector(".playlist");
const btnPrev = document.querySelector("#btnPrev");
const btnNext = document.querySelector("#btnNext");
const list = document.querySelector(".list");
const total = document.querySelector(".total");
const folder = [];
let f;
let curr = 0;
if (!window.showOpenFilePicker) {
    title.innerText = "Browser not compatible, try using a modern browser (the latest version of any Chromium browser)";
}
const pickerOpts = {
    types: [
        {
            description: 'Audio Files',
            accept: {
                'audio/*': ['.mpeg', '.mp4', '.ogg', '.wav', '.m4a']
            }
        },
    ],
    excludeAcceptAllOption: true
};
btn.addEventListener("click", async () => {
    [file] = await showOpenFilePicker(pickerOpts);
    play(await file.getFile());
    folder.push(await file.getFile());
    f = folder.length
    setPlayList();
});

btnF.addEventListener("click", async () => {
    let dir;
    dir = await showDirectoryPicker(pickerOpts);
    loopDir(dir).then(() => { console.log(folder); });
});

const loopDir = async (dir) => {
    for await (const entry of dir.values()) {
        if (entry.kind === "directory") {
            loopDir(entry);
        } else if (entry.kind === "file" && (entry.name.endsWith(".mp3") || entry.name.endsWith(".mp4") || entry.name.endsWith(".ogg") || entry.name.endsWith(".wav") || entry.name.endsWith(".m4a"))) {
            folder.push(await entry.getFile());
        }
    }
    f = folder.length
    playF()
};

aud.addEventListener("load", () => {
    URL.revokeObjectURL(file);
});

aud.addEventListener("pause", () => {
    spinner.classList.remove("spin");
});

aud.addEventListener("play", () => {
    spinner.classList.add("spin");
});

function play(file) {
    if (file) {
        console.log(file);
        let blob = new Blob([file]);
        let url = URL.createObjectURL(blob);
        aud.src = url;
        aud.play();
        title.innerText = file.name;
        setPlayList();
    }
}
function setPlayList() {
    list.innerHTML = "";
    folder.forEach((file, i) => {
        const li = document.createElement("li");
        if (i === curr) {
            li.classList.add("playing");
        }
        li.addEventListener("click", () => {
            play(folder[i]);
            curr = i;
            console.log(i);
            setPlayList();
        });

        li.innerHTML = `<div class="plItem"> 
            <span class="plNum"> 
            ${i + 1} 
            .</span> 
            <span class="plTitle">
            ${file.name} 
            </span>
            </div>`;
        list.appendChild(li);
    });
    playlist.appendChild(list);
    total.innerHTML = "";
    total.innerText = `${curr + 1}/${f}`;
}

function playNext() {
    if (curr < f) {
        play(folder[++curr]);
    } else {
        curr = 0;
        play(folder[curr]);
    }
}
function playPrevious() {
    if (curr > 0) {
        play(folder[--curr]);
    }
}

function playF() {
    if (folder) {
        play(folder[++curr]);
    }
}
aud.onended = () => {
    playNext()
};
btnPrev.addEventListener("click", playPrevious);
btnNext.addEventListener("click", playNext);
