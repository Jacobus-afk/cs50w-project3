// https://stackoverflow.com/questions/42733761/how-to-properly-append-django-csrf-token-to-form-in-inline-javascript
document.addEventListener("DOMContentLoaded", () => {
    const anchors = document.anchors;
    const menu_items = document.getElementById("menu-items");
    let order_div = document.createElement("div");
    let option_div = document.createElement("div");
    let price_div = document.createElement("div");
    let topping_add_div = document.createElement("div");
    let topping_div = document.createElement("div");
    order_div.id = "order-div";
    option_div.id = "option-div";
    price_div.id = "price-div";
    topping_add_div.id = "topping-add-div";
    topping_div.id = "topping-add-div";
    let prev_product_span = null;
    for (i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', (event) => {
            while (menu_items.firstChild) {
                menu_items.removeChild(menu_items.lastChild);
            }
            const product_span = document.getElementById(event.currentTarget.name + "-span");
            prev_product_span = update_active_class(prev_product_span, product_span);
            build_menu(event.currentTarget.name);
        });
    }

    function ajax_req(req, api_endpoint) {
        return new Promise((res, rej) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", api_endpoint);
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const data = JSON.parse(xhr.responseText);
                    // console.log(data);
                    res(data);
                } else {
                    rej({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
            }
            const fdata = new FormData();
            for (key in req) {
                fdata.append(key, req[key]);
            }
            fdata.append('csrfmiddlewaretoken', csrftoken);
            xhr.send(fdata);
        });
    }

    async function place_order(size, toppings = []) {
        console.log("placed order: " , size);
        console.log("with toppings: ", toppings);
        const req = {
            "size": JSON.stringify(size),
            "toppings": JSON.stringify(toppings)
        }
        try{
            const data = await ajax_req(req, "/ajax/addtocart");
            console.log(data);
            if ("success" in data) {
                const cart_count = document.getElementById("cart-cnt");
                cart_count.innerHTML = Number(cart_count.innerHTML) + 1;
            }

        }
        catch(err) {
            console.log("Place order error:" + err);
        }
    }

    async function build_prices(order_id, sel_cnt, toppings = []) {
        const helper = await import("./templates.js");
        let prev_price = null;
        price_div = document.createElement("div");
        price_div.className = "price-div";
        price_div.id = "price-div";
        try {
            req = {
                "order_id": order_id,
                "sel_cnt": sel_cnt
            }
            const data = await ajax_req(req, "/ajax/price");
            // console.log(data);
            const prices = data.prices;

            prices.map(_price => {
                const size = _price.size;
                const price = _price.price;
                const id = _price.id;

                const label = helper.create_label(size, size + ": $" + price);
                label.onclick = () => {
                    prev_price = update_active_class(prev_price, label);
                    place_order({size: size, price_id: id}, toppings);
                }
                helper.appendicitis(price_div, label);
            })
            menu_items.append(price_div);
        }
        catch (err) {
            console.log("Build Price Error: " + err);
        }
    }

    async function list_toppings(order_id) {
        const helper = await import("./templates.js");
        topping_div = document.createElement("div");
        topping_div.className = "topping-div";
        topping_div.id = "topping-div";
        try {
            const data = await ajax_req({ "order_id": order_id }, "/ajax/topping");
            //console.log(data);

            return data.toppings;
        }
        catch (err) {
            console.log("List Toppings Error: ", err);
        }
    }

    async function build_add_toppings(topping_lim, order_id) {
        const helper = await import("./templates.js");
        topping_add_div = document.createElement("div");
        topping_add_div.className = "topping-add-div";
        topping_add_div.id = "topping-add-div";
        const topping_list = await list_toppings(order_id);
        let available_toppings = [];
        let used_toppings = [];
        topping_list.map(entity => {
            const obj = {
                topping: entity.topping,
                topping_id: entity.id
            }
            available_toppings.push(obj);
        })
        // console.log("available toppings: ", available_toppings);

        clear_menu(topping_add_div);
        build_prices(order_id, 0);

        if (topping_lim > 0) {
            let topping_cnt = 0;
            const add_label = helper.create_label("Add_Topping", "+");
            const rem_label = helper.create_label("Remove_Topping", "-");
            const cnt_label = helper.create_label("Topping_Count", 0);
            rem_label.style.visibility = "hidden";

            add_label.onclick = async () => {
                try {
                    const topping_choice = await helper.create_topping_choices(available_toppings);
                    available_toppings.splice(available_toppings.indexOf(topping_choice), 1);
                    used_toppings.push(topping_choice);
                }
                catch (err) {
                    return;
                }

                topping_cnt++;
                if (topping_cnt < topping_lim) {
                    rem_label.style.visibility = "visible";
                }
                else {
                    topping_cnt = topping_lim;
                    rem_label.style.visibility = "visible";
                    add_label.style.visibility = "hidden";
                }
                clear_menu(topping_add_div);
                build_prices(order_id, topping_cnt, used_toppings);
                cnt_label.innerHTML = topping_cnt;
            }

            rem_label.onclick = async () => {
                try {
                    const topping_choice = await helper.create_topping_choices(used_toppings);
                    used_toppings.splice(used_toppings.indexOf(topping_choice), 1);
                    available_toppings.push(topping_choice);
                }
                catch (err) {
                    return;
                }

                topping_cnt--;
                if (topping_cnt > 0) {
                    add_label.style.visibility = "visible";
                }
                else {
                    topping_cnt = 0;
                    rem_label.style.visibility = "hidden";
                    add_label.style.visibility = "visible";
                }
                clear_menu(topping_add_div);
                build_prices(order_id, topping_cnt);
                cnt_label.innerHTML = topping_cnt;
            }
            helper.appendicitis(topping_add_div, cnt_label, add_label, rem_label);
            menu_items.append(topping_add_div);
        }
    }

    async function build_options(order_id, sel_lim, ) {
        const helper = await import("./templates.js");
        let prev_option = null;
        option_div = document.createElement("div");
        option_div.className = "option-div";
        option_div.id = "option-div";
        try {
            const data = await ajax_req({ "order_id": order_id }, "/ajax/option");
            const options = data.options;

            const base_options = options.filter((option) => {
                return !(option.option_name.includes("Topping"));
            });

            if ((typeof base_options === "undefined") || (base_options.length === 0)) {
                return;
            }

            const topping_lim = options.length - base_options.length;
            base_options.map((opt) => {
                const option_name = opt.option_name;
                const cnt = opt.selection_count;
                if (option_name.includes("Selection(s)")) {
                    clear_menu(option_div);
                    return build_prices(order_id, cnt);
                }

                const label = helper.create_label(option_name, option_name);
                label.onclick = () => {
                    prev_option = update_active_class(prev_option, label);
                    if (cnt === 0) {
                        clear_menu(option_div);
                        return build_add_toppings(topping_lim, order_id);
                    }
                    clear_menu(option_div);
                    build_prices(order_id, cnt);
                }
                helper.appendicitis(option_div, label);
            })
            menu_items.append(option_div);
        }
        catch (err) {
            console.log("Build Options Error:" + err);
        }
    }

    function update_active_class(prev_active, new_active) {
        try {
            prev_active.classList.remove("active-sel");
        }
        catch (err) {
            // console.log("update_active_class error: " + err);
        }
        new_active.classList.add("active-sel");
        return new_active;
    }

    async function build_orders(orders) {

        const helper = await import("./templates.js");
        order_div = document.createElement("div");
        order_div.className = "order-div";
        order_div.id = "order-div";
        let prev_order = null;
        orders.map((order) => {
            const id = order.id;
            const title = order.title;
            const sel_lim = order.selection_limit;

            const label = helper.create_label(title, title);
            label.onclick = () => {
                clear_menu(order_div);
                build_options(id, sel_lim);
                prev_order = update_active_class(prev_order, label);
            }
            helper.appendicitis(order_div, label);
        })
        menu_items.append(order_div);
    }

    function clear_menu(older_brother) {
        if (!menu_items.contains(document.getElementById(older_brother.id))) {
            return;
        }
        try {
            while (menu_items.lastChild.id !== older_brother.id) {
                menu_items.removeChild(menu_items.lastChild);
            }
        }
        catch (err) {
            console.log("clear_menu error: " + err);
        }
    }

    async function build_menu(product) {
        try {
            const data = await ajax_req({ "product": product }, "/ajax/order");
            build_orders(data.orders);
            const pos = document.getElementById(product).getClientRects()[0];
            const floating_menu = document.getElementById("floating-menu");
            floating_menu.style.left = pos.left+"px";
            console.log(pos.left, pos.right);
        }
        catch (err) {
            console.log("Build Menu Error: " + err);
        }
    }
})