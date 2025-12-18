const ordersList = document.getElementById("ordersList");

// worker_id из URL
const params = new URLSearchParams(window.location.search);
const workerId = params.get("worker_id");

if (!workerId) {
  ordersList.innerHTML =
    "<p class='text-red-500'>Worker not identified</p>";
  throw new Error("worker_id missing");
}

async function loadOrders() {
  // 1️⃣ Получаем категорию воркера
  const { data: worker, error: workerError } = await window.db
    .from("workers")
    .select("category")
    .eq("telegram_id", workerId)
    .single();

  if (workerError || !worker) {
    console.error("Worker error:", workerError);
    ordersList.innerHTML =
      "<p class='text-red-500'>Failed to load worker</p>";
    return;
  }

  // 🔥 ПРИВОДИМ К LOWERCASE
  const category = worker.category.toLowerCase().trim();

  console.log("Worker category:", category);

  // 2️⃣ Загружаем ордера ТОЛЬКО этой категории
  const { data: orders, error: ordersError } = await window.db
    .from("orders")
    .select("*")
    .ilike("service_type", category) // 🔥 ВАЖНО
    .order("date", { ascending: true });

  if (ordersError) {
    console.error("Orders error:", ordersError);
    ordersList.innerHTML =
      "<p class='text-red-500'>Failed to load orders</p>";
    return;
  }

  if (!orders || orders.length === 0) {
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
          <div class="price">$${order.price || 0}</div>
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

  // 3️⃣ More details
  document.querySelectorAll(".more-details").forEach(btn => {
    btn.addEventListener("click", () => {
      const orderId = btn.dataset.id;
      window.location.href =
        `order-details.html?order_id=${orderId}&worker_id=${workerId}`;
    });
  });
}

loadOrders();