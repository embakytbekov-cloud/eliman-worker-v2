const ordersList = document.getElementById("ordersList");

// 1. Получаем ID пользователя (сначала из памяти, потом напрямую из Telegram)
let workerId = localStorage.getItem("telegram_id");

if (!workerId && window.Telegram?.WebApp?.initDataUnsafe?.user) {
    workerId = String(window.Telegram.WebApp.initDataUnsafe.user.id);
    localStorage.setItem("telegram_id", workerId);
}

console.log("DEBUG: Worker ID is:", workerId);

if (!workerId) {
    ordersList.innerHTML = `
        <div class="text-center p-5">
            <p class='text-red-500 font-bold text-lg'>Worker not identified</p>
            <p class='text-gray-400 text-sm mt-2'>Please restart the app from Telegram</p>
            <button onclick="location.reload()" class="bg-[#3fc060] text-black px-6 py-3 rounded-xl font-bold mt-6 w-full">Retry</button>
        </div>
    `;
} else {
    loadOrders();
}

async function loadOrders() {
    try {
        console.log("DEBUG: Loading worker profile for ID:", workerId);
        
        // 1️⃣ Получаем навыки (skills) воркера. В твоей базе это колонка "skills"
        const { data: worker, error: workerError } = await window.db
            .from("workers")
            .select("skills") 
            .eq("telegram_id", workerId)
            .single();

        if (workerError || !worker) {
            console.error("Worker DB Error:", workerError);
            ordersList.innerHTML = `
                <div class="text-center mt-10 p-5">
                    <p class='text-red-500 font-bold'>Worker not found in database</p>
                    <p class='text-gray-500 text-xs mt-2'>Your ID: ${workerId}</p>
                    <p class='text-gray-400 text-sm mt-4 text-left bg-[#111] p-3 rounded'>
                        Брат, проверь в Supabase, есть ли запись с этим ID в таблице workers.
                    </p>
                </div>`;
            return;
        }

        // В базе skills — это массив ["cleaning", "handyman"]
        const skillsArray = worker.skills || [];
        if (skillsArray.length === 0) {
            ordersList.innerHTML = `
                <div class="text-center mt-10 px-5">
                    <p class="text-yellow-500 font-bold">No skills selected</p>
                    <p class="text-gray-400 text-sm mt-2">Go to profile and choose your categories.</p>
                </div>
            `;
            return;
        }

        console.log("DEBUG: Worker skills are:", skillsArray);

        // 2️⃣ Загружаем заказы, которые подходят под любой из твоих навыков
        const { data: orders, error: ordersError } = await window.db
            .from("orders")
            .select("*")
            .in("service_type", skillsArray) // Сопоставляем список навыков со списком заказов
            .order("date", { ascending: true });

        if (ordersError) {
            console.error("Orders DB Error:", ordersError);
            ordersList.innerHTML = "<p class='text-red-500 text-center mt-10'>Failed to load orders from DB</p>";
            return;
        }

        if (!orders || orders.length === 0) {
            ordersList.innerHTML = `
                <div class="text-center mt-10 p-5">
                    <p class="text-gray-400 italic">No orders available for your categories:</p>
                    <p class="text-[#3fc060] font-bold text-lg mt-2">${skillsArray.join(", ")}</p>
                </div>
            `;
            return;
        }

        // 3️⃣ Отрисовка карточек заказов
        ordersList.innerHTML = "";
        orders.forEach(order => {
            ordersList.innerHTML += `
                <div class="card bg-[#111] border border-[#2a2a2a] p-5 rounded-2xl mb-4 shadow-lg">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h2 class="text-xl font-bold text-white">${order.service_name || 'Service'}</h2>
                            <p class="text-[#3fc060] text-sm font-medium uppercase tracking-wider">${order.service_type}</p>
                        </div>
                        <div class="bg-[#3fc060] text-black px-4 py-1.5 rounded-full font-black text-lg">
                            $${order.price || 0}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 mt-4 text-sm text-gray-300">
                        <div class="flex items-center gap-2">
                            <span>📍</span> <span>${order.address || 'No address provided'}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span>🕒</span> <span>${order.date || ''} at ${order.time || ''}</span>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (err) {
        console.error("Critical Error:", err);
        ordersList.innerHTML = "<p class='text-red-500 text-center mt-10'>Critical app error. Check console.</p>";
    }
}
