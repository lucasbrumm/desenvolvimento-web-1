const apiUrl = 'https://dummyjson.com/users'

const users = []
let editingUserId = null

function displayUsers(filteredUsers = users) {
  const postList = document.getElementById('user-list')
  postList.innerHTML = ''
  filteredUsers.forEach((user) => {
    const listItem = document.createElement('div')
    listItem.setAttribute('class', 'card-users')
    listItem.innerHTML = `
      <img src="${user.image}" alt="${user.firstName}" />
      <span><strong>Nome:</strong> ${user.firstName}</span>
      <span><strong>Sobrenome:</strong> ${user.lastName}</span>
      <span><strong>Email:</strong> ${user.email}</span>
      <span><strong>Idade:</strong> ${user.age}</span>
      <div class="container-user-card-footer">
        <button class="btn-edit-user" data-id="${user.id}">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-delete-user" data-id="${user.id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `
    postList.appendChild(listItem)
  })

  // Add event listeners to edit buttons
  document.querySelectorAll('.btn-edit-user').forEach((button) => {
    button.addEventListener('click', (event) => {
      const userId = event.currentTarget.getAttribute('data-id')
      editUser(userId)
    })
  })

  // Add event listeners to delete buttons
  document.querySelectorAll('.btn-delete-user').forEach((button) => {
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
    form.image.value = user.image // Set the previous image URL

    // Update modal title and button text
    document.getElementById('modal-title').innerText = 'Editar Usuário'
    document.getElementById('modal-submit-button').innerText = 'Salvar'

    // Set editing user ID
    editingUserId = userId

    // Open the modal
    const modal = document.getElementById('addUserModal')
    modal.style.display = 'block'
  }
}

function saveUser(event) {
  event.preventDefault()
  const form = document.getElementById('addUserForm')
  const formData = new FormData(form)

  // Validate form fields
  if (!validateForm(formData)) {
    return
  }

  const imageUrl = formData.get('image') || form.image.value

  const newUser = {
    id: editingUserId || Date.now(), // Use existing ID or generate a new one
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    age: formData.get('age'),
    image: imageUrl || 'default.jpg', // Use previous image or default if none provided
  }

  if (editingUserId) {
    // Update existing user
    const userIndex = users.findIndex((u) => u.id == editingUserId)
    users[userIndex] = newUser
  } else {
    // Add new user
    users.push(newUser)
  }

  // Reset form and close modal
  resetForm()
  const modal = document.getElementById('addUserModal')
  modal.style.display = 'none'

  // Refresh user list
  displayUsers()
}

function validateForm(formData) {
  const firstName = formData.get('firstName')
  const lastName = formData.get('lastName')
  const email = formData.get('email')
  const age = formData.get('age')
  const image = formData.get('image')

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

// Function to reset the form
function resetForm() {
  const form = document.getElementById('addUserForm')
  form.reset()
  editingUserId = null // Reset editing user ID
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

  // Get the modal
  const modal = document.getElementById('addUserModal')

  // Get the button that opens the modal
  const btn = document.getElementById('btn-add-user')

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('close')[0]

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    resetForm() // Ensure the form is reset when adding a new user
    modal.style.display = 'block'
  }

  // When the user clicks on <span> (x), close the modal and reset the form
  span.onclick = function () {
    modal.style.display = 'none'
    resetForm()
  }

  // When the user clicks anywhere outside of the modal, close it and reset the form
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none'
      resetForm()
    }
  }

  // Handle form submission
  const form = document.getElementById('addUserForm')
  form.addEventListener('submit', saveUser)

  // Handle user filter
  const filterInput = document.getElementById('user-filter')
  filterInput.addEventListener('input', filterUsers)

  // Prevent negative numbers in age input
  const ageInput = document.getElementById('age')
  ageInput.addEventListener('input', function () {
    if (this.value < 0) {
      this.value = 0
    }
  })
})
