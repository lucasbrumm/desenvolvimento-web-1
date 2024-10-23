const apiUrl = 'https://dummyjson.com/products'

const products = []

function displayProducts(filteredProducts = products) {
  const productList = document.getElementById('product-list')
  productList.innerHTML = ''
  filteredProducts.forEach((product) => {
    const listItem = document.createElement('div')
    listItem.setAttribute('class', 'card-default')
    listItem.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}" />
        <span><strong>Nome:</strong> ${product.title}</span>
        <span><strong>Preço:</strong> ${product.price}</span>
        <span><strong>Marca:</strong> ${product.brand}</span>
        <span><strong>Cartegoria:</strong> ${product.category}</span>
        <div class="container-default-card-footer">
          <button class="btn-edit-card" data-id="${product.id}">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-delete-card" data-id="${product.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `
    productList.appendChild(listItem)
  })

  // Add event listeners to edit buttons
  document.querySelectorAll('.btn-edit-user').forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.currentTarget.getAttribute('data-id')
      editUser(productId)
    })
  })

  // Add event listeners to delete buttons
  document.querySelectorAll('.btn-delete-card').forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.currentTarget.getAttribute('data-id')
      deleteProduct(productId)
    })
  })
}

function fetchProducts() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      data.products.forEach((product) => {
        const productResponse = new Product(
          product.id,
          product.title,
          product.description,
          product.price,
          product.brand || 'Sem marca',
          product.category,
          product.photos,
          product.thumbnail
        )
        products.push(productResponse)
      })
      displayProducts()
    })
}

function editProduct() {}

function saveProduct() {}

function deleteProduct(productId) {
  const productIndex = products.findIndex((u) => u.id == productId)
  if (productIndex > -1) {
    products.splice(productIndex, 1)
    displayProducts()
  }
}

function resetForm() {
  const form = document.getElementById('addProductForm')
  form.reset()
  editingUserId = null // Reset editing user ID
  document.getElementById('modal-title').innerText = 'Adicionar Produto'
  document.getElementById('modal-submit-button').innerText = 'Adicionar'
}

function filterProducts(event) {
  const searchTerm = event.target.value.toLowerCase()
  const filteredProducts = products.filter((product) => {
    return (
      product.title.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    )
  })
  displayProducts(filteredProducts)
}

document.addEventListener('DOMContentLoaded', function () {
  fetchProducts()

  const modal = document.getElementById('addProductModal')

  const btn = document.getElementById('btn-add-product')

  const span = document.getElementsByClassName('close')[0]

  btn.onclick = function () {
    resetForm() // Ensure the form is reset when adding a new user
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

  const filterInput = document.getElementById('products-filter')
  filterInput.addEventListener('input', filterProducts)
})
