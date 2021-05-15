import popup from './popup.js';

const downloadLink = document.querySelector('#download-my-data')

downloadLink.addEventListener('click', event => {
    event.preventDefault()
    popup.window(
        "Vill du ladda ned din data?",
        "OBS! Det kan ta lite tid innan från det att du klickar \"Fortsätt\" tills din data laddas ned.",
        {
            action: () => window.location.href = downloadLink.href,
            text: "Fortsätt"
        },
        {
            action: () => {},
            text: "Avbryt"
        }
    )
})