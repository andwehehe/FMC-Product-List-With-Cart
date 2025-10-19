let listOfOrders = [];

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

        newCartButton();
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

              changeTotal("+");
            }
          })
        })


        decrement.addEventListener('click', (event) => {
          event.stopPropagation();
          
          if(quantity <= 1) {
            return;
          }
          quantity--;
          btnText.textContent = quantity;
          

          const orderDetails = document.querySelectorAll(".order__details");
          orderDetails.forEach(order => {
            const productName = order.querySelector(".product__ordered").textContent;
            if(productName === name) {
              const productQuantity = order.querySelector(".quantity");
              const productTotalPrice = order.querySelector(".total__amount");

              productQuantity.textContent = `${quantity}x`;
              productTotalPrice.textContent = `$${(price * quantity).toFixed(2)}`;

              changeTotal("-");
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
            <svg class="cancel__icon xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
              <path class="removeBtnFill" fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
            </svg>
          </button>
        `;
        
        orderedSection.appendChild(orderDetails);
        const newHr = document.createElement("hr");
        orderDetails.after(newHr);

        removeOrder();
        changeTotal("+");

      }

      function removeOrder() {
        const allOrder = document.querySelectorAll(".order__details");
        allOrder.forEach(order => {
          const cancelBtn = order.querySelector(".cancel__btn");
          cancelBtn.addEventListener('click', () => {
            const nextHr = order.nextElementSibling;
            if (nextHr && nextHr.tagName === "HR") {
              nextHr.remove();
              decAllToTotal(order);
              defaultCartButton();
            }
            order.remove();
          })
        })  
      }

      function changeTotal(option) {
        const finalAmount = document.querySelector(".displayed__amount");
        let totalAmount;
        
        if(option === "+") {
          totalAmount = +finalAmount.textContent + price;
          totalNumOfOrders(option);
        } else if(option === "-") {
          totalAmount = +finalAmount.textContent - price;
          totalNumOfOrders(option);
        }

        finalAmount.textContent = `${totalAmount.toFixed(2)}`;
      }

      function decAllToTotal(order) {
        const finalAmount = document.querySelector(".displayed__amount");
        const totalProductAmount = order.querySelector(".total__amount");
        let totalAmount = +finalAmount.textContent - +totalProductAmount.textContent.slice(1);
        finalAmount.textContent = `${totalAmount.toFixed(2)}`;

        const totalOrders = document.querySelector(".totalNumOfOrder");
        totalOrders.textContent = +totalOrders.textContent - quantity;

        if(+totalOrders.textContent < 1) {
          toggleCartDisplay("without orders");
        }
      }

      function defaultCartButton() {
        cartIcon.style.display = "block";
        btnText.textContent = "Add to Cart";
        addToCart.classList.remove("addedToCart");
        increment.style.display = "none";
        decrement.style.display = "none";
        canClick = true;
        quantity = 0;
      }

      function newCartButton() {
        cartIcon.style.display = "none";
        btnText.textContent = quantity;
        addToCart.classList.add("addedToCart");
        increment.style.display = "block";
        decrement.style.display = "block";
        canClick = false;
      }

      function totalNumOfOrders(option) {
        const totalOrders = document.querySelector(".totalNumOfOrder");
        if(option === "+") {
          totalOrders.textContent = +totalOrders.textContent + 1;
        } else if(option === "-") {
          totalOrders.textContent = +totalOrders.textContent - 1;
        }

        if(+totalOrders.textContent === 1) {
          toggleCartDisplay("with orders");
          confirmOrder();
        }
      }

      function toggleCartDisplay(option) {
        const orderTotal = document.querySelector(".order__total");
        const remark = document.querySelector(".remark");
        const confirm = document.querySelector(".confirm__btn");

        const emptyCartImg = document.querySelector(".empty__cart-img");
        const emptyCartPrompt = document.querySelector(".empty__cart-prompt");

        if(option === "with orders") {
          orderTotal.style.display = "flex";
          remark.style.display = "flex";
          confirm.style.display = "block";

          emptyCartImg.style.display = "none";
          emptyCartPrompt.style.display = "none";
        } else if(option === "without orders") {
          orderTotal.style.display = "none";
          remark.style.display = "none";
          confirm.style.display = "none";

          emptyCartImg.style.display = "block";
          emptyCartPrompt.style.display = "block";
        }
      }

      // function confirmOrder() {
        
      // }

      function confirmOrder() {
        const body = document.querySelector("body");
        const confirmBtn = document.querySelector(".confirm__btn");
        const overlay = document.querySelector(".overlay");

        confirmBtn.addEventListener('click', () => {
          overlay.style.display = "flex";
          body.style.overflow = "hidden"
          console.log("clicked")
          startNewOrder();
        })
      }

      function startNewOrder() {
        const body = document.querySelector("body");
        const overlay = document.querySelector(".overlay");
        const newOrder = document.querySelector(".start-new__btn");
        const allOrder = document.querySelectorAll(".order__details");
        const totalNumOfOrder = document.querySelector(".totalNumOfOrder");
        

        newOrder.addEventListener('click', () => {
          overlay.style.display = "none";
          body.style.overflow = ""
          allOrder.forEach(order => {
            const quantity = order.querySelector(".quantity");
            const totalPrice = order.querySelector(".total__amount");
            const displayedAmount = document.querySelector(".displayed__amount");

            displayedAmount.textContent = +displayedAmount.textContent - +totalPrice.textContent.slice(1);
            totalNumOfOrder.textContent = +totalNumOfOrder.textContent - +quantity.textContent.slice(0, quantity.textContent.length - 1);

            const nextHr = order.nextElementSibling;
            if (nextHr && nextHr.tagName === "HR") {
              nextHr.remove();
            }
            
            order.remove();
          })

          toggleCartDisplay("without orders");
        }) 
      }

    })
  })

