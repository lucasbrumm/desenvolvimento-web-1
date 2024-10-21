// includeHeader.js
function includeHeader() {
  const headerElement = document.querySelector('header')
  fetch('../components/header.html')
    .then((response) => response.text())
    .then((data) => {
      headerElement.innerHTML = data
    })
}

document.addEventListener('DOMContentLoaded', includeHeader)
