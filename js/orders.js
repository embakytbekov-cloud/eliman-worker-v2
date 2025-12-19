const tg = window.Telegram?.WebApp?.initDataUnsafe?.user;
if (!tg?.id) {
  alert("Telegram not found");
  throw new Error("No Telegram user");
}

/* ===== ШАГ 2 — НОВЫЕ ОРДЕРА ===== */
async function loadNewOrders() {
  const { data: worker, error: wErr } = await db
    .from("workers")
    .select("category")
    .eq("telegram_id", String(tg.id))
    .single();

  if (wErr || !worker?.category) return;

  const { data: orders, error } = await db
    .from("orders")
    .select("*")
    .eq("service_type", worker.category)
    .is("worker_id", null)
    .order("date", { ascending: true });

  if (error) return;

  renderNewOrders(orders);
}

/* ===== ШАГ 4 — ПРИНЯТИЕ ОРДЕРА ===== */
async function acceptOrder(orderId) {
  await db
    .from("orders")
    .update({
      worker_id: String(tg.id)
    })
    .eq("id", orderId)
    .is("worker_id", null);

  loadNewOrders();
}

loadNewOrders();