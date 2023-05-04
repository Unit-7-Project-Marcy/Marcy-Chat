const main = async => {
    let searchResult = 'Ch'
    const username = new URLSearchParams(window.location.search).get("username");
   console.log(username)
    fetch('/api/find?username=' + username).then(response => response.json())
    .then(data => {
        console.log(data)
        data.forEach(elem => {
            const listEle = document.createElement('li')
            listEle.classList.add('list-group-item')
            listEle.textContent = elem.username
            const searchResults = document.getElementById('searchResults')
            searchResults.append(listEle)
        })
    })
}

main()