export default {
    show: popup => {
        document.querySelector('.popup-container').style.display = 'grid'
        document.querySelector(`.popup-${popup}`).classList.add('popup-visible')
    },
    hide: ev => {
        ev?.preventDefault()
        document.querySelector('.popup-container').style.display = 'none'
        document.querySelector('.popup-visible').classList.remove('popup-visible')
    }
}