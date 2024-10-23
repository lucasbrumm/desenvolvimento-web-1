const apiUrl = 'https://dummyjson.com/users'

const users = []
let editingUserId = null

function displayUsers(filteredUsers = users) {
  const userList = document.getElementById('user-list')
  userList.innerHTML = ''
  filteredUsers.forEach((user) => {
    const listItem = document.createElement('div')
    listItem.setAttribute('class', 'card-default')
    listItem.innerHTML = `
      <img src="${user.image}" alt="${user.firstName}" />
      <span><strong>Nome:</strong> ${user.firstName}</span>
      <span><strong>Sobrenome:</strong> ${user.lastName}</span>
      <span><strong>Email:</strong> ${user.email}</span>
      <span><strong>Idade:</strong> ${user.age}</span>
      <div class="container-default-card-footer">
        <button class="btn-edit-card" data-id="${user.id}">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-delete-card" data-id="${user.id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `
    userList.appendChild(listItem)
  })

  // Add event listeners to edit buttons
  document.querySelectorAll('.btn-edit-card').forEach((button) => {
    button.addEventListener('click', (event) => {
      const userId = event.currentTarget.getAttribute('data-id')
      editUser(userId)
    })
  })

  // Add event listeners to delete buttons
  document.querySelectorAll('.btn-delete-card').forEach((button) => {
    button.addEventListener('click', (event) => {
      const userId = event.currentTarget.getAttribute('data-id')
      deleteUser(userId)
    })
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

function editUser(userId) {
  const user = users.find((u) => u.id == userId)
  if (user) {
    const form = document.getElementById('addUserForm')
    form.firstName.value = user.firstName
    form.lastName.value = user.lastName
    form.email.value = user.email
    form.age.value = user.age
    form.image.value = user.image

    document.getElementById('modal-title').innerText = 'Editar Usuário'
    document.getElementById('modal-submit-button').innerText = 'Salvar'

    editingUserId = userId

    const modal = document.getElementById('addUserModal')
    modal.style.display = 'block'
  }
}

function saveUser(event) {
  event.preventDefault()
  const form = document.getElementById('addUserForm')
  const formData = new FormData(form)

  if (!validateForm(formData)) {
    return
  }

  const imageUrl = formData.get('image') || form.image.value

  const newUser = {
    id: editingUserId || Date.now(),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    age: formData.get('age'),
    image: imageUrl || 'default.jpg',
  }

  if (editingUserId) {
    const userIndex = users.findIndex((u) => u.id == editingUserId)
    users[userIndex] = newUser
  } else {
    users.push(newUser)
  }

  resetForm()
  const modal = document.getElementById('addUserModal')
  modal.style.display = 'none'

  displayUsers()
}

function validateForm(formData) {
  const firstName = formData.get('firstName')
  const lastName = formData.get('lastName')
  const email = formData.get('email')
  const age = formData.get('age')
  const image = formData.get('image')

  // regex patterns
  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
  const urlPattern = /^https?:\/\/.+/

  if (
    !firstName ||
    firstName.length < 3 ||
    firstName.length > 50 ||
    !lastName ||
    lastName.length < 3 ||
    lastName.length > 50 ||
    !email ||
    !emailPattern.test(email) ||
    !age ||
    age < 0 ||
    age > 120 ||
    (image && image.size > 0 && !urlPattern.test(image.name))
  ) {
    alert('Por favor, preencha todos os campos corretamente.')
    return false
  }

  return true
}

function deleteUser(userId) {
  const userIndex = users.findIndex((u) => u.id == userId)
  if (userIndex > -1) {
    users.splice(userIndex, 1)
    displayUsers()
  }
}

function resetForm() {
  const form = document.getElementById('addUserForm')
  form.reset()
  editingUserId = null
  document.getElementById('modal-title').innerText = 'Adicionar Usuário'
  document.getElementById('modal-submit-button').innerText = 'Adicionar'
}

function filterUsers(event) {
  const searchTerm = event.target.value.toLowerCase()
  const filteredUsers = users.filter((user) => {
    return (
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    )
  })
  displayUsers(filteredUsers)
}

document.addEventListener('DOMContentLoaded', function () {
  fetchUsers()

  const modal = document.getElementById('addUserModal')

  const btn = document.getElementById('btn-add-user')

  const span = document.getElementsByClassName('close')[0]

  btn.onclick = function () {
    resetForm()
    modal.style.display = 'block'
  }

  span.onclick = function () {
    modal.style.display = 'none'
    resetForm()
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none'
      resetForm()
    }
  }

  const form = document.getElementById('addUserForm')
  form.addEventListener('submit', saveUser)

  const filterInput = document.getElementById('user-filter')
  filterInput.addEventListener('input', filterUsers)

  const ageInput = document.getElementById('age')
  ageInput.addEventListener('input', function () {
    if (this.value < 0) {
      this.value = 0
    }
  })
})
