const bag = new Map();
const bagCount = document.querySelector(".bag-count");
const cartDialog = document.querySelector(".cart-dialog");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const totalAmount = document.querySelector(".total-amount");
const bagButton = document.querySelector(".bag-button");

function renderBag() {
  const entries = Array.from(bag.values());
  const count = entries.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = entries.reduce((sum, item) => sum + item.price * item.quantity, 0);

  bagCount.textContent = String(count);
  cartItems.replaceChildren(...entries.map((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    const description = document.createElement("span");
    description.textContent = `${item.name} × ${item.quantity}`;
    const price = document.createElement("span");
    price.textContent = `$${item.price * item.quantity}`;
    row.append(description, price);
    return row;
  }));
  cartEmpty.style.display = entries.length ? "none" : "block";
  totalAmount.textContent = String(subtotal);
}

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.product;
    const price = Number(button.dataset.price);
    const existing = bag.get(name);

    if (existing) {
      existing.quantity += 1;
    } else {
      bag.set(name, { name, price, quantity: 1 });
    }

    renderBag();
    cartDialog.showModal();
  });
});

bagButton.addEventListener("click", () => cartDialog.showModal());
document.querySelector(".close-cart").addEventListener("click", () => cartDialog.close());

cartDialog.addEventListener("click", (event) => {
  if (event.target === cartDialog) cartDialog.close();
});

document.querySelector(".checkout-button").addEventListener("click", () => {
  if (bag.size === 0) {
    document.querySelector("#bouquets").scrollIntoView({ behavior: "smooth" });
    cartDialog.close();
    return;
  }

  window.alert("Thanks for sharing the love! This demo doesn't process real orders yet.");
});
