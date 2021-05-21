document.querySelectorAll('.verify').forEach(element => {
    element.addEventListener('click', async ev => {
        const validateReq = await fetch(
            `/api/users/validate/${element.id}`,
            {
                method: 'POST'
            }
        )
        const status = await validateReq.json()
    
        if (!status.success)
            return console.log(status.error)
    
        const userElement = document.querySelector(`[userID="${element.id}"]`)
        userElement.parentElement.removeChild(userElement)
    })
})

document.querySelectorAll('.delete').forEach(element => {
    element.addEventListener('click', async ev => {
        const deleteReq = await fetch(
            `/api/admin/deleteUser/${element.id}`,
            {
                method: 'POST'
            }
        )
        const status = await deleteReq.json()
    
        if (!status.success)
            return console.log(status.error)

        const userElement = document.querySelector(`[userID="${element.id}"]`)
        userElement.parentElement.removeChild(userElement)
    })
})