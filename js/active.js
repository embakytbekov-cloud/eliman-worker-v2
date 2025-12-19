async function loadActiveOrders() {
  const tg = window.Telegram?.WebApp?.initDataUnsafe?.user;

  if (!tg?.id) {
    alert("Telegram user not found");
    return;
  }

  // 🔹 1. ПОЛУЧАЕМ КАТЕГОРИЮ ВОРКЕРА
  const { data: worker, error: workerErr } = await window.db
    .from("workers")
    .select("category")
    .eq("telegram_id", String(tg.id))
    .single();

  if (workerErr || !worker?.category) {
    alert("Worker category not found");
    return;
  }

  // 🔹 2. ГРУЗИМ ОРДЕРА ТОЛЬКО ПО КАТЕГОРИИ
  const { data: orders, error: ordersErr } = await window.db
    .from("orders")
    .select("*")
    .eq("status", "accepted")
    .eq("category", worker.category)
    .order("created_at", { ascending: false });

  if (ordersErr) {
    list.innerHTML = `<div class="text-red-400 text-center mt-10">
      Error loading active orders
    </div>`;
    return;
  }

  if (!orders || orders.length === 0) {
    list.innerHTML = `<div class="text-slate-400 text-center mt-10">
      No active orders
    </div>`;
    return;
  }

  renderActive(orders);
}