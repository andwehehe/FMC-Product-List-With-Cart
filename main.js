fetch("assets/data/data.json")
  .then(response => response.json())
  .then(products => {
    products.forEach((product, index) => {
      const { image: {thumbnail, mobile, tablet, desktop}, name, category, price } = product;

      const newProduct = document.createElement("article");
      newProduct.classList.add("dessert");

      newProduct.innerHTML = `
        <div class="img-button__container">
          <img src="${mobile}" alt="${name}" class="product__image">
          <button class="addToCart">
            <img src="assets/images/icon-add-to-cart.svg" alt="Cart icon" class="cart__icon">
            Add to Cart
          </button>
        </div>

        <div class="product-info__container">
          <p class="product">${category}</p>
          <p class="product__name">${name}</p>
          <p class="price">$${price.toFixed(2)}</p>
        </div>
      `;

      const dessertSection = document.querySelector(".desserts__section");
      dessertSection.appendChild(newProduct);

      function changeSize() {
        const mobileSize = window.matchMedia("(max-width: 439px)");
        const tabletSize = window.matchMedia("(min-width: 440px) and (max-width: 929px)");
        const desktopSize = window.matchMedia("(min-width: 930px)");
        const productImage = document.querySelectorAll(".product__image");

          if(mobileSize.matches) {
            productImage[index].src = mobile;
          } else if(tabletSize.matches) {
            productImage[index].src = tablet;
          } else if(desktopSize.matches) {
            productImage[index].src = desktop;
          }
      }

      changeSize();
      window.addEventListener('resize', changeSize);
    })
  })



