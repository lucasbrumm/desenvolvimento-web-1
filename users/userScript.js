const apiUrl = 'https://dummyjson.com/users'

const users = []

function displayUsers() {
  const postList = document.getElementById('user-list')
  postList.innerHTML = ''
  users.forEach((user) => {
    const listItem = document.createElement('div')
    listItem.setAttribute('class', 'card-users')
    listItem.innerHTML = `
      <img src="${user.image}" alt="${user.firstName}" />
      <div class="space"><strong>Nome:</strong> ${user.firstName}</div>
      <div class="space"><strong>Sobrenome:</strong> ${user.lastName}</div>
      <div class="space"><strong>Email:</strong> ${user.email}</div>
      <div class="space"><strong>Idade:</strong> ${user.age}</div>
    `
    postList.appendChild(listItem)
  })
}

function fetchUsers() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      data.users.forEach((user) => {
        const userResponse = new User(
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          user.age,
          user.image
        )
        users.push(userResponse)
      })
      displayUsers()
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

document.addEventListener('DOMContentLoaded', function () {
  fetchUsers()
})
