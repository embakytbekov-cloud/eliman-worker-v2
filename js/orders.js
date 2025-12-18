const ordersList = document.getElementById("ordersList");

// 1. Получаем ID пользователя
let workerId = localStorage.getItem("telegram_id");

// Если в localStorage пусто, пробуем вытащить напрямую из Telegram SDK
if (!workerId && window.Telegram?.WebApp?.initDataUnsafe?.user) {
    workerId = String(window.Telegram.WebApp.initDataUnsafe.user.id);
    localStorage.setItem("telegram_id", workerId);
}

console.log("DEBUG: Worker ID is:", workerId);

if (!workerId) {
    ordersList.innerHTML = `
        <div class="text-center p-5">
            <p class='text-red-500 font-bold'>Worker not identified</p>
            <p class='text-gray-400 text-sm mt-2'>Please restart the app from Telegram</p>
            <button onclick="location.reload()" class="bg-[#3fc060] text-black px-4 py-2 rounded mt-4">Retry</button>
        </div>
    `;
} else {
    loadOrders();
}

async function loadOrders() {
    try {
        console.log("DEBUG: Loading worker profile for ID:", workerId);
        
        // 1️⃣ Получаем навыки (skills) воркера из таблицы
        const { data: worker, error: workerError } = await window.db
            .from("workers")
            .select("skills") // В твоей базе колонка называется skills
            .eq("telegram_id", workerId)
            .single();

        if (workerError || !worker) {
            console.error("Worker DB Error:", workerError);
            ordersList.innerHTML = `
                <p class='text-red-500 text-center mt-10'>
                    Worker not found in database.<br>
                    <span class="text-xs text-gray-500">ID: ${workerId}</span>
                </p>`;
            return;
        }

        // В базе skills — это массив ["cleaning", "handyman"]. Берем первый элемент.
        const mainSkill = (worker.skills && worker.skills.length > 0) 
                          ? worker.skills[0] 
                          : null;

        if (!mainSkill) {
            ordersList.innerHTML = "<p class='text-yellow-500 text-center mt-10'>No skills assigned to your profile</p>";
            return;
        }

        console.log("DEBUG: Worker main skill is:", mainSkill);

        // 2️⃣ Загружаем заказы, где service_type похож на наш основной навык
        const { data: orders, error: ordersError } = await window.db
            .from("orders")
            .select("*")
            .ilike("service_type", `%${mainSkill}%`) 
            .order("date", { ascending: true });

        if (ordersError) {
            console.error("Orders DB Error:", ordersError);
            ordersList.innerHTML = "<p class='text-red-500 text-center mt-10'>Failed to load orders from DB</p>";
            return;
        }

        if (!orders || orders.length === 0) {
            ordersList.innerHTML = `
                <div class="text-center mt-10 p-5">
                    <p class="text-gray-400 italic">No orders available for category:</p>
                    <p class="text-[#3fc060] font-bold text-xl mt-2">${mainSkill}</p>
                </div>
            `;
            return;
        }

        // 3️⃣ Отрисовка карточек
        ordersList.innerHTML = "";
        orders.forEach(order => {
            ordersList.innerHTML += `
                <div class="card bg-[#111] border border-[#2a2a2a] p-4 rounded-2xl mb-4">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h2 class="text-lg font-semibold">${order.service_name || 'Service'}</h2>
                            <p class="text-gray-400 text-sm">${order.service_type}</p>
                        </div>
                        <div class="bg-[#3fc060] text-black px-3 py-1 rounded-full font-bold">
                            $${order.price || 0}
                        </div>
                    </div>
                    <div class="flex flex-col gap-1 mt-3 text-sm text-gray-400">
                        <div>📍 ${order.address || 'No address'}</div>
                        <div>🕒 ${order.date || ''} ${order.time || ''}</div>
                    </div>
                </div>
            `;
        });

    } catch (err) {
        console.error("Critical Error:", err);
        ordersList.innerHTML = "<p class='text-red-500 text-center mt-10'>Critical app error</p>";
    }
}
