console.log('-----------------------client-----------------------')


// let arrayOfStatusBtn = Array.from(document.querySelectorAll('changeStatus'))
// arrayOfStatusBtn.forEach(x=>{
//     console.log(x)
//     x.addEventListener((e,i)=>{
//         console.log(e,i)
//     })
// })

function deletePost(i){
    let arryOfRemove = Array.from(document.querySelectorAll('.remove'))
    let animName = arryOfRemove[i].parentNode.parentNode.childNodes[1].innerText
    fetch('/api/animeList', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            animeName: animName,
            btn: `arryOfRemove[${i}]`,
            index: i
        })
    })
        .then(res=>{
            if(res.ok) return res.json()
        })
        .then(data=>{
            if(data) return window.location.reload(true)
        })
}
function updatePost(i){
    let status
    let arrayOfStatusBtn = Array.from(document.querySelectorAll('.changeStatus'))
    let animName = arrayOfStatusBtn[i].parentNode.parentNode.childNodes[1].innerText
    if(arrayOfStatusBtn[i].classList.contains('watching')){
        arrayOfStatusBtn[i].classList.remove('watching')
        arrayOfStatusBtn[i].classList.add('watched')
        status = 'off'
    }else{
        arrayOfStatusBtn[i].classList.remove('watched')
        arrayOfStatusBtn[i].classList.add('watching')
        status = 'on'
    }
    console.log(arrayOfStatusBtn[i])
    fetch('/api/animeList', {
            method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            animeName: animName,
            btn: `arrayOfStatusBtn[${i}]`,
            watchStatus: status,
            index: i
        })
    })
}