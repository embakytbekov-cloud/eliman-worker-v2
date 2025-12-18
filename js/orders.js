const ordersList = document.getElementById("ordersList");

// получаем worker_id
const params = new URLSearchParams(window.location.search);
const workerId = params.get("worker_id");

if (!workerId) {
  ordersList.innerHTML = "<p class='text-red-500'>Worker not identified</p>";
  throw new Error("worker_id missing");
}

async function loadOrders() {
  // 1️⃣ получаем категорию worker
  const { data: worker, error: workerError } = await window.db
    .from("workers")
    .select("category")
    .eq("telegram_id", workerId)
    .single();

  if (workerError || !worker) {
    console.error(workerError);
    ordersList.innerHTML = "<p class='text-red-500'>Failed to load worker</p>";
    return;
  }

  const workerCategory = worker.category;

  // 2️⃣ загружаем ТОЛЬКО ордера этой категории
  const { data: orders, error } = await window.db
    .from("orders")
    .select("*")
    .eq("service_type", workerCategory)
    .order("date", { ascending: true });

  if (error) {
    console.error(error);
    ordersList.innerHTML = "<p class='text-red-500'>Failed to load orders</p>";
    return;
  }

  if (orders.length === 0) {
    ordersList.innerHTML = `
      <p class="text-slate-400 text-center mt-10">
        No orders available for your category
      </p>
    `;
    return;
  }

  ordersList.innerHTML = "";

  orders.forEach(order => {
    ordersList.innerHTML += `
      <div class="card">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h2 class="text-lg font-semibold">${order.service_name}</h2>
            <p class="muted">${order.service_type}</p>
          </div>
          <div class="price">$${getPrice(order.service_type)}</div>
        </div>

        <div class="flex justify-between items-center mt-3 muted">
          <div>📍 ${order.address}</div>
          <div>🕒 ${order.date} ${order.time}</div>
        </div>

        <div class="mt-3 text-right">
          <button 
            class="details more-details"
            data-id="${order.id}">
            More details →
          </button>
        </div>
      </div>
    `;
  });

  // 3️⃣ переход на details
  document.querySelectorAll(".more-details").forEach(btn => {
    btn.addEventListener("click", () => {
      const orderId = btn.dataset.id;
      window.location.href =
        `order-details.html?order_id=${orderId}&worker_id=${workerId}`;
    });
  });
}

function getPrice(type) {
  switch (type) {
    case "Cleaning": return 120;
    case "Handyman": return 80;
    case "Moving": return 200;
    case "Locksmith": return 150;
    case "Appliance": return 100;
    default: return 100;
  }
}

loadOrders();