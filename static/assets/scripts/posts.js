export default function initPosts() {
    // Load images
    const observerConfig = {
        rootMargin: '0px 0px 50px 0px',
        threshold: 0
    }

    const observer = new IntersectionObserver((entries, self) => {
        entries.forEach(async entry => {
            if (entry.isIntersecting) {
                const target = entry.target
                const imageReq = await fetch(`/api/posts/rawimage/string/${target.id}`)
                const imageDataSrc = await imageReq.json()

                if (!imageDataSrc.success)
                    return console.log(imageDataSrc.error)

                target.style.backgroundImage = `url(${imageDataSrc.image})`

                self.unobserve(target)
            }
        },
        observerConfig)
    })

    document.querySelectorAll('.post-image')?.forEach(image => observer.observe(image))

    // Like buttons
    document.querySelectorAll('.action-like').forEach(element => {
        element.addEventListener('click', async ev => {
            const classList = element.classList

            if (classList.contains('active')) {
                // Unlike
                const unlikeReq = await fetch(
                    `/api/posts/unlike/${element.id}`,
                    {
                        method: 'DELETE'
                    }
                )

                const status = await unlikeReq.json()

                if (!status.success)
                    return console.log(status)

                classList.remove('active')
                const likeAmount = document.querySelector(`span.like-amount[postID="${element.id}"]`)
                likeAmount.innerHTML = parseInt(likeAmount.innerHTML) - 1
            } else {
                // Like
                const likeReq = await fetch(
                    `/api/posts/like/${element.id}`,
                    {
                        method: 'POST'
                    }
                )

                const status = await likeReq.json()

                if (!status.success)
                    return console.log(status)

                classList.add('active')
                const likeAmount = document.querySelector(`span.like-amount[postID="${element.id}"]`)
                likeAmount.innerHTML = parseInt(likeAmount.innerHTML) + 1
            }
        })
    })

    // Share buttons
    document.querySelectorAll('.action-share').forEach(element => {
        element.addEventListener('click', ev => {
            const tmpElement = document.createElement('textarea')
            tmpElement.value = `${window.location.origin}/app/post/view/${element.id}`
            document.body.appendChild(tmpElement)
            tmpElement.select()
            document.execCommand("copy")
            document.body.removeChild(tmpElement)
        })
    })

    // Delete buttons
    document.querySelectorAll('.action-delete').forEach(element => {
        element.addEventListener('click', async ev => {
            const deleteReq = await fetch(
                `/api/posts/delete/${element.id}`,
                {
                    method: 'DELETE'
                }
            )

            const status = await deleteReq.json()

            if (!status.success)
                return console.log(status)

            window.location.reload()
        })
    })
}