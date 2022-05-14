const btn = document.getElementById("btn");
const btnF = document.getElementById("btnF");
const aud = document.getElementById("aud");
const spinner = document.querySelector(".spinner");
const title = document.querySelector(".title");

btn.addEventListener("click", async () => {
    let file;
    [file] = await showOpenFilePicker();
    play(await file.getFile());
});
const folder = [];
btnF.addEventListener("click", async () => {
    let dir;
    dir = await showDirectoryPicker();

    loopDir(dir)
    playF();
});

const loopDir = async (dir) => {
    for await (const entry of dir.values()) {
        console.log(entry);
        if (entry.kind === "directory") {
            loopDir(entry)
        }
        if (entry.kind === "file") {
            folder.push(await entry.getFile());
        }

    }
}

aud.addEventListener("load", () => {
    URL.revokeObjectURL(file);
});
aud.addEventListener("pause", () => {
    // spinner.className = "spinner"
    spinner.style.animation = null;
});

aud.addEventListener("play", () => {
    spinner.className = spinner.className + " spin";
});
function play(file) {
    if (file) {
        console.log(file);
        let blob = new Blob([file]);
        let url = URL.createObjectURL(blob);
        aud.src = url;
        aud.play();
        title.innerText = file.name;
    }
}
function playF() {
    if (folder) {
        let i = 0;
        play(folder[i]);
        i++
        aud.onended = () => {
            if (i < folder.length) {
                play(folder[i]);
                i++
            } else {
                aud.pause()
            }
        }
    }
}
