export default {
    window: (title, bodyText, yes={action, text}, no={action, text}) => {
        const container = document.createElement('div')
        container.classList = "popup-container"
        const popup = document.createElement('div')
        popup.classList = "popup"

        const popupTitle = document.createElement('h1')
        popupTitle.classList = "popup-title"
        popupTitle.innerHTML = title

        const popupBodyText = document.createElement('p')
        popupBodyText.classList = "popup-body"
        popupBodyText.innerHTML = bodyText

        const actionButtons = document.createElement('div')
        actionButtons.classList = "popup-actions"

        const yesButton = document.createElement('button')
        yesButton.classList = "popup-action popup-action-yes"
        yesButton.innerHTML = yes.text
        yesButton.addEventListener('click', () => {
            yes.action()
            document.body.removeChild(container)
        })

        const noButton = document.createElement('button')
        noButton.classList = "popup-action popup-action-no"
        noButton.innerHTML = no.text
        noButton.addEventListener('click', () => {
            no.action()
            document.body.removeChild(container)
        })

        actionButtons.append(yesButton, noButton)
        popup.append(popupTitle, popupBodyText, actionButtons)
        container.append(popup)
        document.body.append(container)
    }
}