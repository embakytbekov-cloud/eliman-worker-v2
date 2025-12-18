const ordersList = document.getElementById("ordersList");

const workerId = localStorage.getItem("telegram_id");

if (!workerId) {
  ordersList.innerHTML =
    "<p class='text-red-500'>Worker not identified</p>";
  throw new Error("telegram_id missing");
}

async function loadOrders() {
  // 1️⃣ get worker category
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

  const category = worker.category.toLowerCase().trim();

  // 2️⃣ load orders by category
  const { data: orders, error: ordersError } = await window.db
    .from("orders")
    .select("*")
    .ilike("service_type", category)
    .order("date", { ascending: true });

  if (ordersError) {
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
      </div>
    `;
  });
}

loadOrders();