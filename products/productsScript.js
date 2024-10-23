const apiUrl = 'https://dummyjson.com/products'

const products = []
let editingUserId = null

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

  document.querySelectorAll('.btn-edit-card').forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.currentTarget.getAttribute('data-id')
      editProduct(productId)
    })
  })

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

function editProduct(productId) {
  const product = products.find((u) => u.id == productId)
  if (product) {
    const form = document.getElementById('addProductForm')
    form.title.value = product.title
    form.description.value = product.description
    form.price.value = product.price
    form.brand.value = product.brand
    form.category.value = product.category
    form.thumbnail.value = product.thumbnail

    document.getElementById('modal-title').innerText = 'Editar Produto'
    document.getElementById('modal-submit-button').innerText = 'Salvar'

    editingUserId = productId

    const modal = document.getElementById('addProductModal')
    modal.style.display = 'block'
  }
}

function saveProduct(event) {
  event.preventDefault()
  const form = document.getElementById('addProductForm')
  const formData = new FormData(form)

  if (!validateForm(formData)) {
    return
  }

  const imageUrl = formData.get('thumbnail') || form.thumbnail.value

  const newProduct = {
    id: editingUserId || Date.now(),
    title: formData.get('title'),
    description: formData.get('description'),
    price: parseFloat(formData.get('price')),
    brand: formData.get('brand'),
    category: formData.get('category'),
    thumbnail: imageUrl,
  }

  if (editingUserId) {
    const productIndex = products.findIndex((u) => u.id == editingUserId)
    products[productIndex] = newProduct
  } else {
    // Add new user
    products.push(newProduct)
  }

  // Reset form and close modal
  resetForm()
  const modal = document.getElementById('addProductModal')
  modal.style.display = 'none'

  // Refresh user list
  displayProducts()
}

function validateForm(formData) {
  const title = formData.get('title')
  const description = formData.get('description')
  const price = formData.get('price')
  const brand = formData.get('brand')
  const category = formData.get('category')
  const thumbnail = formData.get('thumbnail')

  const urlPattern = /^https?:\/\/.+/

  console.log(!price)
  console.log(description.length)
  if (
    !title ||
    title.length < 3 ||
    title.length > 50 ||
    !description ||
    description.length < 3 ||
    description.length > 250 ||
    !price ||
    price < 0 ||
    !brand ||
    brand.length < 3 ||
    !category ||
    category.length < 3 ||
    (thumbnail && thumbnail.size > 0 && !urlPattern.test(thumbnail.name))
  ) {
    alert('Por favor, preencha todos os campos corretamente.')
    return false
  }

  return true
}

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
  editingUserId = null
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

  const form = document.getElementById('addProductForm')
  form.addEventListener('submit', saveProduct)

  const filterInput = document.getElementById('products-filter')
  filterInput.addEventListener('input', filterProducts)

  const price = document.getElementById('price')
  price.addEventListener('input', function () {
    if (this.value < 0) {
      this.value = 0
    }
  })
})
