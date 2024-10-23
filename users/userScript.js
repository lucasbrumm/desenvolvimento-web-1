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
      <span><strong>Nome:</strong> ${user.firstName}</span>
      <span><strong>Sobrenome:</strong> ${user.lastName}</span>
      <span><strong>Email:</strong> ${user.email}</span>
      <span><strong>Idade:</strong> ${user.age}</span>
      <div class="container-user-card-footer">
      <button class="btn-edit-user">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
        <button class="btn-delete-user">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
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

  // Get the modal
  const modal = document.getElementById('addUserModal')

  // Get the button that opens the modal
  const btn = document.getElementById('btn-add-user')

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('close')[0]

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.style.display = 'block'
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = 'none'
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none'
    }
  }
})
