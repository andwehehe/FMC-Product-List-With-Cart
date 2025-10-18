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
      let canClick = true;
      
      addToCart.addEventListener('click', () => {
        if(quantity < 1) {
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
      })

       
        increment.addEventListener('click', () => {
          quantity++;
          btnText.textContent = quantity;

          const orderDetails = document.querySelectorAll(".order__details");
          orderDetails.forEach(order => {
            const productName = order.querySelector(".product__ordered").textContent;
            if(productName === name) {
              const productQuantity = order.querySelector(".quantity");
              const productTotalPrice = order.querySelector(".total__amount");

              productQuantity.textContent = `${quantity}x`;
              productTotalPrice.textContent = `$${(price * quantity).toFixed(2)}`;
            }
          })
        })


        decrement.addEventListener('click', (event) => {
          event.stopPropagation();
          quantity--;
          if(quantity < 1) {
            // cartIcon.style.display = "block";
            // btnText.textContent = "Add to Cart";
            // addToCart.classList.remove("addedToCart");
            // increment.style.display = "none";
            // decrement.style.display = "none";
            return;
          }
          btnText.textContent = quantity;
          

          const orderDetails = document.querySelectorAll(".order__details");
          orderDetails.forEach(order => {
            const productName = order.querySelector(".product__ordered").textContent;
            if(productName === name) {
              const productQuantity = order.querySelector(".quantity");
              const productTotalPrice = order.querySelector(".total__amount");

              productQuantity.textContent = `${quantity}x`;
              productTotalPrice.textContent = `$${(price * quantity).toFixed(2)}`;
            }
          })
        })

      function addItemsToCart() {
        const orderedSection = document.querySelector(".ordered__section");

        const orderDetails = document.createElement("div");
        orderDetails.classList.add("order__details");
        orderDetails.innerHTML = `
          <div class="checkout__details">
            <p class="product__ordered">${name}</p>
            <span class="quantity">1x</span>
            <span class="actual__price">@ $${price.toFixed(2)}</span>
            <span class="total__amount">$${price.toFixed(2)}</span>
          </div>
          <button class="cancel__btn" data-action="remove">
            <img src="assets/images/icon-remove-item.svg" alt="remove order" class="cancel__icon">
          </button>
        `;
        
        orderedSection.appendChild(orderDetails);
        const newHr = document.createElement("hr");
        orderDetails.after(newHr);

          const allOrder = document.querySelectorAll(".order__details");
          allOrder.forEach(order => {

            const cancelBtn = order.querySelector(".cancel__btn");
            cancelBtn.addEventListener('click', () => {

              const hrElement = order.querySelectorAll("hr");
              const nextHr = order.nextElementSibling;
              if (nextHr && nextHr.tagName === "HR") {
                nextHr.remove();
              }
              order.remove();

            })
          })


      }

    })
  })
          

          
//   const orderQuantity = document.querySelectorAll(".quantity");
//   orderQuantity[index].textContent = `${quantity}x`;

