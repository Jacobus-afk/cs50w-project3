// https://stackoverflow.com/questions/42733761/how-to-properly-append-django-csrf-token-to-form-in-inline-javascript
document.addEventListener("DOMContentLoaded", () => {
    const anchors = document.anchors;
    const menu_items = document.getElementById("menu-items");
    let order_div = document.createElement("div");
    let option_div = document.createElement("div");
    let price_div = document.createElement("div");
    let topping_add_div = document.createElement("div");
    order_div.id = "order-div";
    option_div.id = "option-div";
    price_div.id = "price-div";
    topping_add_div.id = "topping-add-div";
    var div_ids = []
    //console.log("divids length: "+div_ids.length);
    for (i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', (event) => {
            while(menu_items.firstChild) {
                menu_items.removeChild(menu_items.lastChild);
            }
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

    function place_order(size, price_id) {
        console.log("placed order: " + size + ", price_id: " + price_id);
    }

    async function build_prices(order_id, sel_cnt) {
        //clear_menu(price_div);

        const helper = await import("./templates.js");
        let prev_price = undefined;
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

            for (i in prices) {
                const size = prices[i].size;
                const price = prices[i].price;
                const id = prices[i].id;

                const label = helper.create_label(size, size + ": " + price);
                label.onclick = () => {
                    prev_price = update_active_class(prev_price, label);
                    place_order(size, id);
                }
                helper.appendicitis(price_div, label);
            }
            menu_items.append(price_div);
            div_ids.push(price_div.id);
        }
        catch (err) {
            console.log("Build Price Error: " + err);
        }
    }

    async function build_add_toppings(topping_lim, order_id) {
        
        const helper = await import("./templates.js");
        topping_add_div = document.createElement("div");
        topping_add_div.className = "topping-add-div";
        topping_add_div.id = "topping-add-div";
        
        clear_menu(topping_add_div);
        build_prices(order_id, 0);
        if (topping_lim > 0) {
            const num = helper.create_num_input(0, 0, topping_lim);
            num.hidden = true;

            const add_label = helper.create_label("Add_Topping", "+");
            const rem_label = helper.create_label("Remove_Topping", "-");
            rem_label.style.visibility = "hidden"; // = true;

            add_label.onclick = () => {
                num.value++;
                const cnt = num.value;
                if (cnt < topping_lim) {
                    clear_menu(topping_add_div);
                    build_prices(order_id, cnt);
                    rem_label.style.visibility = "visible"; // = false;
                }
                else if (cnt == topping_lim) {
                    clear_menu(topping_add_div);
                    build_prices(order_id, cnt);
                    rem_label.style.visibility = "visible"; // = false;
                    add_label.style.visibility = "hidden"; // = true;
                }
                else {
                    add_label.style.visibility = "hidden"; // = true;
                    num.value = topping_lim;
                }
            }

            rem_label.onclick = () => {
                num.value--;
                const cnt = num.value;
                if (cnt > 0) {
                    clear_menu(topping_add_div);
                    build_prices(order_id, cnt);
                    add_label.style.visibility = "visible"; // = false;
                }
                else if (cnt == 0) {
                    clear_menu(topping_add_div);
                    build_prices(order_id, cnt);
                    rem_label.style.visibility = "hidden"; // = true;
                    add_label.style.visibility = "visible"; // = false;
                }
                else {
                    rem_label.style.visibility = "hidden"; // = true;
                    num.value = 0;
                }
            }
            helper.appendicitis(topping_add_div, num, add_label, rem_label);
            menu_items.append(topping_add_div);
            div_ids.push(topping_add_div.id);
        }
    }

    async function build_options(order_id, sel_lim, ) {
        // clear_menu(option_div);
        const helper = await import("./templates.js");
        let prev_option = undefined;
        option_div = document.createElement("div");
        option_div.className = "option-div";
        option_div.id = "option-div";
        try {
            const data = await ajax_req({ "order_id": order_id }, "/ajax/option");
            const options = data.options;

            const base_options = options.filter((option) => {
                return !(option.option_name.includes("Topping"));
            });

            if ((typeof base_options === "undefined")||(base_options.length === 0)) {
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
                        //clear_menu(topping_add_div);
                        clear_menu(option_div);
                        return build_add_toppings(topping_lim, order_id);
                    }
                    clear_menu(option_div);
                    build_prices(order_id, cnt);
                }
                helper.appendicitis(option_div, label);
            })
            menu_items.append(option_div);
            div_ids.push(option_div.id);
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
        div_ids.push(order_div.id);
    }

    function clear_menu(older_brother) {
        // console.log("older brother: " + older_brother.id);
        // child = document.getElementById(older_brother.id);
        // if (menu_items.lastChild.id === older_brother.id) {
        if (!menu_items.contains(document.getElementById(older_brother.id))) {
            return;
        }
        try {
            while(menu_items.lastChild.id !== older_brother.id) {
                menu_items.removeChild(menu_items.lastChild);
            }
        }
        catch(err) {
            console.log("clear_menu error: " + err);
        }
/*
        Array.prototype.map.call(menu_items.children, child => {
            console.log("menu items: " + child.id);
        })


        const parent_idx = div_ids.indexOf(older_brother.id);
        if (parent_idx === -1) {
            return;
        }
        const abandoned_children = div_ids.filter((entry,index) => {
            // return index >= parent_idx;
            return index > parent_idx;
        })

        abandoned_children.map(child => {
            const child_id = document.getElementById(child);
            menu_items.removeChild(child_id);
            console.log("removed " + child);
        })


        div_ids.length = parent_idx;
        console.log("clear menu div_ids: ", div_ids);*/
    }

    async function build_menu(product) {
        // clear_menu(order_div);
        // console.log(product)
        try {
            const data = await ajax_req({ "product": product }, "/ajax/order")
            //
            build_orders(data.orders);
        }
        catch (err) {
            console.log("Build Menu Error: " + err);
        }
    }
})