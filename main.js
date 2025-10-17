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
            <img src="assets/images/icon-add-to-cart.svg" alt="Cart icon" class="cart__icon" >
            <svg class="decrement" xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" class="pathFill" d="M0 .375h10v1.25H0V.375Z"/></svg>
            <span class="btnText"> Add to Cart</span>
            <svg class="increment" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" class="pathFill" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
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

      const cartIcon = newProduct.querySelector(".cart__icon");
      const btnText = newProduct.querySelector(".btnText");
      const addToCart = newProduct.querySelector(".addToCart");
      const increment = newProduct.querySelector(".increment");
      const decrement = newProduct.querySelector(".decrement");
      let quantity = 0;
     
      
      addToCart.addEventListener('click', () => {
        let canClick = true;
        if(quantity < 1) {
          canClick = true;
          quantity++;
          addItemsToCart();
        }
        if(!canClick) {
          return;
        }

        cartIcon.style.display = "none";
        btnText.textContent = quantity;
        addToCart.classList.add("addedToCart");
        increment.style.display = "block";
        decrement.style.display = "block";
        canClick = false;
        console.log("clicked");
      })


        increment.addEventListener('click', (event) => {
          event.stopPropagation();
          quantity++;
          btnText.textContent = quantity;
        })

        decrement.addEventListener('click', (event) => {
          event.stopPropagation();
          quantity--;
          if(quantity < 1) {
            cartIcon.style.display = "block";
            btnText.textContent = "Add to Cart";
            addToCart.classList.remove("addedToCart");
            increment.style.display = "none";
            decrement.style.display = "none";
          } else {
            btnText.textContent = quantity;
          }
        })

      function addItemsToCart() {
        const yourCart = document.querySelector(".your__cart");
        const orderTotal = document.querySelector(".order__total");

        const orderDetails = document.createElement("div");
        orderDetails.classList.add("order__details");
        orderDetails.innerHTML = `
          <div class="checkout__details">
            <p class="product__ordered">${name}</p>
            <span class="quantity">${quantity}x</span>
            <span class="actual__price">@ $${price.toFixed(2)}</span>
            <span class="total__amount">$${(price * quantity).toFixed(2)}</span>
          </div>
          <button class="cancel__btn" data-action="remove">
            <img src="assets/images/icon-remove-item.svg" alt="remove order" class="cancel__icon">
          </button>
        `;
        
        yourCart.insertBefore(orderDetails, orderTotal);
        const newHr = document.createElement("hr");
        orderDetails.after(newHr);
      }


      
    })
  })





