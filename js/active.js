// ================================
// ACTIVE ORDERS
// ================================

const list = document.getElementById("activeList");

if (!window.db) {
  alert("Supabase not connected");
  throw new Error("Supabase not connected");
}

async function loadActiveOrders() {
  const tg = window.Telegram?.WebApp?.initDataUnsafe?.user;

  if (!tg?.id) {
    alert("Telegram user not found");
    return;
  }

  const { data, error } = await window.db
    .from("orders")
    .select("*")
    .eq("status", "accepted")
    .eq("worker_id", String(tg.id))
    .order("created_at", { ascending: false });

  if (error) {
    list.innerHTML = `<div class="text-red-400 text-center mt-10">
      Error loading active orders
    </div>`;
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = `<div class="text-slate-400 text-center mt-10">
      No active orders
    </div>`;
    return;
  }

  renderActive(data);
}

function renderActive(orders) {
  list.innerHTML = "";

  orders.forEach(order => {
    const card = document.createElement("div");

    card.className = `
      bg-slate-800/90
      border border-slate-700
      rounded-2xl
      p-4
    `;

    card.innerHTML = `
      <div class="text-lg font-bold mb-1">
        ${order.service_name}
      </div>

      <div class="text-sm text-slate-400 mb-2">
        📍 ${order.address}
      </div>

      <div class="flex gap-3 mt-3">
        <button
          onclick="startJob(${order.id})"
          class="flex-1 py-2 rounded-xl bg-blue-500 text-black font-bold">
          Start
        </button>

        <button
          onclick="completeJob(${order.id})"
          class="flex-1 py-2 rounded-xl bg-emerald-500 text-black font-bold">
          Complete
        </button>
      </div>
    `;

    list.appendChild(card);
  });
}

async function startJob(orderId) {
  await window.db
    .from("orders")
    .update({ status: "in_progress" })
    .eq("id", orderId);

  alert("Job started");
  loadActiveOrders();
}

async function completeJob(orderId) {
  await window.db
    .from("orders")
    .update({ status: "completed" })
    .eq("id", orderId);

  alert("Job completed");
  loadActiveOrders();
}

loadActiveOrders();