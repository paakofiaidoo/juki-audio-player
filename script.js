const btn = document.getElementById("btn")
const aud = document.getElementById("aud")

btn.addEventListener("click", async () => {
    let file;
    [file] = await showOpenFilePicker();
    play(await file.getFile())
})
aud.addEventListener("load", () => {
    URL.revokeObjectURL(file);
})

function play(file) {
    if (file) {
        let blob = new Blob([file], { type: "application/mp3" })
        let url = URL.createObjectURL(blob)
        aud.src = url
        aud.play()
    }
}